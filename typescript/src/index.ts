interface Params {
  name: string,
  age: number
}

function greeters(params: Params) {
  const {
    name = '默认文案',
    age = '0'
  } = params;

  return `我是 ${name}， 今年${age}`
}

let namess: string = 'mido';
let ages: number = 21;

document.querySelector('.app').innerHTML = greeters({ name: namess, age: ages });