
class Helper {
    // ..and an (optional) custom class constructor. If one is
    // not supplied, a default constructor is used instead:
    // constructor() { }
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }


    // get random number for sleep timer
    getRandomInt() {
        let min = Math.ceil(this.min);
        let max = Math.floor(this.max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Simple class instance methods using short-hand method
    // declaration
    // create a GUID so we can have unique record names
    guid() {
        function _p8(s) {
            let p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    // sleep function so we don't make requests too quickly and get the IP blacklisted
    sleep(ms){
        return new Promise(resolve => {
            setTimeout(resolve,ms)
        })
    }


}


module.exports = Helper
