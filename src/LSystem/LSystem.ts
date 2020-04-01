import {vec3} from 'gl-matrix';
import Turtle from "./Turtle"
import ExpansionRule from "./ExpansionRule"
import DrawingRule from "./DrawingRule"

class LSystem {
    turtle : Turtle;
    iterations : number;
    axiom : string;

    expansion : ExpansionRule;
    drawing : DrawingRule;

    turtleStack : Array<Turtle>;

  constructor() {
    let startPos : vec3 = vec3.create();
    vec3.set(startPos, 0, 0, 0);
    let startOrient : vec3 = vec3.create();
    vec3.set(startOrient, 0, 0, 1);
    let scale : vec3 = vec3.create();
    vec3.set(scale, 10, 10, 10);
    this.turtle = new Turtle(startPos, startOrient, 0, scale);

    this.iterations = 1;
    this.axiom = "F";

    this.expansion = new ExpansionRule();
    this.drawing = new DrawingRule(this.turtle);

    let newAxiom : string = "";
    let replace : string = "";

    for (let i = 0; i < this.iterations; i++) {
        for (let j = 0; j < this.axiom.length; j++) {
            replace = this.expansion.expansionRules.get(this.axiom.charAt(j));
            if (replace)    // will evaluate to true if replace is NOT: null, undefined, NaN, empty string (""), 0, false
            {
                newAxiom += replace;
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

    //   for (let i = 0; i < this.axiom.length; i++) {
    //       let currChar : string = this.axiom.charAt(i);
    //       let func = this.drawing.drawingRules.get(currChar);
    //       if (func) {
    //         //console.log("func");
    //           func();
    //           //console.log(this.turtle.position);
    //           //console.log(this.turtle.orientation);
    //       }
    //       else if (currChar == "[") {
    //         //console.log("[");
    //           this.turtleStack.push(new Turtle(this.turtle.position, this.turtle.orientation, this.turtle.recursionDepth, this.turtle.moveScale));
    //           this.turtle.recursionDepth++;
    //           //console.log(this.turtle.position);
    //       }
    //       else if (currChar == "]") {
    //         //console.log("]");
    //           this.turtle = this.turtleStack.pop();
    //           this.drawing.setTurtle(this.turtle);
    //           //console.log(this.turtle.position);
    //     }
    //   }
  }
}

export default LSystem;