import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as Loader from 'webgl-obj-loader';

class Mesh extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  //normals: Float32Array;
  colors: Float32Array;
  //uvs: Float32Array;
  center: vec4;

  objString: string;

  offsets: Float32Array; // Data for bufTranslate
  headers: Float32Array;
  lefts: Float32Array;
  ups: Float32Array;
  scales: Float32Array;

  constructor(objString: string, center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);

    this.objString = objString;
  }

  create() {  
    let posTemp: Array<number> = [];
    //let norTemp: Array<number> = [];
    //let uvsTemp: Array<number> = [];
    let idxTemp: Array<number> = [];

    var loadedMesh = new Loader.Mesh(this.objString);

    //posTemp = loadedMesh.vertices;
    for (var i = 0; i < loadedMesh.vertices.length; i++) {
      posTemp.push(loadedMesh.vertices[i]);
      if (i % 3 == 2) posTemp.push(1.0);
    }

    //for (var i = 0; i < loadedMesh.vertexNormals.length; i++) {
    //  norTemp.push(loadedMesh.vertexNormals[i]);
    //  if (i % 3 == 2) norTemp.push(0.0);
    //}

    //uvsTemp = loadedMesh.textures;
    idxTemp = loadedMesh.indices;

    // white vert color for now
    //this.colors = new Float32Array(posTemp.length);
    //for (var i = 0; i < posTemp.length; ++i){
    //  this.colors[i] = 1.0;
    //}

    this.indices = new Uint32Array(idxTemp);
    //this.normals = new Float32Array(norTemp);
    this.positions = new Float32Array(posTemp);
    //this.uvs = new Float32Array(uvsTemp);

    this.generateIdx();
    this.generatePos();
    //this.generateNor();
    //this.generateUV();
    this.generateCol();

    this.generateTranslate();
    this.generateHeader();
    this.generateLeft();
    this.generateUp();
    this.generateScale();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    //gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    //gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    //gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    //gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    //gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    //gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

    console.log(`Created Mesh from OBJ`);
    this.objString = ""; // hacky clear
  }

  setInstanceVBOs(offsets: Float32Array, colors: Float32Array, headers: Float32Array, lefts: Float32Array, ups: Float32Array, scales: Float32Array) {
    this.colors = colors;
    this.offsets = offsets;
    this.headers = headers;
    this.lefts = lefts;
    this.ups = ups;
    this.scales = scales;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    gl.bufferData(gl.ARRAY_BUFFER, this.offsets, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufHeader);
    gl.bufferData(gl.ARRAY_BUFFER, this.headers, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufLeft);
    gl.bufferData(gl.ARRAY_BUFFER, this.lefts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUp);
    gl.bufferData(gl.ARRAY_BUFFER, this.ups, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufScale);
    gl.bufferData(gl.ARRAY_BUFFER, this.scales, gl.STATIC_DRAW);
  }
};

export default Mesh;
