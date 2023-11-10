
const numCanvas = document.createElement("canvas")
const numCtx = numCanvas.getContext("2d", {willReadFrequently: true})
const numCanvasL = 500
numCanvas.width = numCanvasL
numCanvas.height = numCanvasL

function numToBmp(str, r, g, b) {
    numCanvas.width = numCanvasL
    numCanvas.height = numCanvasL
    numCtx.fillStyle = "#ffffffff"
    numCtx.fillRect(0, 0, numCanvasL, numCanvasL)
    numCtx.fillStyle = "black"
    numCtx.font = "450px Arial"
    numCtx.fillText(str, 20, 480)
    arr = numCtx.getImageData(0, 0, numCanvasL, numCanvasL).data
    let leftRoom = 999999
    let rightRoom = 999999
    let topRoom = 999999
    let botRoom = 999999
    for (let j = 0; j < numCanvasL; j++) {
        let firstSeen = 9999999
        let lastSeen = -1
        for (let i = 0; i < numCanvasL; i++) {
            const pixI = 4 * i * numCanvasL + 4 * j
            if (arr[pixI] == 255 && arr[pixI + 1] == 255 && arr[pixI + 2] == 255) {
                continue
            }
            firstSeen = Math.min(firstSeen, i)
            lastSeen = i
        }
        if (lastSeen != -1) {
            topRoom = Math.min(firstSeen, topRoom)
            botRoom = Math.min(numCanvasL - 1 - lastSeen, botRoom)
        }
    }
    const dy = Math.floor(0.5 * (topRoom - botRoom))
    for (let i = 0; i < numCanvasL; i++) {
        if (str == "1" && i < 0.7*numCanvasL) continue
        let firstSeen = 9999999
        let lastSeen = -1
        for (let j = 0; j < numCanvasL; j++) {
            const pixI = 4 * i * numCanvasL + 4 * j
            if (arr[pixI] == 255 && arr[pixI + 1] == 255 && arr[pixI + 2] == 255) {
                continue
            }
            firstSeen = Math.min(firstSeen, j)
            lastSeen = j
        }
        if (lastSeen != -1) {
            leftRoom = Math.min(firstSeen, leftRoom)
            rightRoom = Math.min(numCanvasL - 1 - lastSeen, rightRoom)
        }
    }
    const dx = str == "1" ? Math.floor(0.65 * (rightRoom - leftRoom))
        : Math.floor(0.5 * (rightRoom - leftRoom))
    for (let i = 0; i < numCanvasL; i++) {
        for (let j = numCanvasL - 1; j >= dx; j--) {
            const pixI2 = 4 * i * numCanvasL + 4 * j
            const pixI = 4 * i * numCanvasL + 4 * (j-dx)
            const tempR = arr[pixI+0]
            const tempG = arr[pixI+1]
            const tempB = arr[pixI+2]
            const tempA = arr[pixI+3]
            arr[pixI+0] = arr[pixI2+0]
            arr[pixI+1] = arr[pixI2+1]
            arr[pixI+2] = arr[pixI2+2]
            arr[pixI+3] = arr[pixI2+3]
            arr[pixI2+0] = tempR
            arr[pixI2+1] = tempG
            arr[pixI2+2] = tempB
            arr[pixI2+3] = tempA

        }
    }
    for (let i = 0; i < numCanvasL - dy; i++) {
        for (let j = 0; j < numCanvasL; j++) {
            const pixI = 4 * i * numCanvasL + 4 * j
            const pixI2 = 4 * (i+dy) * numCanvasL + 4 * j
            const tempR = arr[pixI+0]
            const tempG = arr[pixI+1]
            const tempB = arr[pixI+2]
            const tempA = arr[pixI+3]
            arr[pixI+0] = arr[pixI2+0]
            arr[pixI+1] = arr[pixI2+1]
            arr[pixI+2] = arr[pixI2+2]
            arr[pixI+3] = arr[pixI2+3]
            arr[pixI2+0] = tempR
            arr[pixI2+1] = tempG
            arr[pixI2+2] = tempB
            arr[pixI2+3] = tempA

        }
    }
    const pixels = []
    for (let i = 0; i < arr.length; i+=4) {
        pixels.push([
            arr[i+3],
            Math.round(arr[i+0]*r),
            Math.round(arr[i+1]*g),
            Math.round(arr[i+2]*b),
        ])
    }
    return Bitmap.createBitmap(pixels, numCanvasL, numCanvasL, Bitmap.Config.ARGB_8888)
}