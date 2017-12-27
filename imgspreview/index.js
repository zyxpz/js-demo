class ImgsPreviewPopup {
  init() {
    this.overlay = $(`<div class="imgs-preview-popup"></div>`);
    this.slider = $('<div class="imgs-slide"></div>');
    this.prevArrow = $('<a class="prevArrow"></a>');
    this.nextArrow = $('<a class="nextArrow"></a>');
    this.pageSpan = $('<span class="imgs-pages"></span>');
    this.close = $('<span class="imgs-close J-close">&#10005;</span>');
    this.placeholders = $([]);
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
    this.placeholders = $([]);
    this.overlay.remove();
  }
}


class ImgsPreview extends ImgsPreviewPopup {
  constructor(opts = {}) {
    super();
    this.attrs = {
      warp: opts.warp,
      imgThumbs: opts.imgThumbs,
    }
    super.init();
    super.handleEvent();
    this.init();
  }

  // 初始化
  init() {
    this.warp = $(this.attrs.warp);

    this.ifOnTouch();

    this.handleEvent();
  }

  // 创建画廊
  createHtml() {
    super.hanleShow();

    this.setTime = setTimeout(() => {
      // 触发动画
      this.overlay.addClass('visible');
    }, 100);
  }

  handleEvent() {
    this.warp.on('click', `${this.attrs.imgThumbs}`, this.querIndex.bind(this));
    this.overlay.on('click', '.prevArrow', this.prevArrowClick.bind(this));
    this.overlay.on('click', '.nextArrow', this.nextArrowClick.bind(this));
  }

  querIndex(e) {
    e.preventDefault();

    this.index = $(e.currentTarget).index();

    this.image = $(e.currentTarget).attr('href');

    this.imgs = $(e.currentTarget).parent().children();

    this.imgLen = this.imgs.length;

    this.imgs.forEach((e) => {
      this.placeholders = this.placeholders.add($(`<div class="placeholder" data-index="${$(e).index()}"><img src="${$(e).attr('href')}"/></div>`));
    });

    this.slider.html(this.placeholders);

    this.imgShowIndex(this.index);

    this.createHtml();

  }

  imgShowIndex(index) {
    this.slider.css({
      left: `${ - index * 100 }%`
    });
    this.pageSpan.text(`${index + 1}/${this.imgLen}`);
  }

  ifOnTouch() {
    if (!("ontouchstart" in window)) {
      this.overlay.append(this.prevArrow).append(this.nextArrow);
    }
  }

  prevArrowClick() {
    this.index = this.index - 1;
    if (this.index < 0) {
      this.index = 0;
      return;
    }
    this.imgShowIndex(this.index);
  }

  nextArrowClick() {
    this.index = this.index + 1;
    if (this.index >= this.imgLen) {
      this.index = this.imgLen - 1;
      return;
    }
    this.imgShowIndex(this.index);
  }


}