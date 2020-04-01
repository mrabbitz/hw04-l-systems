import {vec3} from 'gl-matrix';
import Turtle from "./Turtle"

class DrawingRule {
    drawingRules : Map<string, any>;

  constructor(turtle : Turtle) {
    this.drawingRules = new Map();
    this.drawingRules.set("F", turtle.moveForward.bind(turtle));
    this.drawingRules.set("+", turtle.rotateZNeg30Degs.bind(turtle));
    this.drawingRules.set("-", turtle.rotateZ30Degs.bind(turtle));
  }

  setTurtle(turtle : Turtle) {
    this.drawingRules.set("F", turtle.moveForward.bind(turtle));
    this.drawingRules.set("+", turtle.rotateZNeg30Degs.bind(turtle));
    this.drawingRules.set("-", turtle.rotateZ30Degs.bind(turtle));
  }
}

export default DrawingRule;