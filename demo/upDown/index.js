Object.prototype.prepend = function (newElenment) {
  this.innerHTML = arguments[0] + this.innerHTML
  return this
}

class Scroll {
  constructor(opts) {
    this.attrs = {
      warp: opts.warp,
      main: opts.main,
      startPos: '', // 初始位置
      endPos: '', // 结束位置
    }
  }

  init() {
    this._warp = document.querySelector(`.${this.attrs.warp}`)

    this._main = document.querySelectorAll(`.${this.attrs.main}`)

    this._mainLen = this._main.length

    const warpH = this._warp.offsetHeight

    this.warpH = warpH

    const cloneFirst = this._main[0].cloneNode(true)

    const cloneLast = this._main[this._main.length - 1].cloneNode(true)

    this._warp.appendChild(cloneFirst)

    this._warp.prepend(cloneLast)

    this._warp.childNodes.forEach((e, i) => {
      if (e.nodeType === 1) {
        e.style.height = `${warpH}px`
        e.style.top = `${warpH * ((i / 2) - 1)}px`
        e.setAttribute('data-tap', (i / 2) - 1)
        e.index = (i / 2) - 1
      }
    });

    this.handleMoveEventListener();
  }

  handleMoveEventListener() {
    this._warp.addEventListener('touchstart', this.handleTouchStart.bind(this))

    this._warp.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  handleTouchStart(e) {
    e.preventDefault()
    this.attrs.startPos = e.touches[0].pageY

    this.attrs.endPos = ''

    this.index = e.target.index

    this._warp.addEventListener('touchmove', this.handleTouchMove.bind(this))

  }

  handleTouchMove(e) {
    e.preventDefault()

    this.attrs.endPos = e.touches[0].pageY

  }

  handleTouchEnd() {
    if (this.attrs.endPos !== '') {
      if ((this.attrs.endPos - this.attrs.startPos) > 10) {
        this.prev()
        this._warp.removeEventListener('touchstart', this.handleTouchStart)
      } else if ((this.attrs.endPos - this.attrs.startPos) < -10) {
        this.next()
        this._warp.removeEventListener('touchstart', this.handleTouchStart)
      }
    }
    this._warp.removeEventListener('touchstart', this.handleTouchStart)
  }

  prev() {
    this.index = this.index - 1

    if (this.index < 0) {
      this.index = - 1
      this.domShow(this.index)
      return
    }

    this.domShow(this.index)
  }

  next() {
    this.index = this.index + 1

    if (this.index >= this._mainLen) {
      this.index = this._mainLen
      this.domShow(this.index)
      return
    }
    this.domShow(this.index)
  }

  domShow(index) {
    if (index === -1) {
      this._warp.style.cssText = `transform: translate3d(0, ${1 * this.warpH}px, 0); transition: transform .5s`
      
      setTimeout(() => {
        this._warp.style.cssText = `transform: translate3d(0, ${-(this._mainLen - 1) * this.warpH}px, 0);`
      }, 550);
    } else {
      this._warp.style.cssText = `transform: translate3d(0, -${index * this.warpH}px, 0); transition: transform .5s`
    }
    
    if (index === this._mainLen) {
      setTimeout(() => {
        this._warp.style.cssText = `transform: translate3d(0, 0, 0);`
      }, 550);
    }
    
  }
}