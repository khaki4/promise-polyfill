const defineProperty = (target, propName, propValue) => {
  Object.defineProperty(target, propName, { value: propValue, writable: false });
};

const [
  FULFILLED,
  REJECTED,
  PENDING
] = [true, false, void 0];

class Promifill {
  get state() {
    return PENDING;
  }

  get value() {
    return void 0;
  }

  /**
   * 이미 안정상태를 나타내는 플래그
   */
  get settled() {
    return false;
  }

  constructor(executor) {
    if (typeof executor != 'function') {
      throw new TypeError(`Promise resolver must be a function`);
    }

    const resolve = (value) => {
      defineProperty(this, 'value', value);
      defineProperty(this, 'state', FULFILLED);
    };

    const reject = (reason) => {
      defineProperty(this, 'value', reason);
      defineProperty(this, 'state', REJECTED);
    };

    executor(resolve, reject);
   }
}