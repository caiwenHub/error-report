import ReportError from "./index";

/**
 * 监控请求错误
 * 重写XMLHttpRequest对象的open和send方法，
 */
export function injectXHR() {
  
  const reportInstance = ReportError.instance
  const XMLHttpRequest = window.XMLHttpRequest;

  // const tempOpen = XMLHttpRequest.prototype.open;
  // XMLHttpRequest.prototype.open = function(method, url, async) {
  //   if (!url.match(/logstores/) && !url.match(/sockjs/)) {
  //     this.logData = {
  //       method,
  //       url,
  //       async
  //     }
  //   }
  //   return tempOpen.apply(this, arguments);
  // }

  let tempSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body) {
    let hander = (type) => (event) => {
      reportInstance.getLogData('xhrError', event, type)
    }
    this.addEventListener('load', hander('load'), false);
    this.addEventListener('error', hander('error'), false);
    this.addEventListener('abort', hander('abort'), false);
    return tempSend.apply(this, arguments);
  }
}


// // 重写fetch方法，拦截fetch请求

export function injectFetch() {
  let tempFetch = window.fetch;
  
  window.fetch = function(url, opts) {
    let startTime = Date.now();
    let duration;
    let log;
    return new Promise((resolve, reject) => {
      if (opts) {
        var timeout = opts.timeout;
        if (timeout) {
          setTimeout(() => {
            reject(new Error("fetch timeout"));
          }, timeout)
        }
      }
      tempFetch(url, opts).then(res => {
        duration = Date.now() - startTime;
        log = {
          type: 'error',
          err_type: 'xhrError',
          err_msg: 'xhr is request fail',
          err_time: new Date().getTime(),
        }

        return res.json()

      }).then(data => {
        log.response = JSON.stringify(data);
        reportInstance.getLogData('xhrError', log, 'erorr')
        resolve(data);
      }, err => {
        reportInstance.getLogData('xhrError', log, 'erorr')
        reject(err);
      })
    })
  }
}