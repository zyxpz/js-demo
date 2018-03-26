const option = {
  img: 'https://zos.alipayobjects.com/rmsportal/nEiRxVpRdfCdWmg.jpg',
  width: 500,
  height: 350,
  fontSize: '20px Microsoft YaHei',
  color: 'blue',
  text: 'mido',
  x: 300,
  y: 30,
  xCenter: false,
  yCenter: false,
}

init();


function init() {
  draw(option)
  build()
  preview()
  downImage(option.text)
}

function draw(obj) {
  const cv = document.querySelector('.J-canvas-first')

  // 画布大小
  cv.width = obj.width
  cv.height = obj.height

  //设置图片
  const img = new Image()
  img.src = obj.img

  // 创建context
  const ctx = cv.getContext('2d')

  // 设置名字坐标
  let tx = obj.x,
    ty = obj.y

  // 显示居中
  if (obj.xCenter) {
    tx = obj.width / 2
  }

  if (obj.yCenter) {
    ty = obj.height / 2
  }

  // 图片加载后
  img.onload = () => {
    // 画图
    ctx.drawImage(img, 0, 0)
    // 设置文字大小
    ctx.font = `${obj.fontSize}px`
    // 设置文字颜色
    ctx.fillStyle = obj.color
    // 设置坐标
    if (obj.xCenter) {
      ctx.textAlign = 'center'
    }
    // 画文字
    ctx.fillText(obj.text, tx, ty)
  }

}

function build() {
  let imageFile, imageData
  document.querySelectorAll('input').forEach(item => {
    item.addEventListener('change', (e) => {
      switch (e.currentTarget.getAttribute('name')) {
        case 'width':
          option.width = parseInt(e.currentTarget.value) || 100
          break;
        case 'height':
          option.height = parseInt(e.currentTarget.value) || 100
          break;
        case 'user-name':
          option.text = e.currentTarget.value || option.text
          break;
        case 'x-coordinate':
          option.x = e.currentTarget.value || option.tx
          break;
        case 'y-coordinate':
          option.y = e.currentTarget.value || option.yx
          break;
        case 'x-center':
          if (e.currentTarget.checked) {
            option.xCenter = true
          } else {
            option.xCenter = false
            option.x
          }
          break;
        case 'y-center':
          if (e.currentTarget.checked) {
            option.yCenter = true
          } else {
            option.yCenter = false
            option.y
          }
          break;
        case 'user-name-size':
          option.fontSize = e.currentTarget.value !== '' ? `${e.currentTarget.value}px Microsoft YaHei` : '20px Microsoft YaHei'
          break;
        case 'user-name-color':
          option.color = e.currentTarget.value !== '' ? e.currentTarget.value : 'black'
          break;
        case 'img-file':
          // 获取图片
          imageFile = e.currentTarget.files[0]
          // 转化为base64
          const render = new FileReader()
          render.readAsDataURL(imageFile)

          // 图片加载后
          render.onload = function () {
            imageData = this.result
            option.img = imageData
            draw(option)
          }
          break;
        default:
          break;
      }
      draw(option)
    })
  })
}

// 预览
function preview() {
  document.querySelector('.J-preview').addEventListener('click', () => {
    const myCanvas = document.querySelector('.J-canvas-first')

    // 生成图片
    const img = myCanvas.toDataURL('image/png')

    // 生成dom元素
    const domTpl = `<div class="img-preview J-img-preview"><img src="${img}" /></div>`

    document.querySelector('.my-canvas').insertAdjacentHTML('afterend', domTpl)

    closePreview()

  })
}

// 关闭预览
function closePreview() {
  document.querySelector('.J-img-preview').addEventListener('click', (e) => {
    document.body.removeChild(e.currentTarget)
  })
}

// 下载当前图片
function downImage(fileName) {
  document.querySelector('.J-download-img').addEventListener('click', (e) => {
    // 获取canvas
    const myCanvas = document.querySelector('.J-canvas-first')

    // 生成图片
    const img = myCanvas.toDataURL('image/octet-stream')

    const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')

    saveLink.href = img

    // 设置图片名称
    saveLink.download = `${fileName}.png`

    // 下载
    const ev = document.createEvent('MouseEvents')
    ev
      .initMouseEvent(
        'click',
        true,
        false, window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );

    saveLink.dispatchEvent(
      ev
    );
  })
}