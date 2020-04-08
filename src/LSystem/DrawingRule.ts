import {vec3} from 'gl-matrix';
import Turtle from "./Turtle"

class DrawingRule {
    drawingRules : Map<string, any>;

  constructor(turtle : Turtle) {
    this.drawingRules = new Map();
    this.drawingRules.set("F", turtle.moveForward.bind(turtle));
    // Turn
    this.drawingRules.set("+", turtle.TurnLeft30Degs.bind(turtle));     // left
    this.drawingRules.set("-", turtle.TurnRight30Degs.bind(turtle));    // right
    // Pitch
    this.drawingRules.set("&", turtle.PitchDown30Degs.bind(turtle));    // down
    this.drawingRules.set("^", turtle.PitchUp30Degs.bind(turtle));      // up
    // Roll
    this.drawingRules.set("\\", turtle.RollLeft30Degs.bind(turtle));    // left (actually a backslash \)
    this.drawingRules.set("/", turtle.RollRight30Degs.bind(turtle));    // right


    this.drawingRules.set("S", turtle.shrinkBranch.bind(turtle));
    this.drawingRules.set("X", turtle.randomPitch_10_30.bind(turtle));
    this.drawingRules.set("R", turtle.randomPitch_30_70.bind(turtle));

    this.drawingRules.set("Y2", turtle.randomRoll.bind(turtle, 2, 0));
    this.drawingRules.set("Y2!", turtle.randomRoll.bind(turtle, 2, 1));
    this.drawingRules.set("Y3", turtle.randomRoll.bind(turtle, 3, 0));
    this.drawingRules.set("Y3!", turtle.randomRoll.bind(turtle, 3, 1));
    this.drawingRules.set("Y3!!", turtle.randomRoll.bind(turtle, 3, 2));
    this.drawingRules.set("Y4", turtle.randomRoll.bind(turtle, 4, 0));
    this.drawingRules.set("Y4!", turtle.randomRoll.bind(turtle, 4, 1));
    this.drawingRules.set("Y4!!", turtle.randomRoll.bind(turtle, 4, 2));
    this.drawingRules.set("Y4!!!", turtle.randomRoll.bind(turtle, 4, 3));
    this.drawingRules.set("Y5", turtle.randomRoll.bind(turtle, 5, 0));
    this.drawingRules.set("Y5!", turtle.randomRoll.bind(turtle, 5, 1));
    this.drawingRules.set("Y5!!", turtle.randomRoll.bind(turtle, 5, 2));
    this.drawingRules.set("Y5!!!", turtle.randomRoll.bind(turtle, 5, 3));
    this.drawingRules.set("Y5!!!!", turtle.randomRoll.bind(turtle, 5, 4));
  }

  setTurtle(turtle : Turtle) {
    this.drawingRules.set("F", turtle.moveForward.bind(turtle));
    // Turn
    this.drawingRules.set("+", turtle.TurnLeft30Degs.bind(turtle));     // left
    this.drawingRules.set("-", turtle.TurnRight30Degs.bind(turtle));    // right
    // Pitch
    this.drawingRules.set("&", turtle.PitchDown30Degs.bind(turtle));    // down
    this.drawingRules.set("^", turtle.PitchUp30Degs.bind(turtle));      // up
    // Roll
    this.drawingRules.set("\\", turtle.RollLeft30Degs.bind(turtle));    // left (actually a backslash \)
    this.drawingRules.set("/", turtle.RollRight30Degs.bind(turtle));    // right

    this.drawingRules.set("S", turtle.shrinkBranch.bind(turtle));
    this.drawingRules.set("X", turtle.randomPitch_10_30.bind(turtle));
    this.drawingRules.set("R", turtle.randomPitch_30_70.bind(turtle));

    this.drawingRules.set("Y2", turtle.randomRoll.bind(turtle, 2, 0));
    this.drawingRules.set("Y2!", turtle.randomRoll.bind(turtle, 2, 1));
    this.drawingRules.set("Y3", turtle.randomRoll.bind(turtle, 3, 0));
    this.drawingRules.set("Y3!", turtle.randomRoll.bind(turtle, 3, 1));
    this.drawingRules.set("Y3!!", turtle.randomRoll.bind(turtle, 3, 2));
    this.drawingRules.set("Y4", turtle.randomRoll.bind(turtle, 4, 0));
    this.drawingRules.set("Y4!", turtle.randomRoll.bind(turtle, 4, 1));
    this.drawingRules.set("Y4!!", turtle.randomRoll.bind(turtle, 4, 2));
    this.drawingRules.set("Y4!!!", turtle.randomRoll.bind(turtle, 4, 3));
    this.drawingRules.set("Y5", turtle.randomRoll.bind(turtle, 5, 0));
    this.drawingRules.set("Y5!", turtle.randomRoll.bind(turtle, 5, 1));
    this.drawingRules.set("Y5!!", turtle.randomRoll.bind(turtle, 5, 2));
    this.drawingRules.set("Y5!!!", turtle.randomRoll.bind(turtle, 5, 3));
    this.drawingRules.set("Y5!!!!", turtle.randomRoll.bind(turtle, 5, 4));
  }
}

export default DrawingRule;