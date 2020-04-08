#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

// https://www.shadertoy.com/view/4d2cDy
#define PI 3.14159265358

// random1o2i
float noise2D(vec2 p) {
    return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453);
}

float interpNoise2D(vec2 uv) {
    float intX = floor(uv.x);
    float fractX = fract(uv.x);
    float intY = floor(uv.y);
    float fractY = fract(uv.y);

    float v1 = noise2D(vec2(intX, intY));
    float v2 = noise2D(vec2(intX + 1.0, intY));
    float v3 = noise2D(vec2(intX, intY + 1.0));
    float v4 = noise2D(vec2(intX + 1.0, intY + 1.0));

    float i1 = mix(v1, v2, fractX);
    float i2 = mix(v3, v4, fractX);
    
    return mix(i1, i2, fractY);
}

float fbm2D(vec2 uv) {
    float total = 0.0;
    float persistence = 0.5;
    int octaves = 8;

    for(int i = 1; i <= octaves; i++) {
        float freq = pow(2.f, float(i));
        float amp = pow(persistence, float(i));

        total += interpNoise2D(uv * freq) * amp;
    }
    return total;
}

// https://www.color-hex.com/color/87cefa
const vec3 horizonColor = vec3(135.0/255.0, 206.0/255.0, 250.0/255.0);
// https://www.color-hex.com/color/1874cd
const vec3 skyColor = vec3(24.0/255.0, 116.0/255.0, 205.0/255.0);
const vec3 cloudColor = vec3(1.0);
const float cloudPlaneHeight = 10.0;

void Clouds(vec3 dir, out vec3 color) {
    vec3 cloudPlane = dir*cloudPlaneHeight/dot(dir, vec3(0.0, 1.0, 0.0));
    vec2 uv = cloudPlane.xz + u_Time * .5;
    float clouds = fbm2D(uv * .01);
    clouds = clamp((clouds - 0.5) * 2.0, 0.0, 1.0);
    color = mix(color, cloudColor, clouds);
}

void RayCast(out vec3 origin, out vec3 direction, in float foyY) {
  vec3 Forward = normalize(u_Ref - u_Eye);
  vec3 Right = normalize(cross(Forward, u_Up));

  float tanFovY = tan(foyY / 2.0);
  float len = length(u_Ref - u_Eye);
  float aspect = u_Dimensions.x / u_Dimensions.y;

  vec3 V = u_Up * len * tanFovY;
  vec3 H = Right * len * aspect * tanFovY;

  vec3 p = u_Ref + fs_Pos.x * H + fs_Pos.y * V;

  origin = u_Eye;
  direction = normalize(p - u_Eye);
}

// polynomial smooth min (k = 0.1);
float sminCubic( float a, float b, float k )
{
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*h*k*(1.0/6.0);
}

// Box with side lengths b
float box(vec3 p, vec3 b)
{
  return length(max(abs(p) - b, 0.0));
}

// point, radius, center
float SphereSDF(vec3 p, float r, vec3 c) {
    return distance(p, c) - r;
}

float groundMap(vec3 pos)
{
  vec3 pos1 = pos + vec3(0.0, 10.0, 0.0);
    float t = box(pos1, vec3(5000.0, 1.0, 5000.0));
    t += sin(pos1.x/2.0)*sin(pos1.y)*sin(pos1.z/1.1);
    float t2 = SphereSDF(pos + vec3(0.0, 100.0, 0.0), 100.0, vec3(0.0));
    return sminCubic(t, t2, 0.1);
}

void groundMap(vec3 pos, out float t, out int objHit)
{
  vec3 pos1 = pos + vec3(0.0, 10.0, 0.0);
    float t2 = box(pos1, vec3(5000.0, 1.0, 5000.0));
    t2 += sin(pos1.x/2.0)*sin(pos1.y)*sin(pos1.z/1.1);
    float t3 = SphereSDF(pos + vec3(0.0, 100.0, 0.0), 100.0, vec3(0.0));
    t = sminCubic(t2, t3, 0.1);
    objHit = 0;
}

void march(vec3 origin, vec3 dir, out float t, out int objHit)
{
    t = 0.001;
    for(int i = 0; i < 256; ++i) {
      vec3 pos = origin + t * dir;
    	float m;
      groundMap(pos, m, objHit);
      if(m < 0.01)
      {
          return;
      }
      t += m;
    }
    t = -1.0;
    objHit = -1;
}

vec3 computeNormal(vec3 pos)
{
    vec3 epsilon = vec3(0.0, 0.001, 0.0);
    return normalize( vec3( groundMap(pos + epsilon.yxx) - groundMap(pos - epsilon.yxx),
                            groundMap(pos + epsilon.xyx) - groundMap(pos - epsilon.xyx),
                            groundMap(pos + epsilon.xxy) - groundMap(pos - epsilon.xxy)));
}

vec3 computeMaterial(int objHit, vec3 p, vec3 n) {
  vec3 color = vec3(0.0);
  if (objHit == 0) {
    color = vec3(237.0, 201.0, 175.0)/255.0;
  }

  vec3 sumLightColors = vec3(0.0);
  float ambientTerm = 0.2;

  vec3 sunPos = vec3(-100.0, 100.0, -100.0);
  vec3 sunHueAndIntensity = vec3(0.8);

  vec3 lightVec = normalize(sunPos - p);

  // Calculate the diffuse term for Lambert shading
  float diffuseTerm = clamp(dot(n, lightVec), 0.0, 1.0);    // Avoid negative lighting values with clamp

  float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                        //to simulate ambient lighting. This ensures that faces that are not
                                                        //lit by our point light are not completely black.

  sumLightColors += sunHueAndIntensity * lightIntensity;
  
  sumLightColors = clamp(sumLightColors, ambientTerm * 2.0, 10.0);

  return color * sumLightColors;
}

void Ground(vec3 dir, vec3 eye, out vec3 color) {
  float t;
  int objHit;
  march(eye, dir, t, objHit);

  if (objHit != -1)
  {
    vec3 isect = eye + t * dir;
    vec3 nor = computeNormal(isect);
    
    color = mix(computeMaterial(objHit, isect, nor), color, smoothstep(-0.06, 0.0, dir.y));
  }
}

void main() {

  vec3 rayOrigin;
  vec3 rayDirection;
  RayCast(rayOrigin, rayDirection, 45.f);

  rayDirection.y /= 50.0;
  vec3 color = mix(horizonColor, skyColor, smoothstep(-.2, .1, rayDirection.y));
  Clouds(rayDirection, color);
  rayDirection.y *= 50.0;

  Ground(rayDirection, rayOrigin, color);

  out_Col = vec4(color, 1.0);
  //out_Col = vec4(0.0);
}
