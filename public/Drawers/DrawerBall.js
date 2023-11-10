
const DrawerBall = {
    posLoc: -1,
    normLoc: -1,
    texLoc: -1,
    dataLoc: -1,
    samplerLoc: -1,
    lightDirLoc: -1,
    pvLoc: -1,
    mRotLoc: -1,
    mLoc: -1,
    mRot: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    mPos: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    data: [0, 0, 0, 0,],
    bmpInPlace: {
        "0": numToBmp("0", 0.4, 0.8, 1),
        "1": numToBmp("1", 0.4, 0.8, 1),
        "2": numToBmp("2", 0.4, 0.8, 1),
        "3": numToBmp("3", 0.4, 0.8, 1),
        "4": numToBmp("4", 0.4, 0.8, 1),
        "5": numToBmp("5", 0.4, 0.8, 1),
        "6": numToBmp("6", 0.4, 0.8, 1),
        "7": numToBmp("7", 0.4, 0.8, 1),
        "8": numToBmp("8", 0.4, 0.8, 1),
        "9": numToBmp("9", 0.4, 0.8, 1),
        //"hand_bgr": Bitmap.createBitmap([[255, 238, 118, 0)], 1, 1, Bitmap.Config.ARGB_8888),
        "gearMetal": Bitmap.createBitmap([[255, 100, 100, 112]], 1, 1, Bitmap.Config.ARGB_8888),
        "letter": Bitmap.createBitmap([
            [255, 55, 55, 55],
            [255, 255, 255, 0],
            [255, 0, 0, 0],
            [255, 255, 255, 0],
        ], 2, 2, Bitmap.Config.ARGB_8888),
        "ball": Bitmap.createBitmap([
            [255, 155, 155, 155],
            [255, 180, 180, 255],
            [255, 0, 0, 0],
            [255, 255, 230, 0],
        ], 2, 2, Bitmap.Config.ARGB_8888),
        "red": Bitmap.createBitmap([[255, 255, 0, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "green": Bitmap.createBitmap([[255, 0, 255, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "blue": Bitmap.createBitmap([[255, 0, 0, 255]], 1, 1, Bitmap.Config.ARGB_8888),
        "yellow": Bitmap.createBitmap([[255, 255, 255, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "counterfeit": Bitmap.createBitmap([[255, 194, 178, 128]], 1, 1, Bitmap.Config.ARGB_8888),
        "shade": Bitmap.createBitmap([[220, 0, 0, 0]], 1, 1, Bitmap.Config.ARGB_8888),
    },
    bmpDrawables: {
        "crate_hand": "crate_hand.png",
        "tmap": "tmap.png",
        "hand_bgr": "hand_bgr.jpg",
        "intro_3": "intro_3.png",
    },
    strToTexHandleI: {},
    strToLastLang: {},
    drawableStrToLoaded: {},
    texHandles: [],
    shader: null,

    setupBmp: function(bmp, handle) {
        gl.bindTexture(gl.TEXTURE_2D, handle)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    },
    langToScoreSize: {},
    langToLevelSize: {},

    setup: function(context) {
        while (this.drawableStrToLoaded.length > 0) this.drawableStrToLoaded.pop()
        const texHandlesMutable = []
        for (key in this.bmpDrawables) {
            this.strToTexHandleI[key] = texHandlesMutable.length
            texHandlesMutable.push(-1)
        }
        for (key in this.bmpInPlace) {
            this.strToTexHandleI[key] = texHandlesMutable.length
            texHandlesMutable.push(-1)
        }
        this.texHandles = texHandlesMutable
        for (let i = 0; i < this.texHandles.length; i++) {
            this.texHandles[i] = gl.createTexture()
        }
        for (key in this.bmpInPlace) {
            this.setupBmp(this.bmpInPlace[key], this.texHandles[this.strToTexHandleI[key]])
        }
        this.shader = Shader(assets["shaders/ball.vert"], assets["shaders/ball.frag"])
        this.pvLoc = gl.getUniformLocation(this.shader.full, "u_pvMat")
        this.mRotLoc = gl.getUniformLocation(this.shader.full, "u_mRotMat")
        this.mLoc = gl.getUniformLocation(this.shader.full, "u_mMat")
        this.posLoc = gl.getAttribLocation(this.shader.full, "a_pos")
        this.normLoc = gl.getAttribLocation(this.shader.full, "a_norm")
        this.texLoc = gl.getAttribLocation(this.shader.full, "a_tex")
        this.samplerLoc = gl.getUniformLocation(this.shader.full, "u_sampler")
        this.lightDirLoc = gl.getUniformLocation(this.shader.full, "u_light_dir")
        this.dataLoc = gl.getUniformLocation(this.shader.full, "u_data")
    },


    DIRECT_LIGHT: [0, 0, 1],
    LIGHT_30_85: [
        0.3,
        0.85 * Math.sqrt(1 - 0.3 * 0.3),
        Math.sqrt(1 - 0.85 * 0.85) * Math.sqrt(1 - 0.3*0.3)
    ],
    LIGHT_RIGHT: [Math.sqrt(2)/2, 0, Math.sqrt(2)/2],
    LIGHT_LEFT: [-Math.sqrt(1-0.94*0.94), 0, 0.94],
    BTN_NOT_PRESSED: [0.1, 0.3, Math.sqrt(0.9)],
    BTN_PRESSED: [0.65*0.1, 0.65*0.3, 0.65*Math.sqrt(0.9), ],
    draw: function(o, bmpName, bufs, ballM, preUpdated=false, lightArray=this.LIGHT_LEFT){
        World.pvm.updateWithDisplayObjectBall(o)
        const m = World.pvm.m

        gl.useProgram(this.shader.full)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufs.ind);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.pos);
        gl.enableVertexAttribArray(this.posLoc)
        gl.vertexAttribPointer( this.posLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.norm);
        gl.enableVertexAttribArray(this.normLoc)
        gl.vertexAttribPointer(this.normLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.tex);
        gl.enableVertexAttribArray(this.texLoc)
        gl.vertexAttribPointer(this.texLoc, COORDS_PER_VERTEX, gl.FLOAT, 0, 0, 0)


        gl.uniformMatrix4fv(this.pvLoc, false, World.pvm.pv)
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i < 3 && j < 3) {
                    this.mRot[i*4 + j] = m[i*4+j]
                } else {
                    this.mPos[i*4 + j] = m[i*4+j]
                }
            }
        }
        gl.uniformMatrix4fv(this.mRotLoc, false, this.mRot)
        gl.uniformMatrix4fv(this.mLoc, false, m)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texHandles[this.strToTexHandleI[bmpName]])
        gl.uniform1i(this.samplerLoc, 0)

        gl.uniform3fv(this.lightDirLoc, lightArray)
        const dif = (1 - o.z) * 0.58
        let zz = 1 - dif
        if (zz > 1) {
            const over = zz - 1
            zz = 1 + Math.min(0.5, 0.05 * over) 
        }
        this.data[0] = zz
        this.data[1] = zz < 1 ? Math.pow(1 / zz, 0.25) : 1//1 / zz
        gl.uniform4fv(this.dataLoc, this.data)

        gl.drawElements(gl.TRIANGLES, bufs.indArr.length, gl.UNSIGNED_SHORT, 0)


    },


}