/** 
 * 下拉刷新
 * 上啦加载
 * es5构造函数
 */

const defaults = {
  threshold: 100, // 滑动触发下拉刷新的距离
  stop: 40, // 下拉刷新时停留的位置距离屏幕顶部的距离
  dis: 20 // 距离屏幕底端触发 上拉加载 的距离
}

function JsRefresh(el, params) {
  this.opts = Object.assign({}, defaults, params);
  this.el = typeof el === 'string' ? document.querySelector(el) : el;
  this.upDom = null; // 上拉加载展示 dom
  this.downDom = null; // 下拉刷新 dom
  this.upDomHeight = 0; // 下拉刷新 dom 高度
  this.rotate = null // 下拉刷新 转圈 的角度
  this.touchstartY = 0 // 触摸到屏幕的坐标起始 Y 值
  this.currentY = 0 // 移动时实时记录的坐标 Y 值
  this.isAnimation = false // 是否在自动回滚
  this.isRefresh = false // 是否正在刷新数据
  this.isLoadMore = false // 是否正在加载数据
  this.hasMore = true // 是否有更多数据, 下拉加载会用
  this.rotateTimer = null // 控制 下拉刷新 转圈 的时间计时器
  this.height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight // 屏幕高度, 下拉加载会用
  setTimeout(() => {
    this.offsetHeight = document.documentElement.offsetHeight
  }, 100)


  this.init();
}

JsRefresh.prototype.init = function () {
  // 增加下拉刷新的显示
  const refreshHtml = `<div class="jrscroll-downwarp jrscroll-downwarp-reset" style="height: 0px;"><div class="downwarp-content"><p class="downwarp-progress" style="transform: rotate(0deg);"></p ><p class="downwarp-tip">下拉刷新</p ></div></div>`;
  const divm = document.createElement('div');
  divm.innerHTML = refreshHtml;
  this.upDom = divm.children[0];
  this.el.prepend(this.upDom);
  // 增加上拉加载的显示
  const loadMoreHtml = `<div class="jrscroll-upwarp" style="visibility: hidden;"><p class="upwarp-progress"></p><p class="upwarp-tip">加载中...</p></div>`;
  const div = document.createElement('div');
  div.innerHTML = loadMoreHtml;
  this.downDom = div.children[0];
  this.el.appendChild(this.downDom);
}