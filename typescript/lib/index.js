function greeters(params) {
    var _a = params.name, name = _a === void 0 ? '默认文案' : _a, _b = params.age, age = _b === void 0 ? '0' : _b;
    return "\u6211\u662F " + name + "\uFF0C \u4ECA\u5E74" + age;
}
var namess = 'mido';
var ages = 21;
document.querySelector('.app').innerHTML = greeters({ name: namess, age: ages });
