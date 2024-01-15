const XMLHttpRequestSend = XMLHttpRequest.prototype.send;

let reqCallbacks = [];
let resCallbacks = [];
let wired = false;

export function isWired() {
  return wired;
}

export function addRequestCallback(callback) {
  reqCallbacks.push(callback);
}
export function addResponseCallback(callback) {
  resCallbacks.push(callback);
}
export function removeRequestCallback(callback) {
  reqCallbacks = reqCallbacks.filter((item) => item !== callback);
}
export function removeResponseCallback(callback) {
  resCallbacks = resCallbacks.filter((item) => item !== callback);
}

export function wire() {
  if (wired) {
    throw new Error("Ajax interceptor already wired");
  }

  XMLHttpRequest.prototype.send = function () {
    const reqCallbacksRes = reqCallbacks.map((callback) => {
      return callback(this, arguments);
    });

    this.onreadystatechange = () => {
      resCallbacks.forEach((callback) => {
        callback(this);
      });
    };

    if (reqCallbacksRes.indexOf(false) === -1) {
      XMLHttpRequestSend.apply(this, arguments);
    }
  };

  wired = true;
}

export function unwire() {
  if (!wired) {
    throw new Error("Ajax interceptor not currently wired");
  }

  XMLHttpRequest.prototype.send = XMLHttpRequestSend;
  wired = false;
}
