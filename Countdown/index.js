'use strict';

class Countdown {
  constructor(opts = {}) {
    this.attrs = {
      warp: opts.warp,
      url: opts.url || '',
      down: opts.down || 60,
      run: true,
    }
    Object.assign(this.attrs, opts);
    this.findEl();
  }

  findEl() {
    const $ele = document.querySelector(`.${this.get('warp')}`);
    if (!$ele) {
      console.warn('warp is empry');
      return;
    } else {
      this.set('$ele', $ele);
      this.init();
    }
  }

  init() {
    const $doBox = this.get('$ele').firstElementChild;
    this.set('$doBox', $doBox);
    if ($doBox) {
      this.handleClick();
    }
  }

  handleAjax(opts = {}) {
    const url = opts.url,
      ok = opts.ok,
      $ajax = new XMLHttpRequest();
    $ajax.open("GET", url, true);
    $ajax.send(null);
    $ajax.addEventListener('load', () => {
      if ($ajax.status === 200) {
        ok && ok(req.responseText);
      }
    });
  }

  handleClick() {
    const $clickBox = this.get('$ele');
    $clickBox.addEventListener('click', (e) => {
      // this.handleAjax({ 
      //   url: this.get('url'),
      //   ok(d) {
      //     console.log(d)
      //   }
      // });
      e.preventDefault();
      if (e.currentTarget.getAttribute('disabled') === 'false') {
        return;
      }
      e.currentTarget.setAttribute('disabled', false);
      e.currentTarget.style.backgroundColor = 'blue';
      this.handleIntervalText();
    })
  }

  handleInterval() {
    const interval = setInterval(() => {
      if (this.get('down') > 1 && this.get('down') <= 60) {
        this.set('down', this.get('down') - 1);
        this.get('$doBox').innerText = `倒计时${this.get('down')}`;
      } else {
        this.set('down', 60);
        interval && clearInterval(interval);
        this.get('$ele').style.backgroundColor = 'red';
        this.get('$ele').setAttribute('disabled', true);
        this.get('$doBox').innerText = `验证码`;
      }
    }, 1000);
  }

  handleIntervalText() {
    this.get('$doBox').innerText = `倒计时${this.get('down')}`;
    this.handleInterval();
  }

  set(key, val) {
    return this.attrs[key] = val;
  }

  get(key) {
    return this.attrs[key];
  }
}