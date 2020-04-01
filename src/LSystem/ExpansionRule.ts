import {vec3} from 'gl-matrix';

class ExpansionRule {
    expansionRules : Map<string, string>;

  constructor() {
    this.expansionRules = new Map();
    this.expansionRules.set("F", "F[-F]F[+F][F]");
    //console.log(this.expansionRules.get("F")); // Will print out "F[-F]F[+F][F]"
    //console.log(this.expansionRules.get('A')); // Will print out 'undefined'
  }
}

export default ExpansionRule;