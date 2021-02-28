function roulette(population: any[], size: number) {
    const selection :any[] = [];

    var select = size || Math.floor(population.length * 0.25);
    
    // reverse sort the population based on fitness
    population.sort(function (a, b) {
        if (a.fitness() > b.fitness())
            return -1;
        if (a.fitness() < b.fitness())
            return 1;
        return 0;
    });
    
    // sum up all fitness
    var fsum = population.reduce(function(prev, next) { 
        return prev + next.fitness();
    }, 0);
    
    const relativeFitnesses: number[] = population.map(function(a) {
        return (a.fitness() / fsum) * 100;
    });
        
    // roulette selection
    for (var i = 0; i < select; i++) {
        var probability = Math.floor(Math.random());
        
        for (var j = 0; j < population.length; j++) {
            if (relativeFitnesses[j] > probability)
                selection[i] = population[j];
                
                if (typeof selection[i] === "undefined")
                    console.log("UNDEFINED");
        }
    }

    return selection;
}

function elitist(population: any[], size: number) {
    const selection :any[] = [];

    var select = size || Math.floor(population.length * 0.25);
    
    // sort population by fitness
    population.sort(function (a, b) {
        if (a.fitness() > b.fitness())
            return -1;
        if (a.fitness() < b.fitness())
            return 1;
        return 0;
        });
        
    for (var i = 0; i < select; i++) {
        selection[i] = population[i];
    }

    return selection;
}

export default {
    roulette,
    elitist
}