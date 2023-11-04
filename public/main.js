
const testDob = DisplayObject()
const testDob2 = DisplayObjectBall([0, 1.5, 0])

function loop() {
    window.requestAnimationFrame(loop)
    World.set_t_s((Date.now() - World.t0) * 0.001)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.clear(gl.DEPTH_BUFFER_BIT)

    DrawerVanilla2.draw(gl, testDob, "red", PosNormIndTexs.square)
    testDob2.thX += 0.01
    DrawerBall.draw(testDob2, "ball", PosNormIndTexs.ball)
}

;(async function init() {
    await getAllAssets()
    PosNormIndTexs.setup()
    World.setup(canvas.clientWidth, canvas.clientHeight);
    DrawerVanilla2.setup(gl)
    DrawerBall.setup()
    gl.clearColor(0, 1, 0, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    loop()
})();