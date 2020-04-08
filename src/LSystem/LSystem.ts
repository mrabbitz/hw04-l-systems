import {vec3} from 'gl-matrix';
import Turtle from "./Turtle";
import ExpansionRule from "./ExpansionRule";
import DrawingRule from "./DrawingRule";
import {mat3} from 'gl-matrix';

class LSystem {
    turtle : Turtle;
    iterations : number;
    axiom : string;

    expansion : ExpansionRule;
    drawing : DrawingRule;

    turtleStack : Array<Turtle>;

  constructor() {
    // (pos: vec3, orient: vec3, recursion: number, scale: vec3)
    // mat3: Heading, Left, Up orientations, column major
    this.turtle = new Turtle(vec3.fromValues(0, 0, 0), mat3.fromValues(0, 1, 0, -1, 0, 0, 0, 0, 1), 0, vec3.fromValues(2, 3, 2));

    this.iterations = 4;
    this.axiom = "FABA";

    this.expansion = new ExpansionRule();
    this.drawing = new DrawingRule(this.turtle);

    let newAxiom : string = "";
    //let replace : string = "";

    for (let i = 0; i < this.iterations; i++) {
        for (let j = 0; j < this.axiom.length; j++) {
            let replace = this.expansion.expansionRules.get(this.axiom.charAt(j));
            if (replace)    // will evaluate to true if replace is NOT: null, undefined, NaN, empty string (""), 0, false
            {
                newAxiom += replace();
            }
            else            // accounts for brackets, plus and minus signs, etc.
            {
                newAxiom += this.axiom.charAt(j);
            }
        }
        this.axiom = newAxiom;
        newAxiom = "";
      }
      //console.log(this.axiom);

      this.turtleStack = new Array();
  }
}

export default LSystem;