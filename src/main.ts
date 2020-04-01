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

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;

function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  // let offsetsArray = [];
  // let colorsArray = [];
  // let n: number = 100.0;
  // for(let i = 0; i < n; i++) {
  //   for(let j = 0; j < n; j++) {
  //     offsetsArray.push(i);
  //     offsetsArray.push(j);
  //     offsetsArray.push(0);

  //     colorsArray.push(i / n);
  //     colorsArray.push(j / n);
  //     colorsArray.push(1.0);
  //     colorsArray.push(1.0); // Alpha channel
  //   }
  // }
  // let offsets: Float32Array = new Float32Array(offsetsArray);
  // let colors: Float32Array = new Float32Array(colorsArray);
  // square.setInstanceVBOs(offsets, colors);
  // square.setNumInstances(n * n); // grid of "particles"

  let lSystemTree = new LSystem();
  let offsetsArray = [];
  let orientationsArray = [];
  let colorsArray = [];

  offsetsArray.push(lSystemTree.turtle.position[0]);
  offsetsArray.push(lSystemTree.turtle.position[1]);
  offsetsArray.push(lSystemTree.turtle.position[2]);
  orientationsArray.push(lSystemTree.turtle.orientation[0]);
  orientationsArray.push(lSystemTree.turtle.orientation[1]);
  orientationsArray.push(lSystemTree.turtle.orientation[2]);
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
          offsetsArray.push(lSystemTree.turtle.position[0]);
          offsetsArray.push(lSystemTree.turtle.position[1]);
          offsetsArray.push(lSystemTree.turtle.position[2]);
          orientationsArray.push(lSystemTree.turtle.orientation[0]);
          orientationsArray.push(lSystemTree.turtle.orientation[1]);
          orientationsArray.push(lSystemTree.turtle.orientation[2]);
          colorsArray.push(1.0);
          colorsArray.push(1.0);
          colorsArray.push(1.0);
          colorsArray.push(1.0); // Alpha channel
          n++;
      }
      else if (currChar == "[") {
          lSystemTree.turtleStack.push(new Turtle(Object.assign({}, lSystemTree.turtle.position),
                                                  Object.assign({}, lSystemTree.turtle.orientation),
                                                  Object.assign({}, lSystemTree.turtle.recursionDepth),
                                                  Object.assign({}, lSystemTree.turtle.moveScale)
                                                  )
                                      );
          lSystemTree.turtle.recursionDepth++;
      }
      else if (currChar == "]") {
          lSystemTree.turtle = lSystemTree.turtleStack.pop();
          lSystemTree.drawing.setTurtle(lSystemTree.turtle);
  }
}


  let offsets: Float32Array = new Float32Array(offsetsArray);
  let colors: Float32Array = new Float32Array(colorsArray);
  let orientations: Float32Array = new Float32Array(orientationsArray);
  square.setInstanceVBOs(offsets, colors, orientations);
  square.setNumInstances(n);
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

  const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

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
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      square,
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
