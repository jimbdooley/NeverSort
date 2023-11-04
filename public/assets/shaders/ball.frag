precision mediump float;
uniform sampler2D u_sampler;
uniform vec3 u_light_dir[1];
varying vec3 v_norm;
varying vec2 v_tex;

float MIN_LIGHT = 0.3;

void main() {
    float pct = MIN_LIGHT + (1.0 - MIN_LIGHT)*dot(v_norm, u_light_dir[0]);
    vec4 img = texture2D(u_sampler, v_tex);
    gl_FragColor = vec4(pct * img.xyz, img.w);
}