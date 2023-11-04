
function setXYZSXSYFromRegionAndZ(o, region, z) {
    const pct_dxy = (CAM_Z - z) / CAM_Z
    const _dy = pct_dxy * World.dy
    const _dx = pct_dxy * World.dx
    const leftX = -_dx + 2.0 * _dx * region[0] / World.viewWidth
    const rightX = -_dx + 2.0 * _dx * (region[0]+region[2]) / World.viewWidth
    const topY = _dy - 2.0 * _dy * region[1] / World.viewHeight
    const botY = _dy - 2.0 * _dy * (region[1]+region[3]) / World.viewHeight
    o.x = 0.5 * (leftX + rightX)
    o.y = 0.5 * (topY + botY)
    o.z = z
    o.sy = 0.5 * (topY - botY)
    o.sx = 0.5 * (rightX - leftX)
}

function setWorldXYZFromScreenXY(o, x, y, z) {
    const pct_dxy = (CAM_Z - z) / CAM_Z
    const _dy = pct_dxy * World.dy
    const _dx = pct_dxy * World.dx
    o.x = -_dx + 2.0 * _dx * x / World.viewWidth
    o.y = _dy - 2.0 * _dy * y / World.viewHeight
    o.z = z
}



function setScreenXYFromWorldXYZ(arr, x, y, z) {
    const pct_dxy = (CAM_Z - z) / CAM_Z
    const currDX = pct_dxy * World.dx
    const currDY = pct_dxy * World.dy
    const pct_dx = (x + currDX) / (2.0 * currDX)
    const pct_dy = (-y + currDY) / (2.0 * currDY)
    arr[0] = World.viewWidth * pct_dx
    arr[1] = World.viewHeight * pct_dy
}


const setPointer = (()=>{
    const tempXY = [0, 0]
    const sourceDob2 = DisplayObject()
    const targetDob2 = DisplayObject()
    return function(sourceDob, targetDob, pointerDob, z, r) {
        setScreenXYFromWorldXYZ(tempXY, sourceDob.x, sourceDob.y, sourceDob.z)
        setWorldXYZFromScreenXY(sourceDob2, tempXY[0], tempXY[1], z)
        setScreenXYFromWorldXYZ(tempXY, targetDob.x, targetDob.y, targetDob.z)
        setWorldXYZFromScreenXY(targetDob2, tempXY[0], tempXY[1], z)
        pointerDob.x = 0.5 * (sourceDob2.x + targetDob2.x) * r + (1-r) * sourceDob2.x
        pointerDob.y = 0.5 * (sourceDob2.y + targetDob2.y) * r + (1-r) * sourceDob2.y
        pointerDob.z = z
        const dx = targetDob2.x - sourceDob2.x
        const dy = targetDob2.y - sourceDob2.y
        const scale = 0.5 * Math.sqrt(dx * dx + dy * dy) * r
        pointerDob.sy = scale
        pointerDob.sx = 0.95 * Math.sqrt(scale)
        pointerDob.sz = 0.5 * pointerDob.sy
        pointerDob.thZ = Math.atan2(dy, dx) - 0.5*Math.PI
        if (targetDob.x > sourceDob.x) {
            pointerDob.thK = pointerDob.thZ - 0.5 * Math.PI
        } else {

            pointerDob.thK = pointerDob.thZ + 0.5 * Math.PI
        }
        pointerDob.thTilt = 0.85
        //pointerDob.thTilt = 0
        //pointerDob.thK = 0
    }
})();
