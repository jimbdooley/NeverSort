precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
attribute vec2 a_tex;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat;
varying vec3 v_norm;
varying vec2 v_tex;


void main() {
    gl_Position = u_pvmMat * a_pos;
    v_norm = normalize((u_mMat * a_norm).xyz);
    v_tex = a_tex;
}
