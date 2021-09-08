export const getWinUrl = () => location.href

export const isStr = val => val && typeof val === 'string'

export const isNum = val => typeof val === 'number' && val === val

export const isObj = obj => obj && Object.prototype.toString.call(obj) === "[object Object]"

export const isRealObj = obj => isObj(obj) && Reflect.ownKeys(obj).length

export const isArr = arr => arr && Array.isArray(arr)

export const isRealArr = arr => isArr(arr) && arr.length

const getAgent = key => {
  const { userAgent } = navigator;
  return userAgent.indexOf(key) > -1
}

/**
 获取浏览器类型
 */
export function getBrowser () {
  const brownser = ['Opera', 'Firefox', '360SE', 'Chrome', 'Safari']
  let result = ''
  for (let i = 0; i < brownser.length; i++) {
    if (getAgent(brownser[i])) {
      result = brownser[i]
      break;
    }
  }
  if (result) return result
  const ie = getIE()
  if (ie) return ie
  return 'unKnown'
}
/**
 * 获取IE版本号
 * @returns 
 */
export function getIE() {
  const isIE = getAgent('compatible') && getAgent('MSIE')
  const isEdge = getAgent("Edge") && !isIE
  const isIE11 = getAgent('Trident') && getAgent("rv:11.0")
  if (isIE) {
    const regIE = RegExp("MSIE (\\d+\\.\\d+);")
    regIE.test(userAgent)
    const ieVersion = parseFloat(RegExp["$1"])
    return `IE${ieVersion}`
  }
  if (isEdge) return 'Edge'
  if (isIE11) return 'IE11'
  return ''
}

/**
 * 图片打点
 */
export const imgReport = (url) => {
  console.log('图片打点', url)
  if (isStr) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onerror = reject
      img.onload = resolve
      img.src = url;
    })
  }
  return new Promise().reject('图片url为空')
}

/**
 * 格式化put url参数
 * @param {String} url 上报url
 * @param {Object} param 要上报的参数
 */
export const formatQuery = (url, param) => {
  if (isStr(url) && isRealObj(param)) {
    let temp = ''
    const params = Object.entries(param)
    params.forEach((item, index) => {
      let [key, value] = item;
      if (isObj(value) || isArr(value)) value = JSON.stringify(value)
      temp += index + 1 < params.length
        ? `${key}=${value}&`
        : `${key}=${value}`
    })
    return url.indexOf('?') > 0
      ? `${url}&${temp}`
      : `${url}?${temp}`
  }
  return ''
}