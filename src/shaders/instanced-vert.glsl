#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

in vec3 vs_Header;
in vec3 vs_Left;
in vec3 vs_Up;
in vec3 vs_Scale;

out vec4 fs_Col;
out vec4 fs_Pos;

void main()
{
    fs_Col = vs_Col;
    fs_Pos = vs_Pos;

    vec4 position = vs_Pos;
    vec3 offset = vs_Translate;
	vec3 headerDir = vs_Header;		// y
	vec3 rightDir = vs_Left * -1.0;	// x
	vec3 upDir = vs_Up;				// z

	mat3 transform = mat3(rightDir, headerDir, upDir);

	position.xyz /= 2.0;
	position.y -= 1.0;
    //position.xyz *= vs_Scale;
	//position.y += 1.0;
    //position = position * rotationX(rotation.x) * rotationY(rotation.y) * rotationZ(rotation.z);

	//position.y -= 0.5;
	position.xz *= vs_Scale.xz;
	position.y *= vs_Scale.y * 1.5;
	
	position.y += vs_Scale[1] / 2.0;
	position.xyz = transform * position.xyz;
	//position.y += 0.5;
    position.xyz += offset;

    gl_Position = u_ViewProj * position;
}
