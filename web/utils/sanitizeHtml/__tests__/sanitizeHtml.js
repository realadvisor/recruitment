/* @flow */

import { sanitizeHtml } from '../sanitizeHtml';

test('it restores html closing tags', () => {
  expect(
    sanitizeHtml(`
    <b><a><a><strong>hello</b></a>
    <b><a><a><strong>hello</b></a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <b><a><a><strong>hello
  `)
  ).toMatchSnapshot();
});

test('it works with broken tags', () => {
  expect(
    sanitizeHtml(`
    <a <script>hello world
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a>hello world</b</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <e<<a <a>hello world</b</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <e <<a <a>hello world</b</a>
  `)
  ).toMatchSnapshot();
});

test('it works with gt lt symbols inside tags', () => {
  expect(
    sanitizeHtml(`
    <a>hello > world</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a>hello>world</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a>hello < world</a>
  `)
  ).toMatchSnapshot();

  // in this case <word is ambigious so will be stripped out
  // same will do chrome
  expect(
    sanitizeHtml(`
    <a>hello<world</a>
  `)
  ).toMatchSnapshot();
});

test('it strips script style iframe object meta tags', () => {
  expect(
    sanitizeHtml(`
    <script language=js>script</script>
    <script>script</script>
    <meta>meta</meta>
    <style>style</style>
    <iframe>iframe</iframe>
    <object>object</object>
  `)
  ).toMatchSnapshot();
});

test('it strips tags not matched with [a-zA-Z]+\\w* (default options)', () => {
  expect(
    sanitizeHtml(`
    <1a>hello world</1a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <плохойТег><good>hello world</good></плохойТег>
  `)
  ).toMatchSnapshot();
});

test('it strips poster,repeat,pattern,srcset,on* attributes', () => {
  expect(
    sanitizeHtml(`
    <test poster="hi all" yes="no" repeat="all hi" no="yes" pattern="">hello world</test>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <test srcset="hi all" yes="no" onhello="all hi" no="yes" onopen="">hello world</test>
  `)
  ).toMatchSnapshot();
});

test('it preserves formaction,href,xlink:href attributes with schemas http,https,mailto,tel,no schema', () => {
  expect(
    sanitizeHtml(`
    <a href="tel:hello/world">hello</a>
  `)
  ).toMatchSnapshot();
  expect(
    sanitizeHtml(`
    <a href="mailto:hello/world">hello</a>
  `)
  ).toMatchSnapshot();
  expect(
    sanitizeHtml(`
    <a href="/hello/world">hello</a>
  `)
  ).toMatchSnapshot();
  expect(
    sanitizeHtml(`
    <a href="http://hello/world">hello</a>
  `)
  ).toMatchSnapshot();
  expect(
    sanitizeHtml(`
    <a href="https://hello/world">hello</a>
  `)
  ).toMatchSnapshot();
});

test('it strips formaction,href,xlink:href attributes with schemas other than http,https,mailto,tel,no schema', () => {
  expect(
    sanitizeHtml(`
    <a href="hello:hello/world">hello</a>
  `)
  ).toMatchSnapshot();
  expect(
    sanitizeHtml(`
    <a href="javascript:hello/world">hello</a>
  `)
  ).toMatchSnapshot();
  expect(
    sanitizeHtml(`
    <a xlink:href="javascript:hello/world">hello</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <button formaction="javascript:hello/world">hello</button>
  `)
  ).toMatchSnapshot();
});

test('it understand \' in rounded with " in attributes', () => {
  expect(
    sanitizeHtml(`
    <a test="hey'hey">hello</a>
  `)
  ).toMatchSnapshot();
});

test('it understand " in rounded with \' in attributes', () => {
  expect(
    sanitizeHtml(`
    <a test='hey"hey'>hello</a>
  `)
  ).toMatchSnapshot();
});

test('it not break tags because of < > in attributes', () => {
  expect(
    sanitizeHtml(`
    <a test='hey<hey'>hello</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a test='hey>hey'>hello</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a test='<hey>hey</hey>'>hello</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a test="hey<hey">hello</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a test="hey>hey">hello</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a test="<hey>hey</hey>">hello</a>
  `)
  ).toMatchSnapshot();
});

test('it understand self closing tags', () => {
  expect(
    sanitizeHtml(`
    <b/><a test="lala" />
  `)
  ).toMatchSnapshot();
});

test('it not encodes non ascii chars in attributes', () => {
  expect(
    sanitizeHtml(`
    <a test="привет мир" />
  `)
  ).toMatchSnapshot();
});

test('it encodes \'"><& in attributes', () => {
  expect(
    sanitizeHtml(`
    <a test="'&><" />
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a test=a&b />
  `)
  ).toMatchSnapshot();
});

test('it fixes non wrapped with quotes attributes', () => {
  expect(
    sanitizeHtml(`
    <a test=hello />
  `)
  ).toMatchSnapshot();
});

test('it can get wrong schema even if it encoded', () => {
  expect(
    sanitizeHtml(`
    <a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Hax</a>
  `)
  ).toMatchSnapshot();
  expect(
    sanitizeHtml(`
    <a href="&#106&#97&#118&#97&#115&#99&#114&#105&#112&#116&#58&#97&#108&#101&#114&#116&#40&#39&#88&#83&#83&#39;&#41;">Hax</a>
  `)
  ).toMatchSnapshot();
});

test('it can get right schema even if it encoded', () => {
  expect(
    sanitizeHtml(`
    <a href="&#116;&#101;&#108;&#58;&#104;&#101;&#108;&#108;&#111;">Hax</a>
  `)
  ).toMatchSnapshot();

  expect(
    sanitizeHtml(`
    <a href="&#116&#101&#108&#58&#104&#101&#108&#108&#111">Hax</a>
  `)
  ).toMatchSnapshot();
});

test('something bad will somehow be sanitized', () => {
  expect(
    sanitizeHtml(`
    <a <script a=">" b=">">ddd</a>
  <div hi="игрушек>игрушечники">ddd</div>
  <div мир игрушек>игрушечники</div>
  <жопа мира />
  <script

  href="hello">world</script>
  <b><a href='jopa' /></b>
  <div/>
  >c><b
    hi='al"ll lol'
    let=me&not
  >hello<a>popopopo</b></a>

  <!-- жопа мира -->
  <a xlink:href="hello" onjaja="ddd" srcset="jajaj" href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">Hax</a>
  <a href="javascript:hiall">ddd</a>
  `)
  ).toMatchSnapshot();
});
