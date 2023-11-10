precision mediump float;
varying vec3 v_norm;
varying vec2 v_tex;

float MIN_LIGHT = 0.3;

float TWO_PI = 6.2831853;
float floorR = 0.1;
float floorG = 0.4;
float floorB = 0.9;
void main() {
    float rows = -99.0 + 100.0*cos(100.0*TWO_PI * v_tex.x);
    float cols = -99.0 + 100.0*cos(100.0*TWO_PI * v_tex.y);
    float b = max(0.0, max(rows, cols));

    //float floorR = _floorR * (0.5 + 0.5 * (0.5 * (2.0 - v_tex.x - v_tex.y)));
    //float floorG = _floorG * (0.5 + 0.5 * (0.5 * (2.0 - v_tex.x - v_tex.y)));
    //float floorB = _floorB * (0.5 + 0.5 * (0.5 * (2.0 - v_tex.x - v_tex.y)));

    gl_FragColor = vec4(
        floorR + (1.0 - floorR) * b,    
        floorG + (1.0 - floorG) * b,    
        floorB + (1.0 - floorB) * b,    
        1.0);
}
