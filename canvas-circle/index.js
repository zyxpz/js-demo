class CircleCanvas {
  constructor(props) {

    this.speed = props.speed || 0.1

    this.element = props.ele // cavans 元素

    this.whole = props.whole || 100

    this.ctx = ''

    this.centerX = ''

    this.centerY = ''

    this.R = ''


    this.circle = null
  }

  init() {
    this.findEle()
  }

  findEle() {
    try {
      this.circle = document.querySelector(`.${this.element}`)
    } catch (error) {
      console.log(`没有该元素-${this.element}`)
    }

    this.handleCanvasData()
  }

  handleCanvasData() {
    this.ctx = this.circle.getContext('2d')
    this.centerX = this.circle.width / 2
    this.centerY = this.circle.height / 2
    this.R = Math.PI * 2 / 100

    this.handleRun()
  }

  // 处理运动轨迹
  handleOuterCircle(n) {
    this.ctx.save()
    this.ctx.strokeStyle = "#fff" // 设置描边样式
    this.ctx.lineWidth = 5 // 设置线宽
    this.ctx.beginPath() // 路径开始
    this.ctx.arc(this.centerX, this.centerY, 100, -Math.PI / 2, -Math.PI / 2 + n * this.R, false) // 用于绘制圆弧this.ctx.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
    this.ctx.stroke() // 绘制
    // this.ctx.closePath() // 路径结束
    this.ctx.restore()
  }

  // 处理外部圆
  handleMotionCircle() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.lineWidth = 2 // 设置线宽
    this.ctx.strokeStyle = "red"
    this.ctx.arc(this.centerX, this.centerY, 100, 0, Math.PI * 2, false)
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.restore()
  }

  // 处理文字
  handleText(n) {
    this.ctx.save() // save和restore可以保证样式属性只运用于该段canvas元素
    this.ctx.strokeStyle = "#fff" // 设置描边样式
    this.ctx.font = "40px Arial" // 设置字体大小和字体
    // 绘制字体，并且指定位置
    this.ctx.strokeText(n.toFixed(0) + "%", this.centerX - 25, this.centerY + 10)
    this.ctx.stroke() // 执行绘制
    this.ctx.restore()
  }

  handleRun() {
    const that = this

    this.timmer = setInterval(() => {
      that.ctx.clearRect(0, 0, that.circle.width, that.circle.height);
      that.handleOuterCircle(that.speed);
      that.handleText(that.speed);
      that.handleMotionCircle();
      if (that.speed > that.whole) {
        clearInterval(that.timmer)
        that.speed = 0;
      }
      that.speed += 0.1;
    }, 50)
  }
}