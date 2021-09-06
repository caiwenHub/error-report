import { isStr, isRealObj, isRealArr } from './index'

const getObj = val => JSON.parse(localStorage.getItem(val))
const setStr = val => localStorage.setItem(key, JSON.stringify(val))
const hasVal = val => localStorage.hasOwnProperty(val)
const clearData = () => localStorage.clear()
const deleteVal = key => localStorage.deleteData(key)

/**
 * 获取localStorage的值
 * @param {*} val string或arr 
 */
const getData = (val) => {
  if (isStr(val) && hasVal(val)) return {[val]:getObj(val)}
  if (isRealArr(val)) {
    const results = {}
    val.forEach(key => {
      if (hasVal(key)) results[key] = getObj(val)
    })
    return results
  }
  return {}
}

/**
 * 设置localStorage的值
 * @param {Object} val key/value
 */
const setData = (val) => {
  if (isRealObj(val)) {
    Object.entries(val).forEach(item => {
      const [key, val] = item;
      setStr(key, val)
    })
  } else {
    throw new Error('param need Object')
  }
}

/**
 * 删除localStorage一个或多个值
 * @param {*} val string/Array
 */
const deleteData = (val) => {
  if (isStr(val)) deleteVal(val)
  if (isRealArr(val)) {
    val.forEach(key => deleteVal(key))
  }
}

const storage = {getData, setData, clearData, deleteData}

export default storage