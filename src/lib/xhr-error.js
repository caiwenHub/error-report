import { report } from '../api'
/**
 * 监控请求错误
 * 重写XMLHttpRequest对象的open和send方法，
 */
export function injectXHR() {

    const XMLHttpRequest = window.XMLHttpRequest;

    const tempOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async) {
        if (!url.match(/logstores/) && !url.match(/sockjs/)) {
            this.logData = {
                method,
                url,
                async
            }
        }
        return tempOpen.apply(this, arguments);
    }

    let tempSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        if (this.logData) {
            let startDate = Date.now();
            let hander = (type) => (event) => {
                let duration = Date.now() - startDate;
                report.send({
                    kind: "stability",
                    type: "xhr",
                    eventype: type,
                    duration,
                    statusText: this.statusText,
                    pathName: this.logData.url,
                    status: this.status,
                    response: this.response ? JSON.stringify(this.response) : "",
                    params: body || ''
                })
            }
            this.addEventListener('load', hander('load'), false);
            this.addEventListener('error', hander('error'), false);
            this.addEventListener('abort', hander('abort'), false);
        }
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
                    kind: "stability",
                    type: "fetch",
                    duration,
                    statusText: res.statusText,
                    pathName: res.url,
                    status: res.status,
                    params: opts ? opts.body : '',
                    response: undefined
                }

                return res.json()

            }).then(data => {
                log.response = JSON.stringify(data);
                // tranker.send(log);
                resolve(data);
            }, err => {
                // tranker.send(log);
                reject(err);
            })
        })
    }
}