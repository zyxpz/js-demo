
class ClassApp {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet = () =>
    `hellow,${this.greeting}` 
}

let ClassAppIs = new ClassApp('world');

document.querySelector('.app').innerHTML = ClassAppIs.greet();