
const DrawerFloor = {
    posLoc: -1,
    normLoc: -1,
    texLoc: -1,
    pvmLoc: -1,
    mLoc: -1,
    dataLoc: -1,
    data: [1, 1, 1, 1],
    bmps: {},
    strToTexHandle: {},
    loaded: {},
    shader: null,


    setup: function(gl) {
        this.shader = Shader(assets["shaders/floor.vert"],
            assets["shaders/floor.frag"], "floor")
        this.pvmLoc = gl.getUniformLocation(this.shader.full, "u_pvmMat")
        this.mLoc = gl.getUniformLocation(this.shader.full, "u_mMat")
        this.posLoc = gl.getAttribLocation(this.shader.full, "a_pos")
        this.normLoc = gl.getAttribLocation(this.shader.full, "a_norm")
        this.texLoc = gl.getAttribLocation(this.shader.full, "a_tex")



    },

    draw: function(gl, o, bufs){
        
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


        gl.drawElements(gl.TRIANGLES, bufs.indArr.length, gl.UNSIGNED_SHORT, 0)


    },

}