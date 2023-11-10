

const textCanvas = document.createElement("canvas")
const textCtx = textCanvas.getContext("2d", {willReadFrequently: true})
const textCanvasW = 2400
const textCanvasH = 400
textCanvas.width = textCanvasW
textCanvas.height = textCanvasH

function makeText(text, underline) {
    textCtx.fillStyle = "white"
    textCtx.fillRect(0, 0, textCanvasW, textCanvasH)
    textCtx.fillStyle = "black"
    textCtx.font = "300px sans-serif"
    textCtx.fillText(text, 20, 300)
    const data = textCtx.getImageData(0, 0, textCanvasW, textCanvasH).data

    const pixels = []
    for (let i = 0; i < data.length; i += 4) {
        pixels.push([
            data[i+3],
            data[i+0],
            data[i+1],
            data[i+2],
        ])
    }

    return Bitmap.createBitmap(pixels, textCanvasW, textCanvasH, Bitmap.Config.ARGB_8888)
}