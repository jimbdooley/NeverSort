
const DrawerVanilla2 = {
    posLoc: -1,
    normLoc: -1,
    texLoc: -1,
    samplerLoc: -1,
    lightDirLoc: -1,
    pvmLoc: -1,
    mLoc: -1,
    dataLoc: -1,
    data: [1, 1, 1, 1],
    bmps: {},
    strToTexHandle: {},
    loaded: {},
    shader: null,

    bmpInPlace: {
        "red": Bitmap.createBitmap([[255, 255, 0, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "green": Bitmap.createBitmap([[255, 0, 255, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "blue": Bitmap.createBitmap([[255, 0, 0, 255]], 1, 1, Bitmap.Config.ARGB_8888),
        "yellow": Bitmap.createBitmap([[255, 255, 255, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "shade": Bitmap.createBitmap([[210, 0, 0, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "light_shade": Bitmap.createBitmap([[100, 255, 255, 255]], 1, 1, Bitmap.Config.ARGB_8888),
        "black": Bitmap.createBitmap([[255, 0, 0, 0]], 1, 1, Bitmap.Config.ARGB_8888),
    },
    fullShadeDob: DisplayObject([0, 0, FAR-1], [1000, 1000, 1]),


    setupBmp: function(gl, str, bmp) {
        if (str in this.loaded) return
        this.strToTexHandle[str] = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.strToTexHandle[str])
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        this.loaded[str] = true
    },

    textDims: {},
    setupText(textKey, w, h, color) {
        const text = T[textKey][currLang]
        const dimKey = w * 100000 + h
        if (text in this.textDims && this.textDims[text] === dimKey) return
        if (text in this.textDims && this.textDims[text] !== dimKey) {
            gl.deleteTexture(this.strToTexHandle[textKey])
            delete this.loaded[textKey]
        }
        this.textDims[text] = dimKey
        const bmp = writeText(text, w, h, color)
        this.setupBmp(textKey, bmp)
    },
    blackTextXPDims: {},
    setupBlackTextXP(textKey, w, h) {
        const text = T[textKey][currLang]
        const dimKey = w * 100000 + h
        if (text in this.blackTextXPDims && this.blackTextXPDims[text] === dimKey) return
        if (text in this.blackTextXPDims && this.blackTextXPDims[text] !== dimKey) {
            gl.deleteTexture(this.strToTexHandle[textKey])
            delete this.loaded[textKey]
        }
        this.blackTextXPDims[text] = dimKey
        const bmp = writeBlackTextXP(text, w, h, )
        this.setupBmp(textKey, bmp)
    },

    setup: function(gl) {
        this.shader = Shader(assets["shaders/pos_norm_ind_tex.vert"],
            assets["shaders/pos_norm_ind_tex.frag"], "vanilla2")
        this.pvmLoc = gl.getUniformLocation(this.shader.full, "u_pvmMat")
        this.mLoc = gl.getUniformLocation(this.shader.full, "u_mMat")
        this.posLoc = gl.getAttribLocation(this.shader.full, "a_pos")
        this.normLoc = gl.getAttribLocation(this.shader.full, "a_norm")
        this.texLoc = gl.getAttribLocation(this.shader.full, "a_tex")
        this.samplerLoc = gl.getUniformLocation(this.shader.full, "u_sampler")
        this.lightDirLoc = gl.getUniformLocation(this.shader.full, "u_light_dir")

        for (const key in this.bmpInPlace) {
            this.setupBmp(gl, key, this.bmpInPlace[key])
        }


    },

    DIRECT_LIGHT: [0, 0, 1, 1],
    SHADE_LIGHT: [0, 1, 0, 1],
    VARIABLE_SHADER: [1, 1, 1, 1],
    draw: function(gl, o, str, bufs, lightDir=null){
        if (lightDir === null) lightDir = this.DIRECT_LIGHT
        if (!(str in this.loaded)) return
        World.pvm.updateWithDisplayObject(o)


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

        gl.uniformMatrix4fv(this.pvmLoc, false, World.pvm.pvm)
        gl.uniformMatrix4fv(this.mLoc, false, World.pvm.m)

        //gl.activeTexture(gl.TEXTURE0)
        //gl.bindTexture(gl.TEXTURE_2D, this.strToTexHandle[str])
        //gl.uniform1i(this.samplerLoc, 0)

        gl.uniform4fv(this.lightDirLoc, lightDir)

        gl.drawElements(gl.TRIANGLES, bufs.indArr.length, gl.UNSIGNED_SHORT, 0)


    },

}