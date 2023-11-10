
const ROT_START_DUR = 3

const titleTextDob = DisplayObject([-0.2, 8.5, 0.005], [4.8,0.8, 1])
const step1Dob = DisplayObject([-0.2, 4.8, 0.005], [4.8,0.8, 1])
const step2Dob = DisplayObject([-0.2, 1.5, 0.005], [4.8,0.8, 1])
const step3Dob = DisplayObject([-0.2, -4.5, 0.005], [4.8,0.8, 1])


const ballRef = [-4.25, -2.8, -1.35, 0.1, 1.55, 2.95, 4.3]
const ballPoints = {}
ballPoints.ys = [6.4, 3.05]
ballPoints.start = ballRef.map(v => 0.84*v),
ballPoints.prevRs = ballRef.map(_ => 0)
ballPoints.cut = ballPoints.start.map((v, i) => i < 4 ? v - 0.76 : v + 0.76)
ballPoints.cutTOffsets = ballPoints.cut.map(_ => Math.random() * 0.5)

function scriptInit() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].techZ = 4 + 8 * Math.random()
        balls[i].moZ = 3 * (-Math.random())
        balls[i].dob.x = ballPoints.start[i]
        balls[i].dob.y = ballPoints.ys[0]
    }
    scriptRunning = true
    scriptT = 0
}

function script(t) {
    const introZoomT = Math.max(0, -t + ROT_START_DUR)
    const pauseR = 0.000
    const camZoomT = Math.min(introZoomT, (1-pauseR)*ROT_START_DUR)
    const introR = sCurve(camZoomT / ((1-pauseR)*ROT_START_DUR))
    const th = 0.4 * Math.PI * introR
    World.pvm.setCam(
        Math.cos(th) * CAM_X - Math.sin(th) * CAM_Y - 3*introR*introR*introR,
        Math.sin(th) * CAM_X + Math.cos(th) * CAM_Y + 8*introR,
        CAM_Z * (1 - 0.136 * introR*introR),
        Math.cos(th) * LAX - Math.sin(th) * LAY,
        Math.sin(th) * LAX + Math.cos(th) * LAY,
        LAZ ,
    )

    const bounce0Start = 6
    const bounce0Stop = 8
    if (t >= bounce0Start && t <= bounce0Stop) {
        for (let i = 0; i < balls.length; i++) {
            const bounceT = t - bounce0Start - ballPoints.cutTOffsets[i]
            const rawR = bounceT / (bounce0Stop - bounce0Start - 0.5)
            if (rawR < 1 && rawR > 0) {
                if (rawR < 0.3) {
                    balls[i].moZ -= 0.5
                } else if (rawR < 0.9) {
                    if (ballPoints.prevRs[i] < 0.3) balls[i].moZ = 8
                    const shiftR = (rawR - 0.3) / 0.6
                    balls[i].dob.y = (1-shiftR) * ballPoints.ys[0] + shiftR * ballPoints.ys[1]
                    balls[i].dob.x = shiftR * ballPoints.cut[i] + (1-shiftR) * ballPoints.start[i]
                }
                
            }
            ballPoints.prevRs[i] = rawR
        }
    }
}