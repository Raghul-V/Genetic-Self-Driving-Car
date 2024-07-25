class Road {
    constructor (x, width, laneCount=3) {
        this.x = x
        this.width = width
        this.laneCount = laneCount
        
        this.left = x - width/2
        this.right = x + width/2

        const infinity = 10_000_000
        this.top = -infinity
        this.bottom = infinity

        this.borders = [
            [{ y: this.top, x: this.left }, { y: this.bottom, x: this.left }],
            [{ y: this.top, x: this.right }, { y: this.bottom, x: this.right }],
        ]
    }

    getLaneCenter(laneIndex) {
        return this.left + (Math.min(laneIndex, this.laneCount) - 1/2)*(this.width/this.laneCount)
    }

    draw(ctx) {
        ctx.lineWidth = 6
        ctx.strokeStyle = "white"
        
        for (let i=0; i<=this.laneCount; i++) {
            if (i > 0 && i < this.laneCount) {
                ctx.setLineDash([20, 20])
            } else {
                ctx.setLineDash([])
            }

            ctx.beginPath()
            ctx.moveTo(this.left + i*(this.width/this.laneCount), this.top)
            ctx.lineTo(this.left + i*(this.width/this.laneCount), this.bottom)
            ctx.stroke()
        }
    }
}
