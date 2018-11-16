/* @flow */

import { encode, decode } from '../he';

const pairs = [
  ['hello world', 'hello world'],
  ['hello&world', 'hello&amp;world'],
  ['<>"\'`hello&world', '&lt;&gt;&quot;&#x27;&#x60;hello&amp;world'],
  ['привет', 'привет'],
  ['&copy;', '&amp;copy;'],
  ['foo&&& bar', 'foo&amp;&amp;&amp; bar'],
];

const onewayDecode = [
  [
    '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;',
    `javascript:alert('XSS')`,
  ],
  [
    '&#106&#97',
    'ja',
    [
      'character reference &#106 was not terminated by a semicolon',
      'character reference &#97 was not terminated by a semicolon',
    ],
  ],
  [
    '&copy;',
    '&copy;',
    ['ambiguous ampersand or unknown named character &copy;'],
  ],
  [
    '&nbsp',
    '&nbsp;',
    ['named character reference &nbsp was not terminated by a semicolon'],
  ],
  [
    '&gte',
    '&gte;',
    ['named character reference &gte was not terminated by a semicolon'],
  ],
  ['&nbsp;', '\xA0'],
  ['&#127;', '&#127;', ['disallowed character reference &#127;']],
];

test('encode', () => {
  pairs.forEach(([a, b]) => {
    const { encoded, errors } = encode(a);
    expect(encoded).toBe(b);
    expect(errors.length).toBe(0);
  });
});

test('decode', () => {
  pairs.forEach(([a, b]) => {
    const { decoded, errors } = decode(b);
    expect(decoded).toBe(a);
    expect(errors.length).toBe(0);
  });

  onewayDecode.forEach(([a, b, c = []]) => {
    const { decoded, errors } = decode(a);
    expect(errors).toEqual(c);
    expect(decoded).toBe(b);
  });
});

test('decode encode', () => {
  // does not encode-decode "bad" symbol
  expect(encode(decode('при&#127;вет').decoded).encoded).toEqual(
    'при&amp;#127;вет'
  );
  // does encode-decode "good" symbol
  expect(encode(decode('при&#97;вет').decoded).encoded).toEqual('приaвет');

  expect(encode(decode('при&nbsp;вет').decoded).encoded).toEqual('при\xA0вет');
});
