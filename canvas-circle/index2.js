class CircleCanvas2 {
  constructor(props) {
    this.element = props.ele // cavans 元素

    this.textNumber = props.text || 1;
  }

  init() {
    this.findEle()
  }

  findEle() {
    try {
      this.circleEle = document.querySelector(`.${this.element}`)
    } catch (error) {
      console.log(`没有该元素-${this.element}`)
    }

    this.handleCanvasData()
  }

  handleCanvasData() {

    this.centerX = this.circleEle.width

    this.centerY = this.circleEle.height

    this.circle = {
      x: (this.centerX / 2),
      y: (this.centerY / 2),
      radius: 110,
      speed: 4,
      rotation: 0,
      angleStart: 310,
      angleEnd: 90,
      hue: 220,
      thickness: 30,
    }

    this.ctx = this.circleEle.getContext('2d')

    this.gradient = this.ctx.createLinearGradient(0, -this.circle.radius, 0, this.circle.radius)
    this.gradient.addColorStop('0', 'yellow')
    this.gradient.addColorStop('0.3', 'blue')
    this.gradient.addColorStop('0.6', 'green')
    this.gradient.addColorStop('1.0', 'red')

    setInterval(this.handleRuning.bind(this), 60)
  }

  dToR(degrees) {
    return degrees * (Math.PI / 180)
  }

  updateCircle() {
    if (this.circle.rotation < 360) {
      this.circle.rotation += this.circle.speed
    } else {
      this.circle.rotation = 0
    }
  }

  renderCircle() {
    this.ctx.save()
    this.ctx.translate(this.circle.x, this.circle.y)
    this.ctx.rotate(this.dToR(this.circle.rotation))
    this.ctx.beginPath()
    this.ctx.lineCap = 'round'
    this.ctx.strokeStyle = '#EFCCCE'
    this.ctx.lineWidth = 40
    this.ctx.arc(0, 0, this.circle.radius, this.dToR(this.circle.angleStart), this.dToR(this.circle.angleEnd), false)
    this.ctx.stroke()
    this.ctx.lineWidth = this.circle.thickness
    this.ctx.strokeStyle = this.gradient
    this.ctx.stroke()
    this.ctx.restore()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.centerX, this.centerY)
  }


  handleMotionCircle() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.lineWidth = 40
    this.ctx.strokeStyle = 'rgb(255, 255, 255, 0.5)'
    this.ctx.arc(this.centerX / 2, this.centerY / 2, 100, 0, Math.PI * 2, false)
    this.ctx.fillStyle = '#fff'
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.restore()
  }

  // 处理文字
  handleText(number) {
    this.ctx.save()
    this.ctx.fillStyle = 'red'
    this.ctx.font = '40px Arial'
    this.ctx.fillText(`${number} %`, this.centerX / 2 - 25, this.centerY / 2 + 10)
    this.ctx.stroke()
    this.ctx.restore()
  }

  handleRuning() {
    if (this.textNumber === 100) {
      this.textNumber = 1
    } else {
      this.textNumber = this.textNumber + 1
    }
    this.clear()
    this.handleMotionCircle()
    this.updateCircle()
    this.renderCircle()
    this.handleText(this.textNumber)
  }
}