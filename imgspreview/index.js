class ImgsPreviewPopup {
  init() {
    this.overlay = $('<div class="imgs-preview-popup"></div>');
    this.slider = $('<div class="imgs-slide"></div>');
    this.prevArrow = $('<a class="prevArrow"></a>');
    this.nextArrow = $('<a class="nextArrow"></a>');
    this.pageSpan = $('<span class="imgs-pages"></span>');
    this.close = $('<span class="imgs-close J-close">&#10005;</span>');
    this.placeholders = $('<div class="placeholder"></div>');
  }
  handleEvent() {
    this.overlay.on('click', '.J-close', this.handleHide.bind(this));
  }
  handleCreatePopupHtml() {
    this.overlay.appendTo('body');
    this.slider.appendTo(this.overlay);
    this.pageSpan.appendTo(this.overlay);
    this.close.appendTo(this.overlay);
  }
  hanleShow() {
    this.handleCreatePopupHtml();
  }
  handleHide() {
    this.overlay.removeClass('visible');
    this.overlay.remove();
  }
}


class ImgsPreview extends ImgsPreviewPopup {
  constructor(opts = {}) {
    super();
    this.attrs = {
      warp: opts.warp,
      sketchpad: opts.sketchpad,
      imgThumbs: opts.imgThumbs,
    }
    super.init();
    super.handleEvent();
    this.init();
  }

  // 初始化
  init() {
    this.warp = $(this.attrs.warp);

    this.handleEvent();
  }

  // 创建画廊
  createHtml() {
    super.hanleShow();

    this.setTime = setTimeout(() => {
      // 触发动画
      this.overlay.addClass('visible');
    }, 100);

    this.pageSpan.text(`${this.index + 1}/${this.imgLen}`);
  }

  handleEvent() {
    this.warp.on('click', `${this.attrs.imgThumbs}`, this.querIndex.bind(this));
  }

  querIndex(e) {
    e.preventDefault();

    this.index = $(e.currentTarget).index();

    this.image = $(e.currentTarget).attr('href');

    this.imgs = $(e.currentTarget).parent().children();

    this.imgLen = this.imgs.length;

    // this.imgs.each(() => {
    //   this.placeholders = this.placeholders.add($('<div class="placeholder"></div>'));
    // });

    this.slider.append(this.placeholders);

    this.imgHtml(this.image);

    this.createHtml();

  }

  imgHtml(src) {
    const img = $('<img/>')
    img.attr('src', src);
    this.placeholders.html(img);
  }

}