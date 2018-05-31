var Greeter = /** @class */ (function () {
    function Greeter(message) {
        var _this = this;
        this.greet = function () {
            return "hellow," + _this.greeting;
        };
        this.greeting = message;
    }
    return Greeter;
}());
var greeterss = new Greeter('world');
