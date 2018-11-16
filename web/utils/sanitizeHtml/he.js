/* @flow */
import invariant from 'tiny-invariant';
/* eslint-disable no-control-regex */

// All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
// code points listed in the first column of the overrides table on
// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.
// const regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
// All astral symbols.
const regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

const regexEscape = /["&'<>`]/g;

const escapeMap = {
  '"': '&quot;',
  '&': '&amp;',
  "'": '&#x27;',
  '<': '&lt;',
  // See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
  // following is not strictly necessary unless it’s part of a tag or an
  // unquoted attribute value. We’re only escaping it to support those
  // situations, and for XML support.
  '>': '&gt;',
  // In Internet Explorer ≤ 8, the backtick character can be used
  // to break out of (un)quoted attribute values or HTML comments.
  // See http://html5sec.org/#102, http://html5sec.org/#108, and
  // http://html5sec.org/#133.
  '`': '&#x60;',
};

const regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;

const regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;

const regexDecode = /&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(nbsp|quot|AMP|amp|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;

const decodeMap = {
  amp: '&',
  AMP: '&',
  gt: '>',
  Gt: '\u226B',
  GT: '>',
  lt: '<',
  Lt: '\u226A',
  LT: '<',
  quot: '"',
  QUOT: '"',
  nbsp: '\xA0',
};

const decodeMapNumeric = {
  '0': '\uFFFD',
  '128': '\u20AC',
  '130': '\u201A',
  '131': '\u0192',
  '132': '\u201E',
  '133': '\u2026',
  '134': '\u2020',
  '135': '\u2021',
  '136': '\u02C6',
  '137': '\u2030',
  '138': '\u0160',
  '139': '\u2039',
  '140': '\u0152',
  '142': '\u017D',
  '145': '\u2018',
  '146': '\u2019',
  '147': '\u201C',
  '148': '\u201D',
  '149': '\u2022',
  '150': '\u2013',
  '151': '\u2014',
  '152': '\u02DC',
  '153': '\u2122',
  '154': '\u0161',
  '155': '\u203A',
  '156': '\u0153',
  '158': '\u017E',
  '159': '\u0178',
};

const invalidReferenceCodePoints = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  11,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  127,
  128,
  129,
  130,
  131,
  132,
  133,
  134,
  135,
  136,
  137,
  138,
  139,
  140,
  141,
  142,
  143,
  144,
  145,
  146,
  147,
  148,
  149,
  150,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  159,
  64976,
  64977,
  64978,
  64979,
  64980,
  64981,
  64982,
  64983,
  64984,
  64985,
  64986,
  64987,
  64988,
  64989,
  64990,
  64991,
  64992,
  64993,
  64994,
  64995,
  64996,
  64997,
  64998,
  64999,
  65000,
  65001,
  65002,
  65003,
  65004,
  65005,
  65006,
  65007,
  65534,
  65535,
  131070,
  131071,
  196606,
  196607,
  262142,
  262143,
  327678,
  327679,
  393214,
  393215,
  458750,
  458751,
  524286,
  524287,
  589822,
  589823,
  655358,
  655359,
  720894,
  720895,
  786430,
  786431,
  851966,
  851967,
  917502,
  917503,
  983038,
  983039,
  1048574,
  1048575,
  1114110,
  1114111,
];

/*--------------------------------------------------------------------------*/

const stringFromCharCode = String.fromCharCode;
const object = {};
const hasOwnProperty = object.hasOwnProperty;
const has = function(object, propertyName) {
  return hasOwnProperty.call(object, propertyName);
};

// Modified version of `ucs2encode`; see https://mths.be/punycode.
const codePointToSymbol = function(
  codePoint: number,
  original: string,
  errors: Array<string>
) {
  let output = '';
  if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
    // See issue #4:
    // “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
    // greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
    // REPLACEMENT CHARACTER.”

    parseError(
      `character reference "${original}" outside the permissible Unicode range`,
      errors
    );

    return '\uFFFD';
  }

  if (has(decodeMapNumeric, codePoint)) {
    parseError(`disallowed character reference ${original}`, errors);
    return decodeMapNumeric[codePoint];
  }

  if (invalidReferenceCodePoints.includes(codePoint)) {
    parseError(`disallowed character reference ${original}`, errors);
    // do not decode disallowed codes
    return original;
  }

  if (codePoint > 0xffff) {
    codePoint -= 0x10000;
    output += stringFromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
    codePoint = 0xdc00 | (codePoint & 0x3ff);
  }
  output += stringFromCharCode(codePoint);
  return output;
};

const hexEscape = function(codePoint) {
  return '&#x' + codePoint.toString(16).toUpperCase() + ';';
};

const parseError = function(message, errors: Array<string>) {
  // throw Error('Parse error: ' + message);
  if (!errors.includes(message)) {
    errors.push(message);
  }
};

/*
var escapeBmpSymbol = function(symbol) {
  return hexEscape(symbol.charCodeAt(0));
};
*/
/*--------------------------------------------------------------------------*/

export const encode = function(
  string: string
): {
  encoded: string,
  errors: $ReadOnlyArray<string>,
} {
  const errors = [];

  if (regexInvalidRawCodePoint.test(string)) {
    parseError('forbidden code point', errors);
  }

  const escapeCodePoint = hexEscape;

  // Apply named character references.
  // Encode `<>"'&` using named character references.
  string = string.replace(regexEscape, function(string) {
    invariant(string in escapeMap, `escapeMap must contain ${string}`);

    return escapeMap[string]; // no need to check `has()` here
  });

  return {
    errors,
    encoded: string
      // Encode astral symbols.
      .replace(regexAstralSymbols, function($0) {
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        const high = $0.charCodeAt(0);
        const low = $0.charCodeAt(1);
        const codePoint = (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;
        return escapeCodePoint(codePoint);
      }),
    // .replace(regexBmpWhitelist, escapeBmpSymbol),
  };
};
// Expose default options (so they can be overridden globally).

export const decode = function(
  html: string
): {
  decoded: string,
  errors: $ReadOnlyArray<string>,
} {
  const errors = [];

  if (regexInvalidEntity.test(html)) {
    parseError('malformed character reference', errors);
  }

  return {
    errors,
    decoded: html.replace(regexDecode, ($0, $1, $2, $3, $4, $5, $6) => {
      let codePoint;
      let semicolon;
      let decDigits;
      let hexDigits;
      let reference;

      if ($1) {
        // Decode decimal escapes, e.g. `&#119558;`.
        decDigits = $1;
        semicolon = $2;
        if (!semicolon) {
          parseError(
            `character reference ${$0} was not terminated by a semicolon`,
            errors
          );
        }
        codePoint = parseInt(decDigits, 10);
        return codePointToSymbol(codePoint, $0, errors);
      }
      if ($3) {
        // Decode hexadecimal escapes, e.g. `&#x1D306;`.
        hexDigits = $3;
        semicolon = $4;
        if (!semicolon) {
          parseError(
            `character reference ${$0} was not terminated by a semicolon`,
            errors
          );
        }
        codePoint = parseInt(hexDigits, 16);
        return codePointToSymbol(codePoint, $0, errors);
      }
      if ($5) {
        // Decode named character references with trailing `;`, e.g. `&copy;`.
        reference = $5;
        if (has(decodeMap, reference)) {
          return decodeMap[reference];
        } else {
          // Ambiguous ampersand. https://mths.be/notes/ambiguous-ampersands
          parseError(
            `ambiguous ampersand or unknown named character ${$0}`,
            errors
          );
          return $0;
        }
      }
      // If we’re still here, it’s a legacy reference for sure. No need for an
      // extra `if` check.
      // Decode named character references without trailing `;`, e.g. `&amp`
      // This is only a parse error if it gets converted to `&`, or if it is
      // followed by `=` in an attribute context.
      reference = $6;

      parseError(
        `named character reference ${$0} was not terminated by a semicolon`,
        errors
      );
      // Note: there is no need to check `has(decodeMapLegacy, reference)`.
      return $0 + ';';
    }),
  };
};
