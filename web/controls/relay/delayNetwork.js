/* @flow */

let _timeToUpdate = 0;
let _resolvers = [];
let _handleTimeout: TimeoutID;

export const setDelay = (delay: number) => {
  const prevTime = _timeToUpdate;
  _timeToUpdate = Math.max(_timeToUpdate, new Date().getTime() + delay);

  if (_timeToUpdate > prevTime) {
    if (_handleTimeout) {
      clearTimeout(_handleTimeout);
    }

    _handleTimeout = setTimeout(() => {
      _resolvers.forEach(resolver => resolver());
      _resolvers.length = 0;
    }, delay);
  }
};

export const getDelayedPromise = <T>(data: T) => {
  const currTime = new Date().getTime();
  if (currTime > _timeToUpdate && _resolvers.length === 0) {
    return Promise.resolve(data);
  }

  return new Promise<T>(resolve => {
    _resolvers.push(() => resolve(data));
  });
};
