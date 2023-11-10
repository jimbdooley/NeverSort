
const floorDob = DisplayObject([0, 0, 0], [24.1, 24.1, 0])
const testDob2 = DisplayObjectBall([0, 1.5, 1.5])

const drawBallShadow = (() => {
    const shadowDob = DisplayObject([0, 0, 0.01], [1, 2, 1])
    return function(gl, lightDob, ballDob, ballR, i) {
        const zToZ = lightDob.z / (lightDob.z - ballDob.z)
        const dx = ballDob.x - lightDob.x
        const dy = ballDob.y - lightDob.y
        shadowDob.x = lightDob.x + dx * zToZ
        shadowDob.y = lightDob.y + dy * zToZ
        shadowDob.z = 0.01 * (1+i)
        shadowDob.sx = 1.1 * ballR
        shadowDob.sy = 1.1 * ballR * 1
        shadowDob.thZ = Math.atan2(dy, dx) + Math.PI * 0.5
        DrawerVanilla2.draw(gl, shadowDob, "shadow", PosNormIndTexs.square)
    
    }
})();

function bounceAll(dm=10) {
    for (let i = 0; i < balls.length; i++) {
        balls[i].moZ = dm
    }
}

function Ball(x, _n) {
    const rtn = {}
    rtn.n = _n
    rtn.scale = 0.42*(1 + 0.05 * rtn.n)
    rtn.techZ = rtn.scale + 3 * Math.random()
    rtn.dob = DisplayObjectBall([x, ballPoints.ys[0], rtn.techZ], [rtn.scale, rtn.scale, rtn.scale])
    rtn.mass = rtn.scale * rtn.scale
    rtn.moZ = 0
    rtn.str = _n + ""
    rtn.update = function(_dt) {
        const dt = 1.5 * _dt
        let forceZ = -this.mass * 9
        if (this.techZ < this.scale) {
            forceZ += 120 * (this.scale - this.techZ)
        }
        this.moZ += forceZ * dt / this.mass
        this.moZ *= 0.99 - Math.max(0, scriptT) * 0.01
        this.techZ += dt * this.moZ
        this.dob.z = this.techZ

    }
    return rtn
}

const balls = [
    Ball(ballPoints.start[0], 6),
    Ball(ballPoints.start[1], 4),
    Ball(ballPoints.start[2], 7),
    Ball(ballPoints.start[3], 3),
    Ball(ballPoints.start[4], 5),
    Ball(ballPoints.start[5], 2),
    Ball(ballPoints.start[6], 1),
]

let scriptT = 0
let scriptRunning = false
function loop() {
    window.requestAnimationFrame(loop)
    World.set_t_s((Date.now() - World.t0) * 0.001)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.clear(gl.DEPTH_BUFFER_BIT)
    if (scriptRunning) {
        scriptT += World.dT_s
        script(scriptT)
    }

    DrawerVanilla2.draw(gl, floorDob, "wood", PosNormIndTexs.square)
    DrawerVanilla2.draw(gl, titleTextDob, "tt", PosNormIndTexs.square)
    DrawerVanilla2.draw(gl, step1Dob, "s1", PosNormIndTexs.square)
    DrawerVanilla2.draw(gl, step2Dob, "s2", PosNormIndTexs.square)
    DrawerVanilla2.draw(gl, step3Dob, "s3", PosNormIndTexs.square)
    for (let i = 0; i < balls.length; i++) {
        drawBallShadow(gl, World.lightDob, balls[i].dob, balls[i].scale, i)
    }
    for (const ball of balls) {
        ball.update(World.dT_s)
        DrawerBall.draw(ball.dob, ball.str, PosNormIndTexs.ball)

    }
}

;(async function init() {
    await getAllAssets()
    PosNormIndTexs.setup()
    World.setup(canvas.clientWidth, canvas.clientHeight);
    DrawerVanilla2.setup(gl)
    DrawerFloor.setup(gl)
    DrawerBall.setup()

    gl.clearColor(0, 1, 0, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    
    DrawerVanilla2.setupBmp(gl, "wood", drawable["wood"])

    loop()
})();

document.addEventListener("mousedown", () => {
    scriptInit()
})
