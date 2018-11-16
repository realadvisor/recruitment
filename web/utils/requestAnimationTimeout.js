/* @flow */
opaque type ID = string;

export type Handle = {
  id?: ID,
};

export function cancelAnimationTimeout(frame: ?Handle) {
  if (frame) {
    window.cancelAnimationFrame(frame.id);
  }
}

/**
 * Recursively calls requestAnimationFrame until a specified delay has been met
 * or exceeded. When the delay time has been reached the function you're timing
 * out will be called.
 *
 * Credit: Joe Lambert (https://gist.github.com/joelambert/1002116#file-requesttimeout-js)
 */
export function requestAnimationTimeout(func: () => void, delay: number) {
  const start = Date.now();
  const frame: Handle = {};

  function timeout() {
    if (Date.now() - start >= delay) {
      func.call();
    } else {
      frame.id = window.requestAnimationFrame(timeout);
    }
  }

  frame.id = window.requestAnimationFrame(timeout);
  return frame;
}
