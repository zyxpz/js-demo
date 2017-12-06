
class Tabs {
  constructor(opts = {}) {
    this.attrs = {
      wrap: opts.wrap,
      nav: opts.nav,
      main: opts.main,
      navKey: 0, // 先废弃掉，后续再解决
    }

    $.extend(this.attrs, opts);

    this.setUp();
  }

  setUp() {
    const findEl = this.findEl();
    if (findEl) {
      this.init();
    } else {
      throw new Error('empty');
    }
  }

  findEl() {
    const $warp = this.attrs.wrap = $(this.get('warp'));
    if (!$warp.length) {
      return false;
    } else {
      this.set('$warp', $warp);
    }

    const $nav = this.attrs.nav = $(this.get('nav'));
    if (!$nav.length) {
      return false;
    } else {
      this.set('$nav', $nav);
    }

    const $main = this.attrs.main = $(this.get('main'));
    if (!$main.length) {
      return false;
    } else {
      this.set('$main', $main);
    }

    return true;
  }

  init() {
    // 处理nav
    const $navChildren = this.get('$nav').find('.tabs-nav-content');
    if ($navChildren.length) {
      $navChildren.map((item, index) => {
        $(index).attr('data-key', item);
      });

      // 定位线的初始位置
      const $navLineInit = this.get('$nav').find('.tabs-nav-line'),
        $lineWid = $navChildren[0].offsetWidth,
        left = this.get('navKey') * $lineWid;
      $navLineInit.css({ 'left': left, 'width': `${$lineWid}px` });

      // 点击事件
      this.handleNavClick();
    }

    // 处理main
    const $mainChildren = this.get('$main').find('.tabs-main'),
      panelsLen = $mainChildren.length,

      cloneFirst = $mainChildren[0].cloneNode(true), // 第一个
      cloneLast = $mainChildren[panelsLen - 1].cloneNode(true); // 最后一个
    this.get('$main').append(cloneFirst);
    this.get('$main').prepend(cloneLast);

    if ($mainChildren.length) {
      const wid = $mainChildren[0].offsetWidth;
      this.get('$main').find('.tabs-main').map((index, item) => {
        const left = wid * (index - this.get('navKey') - 1);
        $(item).css('left', `${left}px`);
        $(item).attr('data-key', index - 1);
      });

      this.handleMoveEventListener();
    }
  }

  // 导航栏点击事件
  handleNavClick() {
    const $navChildren = this.get('$nav').find('.tabs-nav-content');
    $navChildren.on('click', this.handleNavLine.bind(this));
  }

  // 导航栏，线位置处理
  handleNavLine(e) {
    const $target = $(e.currentTarget),
      key = $target.data('key');

    this.handleMain(key);
    this.handleMoveNavLine(key, 'line');
  }

  // 线位置
  handleMoveNavLine(index, type) {
    const
      $navline = this.get('$nav').find('.tabs-nav-line'),
      $tabs = this.get('$nav').find('.tabs-nav-content'),
      $tabslen = $tabs.length,
      $tabsWid = $tabs[0].offsetWidth,
      $lineWid = $navline[0].offsetWidth,
      left = index * $lineWid;
    if (left >= ($tabsWid * $tabslen)) {
      $navline.css({ 'transform': `translate3d(0, 0, 0)`, 'transition': 'transform .5s' });
    } else if (left < 0 && type !== 'line') {
      $navline.css({ 'transform': `translate3d(${$tabsWid * ($tabslen - 1)}px, 0, 0)`, 'transition': 'transform .5s' });
    } else {
      $navline.css({ 'transform': `translate3d(${left}px, 0, 0)`, 'transition': 'transform .5s' });
    }
  }

  // 对应导航栏面板
  handleMain(key) {
    const $main = this.get('$main'),
      wid = $main[0].offsetWidth,
      left = - wid * key;

    $main.css({ 'transform': `translate3d(${left}px, 0, 0)`, 'transition': 'transform .5s' });
  }

  // 面板touch事件
  handleMoveEventListener() {
    const $main = this.get('$main');

    $main.on('touchstart', this.touchStart.bind(this));
    $main.on('touchmove', this.touchMove.bind(this));
    $main.on('touchend', this.touchEnd.bind(this));
  }

  touchStart(e) {
    const pageX = e.touches[0].pageX,
      $target = $(e.target),
      listIndex = parseInt($target.data('key'));
    this.set('listIndex', listIndex);
    this.set('startX', pageX);
  }

  touchMove(e) {
    const $target = $(e.target),
      i = this.get('listIndex'),
      pageX = e.touches[0].pageX,
      moveDis = parseInt(pageX - this.get('startX') - i * $target[0].offsetWidth);
    this.handleMainMove(moveDis);
    this.set('endX', pageX);
  }

  touchEnd(e) {
    const moveStart = this.get('startX'),
      moveEnd = this.get('endX'),
      isMove = moveStart - moveEnd;
    if (Math.abs(isMove) > 0) { // 移动
      if (Math.abs(isMove) > 40) { // 大于20切换另一张
        if (isMove < 0) { // 右滑
          this.handleMoveList(this.get('listIndex') - 1);
        } else { // 左滑
          this.handleMoveList(this.get('listIndex') + 1);
        }
      } else { // 返回
        this.handleMoveList(this.get('listIndex'));
      }
    } else {
      console.log('未拖动');
    }
  }

  // 面板滑动事件
  handleMoveList(index) {
    const $main = this.get('$main'),
      mainWidth = $main[0].offsetWidth,
      startX = parseInt($main[0].style.transform.slice(12)),
      newIndex = -(index * mainWidth),
      listLen = $main.children().length - 2;
    this.handleMoveNavLine(index);
    // console.log(mainWidth, startX, newIndex, listLen, index)
    $main[0].tweenTranslateXAnimate(startX, newIndex, () => {
      switch (index) {
        case listLen:
          this.handleMainMove(0);
          break;

        case -1:
          this.handleMainMove(mainWidth * (1 - listLen));
          break;
        default:
          break;
      }
    })
  }

  // 面板滑动位置
  handleMainMove(left) {
    const $main = this.get('$main');
    $main.css({ 'transform': `translate3d(${left}px, 0, 0)`, 'transition': 'none' });
  }

  set(key, val) {
    return this.attrs[key] = val;
  }

  get(key) {
    return this.attrs[key];
  }
}


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