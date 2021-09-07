const whiteScreen = () => {
  let emptyElement = 0
  const rootElement = ['html', 'body', '#app', '#container']

  const getSelector = el => el.id || el.className || el.nodeName.toLowerCase();
  
  const isRoot = el => {
    const selector = getSelector(el)
    if (rootElement.some(item => item === selector)) emptyElement++;
  }

  const judgeScreenByPoint = () => {
    for (let i = 1; i < 10; i++) {
      // 定y轴，取x轴
      const elX = document.elementFromPoint(window.innerWidth * index / 10, window.innerHeight / 2)
      const elY = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * index / 10)
      isRoot(elX[0])
      isRoot(elY[0])
    }
    if (emptyElement > 16) { // 循环18次，没有其他的element，白屏
      // 上传数据
    }
  }

  if (document.elementFromPoint) {
    judgeScreenByPoint()
  }
}