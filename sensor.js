class Sensor {
    constructor (car) {
        this.car = car
        this.rayCount = 12
        this.rayLength = car.height * 2.15
        this.raySpread = Math.PI*2

        this.rays = []
        this.readings = []
    }

    update(roadBorders, traffic) {
        this.#castRays()
        this.#getReadings(roadBorders, traffic)
    }

    #castRays() {
        this.rays = []

        for (let i=0; i<this.rayCount; i++) {
            let angle = 0
            if (this.rayCount > 1) {
                angle = i*this.raySpread/(this.rayCount-1) - this.raySpread/2
            }
            angle += this.car.angle
            
            const start = { x: this.car.x, y: this.car.y }
            const end = { x: this.car.x - Math.sin(angle)*this.rayLength , y: this.car.y - Math.cos(angle)*this.rayLength }

            this.rays.push([start, end])
        }
    }

    #getReadings(roadBorders, traffic) {
        this.readings = []

        for (let ray of this.rays) {
            let touches = []

            for (let roadBorder of roadBorders) {
                const touch = getIntersection(ray[0], ray[1], roadBorder[0], roadBorder[1])
                if (touch) {
                    touches.push(touch)
                }
            }
            for (let car of traffic) {
                const poly = car.corners
                for (let i=0; i<poly.length; i++) {
                    const touch = getIntersection(ray[0], ray[1], poly[i], poly[(i+1) % poly.length])
                    if (touch) {
                        touches.push(touch)
                    }
                }
            }

            if (touches.length == 0) {
                this.readings.push(null)
            } else {
                const offsets = touches.map(e => e.offset)
                const minOffset = Math.min(...offsets)
                this.readings.push(touches.find(e => e.offset==minOffset))
            }
        }
    }

    draw(ctx) {
        for (let ray of this.rays) {
            let end = this.readings[this.rays.indexOf(ray)] || ray[1]
            
            ctx.lineWidth = 4
            ctx.strokeStyle = "yellow"
            ctx.beginPath()
            ctx.moveTo(ray[0].x, ray[0].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

            ctx.lineWidth = 4
            ctx.strokeStyle = "#f007"  // #3334
            ctx.beginPath()
            ctx.moveTo(ray[1].x, ray[1].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
        }
    }
}

