import {vec3} from 'gl-matrix';

class Turtle {
    position: vec3;
    orientation: vec3;
    recursionDepth: number;
    moveScale: vec3;

    constructor(pos: vec3, orient: vec3, recursion: number, scale: vec3) {
      this.position = pos;
      this.orientation = orient;
      this.recursionDepth = recursion;
      this.moveScale = scale;
    }

  moveForward() {
    let addition : vec3 = vec3.create();
    vec3.multiply(addition, this.orientation, this.moveScale);
    vec3.add(this.position, this.position, addition);
  }

  rotateX30Degs() {
    vec3.rotateX(this.orientation, this.orientation, vec3.create(), 0.523599);
  }
  rotateY30Degs() {
    vec3.rotateY(this.orientation, this.orientation, vec3.create(), 0.523599);
  }
  rotateZ30Degs() {
    vec3.rotateZ(this.orientation, this.orientation, vec3.create(), 0.523599);
  }
  rotateZNeg30Degs() {
    vec3.rotateZ(this.orientation, this.orientation, vec3.create(), -0.523599);
  }
}

export default Turtle;