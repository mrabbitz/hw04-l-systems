#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;

out vec4 out_Col;

// random1o2i
float noise2D(vec2 p) {
    return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453);
}

float interpNoise2D(float x, float y) {
    float intX = floor(x);
    float fractX = fract(x);
    float intY = floor(y);
    float fractY = fract(y);

    float v1 = noise2D(vec2(intX, intY));
    float v2 = noise2D(vec2(intX + 1.0, intY));
    float v3 = noise2D(vec2(intX, intY + 1.0));
    float v4 = noise2D(vec2(intX + 1.0, intY + 1.0));

    float i1 = mix(v1, v2, fractX);
    float i2 = mix(v3, v4, fractX);
    
    return mix(i1, i2, fractY);
}
float fbm2D(float x, float y) {
    float total = 0.0;
    float persistence = 0.5;
    int octaves = 8;

    for(int i = 1; i <= octaves; i++) {
        float freq = pow(2.f, float(i));
        float amp = pow(persistence, float(i));

        total += interpNoise2D(x * freq,
                               y * freq) * amp;
    }
    return total;
}

void main()
{
    //float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    //out_Col = vec4(dist) * fs_Col;
    out_Col = fs_Col;

    // https://www.colorhexa.com/654321
    // vec3 color = vec3(.4, .26, .13);
    // out_Col.rgb = color;
    // out_Col.a = 1.0;
}
