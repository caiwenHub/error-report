
import ReportError from './index'


function handleJsError(err) {
  const reportInstance = ReportError.instance
  if (!(err instanceof ErrorEvent)) { // 资源错误
    console.log('资源错误', err)
    reportInstance.getLogData('resourcesError', err)
  } else { // 运行时错误
    console.log('运行时错误', err)
    reportInstance.getLogData('jsError', err)
  }
}

function handlePromiseError(err) {
  const reportInstance = ReportError.instance
  console.log('promise报错', err)
  reportInstance.getLogData('promiseError', err)
}

const injectJsError = () => {
  window.addEventListener('error', handleJsError, true)
  window.addEventListener('unhandledrejection', handlePromiseError, true)
}

export default injectJsError