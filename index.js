import { getBrowser } from './src/utils'
import storage from './src/utils/storage'
import injectJsError from './src/lib/js-error'
import {injectXHR} from './src/lib/xhr-error'
import request from './src/utils/request'



injectJsError()
injectXHR()

const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')
const btn3 = document.getElementById('btn3')
const btn4 = document.getElementById('btn4')

btn1.onclick = () => {
  console.log('测试资源报错')
  const script = document.createElement('script');
  script.setAttribute('src', 'http://cc.com/aa.js');
  document.body.appendChild(script)
}

btn2.onclick = () => {
  console.log('测试js运行时错误')
  console.log(aa)
}

btn3.onclick = () => {
  console.log('测试promise报错')
  new Promise().then()
}
btn4.onclick = () => {
  console.log('测试请求')
  request({
    method: 'put',
    url: '/',
    params: {
      name: 'caiwen'
    }
  }).then(res => console.log(res))
    .catch((err) => console.log(err))
}