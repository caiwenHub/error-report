import { getBrowser } from './src/utils'
import storage from './src/utils/storage'

console.log(11111, getBrowser())
function handleError(e) {
  console.log('error', e)
  return true
}
window.addEventListener('error', handleError, false)
// window.onerror = (e) => {
//   console.log(111, e)
//   return true
// }
const temp = document.createElement('div')
const a = ''
temp.innerHTML = "555555"
console.log(bbb)
// try {
//   console.log(aaa)
// } catch (error) {
//   console.log(111,error)
// }
document.body.appendChild(temp)