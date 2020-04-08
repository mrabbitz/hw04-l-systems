import {vec3} from 'gl-matrix';

class ExpansionRule {
    expansionRules : Map<string, any>;

    enumer : Array<string>;

    constructor() {
      this.expansionRules = new Map();
  
      this.expansionRules.set("F", this.randomF.bind(this));
  
      this.expansionRules.set("A", this.randomA.bind(this));
  
      this.expansionRules.set("B", this.randomB.bind(this));
  
      this.enumer = new Array<string>("-","^","/", "+","&","\\");
      console.log(this.enumer);
  
      //this.expansionRules.set("F", "F[-F]F[+F][F]");
      //console.log(this.expansionRules.get("F")); // Will print out "F[-F]F[+F][F]"
      //console.log(this.expansionRules.get('A')); // Will print out 'undefined'
  
      //this.expansionRules.set("F", "F+F-F&F^F\\F/F");
    }

    getRandomArbitrary(min : number, max : number) {
      return Math.random() * (max - min) + min;
    }

    randomF() {
      let rand : number = Math.random();
      let str : string;
      //if (rand <= 0.33) {
      //  str = "F[+F]F[-F]F";
      //}
      //else if (rand <= 0.66) {
      //  str = "FF-[-F+F+F]+[+F-F-F]";
      //}
      //else {
      //  str = "F[-F]F";
      //}
      //str = "FF" + this.enumer[Math.floor(Math.random() * 3.0) + 3] + "[" + this.enumer[Math.floor(Math.random() * 3.0) + 3] + "F" + this.enumer[Math.floor(Math.random() * 3.0)] + "F" + this.enumer[Math.floor(Math.random() * 3.0)] + "F]" + this.enumer[Math.floor(Math.random() * 3.0)] + "[" + this.enumer[Math.floor(Math.random() * 3.0)] + "F" + this.enumer[Math.floor(Math.random() * 3.0) + 3] + "F" + this.enumer[Math.floor(Math.random() * 3.0) + 3] + "F]";

      let idx = Math.floor(Math.random() * 3.0); // 0, 1, or 2
      str = "FF" + this.enumer[idx] + "[" + this.enumer[idx] + "F" + this.enumer[idx+3] + "F" + this.enumer[idx+3] + "F]" + this.enumer[idx+3] + "[" + this.enumer[idx+3] + "F" + this.enumer[idx] + "F" + this.enumer[idx] + "F]";


      // let len = Math.floor(str.length / 2.0);

      // for (let i = 0; i < len; ++i) {
      //   rand = Math.floor(Math.random() * str.length);
      //   if (Math.random() <= 0.5) {
      //     str = str.slice(0, rand) + "A" + str.slice(rand);
      //   }
      //   else {
      //     str = str.slice(0, rand) + "B" + str.slice(rand);
      //   }
      // }

      return str;
    }

    randomA() {
      let tmp = Math.random();
      if (tmp <= 0.33) {
        //return "[Y2XF][Y2!XF]F";
        return "[Y5XF][Y5!XF][Y5!!XF][Y5!!!XF][Y5!!!!XF]F";
      }
      else if (tmp <= 0.66) {
        return "[Y3XF][Y3!XF][Y3!!XF]F";
      }
      else
      {
        return "[Y4XF][Y4!XF][Y4!!XF][Y4!!!XF]F";
      }
    }

    randomB() {
      let tmp = Math.random();
      if (tmp <= 0.33) {
        //return "[Y2RF][Y2!RF]F";
        return "[Y5RF][Y5!RF][Y5!!RF][Y5!!!RF][Y5!!!!RF]F";
      }
      else if (tmp <= 0.66) {
        return "[Y3RF][Y3!RF][Y3!!RF]F";
      }
      else
      {
        return "[Y4RF][Y4!RF][Y4!!RF][Y4!!!RF]F";
      }
    }
}

export default ExpansionRule;