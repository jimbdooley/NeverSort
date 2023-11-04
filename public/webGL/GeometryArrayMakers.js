
function objProperToPosNormIndTex(fileStr) {
    while (fileStr.indexOf("\r") != -1) { fileStr = fileStr.replace("\r", "\n") }
    while (fileStr.indexOf("\n\n") != -1) { fileStr = fileStr.replace("\n\n", "\n") }
    const es = []
    for (el of fileStr.split("\n")) {
        const new_row = []
        for (el2 of el.split(" ")) {
            new_row.push(el2)
        }
        es.push(new_row)
    }
    const posOrig = []
    const texOrig = []
    const normOrig = []
    let triCount = 0
    for (const row of es) {
        if (row.length == 0) continue
        for (let i = 1; i < row.length; i++) {
            if (row[0] == "v") posOrig.push(parseFloat(row[i]))
            if (row[0] == "vn") normOrig.push(parseFloat(row[i]))
            if (row[0] == "vt" && i < 3) texOrig.push(parseFloat(row[i]))
        }
        if (row[0] == "v") posOrig.push(1)
        if (row[0] == "vn") normOrig.push(0)
        if (row[0] == "vt") { for (let j = 0; j < 2; j++) texOrig.push(0) }
        if (row[0] == "f") triCount += row.length - 3
    }
    const pos = []
    const norm = []
    const tex = []
    const inds = []
    for (let i = 0; i < triCount * 12; i++) {
        pos.push(1)
        norm.push(0)
        tex.push(0)
    }
    for (let i = 0; i < triCount * 3; i++) {
        inds.push(0)
    }
    triCount = 0
    for (const row of es) {
        if (row.length == 0) continue
        if (row[0] != "f") continue
        for (let i = 0; i < row.length - 3; i++) {
            for (let tri = 3*triCount; tri < 3*triCount + 3; tri++) {
                inds[tri] = tri
                const objRow = 1 + (tri == 3*triCount ?  0 : i + tri - 3*triCount)
                const origI = row[objRow].split("/")
                for (let j = 0; j < 3; j++) {
                    pos[tri*4+j] = posOrig[(origI[0]-1)*4+j]
                    tex[tri*4+j] = texOrig[(origI[1]-1)*4+j]
                    norm[tri*4+j] = normOrig[(origI[2]-1)*4+j]
                }
            }
            triCount += 1
        }

    }
    return PosNormIndTex(pos, norm, inds, tex)

}

function getOuterPath(w, r, cornerSegs) {
    const cornerCenters = [
        [r-w,1-r],
        [w-r,1-r],
        [w-r,r-1],
        [r-w,r-1],
    ]
    const rtn = []
    const rtn2 = []
    const rtn3 = []
    for (let i = 0; i < 4; i ++) {
        const th0 = Math.PI - i*0.5*Math.PI
        for (let j = 0; j <= cornerSegs; j++) {
            rtn.push([
                cornerCenters[i][0] + r*Math.cos(th0 - j*0.5*Math.PI/cornerSegs),
                cornerCenters[i][1] + r*Math.sin(th0 - j*0.5*Math.PI/cornerSegs),
            ])
            rtn2.push(th0 - j*0.5*Math.PI/cornerSegs)
            const cr = 0.15
            if (i%2 == 0) {
                rtn3.push((1-cr + cr*j/cornerSegs))
            } else {
                rtn3.push(1-(1-cr + cr*j/cornerSegs))
            }
        }
    }
    return [rtn, rtn2, rtn3]
}


function indicatorPNIT() {
    const op = getOuterPath(0.7, 0.1, 10)
    const _outerPath = op[0]
    const _xs = op[2]
    const outerPath = []
    const xs = []
    for (let i = 0; i < 4; i++) {
        const e0 = _outerPath.length*(i+1)*0.25-1
        const e1 = (e0+1) % _outerPath.length
        for (let j = 1+e0-0.25*_outerPath.length; j < e0+1; j++) {
            outerPath.push(_outerPath[j])
            xs.push(_xs[j])
        }
        for (let j = 1; j < 10; j++) {
            v0 = 1 - j / 10
            v1 = 1 - v0
            outerPath.push([
                v0*_outerPath[e0][0] + v1*_outerPath[e1][0],
                v0*_outerPath[e0][1] + v1*_outerPath[e1][1],
            ])
            xs.push(v0*_xs[e0] + v1*_xs[e1])
        }
    }
    const outerPath2 = []
    for (let i = 0; i < outerPath.length; i ++) {
        outerPath2.push([
            outerPath[i][0]*1.26,
            outerPath[i][1]*1.26*0.96
        ])
        outerPath[i][0] *= 0.99
        outerPath[i][1] *= 0.99
    }
    const pos = []
    const norm = []
    const ind = []
    const tex = []
    for (let i = 0; i < outerPath.length; i++) {
        const j = (i + 1) % outerPath.length
        pos.push(outerPath[i][0], outerPath[i][1], 0, 1)
        pos.push(outerPath[j][0], outerPath[j][1], 0, 1)
        pos.push(outerPath2[i][0], outerPath2[i][1], 0, 1)
        pos.push(outerPath2[j][0], outerPath2[j][1], 0, 1)
        norm.push(0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0)
        tex.push(xs[i], 0.5, 0, 0)
        tex.push(xs[j], 0.5, 0, 0)
        tex.push(xs[i], 0.55, 0, 0)
        tex.push(xs[j], 0.55, 0, 0)
    }
    for (let i = 0; i < pos.length*0.25; i+=4) {
        ind.push(i+0, i+1, i+2, i+2, i+1, i+3)
    }
    const posLen = pos.length
    const indLen = ind.length
    const nextInd = ind.reduce((a, b) => Math.max(a, b), -1) + 1
    for (let i = 0; i < posLen; i+=4) {
        pos.push(-pos[i], pos[i+1], -pos[i+2], pos[i+3])
        tex.push(tex[i], tex[i+1], tex[i+2], tex[i+3])
        norm.push(-norm[i], norm[i+1], -norm[i+2], norm[i+3])
    }
    for (let i = 0; i < indLen; i++) {
        ind.push(ind[i]+nextInd)
    }
    return PosNormIndTex(pos, norm, ind, tex)
}

function xform1(x, y, z, th, dstArr) {
    const y2 = y*Math.cos(th) - z * Math.sin(th)
    const z2 = y*Math.sin(th) + z*Math.cos(th)
    dstArr.push(x, y2, z2, 1)
}
function xform2(x, y, z, th, dstArr) {
    const x2 = x*Math.cos(th) - z * Math.sin(th)
    const z2 = x*Math.sin(th) + z*Math.cos(th)
    dstArr.push(x2, y, z2, 1)
}

function cubeCirclePNIT(N=4, keepAsCube=false) {
    const pos = []
    const norm = []
    const ind = []
    const tex  = []
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            pos.push(-1 + (2/N)*i, -1 + (2/N)*j, 1, 1)
            tex.push(i/N, 1 - j/N, 0, 0)
            pos.push(-1 + (2/N)*(i+1), -1 + (2/N)*j, 1, 1)
            tex.push((i+1)/N, 1 - j/N, 0, 0)
            pos.push(-1 + (2/N)*i, -1 + (2/N)*(j+1), 1, 1)
            tex.push(i/N, 1 - (j+1)/N, 0, 0)
            pos.push(-1 + (2/N)*i, -1 + (2/N)*(j+1), 1, 1)
            tex.push(i/N, 1 - (j+1)/N, 0, 0)
            pos.push(-1 + (2/N)*(i+1), -1 + (2/N)*j, 1, 1)
            tex.push((i+1)/N, 1 - j/N, 0, 0)
            pos.push(-1 + (2/N)*(i+1), -1 + (2/N)*(j+1), 1, 1)
            tex.push((i+1)/N, 1 - (j+1)/N, 0, 0)
            for (let k = 0; k < 6; k++) norm.push(0, 0, 1, 0)
        }
    }
    if (!keepAsCube) {
        for (let i = 0; i < pos.length; i += 4) {
            const vl = Math.sqrt(pos[i]*pos[i] + pos[i+1]*pos[i+1] + pos[i+2]*pos[i+2])
            pos[i] /= vl
            pos[i+1] /= vl
            pos[i+2] /= vl
        }
    }
    const posLen = pos.length
    for (let h = 1; h < 4; h++) {
        for (let i = 0; i < posLen; i += 4) {
            xform1(pos[i], pos[i+1], pos[i+2], h*0.5*Math.PI, pos)
            tex.push(tex[i], tex[i+1], 0, 0)
            norm.push(0, 0, 1, 0)
        }
    }
    for (let h = 1; h < 4; h += 2) {
        for (let i = 0; i < posLen; i += 4) {
            xform2(pos[i], pos[i+1], pos[i+2], h*0.5*Math.PI, pos)
            tex.push(tex[i], tex[i+1], 0, 0)
            norm.push(0, 0, 1, 0)
        }
    }
    for (let i = 0; i < pos.length / 4; i++) ind.push(i)
    for (let i = 0; i < ind.length; i+=3) setNaturalNormals(pos, norm, ind, i)
    return PosNormIndTex(pos, norm, ind, tex)
}

const PosNormIndTexs = {
    square: null,
    indicatorPNIT: indicatorPNIT(),
    ball: cubeCirclePNIT(10),
    setup() {
        this.square = objProperToPosNormIndTex(assets["objs/square.obj"])
    },
}