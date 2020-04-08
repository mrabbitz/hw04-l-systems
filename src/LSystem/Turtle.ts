import {vec3} from 'gl-matrix';
import {glMatrix} from 'gl-matrix';
import {mat3} from 'gl-matrix';

class Turtle {
    position: vec3;
    orientation: mat3;
    recursionDepth: number;
    scale_whd: vec3;

    rotU(radians: number) {
      return mat3.fromValues(Math.cos(radians), -Math.sin(radians), 0.0,
                             Math.sin(radians),  Math.cos(radians), 0.0,
                                    0.0       ,         0.0       , 1.0);
    }
    rotL(radians: number) {
      return mat3.fromValues( Math.cos(radians),  0.0,  Math.sin(radians),
                                    0.0        ,  1.0,        0.0        ,
                             -Math.sin(radians),  0.0,  Math.cos(radians));
    }
    rotH(radians: number) {
      return mat3.fromValues(1.0,         0.0       ,       0.0        ,
                             0.0,  Math.cos(radians), Math.sin(radians),
                             0.0, -Math.sin(radians), Math.cos(radians));
    }

    constructor(pos: vec3, orient: mat3, recursion: number, scale: vec3) {
      this.position = pos;
      this.orientation = orient;
      this.recursionDepth = recursion;
      this.scale_whd = scale;
    }

  moveForward() {
    let addition : vec3 = vec3.create();
    let heading : vec3 = vec3.fromValues(this.orientation[0], this.orientation[1], this.orientation[2]);
    vec3.multiply(addition, heading, vec3.fromValues(this.scale_whd[1], this.scale_whd[1], this.scale_whd[1]));
    vec3.add(this.position, this.position, addition);
  }


  TurnLeft30Degs() {
    mat3.multiply(this.orientation, this.orientation, this.rotU(0.523599));
  }
  TurnRight30Degs() {
    mat3.multiply(this.orientation, this.orientation, this.rotU(-0.523599));
  }
  PitchDown30Degs() {
    mat3.multiply(this.orientation, this.orientation, this.rotL(0.523599));
  }
  PitchUp30Degs() {
    mat3.multiply(this.orientation, this.orientation, this.rotL(-0.523599));
  }
  RollLeft30Degs() {
    mat3.multiply(this.orientation, this.orientation, this.rotH(0.523599));
  }
  RollRight30Degs() {
    mat3.multiply(this.orientation, this.orientation, this.rotH(-0.523599));
  }

  getRandomArbitrary(min : number, max : number) {
    return Math.random() * (max - min) + min;
  }

  shrinkBranch() {
    if (this.recursionDepth == 1) {
      this.scale_whd[0] *= this.getRandomArbitrary(0.7, 1.0);
      this.scale_whd[1] *= this.getRandomArbitrary(0.7, 1.0);
      this.scale_whd[2] *= this.getRandomArbitrary(0.7, 1.0);
    }
    else if (this.recursionDepth > 3) {
      this.scale_whd[0] *= this.getRandomArbitrary(0.3, 0.7);
      this.scale_whd[1] *= this.getRandomArbitrary(0.3, 0.7);
      this.scale_whd[2] *= this.getRandomArbitrary(0.3, 0.7);
    }
    else {
      this.scale_whd[0] *= this.getRandomArbitrary(0.3, 0.7);
      this.scale_whd[1] *= this.getRandomArbitrary(0.7, 1.0);
      this.scale_whd[2] *= this.getRandomArbitrary(0.3, 0.7);
    }
  }

  randomRoll(branches: number, currentBranch: number) {
    let equalAngle = 360.0 / branches;
    let startAngle = equalAngle * currentBranch;
    let endAngle = startAngle + (equalAngle * 0.8);
    console.log(equalAngle);
    console.log(startAngle);
    console.log(endAngle);

    let tmp = glMatrix.toRadian(this.getRandomArbitrary(startAngle, endAngle));
    mat3.multiply(this.orientation, this.orientation, this.rotH(tmp));
  }

  randomPitch_10_30() {
    let tmp = glMatrix.toRadian(this.getRandomArbitrary(10, 30));
    mat3.multiply(this.orientation, this.orientation, this.rotL(tmp));
  }

  randomPitch_30_70() {
    let tmp = glMatrix.toRadian(this.getRandomArbitrary(30, 70));
    mat3.multiply(this.orientation, this.orientation, this.rotL(tmp));
  }
}

export default Turtle;