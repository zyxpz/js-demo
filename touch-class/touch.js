HTMLElement.prototype.tweenTranslateXAnimate = function (start, end, cb) {
  let duration = 50;
  let t = 0;
  let vv = end - start; //移动的值
  let Tween = {
    Quad: {
      easeOut: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      }
    }
  };
  this.timer = setInterval(function () {
    let dis = start + Tween.Quad.easeOut(++t, 0, vv, duration);
    this.style.transform = 'translate3d(' + dis + 'px, 0, 0)';
    if (vv > 0 && parseInt(this.style.transform.slice(12)) >= end) {
      this.style.transform = 'translate3d(' + parseInt(dis) + 'px, 0, 0)';
      clearInterval(this.timer);
      cb && cb();
    }
    if (vv < 0 && parseInt(this.style.transform.slice(12)) <= end) {
      this.style.transform = 'translate3d(' + parseInt(dis) + 'px, 0, 0)';
      clearInterval(this.timer);
      cb && cb();
    }
  }.bind(this), 4);
}


class Touch {
  constructor(opts = {}) {
    this.attrs = {
      element: opts.element || '', // 容器
      warp: opts.warp || '', // 启动器，显示区域
      panel: null, // 面板元素
      panels: null, // 面板元素集,
      animation: opts.animation || 'horizontal', // 执行动画方式 || ‘vertical 竖向’，‘horizontal 横向’
      moveStart: null, // 开始
      moveEnd: 0, // 结束
      moveDis: 0, // 滑动距离
      moveDisP: 0, // 当前图片的transform
      moveDiff: 0, // 连续动画
      seed: 2000,
    }

    $.extend(this.attrs, opts);

    this.setUp(); // 启动
  }

  setUp() {
    const findEl = this.findEl();
    if (findEl) {
      this.init();
      this.handleEventListener();
    }
  }

  findEl() {
    // 容器
    const element = this.attrs.element = $(this.get('element'));
    if (!element.length) {
      try {
        throw new Error('element is empty')
      } catch (error) {
        console.warn(error);
      }

      return false;
    }

    // 启动容器,滑动显示区域
    let setWarp = $(this.get('warp')) && element.find(this.get('warp'));
    if (!setWarp.length) {
      setWarp = element.children().first();
    }
    this.set('warp', setWarp);
    if (!this.get('warp').length) {
      try {
        throw new Error('warp is empty')
      } catch (error) {
        console.warn(error);
      }
      return null;
    }

    // 面板元素，默认为warp的第一个子元素
    let setPanel = this.get('panel') && warp.find(this.get('panel'));
    if (!setPanel) {
      setPanel = this.get('warp').children().first();
    }
    this.set('panel', setPanel);
    if (!this.get('panel').length) {
      try {
        throw new Error('panel is empty');
      } catch (error) {
        console.warn(error);
      }
    }

    // panel子集
    this.set('panels', this.get('warp').children());
    const panelConent = this.get('panels').length;
    if (!panelConent) {
      this.attrs.element.hide();
      try {
        throw new Error('没有图片');
      } catch (error) {
        console.log(error);
      }
      return null;
    }

    // 只有一张图片的时候
    // if (panelConent === 1) {

    // }



    return this;
  }

  init() {
    const [
      element,
      warp,
      panels,
    ] = [
        this.get('element'),
        this.get('warp'),
        this.get('panels')
      ];
    const panelsLen = panels.length; // 子元素个数
    const panelHeight = this.get('panel')[0].offsetHeight; //  子元素高度
    const panelWidth = this.get('panel')[0].offsetWidth; // 子元素宽度


    // 对dom处理，copy最后一个放第一位，第一个放最后一位
    const cloneFirst = panels[0].cloneNode(true); // 第一个
    const cloneLast = panels[panelsLen - 1].cloneNode(true); // 最后一个
    warp.append(cloneFirst);
    warp.prepend(cloneLast);

    // 判断动画
    switch (this.get('animation')) {
      case 'horizontal': // 横向动画
        element.css({ 'height': `${panelHeight}px`, 'overflow': 'hidden' });
        warp.css('position', 'relative');
        const newPanels = warp.children();
        newPanels.map((i, item) => {
          // 添加样式
          $(item).css({ 'position': 'absolute', 'left': `${(i - 1) * panelWidth}px` });
          $(item).attr('index', `${i - 1}`);
        });
        if (this.get('seed') >= 2000) {
          const isTime = setInterval(this.horizontalMarquee.bind(this), this.get('seed'));
          this.set('isTime', isTime);
        } else {
          console.log(new Error('Time is too short, Please set seed greater than 2000'));
        }
        break;

      default:
        break;
    }
  }

  // 横向动画
  horizontalMarquee() {
    this.attrs.moveDiff -= this.get('panels').width();

    this.get('warp').css({ 'transform': `translate3d(${this.attrs.moveDiff}px, 0, 0)`, 'transition': 'transform 1s' });

    if (this.get('panels').width() * this.get('panels').length + this.attrs.moveDiff <= 0) {

      this.set('moveDiff', 0);

      const transitionEvent = this.whichTransitionEvent();

      transitionEvent && this.get('warp')[0].addEventListener(transitionEvent, () => {
        this.get('warp').css({ 'transform': `translate3d(${this.attrs.moveDiff}px, 0, 0)`, 'transition': 'none' })
      })
    }
  }

  handleEventListener() {
    const [
      warp, // 外层容器
    ] = [
        this.get('warp'),
      ];
    warp.on('touchstart', this.touchEvent.bind(this), false);
    warp.on('touchmove', this.touchEvent.bind(this), false);
    warp.on('touchend', this.touchEvent.bind(this), false);
  }

  touchEvent(e) {
    switch (e.type) {
      case 'touchstart':
        this.touchStart(e);
        break;
      case 'touchmove':
        this.touchMove(e);
        break;
      case 'touchend':
      case 'touchcancel':
        this.touchEnd(e);
        break;
      case 'webkitTransitionEnd':
      case 'msTransitionEnd':
      case 'oTransitionEnd':
      case 'transitionend':

        break;
      default:
        return;
    }
  }

  touchStart(e) {
    // console.log(e.touches[0]);
    const index = parseInt($(e.target).attr('index'));
    this.set('listIndex', index); // 点击了那个图片
    const pageX = e.touches[0].pageX; // touch点击下的x值
    this.set('moveStart', pageX);
    this.set('moveEnd', pageX);

    // 接触时清除自动动画
    clearInterval(this.get('isTime'));
    this.get('warp').css('transition', 'none');
  }

  touchMove(e) {
    // console.log(e.touches[0]);
    const pageX = e.touches[0].pageX;// touch移动结束的x值
    const moveDis = parseInt(pageX - this.get('moveStart') - this.get('listIndex') * this.get('panel')[0].offsetWidth); // y移动值
    this.set('moveEnd', pageX); // 
    this.set('moveDis', pageX - moveDis);
    this.get('warp').css('transform', `translate3d(${moveDis}px, 0, 0)`)
  }

  touchEnd(e) {
    const isMove = this.get('moveEnd') - this.get('moveStart'); // 判断是否移动
    if (Math.abs(isMove) > 0) { // 移动
      if (Math.abs(isMove) > this.get('warp')[0].offsetWidth * 0.5) { // 拖动超过容器一半换下一张
        if (isMove < 0) {
          this.findList(this.get('listIndex') + 1); // 左滑
        } else {
          this.findList(this.get('listIndex') - 1); // 右
        }
      } else {
        this.findList(this.get('listIndex'))
      }
    } else {
      console.log('未拖动');
    }
    this.get('isTime');
  }

  findList(index) {
    const warp = this.get('warp');
    const warpWidth = this.get('warp')[0].offsetWidth
    const start = parseInt(warp[0].style.transform.slice(12)); // 初始位置
    const newIndex = -(index * warpWidth);
    const listLen = this.get('warp').children().length - 2;
    this.set('moveDisP', newIndex);
    this.set('moveDiff', newIndex);
    warp[0].tweenTranslateXAnimate(start, newIndex, () => {
      switch (index) {
        case listLen:
          this.set('moveDis', 0);
          this.set('moveDiff', 0);
          warp.css('transform', 'translate3d(0, 0, 0)');
          break;

        case -1:
          this.set('moveDis', -warpWidth * (listLen - 1));
          this.set('moveDiff', -this.get('warp') * (listLen - 1));
          warp.css('transform', `translate3d(${warpWidth * (1 - listLen)}px, 0, 0)`);
          break;
        default:
          break;
      }
    });
  }


  // 浏览器兼容
  whichTransitionEvent() {
    const el = this.get('warp')[0];
    let transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    }
    for (let t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  set(key, val) {
    this.attrs[key] = val;
    return this.attrs;
  }

  get(val) {
    return this.attrs[val]
  }
}