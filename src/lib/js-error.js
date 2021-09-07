

function handleJsError(err) {
  if (!(err instanceof ErrorEvent)) { // 资源错误
    console.log('资源错误', err)
  } else { // 运行时错误
    console.log('运行时错误', err)
  }
}

function handlePromiseError(err) {
  console.log('promise报错',err)
}

const injectJsError = () => {
  window.addEventListener('error', handleJsError, true)
  window.addEventListener('unhandledrejection', handlePromiseError, true)
}

export default injectJsError