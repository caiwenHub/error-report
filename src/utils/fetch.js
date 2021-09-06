import axios from "axios";

const fetch = async ({ params, url, method, ...other }) => {
  
  let config = {
    baseURL: 'http://localhost:3000',
    url,
    method,
    timeout: 5000,
    ...other
  }
  // 只添加了常用的http方法
  const methodParams = {
    'put': { params, ...config },
    'post': { data: params, ...config }
  }

  const instance = axios.create()
  const response = await instance(methodParams[method])
    .then(res => res)
    .catch(err => err)
  return response;
}

export default fetch