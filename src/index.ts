import selection from './selection'

export interface Entity {
    fitness(): number;
    mutate(): void;
    crossover(e): any;
}

export class Population<T extends Entity> {

    size: number;
    currentGeneration: number;

    population: T[];
    selectedEntities: T[];

    constructor(size: number) {
        this.size = size;
        this.currentGeneration = 0;
        
        this.population = [];
        this.selectedEntities = [];
    }

    populate(entityConstructor: new () => T) {
        this.population = [];
        
        // does the provided constructor have the necessary prerequisites?
        if ( this.isProperEntityConstructor(entityConstructor) ) {
            for(var i = 0; i < this.size; i++) {
                this.population.push(new entityConstructor());
            }
            this.currentGeneration++;
        } else {
            throw GeneticException("GeneticException: Invalid entity constructor, required methods: fitness, crossover, mutate");
        }
    }

    averageFitness() {
        var sum = 0;
        for (var i = 0; i < this.size; i++) {
            sum += this.population[i].fitness();
        }
        return sum / this.size;
    }

    selection(numOfSelections: number, selectionAlgorithm?: (p: T[], s: number) => T[]) {
        const algorithm = selectionAlgorithm || selection.roulette;

        this.selectedEntities = algorithm(this.population, numOfSelections);
    }

    crossover() {
        if (this.selectedEntities.length === 0)
            throw GeneticException("GeneticException: No entities were selected");

        for (var i = 0; i < this.population.length; i++) {
            var a = this.randomEntity(this.selectedEntities);
            var b = this.randomEntity(this.selectedEntities);
            
            this.population[i] = a.crossover(b);
        }   
    }

    mutate(probability: number) {
        for (var i = 0; i < this.population.length; i++) {
            if (Math.random() < probability) {
                this.population[i].mutate();
            }
        }
    }

    private isProperEntityConstructor(c: new() => T ) {
        var t = new c();
        return typeof t.fitness === "function" && typeof t.crossover === "function" && typeof t.mutate === "function";
    }

    private randomEntity(a: T[]): T {
        return a[Math.floor(Math.random()*a.length)];
    }

}

function GeneticException(message: string) {
    this.message = message;
}