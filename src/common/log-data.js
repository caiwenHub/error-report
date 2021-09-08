import { getBrowser } from "../utils";

// 固定要上报的错误
export const logData = {
  type: '',
  err_type: '', // 错误类型
  err_msg: '', // 错误信息
  err_url: '', // 错误所在url
  err_line: '', // 错误所在行
  err_col: '', // 列
  err_time: '', // 时间戳
  error: {}, // error对象
  browser_type: '', // 浏览器类型
  extend: {}, // 业务扩展字段，JSON字符串
  filename: ''
}

export const getLogData = (type, error, errorType) => {
  const { href } = location || {}
  if (type === 'resourcesError') {
    const { timeStamp, target } = error || {}
    return {
      ...logData,
      type: 'error',
      err_type: 'resourcesError',
      err_msg: 'script resource is load fail',
      err_url: target.src || '',
      err_time: timeStamp,
      browser_type: getBrowser()
    }
  } else if (type === 'whiteError') {
    console.log(error)
  } else if (type === 'xhrError') {
    console.log(11111, error)
  } else {
    const {
      error: errorObj,
      colno,
      lineno,
      message,
      filename,
      timeStamp,
      type: errrorType
    } = error
    return {
      ...logData,
      type: errrorType,
      err_type: type,
      err_msg: message,
      err_url: href,
      err_line: lineno,
      err_col: colno,
      err_time: timeStamp,
      error: errorObj,
      browser_type: getBrowser(),
      filename
    }
  }
}

const err_type = [
  'resourcesError', // 资源报错
  'jsError', // js报错
  'promiseError', // promise报错
  'xhrError', // 接口报错
  'whiteError' // 白屏
]