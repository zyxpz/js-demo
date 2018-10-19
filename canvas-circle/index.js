class CircleCanvas {
  constructor(props) {

    this.position = 0.1

    this.speed = 0.1

    this.element = props.ele // cavans 元素

    this.endP = 100

    this.ctx = ''

    this.centerX = ''

    this.centerY = ''

    this.R = ''


    this.circle = null
  }

  init(opts) {
    this.startP = opts.startP

    this.speed = opts.speed

    this.endP = opts.endP

    this.finished = opts.finished || function loop() {}

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
    this.R = Math.PI * 2 / 100 // 圆周分为一百份

    this.handleRun()

  }

  // 处理运动轨迹
  handleOuterCircle(n) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = '#EFCCCE'
    this.ctx.lineWidth = '40'
    this.ctx.arc(this.centerX, this.centerY, 105, -Math.PI / 2, -Math.PI / 2 + n * this.R, false)
    this.ctx.stroke()
    const gradient = this.ctx.createLinearGradient(this.centerX + 105, this.centerY + 105, this.centerX - 105, this.centerY - 105)
    gradient.addColorStop('0', 'yellow')
    gradient.addColorStop('0.3', 'green')
    gradient.addColorStop('0.6', 'blue')
    gradient.addColorStop('1.0', 'red')
    this.ctx.strokeStyle = gradient
    this.ctx.lineWidth = '25'
    this.ctx.lineCap = 'round'
    this.ctx.stroke()
    this.ctx.restore()
  }

  // 处理外部圆
  handleMotionCircle() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.lineWidth = 40
    this.ctx.strokeStyle = 'rgb(255,255,255,0.5)'
    this.ctx.arc(this.centerX, this.centerY, 100, 0, Math.PI * 2, false)
    this.ctx.fillStyle = '#fff'
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.restore()
  }

  // 处理文字
  handleText(n) {
    this.ctx.save()
    this.ctx.fillStyle = 'red'
    this.ctx.font = '40px Arial'
    this.ctx.fillText(n.toFixed(0) + '%', this.centerX - 25, this.centerY + 10)
    this.ctx.stroke()
    this.ctx.restore()
  }

  handleRun() {
    const that = this

    this.timmer = setInterval(() => {
      that.ctx.clearRect(0, 0, that.circle.width, that.circle.height)
      that.handleMotionCircle()
      that.handleOuterCircle(that.startP)
      that.handleText(that.startP)
      if (that.startP > that.endP) {
        clearInterval(that.timmer)

        that.finished()

      }
      that.startP += that.speed
    }, 50)
  }
}