
const World = {
    viewWidth: 0,
    viewHeight: 0,
    backgroundDob: DisplayObject(),
    pvm: null,
    dx: 0,
    dy: 0,
    t0: Date.now(),
    dT_s: 0.033,
    t_s: 0,
    set_t_s() {
        const newTime = (Date.now() - this.t0) * 0.001
        this.dT_s = Math.min(0.05, newTime - this.t_s)
        this.t_s = newTime
    },
    setup(w, h) {
        if (w === undefined || h === undefined 
            || w === null || h === null
            || w <= 0 || h <= 0) return
        this.viewWidth = w
        this.viewHeight = h
        this.pvm = PVM(w, h, FOV, 0, 0, CAM_Z)
        this.dy = CAM_Z * Math.tan(FOV * 0.5)
        this.dx = this.dy * this.viewWidth / this.viewHeight


        setXYZSXSYFromRegionAndZ(this.backgroundDob, [-1, -1, w+2, h+2], 0)
    }
}    
