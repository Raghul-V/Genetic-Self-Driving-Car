// change this speed up the training
const noOfCars = 250

const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 250

const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 650

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const lanes = 3
const road = new Road(carCanvas.width/2, carCanvas.width*0.9, lanes)

const cars = generateCars(noOfCars)

let bestCar = cars[0]

if (localStorage.getItem("bestBrain")) {
    for (let car of cars) {
        car.brain = JSON.parse(localStorage.getItem("bestBrain"))
        NeuralNetwork.mutate(car.brain, 0.1)
    }
    bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"))
}

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.setItem("bestBrain", "")
}

const trafficCount = 25
const traffic = []

for (let i=0; i<trafficCount; i++) {
    traffic[i] = new Car(
        Math.random()*(carCanvas.width*0.75) + carCanvas.width*0.125, 
        Math.random()*50 - i*200, 
        40, 80, "DUMMY"
    )
}

animate()

function generateCars(N) {
    const cars = []
    for (let i=0; i<N; i++) {
        cars.push(new Car(road.getLaneCenter(2), window.innerHeight-150, 40, 80, "AI"))
    }
    return cars
}

function animate(time) {
    carCanvas.height = window.outerHeight
    networkCanvas.height = window.outerHeight

    carCtx.clearRect(0, 0, carCanvas.offsetWidth, carCanvas.offsetHeight)

    for (let car of cars) {
        car.update(road.borders, traffic)
    }

    for (let car of traffic) {
        car.update(road.borders, [])
    }
    
    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    )

    carCtx.save()
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.8)

    road.draw(carCtx)

    for (let car of traffic) {
        car.draw(carCtx)
    }
    
    carCtx.globalAlpha = 0.2
    for (let car of cars) {
        car.draw(carCtx)
    }
    carCtx.globalAlpha = 1

    bestCar.draw(carCtx, true)

    carCtx.restore()

    networkCtx.lineDashOffset= -time/50
    Visualizer.drawNetwork(networkCtx, bestCar.brain)

    requestAnimationFrame(animate)
}


