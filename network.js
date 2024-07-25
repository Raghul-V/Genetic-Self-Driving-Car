class NeuralNetwork {
    constructor (neuronCounts) {
        this.levels = []
        for (let i=0; i<neuronCounts.length-1; i++) {
            this.levels[i] = new Level(neuronCounts[i], neuronCounts[i+1])
        }
    }

    static feedForward(inputs, network) {
        let outputs = []
        for (let level of network.levels) {
            outputs = Level.feedForward(inputs, level)
            inputs = outputs
        }

        return outputs
    }

    static mutate(network, amount=1) {
        network.levels.forEach(level => {
            for (let i=0; i<level.biases.length; i++) {
                level.biases[i] = level.biases[i]*(1-amount) + (Math.random()*2-1)*amount
            }
    
            for (let i=0; i<level.weights.length; i++) {
                for (let j=0; j<level.weights[0].length; j++) {
                    level.weights[i][j] = level.weights[i][j]*(1-amount) + (Math.random()*2-1)*amount
                }
            }
        })
    }
}


class Level {
    constructor (inputCount, outputCount) {
        this.inputs = new Array(inputCount)
        this.outputs = new Array(outputCount)
        this.biases = new Array(outputCount)

        this.weights = []
        for (let i=0; i<inputCount; i++) {
            this.weights[i] = new Array(outputCount)
        }

        Level.#randomize(this)
    }

    static #randomize(level) {
        for (let i=0; i<level.inputs.length; i++) {
            for (let j=0; j<level.outputs.length; j++) {
                level.weights[i][j] = Math.random()*2 - 1
            }
        }

        for (let i=0; i<level.outputs.length; i++) {
            level.biases[i] = Math.random()*2 - 1
        }
    }

    static feedForward(inputs, level) {
        for (let i=0; i<level.inputs.length; i++) {
            level.inputs[i] = inputs[i]
        }

        for (let i=0; i<level.outputs.length; i++) {
            let value = 0
            for (let j=0; j<level.inputs.length; j++) {
                value += level.inputs[j]*level.weights[j][i]
            }
            value += level.biases[i]
            
            level.outputs[i] = (value > 0) ? 1 : 0
        }

        return level.outputs
    }
}

