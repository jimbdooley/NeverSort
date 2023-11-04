
const fullArtTextKeyToId = []

let faImgDataArr = null
let faCopyArr = null
function makeFullArtText(id, imgData, h, w) {
    if (faImgDataArr == null || faImgDataArr.length != h * w * 4) {
        faImgDataArr = new Uint8ClampedArray(h*w*4)
        faCopyArr = new Uint8ClampedArray(h*w*4)
    } 
    for (let i = 0; i < faImgDataArr.length; i += 4) {
        faImgDataArr[i+0] = 255;
        faImgDataArr[i+1] = 255;
        faImgDataArr[i+2] = 255;
        faImgDataArr[i+3] = imgData[i+3];
        faCopyArr[i+3] = 0
    }

    for (let i = 0; i < faImgDataArr.length; i+=4) {
        if (faImgDataArr[i+3] == 0) continue
        const px = Math.floor(i/4)
        const row = Math.floor(px / w)
        const col = px % w
        for (let a = 0; a <=4; a++) {
            for (let b = 0; b <=4; b++) {
                const newRow = row - 2 + a
                const newCol = col - 2 + b
                const newPX = newRow*w +newCol
                const newI = newPX * 4;
                if (newI < 0 || newI > faImgDataArr.length) continue
                if (faImgDataArr[newI + 3] > 0) continue
                let dist = 255 - faImgDataArr[i+3]
                const dx = 2 - a
                const dy = 2 - b
                dist += 256 * Math.sqrt(dx*dx + dy*dy)
                if (dist < 512) {
                    faCopyArr[newI + 3] = 255
                } else if (dist < 768) {
                    faCopyArr[newI + 3] = Math.max(faCopyArr[newI + 3], 768 - dist)
                }
            }
        }
    }
    for (let i = 0; i < faImgDataArr.length; i+=4) {
        if (faImgDataArr[i+3] > 0) {
            const dif = 255 - faImgDataArr[i+3]
            const newVal = 255 - Math.round(0.85*dif)
            faImgDataArr[i+0] = newVal
            faImgDataArr[i+1] = newVal
            faImgDataArr[i+2] = newVal
            faImgDataArr[i+3] = 255
            continue
        }
        if (faCopyArr[i+3] == 0) {
            faImgDataArr[i+0] = 0
            faImgDataArr[i+1] = 0
            faImgDataArr[i+2] = 0
            faImgDataArr[i+3] = 0
            continue
        }
        faImgDataArr[i+0] = 0
        faImgDataArr[i+1] = 0
        faImgDataArr[i+2] = 0
        faImgDataArr[i+3] = 255
        //faImgDataArr[i+3] = Math.max(faImgDataArr[i+3], faCopyArr[i+3])
    }
    //addBorder(faImgDataArr, [255, 0, 0], w, h, 3)

    const key = `fullArtText_${id}`
    while (fullArtTextKeyToId.length <= id) fullArtTextKeyToId.push(null)
    fullArtTextKeyToId[id] = key
    if (key in DrawerVanilla2.loaded) {
        gl.deleteTexture(DrawerVanilla2.strToTexHandle[key])
        delete DrawerVanilla2.loaded[key]
    }
    DrawerVanilla2.setupBmpFromArr(key, faImgDataArr, h, w)

}
