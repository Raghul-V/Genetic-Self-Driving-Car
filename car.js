class Car {
    constructor (x, y, width, height, controlType) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.acceleration = 0.1
        this.maxSpeed = (controlType != "DUMMY") ? 6 : 5
        this.friction = 0.02
        this.angle = 0

        this.damaged = false
        this.corners = []

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this)
        }
        
        this.useBrain = (controlType == "AI")
        if (this.useBrain) {
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 16, 4]
            )
        }

        this.controls = new Controls(controlType)
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move()
            this.#updateCorners()
            this.damaged = this.isDamaged(roadBorders, traffic)
            if (this.sensor) {
                this.sensor.update(roadBorders, traffic)

                if (this.useBrain) {
                    const offsets = this.sensor.readings.map(
                        r => (r == null) ? 0 : r.offset
                    )
                    const outputs = NeuralNetwork.feedForward(offsets, this.brain)

                    this.controls.forward = outputs[0]
                    this.controls.left = outputs[1]
                    this.controls.right = outputs[2]
                    this.controls.reverse = outputs[3]
                }
            }
        }
    }

    isDamaged(roadBorders, traffic) {
        for (let roadBorder of roadBorders) {
            if (polysIntersect(this.corners, roadBorder)) {
                return true
            }
        }
        for (let car of traffic) {
            if (polysIntersect(this.corners, car.corners)) {
                return true
            }
        }
        return false
    }

    #move() {
        if (this.controls.forward)
            this.speed += this.acceleration
        else if (this.controls.reverse)
            this.speed -= this.acceleration/2
        else if (this.speed > 0)
            this.speed -= this.friction
        else if (this.speed < 0)
            this.speed += this.friction
        
        if (this.speed) {
            if (this.controls.right)
                this.angle -= 0.04 * (this.speed / Math.abs(this.speed))
            else if (this.controls.left)
                this.angle += 0.04 * (this.speed / Math.abs(this.speed))
        }
        
        if (this.speed > this.maxSpeed)
            this.speed = this.maxSpeed
        else if (this.speed < -this.maxSpeed/2)
            this.speed = -this.maxSpeed/2
        
        if (Math.abs(this.speed) < this.friction)
            this.speed = 0

        this.y -= Math.cos(this.angle) * this.speed
        this.x -= Math.sin(this.angle) * this.speed
    }

    #updateCorners() {
        const rad = Math.hypot(this.height, this.width)/2
        const angle = Math.acos(this.height/(2*rad))

        const corner = (angle) => {
            return {
                x: this.x - rad*Math.sin(this.angle + angle)*0.85,
                y: this.y - rad*Math.cos(this.angle + angle)*0.85
            }
        }

        this.corners = [
            corner(angle),
            corner(Math.PI-angle),
            corner(Math.PI+angle),
            corner(-angle),
        ]
    }

    draw(ctx, drawSensor) {
        const image = new Image()
        image.src = this.damaged ? "damagedCar.png" : "normalCar.png"

        if (this.sensor) {
            if (!this.damaged && drawSensor) {
                this.sensor.draw(ctx)
            }

            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(-this.angle)

            ctx.beginPath()

            ctx.drawImage(
                image,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            )

            ctx.restore()
        } else {
            ctx.beginPath()

            ctx.drawImage(
                image, 
                this.x-this.width/2,
                this.y-this.height/2,
                this.width,
                this.height
            )
        }
        
        ctx.fill()
    }
}

