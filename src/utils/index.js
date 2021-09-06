export const getWinUrl = () => location.href

export const isStr = val => val && typeof val === 'string'

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
  if (isStr) {
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onerror = reject
      img.onload = resolve
      img.src = url;
    })
  }
}