
class Tabs {
  constructor(opts = {}) {
    this.attrs = {
      wrap: opts.wrap,
      nav: opts.nav,
      main: opts.main,
      navKey: null,
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
    if (!$warp) {
      return false;
    } else {
      this.set('$warp', $warp);
    }

    const $nav = this.attrs.nav = $(this.get('nav'));
    if (!$nav) {
      return false;
    } else {
      this.set('$nav', $nav);
    }

    const $main = this.attrs.main = $(this.get('main'));
    if (!$main) {
      return false;
    } else {
      this.set('$main', $main);
    }

    return true;
  }

  init() {
    // 处理nav
    const $navChildren = this.get('$nav').find('.tabs-nav-content');
    if ($navChildren) {
      $navChildren.map((item, index) => {
        $(index).attr('data-key', item);
      });

      // 定位线的初始位置
      const $navLineInit = this.get('$nav').find('.tabs-nav-line'),
        $lineWid = $navLineInit[0].offsetWidth,
        left = this.get('navKey') * $lineWid;
      $navLineInit.css('left', left);

      // 点击事件
      this.handleNavClick();
    }

    // 处理main
    const $mainChildren = this.get('$main').find('.tabs-main');
    if ($mainChildren) {
      const wid = $mainChildren[0].offsetWidth;
      $mainChildren.map((index, item) => {
        const left = wid * (index - this.get('navKey'));
        $(item).css('left', `${left}px`);
      });
    }
  }

  handleNavClick() {
    const $navChildren = this.get('$nav').find('.tabs-nav-content');
    $navChildren.on('click', this.handleNavLine.bind(this));
  }

  // 导航栏，线位置处理
  handleNavLine(e) {
    const $target = $(e.currentTarget),
      navKey = Number($target.data('key') - this.get('navKey')),
      $navline = this.get('$nav').find('.tabs-nav-line'),
      $lineWid = $navline[0].offsetWidth,
      left = navKey * $lineWid;
    $navline.css({ 'transform': `translate3d(${left}px, 0, 0)`, 'transition': 'transform .5s' });

    this.handleMain(navKey);
  }

  handleMain(key) {
    const $main = this.get('$main'),
    wid = $main[0].offsetWidth,
    left = - wid * key;

    $main.css({ 'transform': `translate3d(${left}px, 0, 0)`, 'transition': 'transform .5s' });
  }

  set(key, val) {
    return this.attrs[key] = val;
  }

  get(key) {
    return this.attrs[key];
  }
}