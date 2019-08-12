// new Promise((resolve, reject) => {
//   resolve(42);
// });

const defineProperty = (target, propName, propValue) => {
  Object.defineProperty(target, propName, {value: propValue})
}

const isThenable = subject => subject && typeof subject.then == 'function'

const defer = (handler) =>
    (...args) => {
      setTimeout(handler, 0, ...args);
    }


const thrower = (error) => {
  throw error instanceof Error
    ? error
    : new Error(error);
};

const raiseUnhandledPromiseRejectionException =
  defer((error, promise) => {
    if (promise.chain.length > 0) {
      return;
    }
    thrower(error);
  });

const [FULFILLED, REJECTED, PENDING] = [true, false, void 0]

class Promifill {
  get state() {
    return PENDING
  }

  get value() {
    return void 0
  }

  get settled() {
    return false
  }

  constructor(excutor) {
    if (typeof excutor != 'function') {
      throw new TypeError(`Promise resolver must be a function`)
    }
    defineProperty(this, "chain", []);
    defineProperty(this, "observers", []);

    const secret = []

    const schedule = (() => {
      let microtasks = []

      const run = () => {
        let handler, value
        while (microtask.length > 0 && ({handler, value} = microtasks.shift())) {
          handler(value)
        }
      }

      const observer = new MutationObserver(run)
      const node = document.createTextNode('')

      observer.observe(node, {characterData: true})

      return observers => {
        if (observers.length === 0) {
          return
        }

        microtasks = microtasks.concat(observers)
        observers.length = 0

        node.data = node.data === 1 ? 0 : 1
      }
    })()

    const resolve = (value, bypassKey) => {
      if (this.settled && bypassKey !== secret) {
        return
      }

      defineProperty(this, 'settled', true)

      const then_ = value && value.then
      const thenable = typeof then_ == 'function'

      if (thenable && value.state === PENDING) {
        then_.call(value, v => resolve(v, secret), r => reject(r, secret))
      } else {
        defineProperty(this, 'value', thenable ? value.value : value)
        defineProperty(this, 'state', thenable ? value.state : FULFILLED)

        schedule(this.observers)
      }
    }

    const reject = (reason, bypassKey) => {
      (reason, bypassKey) => {
        if (this.settled && bypassKey !== secret) {
          return;
        }

        defineProperty(this, "settled", true);

        defineProperty(this, "value", reason);
        defineProperty(this, "state", REJECTED);

        schedule(
          this.observers.map((observer) => ({
            handler: observer.onrejected,
            value: this.value
          }))
        );

        raiseUnhandledPromiseRejectionException(this.value, this);
    }
  }

  then(onfulfill, onreject) {
    return new this.constructor((resolve, reject) => {
      const internalOnfulfill = value => {
        try {
          resolve(typeof onfulfill == 'function' ? onfulfill(value) : value)
        } catch (error) {
          reject(error)
        }
      }

      const internalOnreject = reason => {
        try {
          if (typeof onreject == 'function') {
            resolve(onreject(reason))
          } else {
            reject(reason)
          }
        } catch (error) {
          reject(error)
        }
      }

      schedule(this.observers)
      this.chain.push(chainedPromise);

      return chainedPromise;
    })
  }
}
