import {vec3} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

import LSystem from './LSystem/LSystem'
import Turtle from './LSystem/Turtle'
import Mesh from './geometry/Mesh';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  Axiom: 'FABA',
  Iterations: 4
};

let prevAxiom: string = 'FABA';
let prevIterations: number = 4;

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;

let _mesh: Mesh;
let _mesh1: Mesh;

function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  var objString = document.getElementById('my_cube.obj').innerHTML;
  _mesh = new Mesh(objString, vec3.fromValues(0, 0, 0));
  _mesh.create();

  objString = document.getElementById('sphere.obj').innerHTML;
  _mesh1 = new Mesh(objString, vec3.fromValues(0, 0, 0));
  _mesh1.create();

  loadLSystem(controls.Axiom, controls.Iterations);
}

function loadLSystem(axiom: string, iterations: number) {

  let offsetsArray1 = [];
  let headersArray1 = [];
  let leftsArray1 = [];
  let upsArray1 = [];
  let scalesArray1 = [];
  let colorsArray1 = [];
  let n1: number = 0;

  let lSystemTree = new LSystem(axiom, iterations);
  let offsetsArray = [];
  let headersArray = [];
  let leftsArray = [];
  let upsArray = [];
  let scalesArray = [];
  let colorsArray = [];

  offsetsArray.push(lSystemTree.turtle.position[0]);
  offsetsArray.push(lSystemTree.turtle.position[1]);
  offsetsArray.push(lSystemTree.turtle.position[2]);
  headersArray.push(lSystemTree.turtle.orientation[0]);
  headersArray.push(lSystemTree.turtle.orientation[1]);
  headersArray.push(lSystemTree.turtle.orientation[2]);
  leftsArray.push(lSystemTree.turtle.orientation[3]);
  leftsArray.push(lSystemTree.turtle.orientation[4]);
  leftsArray.push(lSystemTree.turtle.orientation[5]);
  upsArray.push(lSystemTree.turtle.orientation[6]);
  upsArray.push(lSystemTree.turtle.orientation[7]);
  upsArray.push(lSystemTree.turtle.orientation[8]);
  scalesArray.push(lSystemTree.turtle.scale_whd[0]);
  scalesArray.push(lSystemTree.turtle.scale_whd[1]);
  scalesArray.push(lSystemTree.turtle.scale_whd[2]);
  colorsArray.push(1.0);
  colorsArray.push(1.0);
  colorsArray.push(1.0);
  colorsArray.push(1.0); // Alpha channel

  let n: number = 1;

  console.log(lSystemTree.axiom);

  for (let i = 0; i < lSystemTree.axiom.length; i++) {
      let currChar : string = lSystemTree.axiom.charAt(i);
      let func = lSystemTree.drawing.drawingRules.get(currChar);
      if (func) {
          func();
          if (currChar == "F")
          {
            offsetsArray.push(lSystemTree.turtle.position[0]);
            offsetsArray.push(lSystemTree.turtle.position[1]);
            offsetsArray.push(lSystemTree.turtle.position[2]);
            headersArray.push(lSystemTree.turtle.orientation[0]);
            headersArray.push(lSystemTree.turtle.orientation[1]);
            headersArray.push(lSystemTree.turtle.orientation[2]);
            leftsArray.push(lSystemTree.turtle.orientation[3]);
            leftsArray.push(lSystemTree.turtle.orientation[4]);
            leftsArray.push(lSystemTree.turtle.orientation[5]);
            upsArray.push(lSystemTree.turtle.orientation[6]);
            upsArray.push(lSystemTree.turtle.orientation[7]);
            upsArray.push(lSystemTree.turtle.orientation[8]);
            scalesArray.push(lSystemTree.turtle.scale_whd[0]);
            scalesArray.push(lSystemTree.turtle.scale_whd[1]);
            scalesArray.push(lSystemTree.turtle.scale_whd[2]);
            colorsArray.push(0.4);
            colorsArray.push(0.26);
            colorsArray.push(0.13);
            colorsArray.push(1.0); // Alpha channel
            n++;
          }
      }
      else if (currChar == "[") {
          lSystemTree.turtleStack.push(new Turtle(Object.assign({}, lSystemTree.turtle.position),
                                                  Object.assign({}, lSystemTree.turtle.orientation),
                                                  Object.assign({}, lSystemTree.turtle.recursionDepth),
                                                  Object.assign({}, lSystemTree.turtle.scale_whd)
                                                  )
                                      );
          lSystemTree.turtle.recursionDepth++;
          lSystemTree.turtle.shrinkBranch();
      }
      else if (currChar == "]") {

        offsetsArray1.push(lSystemTree.turtle.position[0]);
        offsetsArray1.push(lSystemTree.turtle.position[1]);
        offsetsArray1.push(lSystemTree.turtle.position[2]);
        headersArray1.push(lSystemTree.turtle.orientation[0]);
        headersArray1.push(lSystemTree.turtle.orientation[1]);
        headersArray1.push(lSystemTree.turtle.orientation[2]);
        leftsArray1.push(lSystemTree.turtle.orientation[3]);
        leftsArray1.push(lSystemTree.turtle.orientation[4]);
        leftsArray1.push(lSystemTree.turtle.orientation[5]);
        upsArray1.push(lSystemTree.turtle.orientation[6]);
        upsArray1.push(lSystemTree.turtle.orientation[7]);
        upsArray1.push(lSystemTree.turtle.orientation[8]);

        let randomm: number = Math.random() * 0.5 + 0.5;
        //let specialScales : vec3 = vec3.fromValues(randomm, randomm, randomm);

        
        scalesArray1.push(randomm);
        scalesArray1.push(randomm);
        scalesArray1.push(randomm);
        colorsArray1.push(1.0);
        colorsArray1.push(0.0);
        colorsArray1.push(0.0);
        colorsArray1.push(1.0); // Alpha channel
        n1++;
        



          lSystemTree.turtle = lSystemTree.turtleStack.pop();
          lSystemTree.drawing.setTurtle(lSystemTree.turtle);
  }
  else if (currChar == "Y") {
    currChar += lSystemTree.axiom.charAt(++i);        // Fetching associated number
    let nextChar = lSystemTree.axiom.charAt(++i);
    while (nextChar == "!") {
      currChar += nextChar;
      nextChar = lSystemTree.axiom.charAt(++i);
    }
    --i;
    func = lSystemTree.drawing.drawingRules.get(currChar);
    func();
  }
}

let offsets1: Float32Array = new Float32Array(offsetsArray1);
let colors1: Float32Array = new Float32Array(colorsArray1);
let headers1: Float32Array = new Float32Array(headersArray1);
let lefts1: Float32Array = new Float32Array(leftsArray1);
let ups1: Float32Array = new Float32Array(upsArray1);
let scales1: Float32Array = new Float32Array(scalesArray1);
_mesh1.setInstanceVBOs(offsets1, colors1, headers1, lefts1, ups1, scales1);
  _mesh1.setNumInstances(n1);

  let offsets: Float32Array = new Float32Array(offsetsArray);
  let colors: Float32Array = new Float32Array(colorsArray);
  let headers: Float32Array = new Float32Array(headersArray);
  let lefts: Float32Array = new Float32Array(leftsArray);
  let ups: Float32Array = new Float32Array(upsArray);
  let scales: Float32Array = new Float32Array(scalesArray);
  _mesh.setInstanceVBOs(offsets, colors, headers, lefts, ups, scales);
  _mesh.setNumInstances(n);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  var f0 = gui.addFolder('Characters F, A and B have expansion rules');
  gui.add(controls, 'Axiom');
  gui.add(controls, 'Iterations', 0, 8).step(1);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 40, -250), vec3.fromValues(0, 40, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    if (controls.Axiom != prevAxiom || controls.Iterations != prevIterations)
    {
      prevAxiom = controls.Axiom;
      prevIterations = controls.Iterations;
      loadLSystem(prevAxiom, prevIterations);
    }


    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      _mesh1, _mesh,
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
