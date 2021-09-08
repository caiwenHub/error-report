import {
  imgReport,
  formatQuery,
  isObj,
  isRealObj,
  isRealArr,
  isNum,
  getBrowser
} from '../utils/index';
import { logData } from '../common/log-data'
import { reportApi } from "../api";
import storage from "../utils/storage";

const formatWay = (props) => {
  const { wayInterval, wayTimes } = props || {};
  if (wayInterval) {
    if (isNum(wayInterval)) return 'reportByInterval'
    throw Error('ReportError: params of "wayInterval" must be Number')
  }
  if (wayTimes) {
    if (isNum(wayTimes)) return 'reportByTimes'
    throw Error('ReportError: params of "wayTimes" must be Number')
  }
  return 'reportByError'
}

const classKeys = [
  'url',
  'data',
  'reportType', // 使用img还是ajax发送
  'reportMethod', // http的method
  'wayInterval', // 间隔多久上报
  'wayTimes', // 满多少次上报
  'extend', // 业务数据
]

class ReportError {
  timmer = null
  /**
   * 构造函数
   * @param {*} url 上报url
   * @param {*} data 自定义上报数据
   */
  constructor(params) {
    this.init(params)
  }
  /**
   * 使用单例模式构造对象
   */
  static getInstance(props) {
    // props是必传参数
    if (!isRealObj(props)) {
      throw new Error('ReportError: params is necessary')
    }
    const defaultProps = {
      reportType: 'img',
      reportMethod: 'put',
      reportWay: formatWay(props),
      type: 'report'
    }
    const params = { ...defaultProps, ...props }
    const { url, data } = props
    // url是必传参数
    if (!url) {
      throw new Error('ReportError: params "url" is necessary')
    }
    // data必须是Object类型
    if (data && !isObj(data)) {
      throw new Error('ReportError: params "data" of type must an Object')
    }

    const propsKeys = Object.keys(props)
    // 传入的参数必须是初始化包含的参数
    if (propsKeys.some(key => classKeys.indexOf(key) < 0)) {
      throw new Error('ReportError: params keys must in the instance prototype')
    }

    if (!ReportError.instance) {
      ReportError.instance = new ReportError(params)
    } else if (isRealObj(data)) {
      this.init(params)
    }
    return ReportError.instance
  }
  init(params) {
    this.logData = logData
    Object.entries(params).forEach(item => {
      const [key, value] = item
      if (key === 'extend') {
        this.logData.extend = value
      } else {
        this[key] = value
      }
    })
  }
  /**
   * 选择是Img上报还是Ajax上报
   * img只支持put
   * ajax支持put和post
   * @param {*} data Object都可以，Array只支持post 
   */
  report(data) {
    if (this.reportType === 'img') {
      if (!isObj(data)) {
        throw Error("ReportError: img report just only apply Object data")
      }
      imgReport(formatQuery(this.url, data))
        .then()
        .catch(err => console.log(err))
    } else if (this.reportType === 'ajax' && this.reportMethod === 'put') {
      if (!isObj(data)) {
        throw Error("ReportError: img report just only apply Object data")
      }
      reportApi('put', data, this.url)
    } else {
      reportApi('method', data, this.url)
    }
  }
  /**
   * 一次一报，只支持put
   */
  reportByError(data) {
    if(data) this.logData.extend = data
    this.report(this.logData)
  }

  /**
   * 多次一报， json字符串
   * @param {Number} num 收集到多少条后上报
   */
  reportByTimes(data) {
    if(data) this.logData.extend = data
    const reportData = storage.getData('reportData')
    if (reportData.lenght < this.wayTimes) {
      reportData.push(this.logData)
      storage.setData('reportData', reportData)
    } else {
      this.report(reportData)
      storage.deleteData('reportData')
    }
  }

  /**
   * 固定时间上报所有，暂时不支持
   * @param {String} time HH:MM:SS
   */
  reportByFixedTime(time) { }

  /**
   * 时间间隔上报
   * @param {Number} ms 毫秒
   */
  reportByInterval(data) {
    const reportData = storage.getData('reportData')
    if(data) this.logData.extend = data
    reportData.push(this.logData)
    storage.setData('reportData', reportData)
    if (this.timmer) return
    this.timmer = setInterval(() => {
      if (isRealArr(reportData)) {
        this.report(reportData)
        storage.deleteData('reportData')
      }
      clearInterval(this.timmer)
      this.timmer = null
    }, this.wayInterval);
  }
  /**
   * 初始化上报错误
   * @param {*} type 
   * @param {*} error 
   * @returns 
   */
  getLogData(type, error) {
    const { href } = location || {}
    const { timeStamp, target } = error || {}
    if (type === 'resourcesError') {
      this.logData = {
        ...this.logData,
        type: 'error',
        err_type: 'resourcesError',
        err_msg: 'script resource is load fail',
        err_url: target.src || '',
        err_time: timeStamp,
        browser_type: getBrowser()
      }
    } else if (type === 'whiteError') {
      this.logData = {
        ...this.logData,
        ...error,
        browser_type: getBrowser()
      }
    } else if (type === 'xhrError') {
      this.logData = {
        ...this.logData,
        type: 'error',
        err_type: 'xhrError',
        err_msg: 'xhr is request fail',
        err_time: timeStamp,
        browser_type: getBrowser()
      }
    } else {
      const {
        error: errorObj,
        colno,
        lineno,
        message,
        filename,
        type: errrorType
      } = error
      this.logData = {
        ...this.logData,
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
    this[this.reportWay]()
  }
}

export default ReportError