
function PVM(_width, _height, fov, camX, camY, camZ) {
    rtn = {}
    rtn.p = perspective(null, _width / _height, fov)
    rtn.v = invert4By4(lookAt([camX, camY, camZ], [0, 0, 0]), null)
    rtn.m = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    rtn.pv = mul4By4(rtn.p, rtn.v, null)
    rtn.pvm = new Float32Array(16)
    rtn.updateWithDisplayObject = function(o) {
        skewRotRodTrans(this.m, o)
        mul4By4NewDest(this.pv, this.m, this.pvm)
    }
    
    rtn.updateWithDisplayObjectBall = function(o) {
        skewRotRodTransX(this.m, o)
        mul3x3sOf4x4s(o.postRotMat, this.m, this.m)
        mul4By4(this.pv, this.m, this.pvm)
        
    }
    return rtn

}

function Shader(vertCode, fragCode, name=null){
    const rtn = {
        vert : gl.createShader(gl.VERTEX_SHADER),
        frag : gl.createShader(gl.FRAGMENT_SHADER),
        full : gl.createProgram(),
        vertCompileLog : "",
        fragCompileLog : "",
    }
    gl.shaderSource(rtn.vert, vertCode)
    gl.compileShader(rtn.vert)
    rtn.vertCompileLog = gl.getShaderInfoLog(rtn.vert)
    gl.shaderSource(rtn.frag, fragCode)
    gl.compileShader(rtn.frag)
    rtn.fragCompileLog = gl.getShaderInfoLog(rtn.frag)
    if (name != null) {
        console.log(`${name} vertlog`, rtn.vertCompileLog)
        console.log(`${name} fraglog`, rtn.fragCompileLog)
    }
    gl.attachShader(rtn.full, rtn.vert)
    gl.attachShader(rtn.full, rtn.frag)
    gl.linkProgram(rtn.full)
    return rtn
}

function PosNormIndTex(_pos, _norm, _ind, _tex) {
    const rtn = {}
    rtn.posArr = _pos
    rtn.normArr = _norm
    rtn.indArr = _ind
    rtn.texArr = _tex
    rtn.pos =  gl.createBuffer()
    rtn.norm = gl.createBuffer()
    rtn.ind = gl.createBuffer()
    rtn.tex = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, rtn.pos)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rtn.posArr), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, rtn.norm)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rtn.normArr), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rtn.ind)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rtn.indArr), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, rtn.tex)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rtn.texArr), gl.STATIC_DRAW)
    return rtn
}


function ShatterNormIndTex(_cens, _pos, _norm, _ind, _tex) {
    const rtn = {}
    rtn.indArr = _ind
    rtn.centers = _cens.map(_ => gl.createBuffer())
    rtn.pos = gl.createBuffer()
    rtn.norm = gl.createBuffer()
    rtn.ind = gl.createBuffer()
    rtn.tex = gl.createBuffer()
    for (let i = 0; i < _cens.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, rtn.centers[i])
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_cens[i]), gl.STATIC_DRAW)
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, rtn.pos)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_pos), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, rtn.norm)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_norm), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rtn.ind)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(_ind), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, rtn.tex)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_tex), gl.STATIC_DRAW)
    return rtn
}

const Bitmap = {
    createBitmap(argbArr, rows, cols) {
        const pixels = new Uint8ClampedArray(rows*cols*4)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                pixels[4*(cols*i + j) + 0] = argbArr[i*cols + j][1]
                pixels[4*(cols*i + j) + 1] = argbArr[i*cols + j][2]
                pixels[4*(cols*i + j) + 2] = argbArr[i*cols + j][3]
                pixels[4*(cols*i + j) + 3] = argbArr[i*cols + j][0]
            }
        }
        return new ImageData(pixels, rows, cols)
    },
    Config: {ARGB: -1},
}

