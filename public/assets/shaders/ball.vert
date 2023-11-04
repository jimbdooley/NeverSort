precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
attribute vec2 a_tex;
uniform vec4 u_data[1];
uniform mat4 u_pvMat;
uniform mat4 u_mRotMat;
uniform mat4 u_mMat;
varying vec3 v_norm;
varying vec2 v_tex;


void main() {
    vec4 rotated = u_mRotMat * a_pos;
    rotated.x *= u_data[0].y;
    rotated.y *= u_data[0].y;
    rotated.z *= u_data[0].x;
    rotated.x += u_mMat[3][0];
    rotated.y += u_mMat[3][1];
    rotated.z += u_mMat[3][2];
    gl_Position = u_pvMat * rotated;
    v_norm = normalize((u_mMat * a_norm).xyz);
    v_tex = a_tex;
}
