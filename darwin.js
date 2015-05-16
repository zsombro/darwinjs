var darwin = (function(global){

	function Population(size, targetFitness) {
		this.size = size;
		this.targetFitness = targetFitness;
		this.generation = 0;
		
		this.pop = [];
		this.sel = [];
		
		// console.log("New population of " + this.size + " entities");
	}

	Population.prototype.populate = function (entityConstructor) {
		this.pop = [];
		
		// does the provided constructor have the necessary prerequisites?
		if ( isProperEntityConstructor(entityConstructor) ) {
			for(var i = 0; i < this.size; i++) {
				this.pop.push(new entityConstructor());
			}
			this.generation++;
		} else {
			//console.log("The provided class (" + entityConstructor.name + ") does not have the required methods (fitness, crossover, mutate)");
			throw GeneticException("GeneticException: Invalid entity constructor, required methods: fitness, crossover, mutate");
		}
	}
	
	Population.prototype.averageFitness = function () {
		var sum = 0;
		for (var i = 0; i < this.size; i++) {
			sum += this.pop[i].fitness();
		}
		return sum / this.size;
	}

	Population.prototype.selection = function (numOfSelections, selectionAlgorithm) {
		selectionAlgorithm = selectionAlgorithm || selections.Roulette;
		
		selectionAlgorithm(this, numOfSelections);
	}
	
	var selectionRoulette = function (object, size) {
		object.sel = [];
		var select = size || Math.floor(object.pop.length * 0.25);
		// console.log("Selecting " + select + " entities from population");
		
		// reverse sort the population based on fitness
		object.pop.sort(function (a, b) {
			if (a.fitness() > b.fitness())
				return -1;
			if (a.fitness() < b.fitness())
				return 1;
			return 0;
			});
		
		// sum up all fitness
		var fsum = object.pop.reduce(function(prev, next) { 
			return (typeof prev === "number" ? prev : prev.fitness()) + next.fitness(); 
			});
		
		// calculate relative fitness for each entity
		object.pop = object.pop.map(function(a) {
			a.relativeFitness = (a.fitness() / fsum) * 100;
			return a;
			});
			
		// roulette selection
		for (var i = 0; i < select; i++) {
			var probability = Math.floor(Math.random() * fsum);
			
			for (var j = 0; j < object.size; j++) {
				if (object.pop[j].relativeFitness > probability)
					object.sel[i] = object.pop[j];
					
					if (typeof object.sel[i] === "undefined")
						console.log("UNDEFINED");
			}
		}
	}
	
	var selectionElitist = function (object, size) {
		var select = size || Math.floor(object.pop.length * 0.25);
		
		// sort population by fitness
		object.pop.sort(function (a, b) {
			if (a.fitness() > b.fitness())
				return -1;
			if (a.fitness() < b.fitness())
				return 1;
			return 0;
			});
			
		for (var i = 0; i < select.length; i++) {
			object.sel[i] = object.pop[i];
		}
	}
	
	Population.prototype.crossover = function() {
		// generate the next generation
		if (this.sel.length > 0)
		{
			for (var i = 0; i < this.pop.length; i++) {
				// pick two random entities from the selection
				var a = randomArrayElement(this.sel);
				var b = randomArrayElement(this.sel);
				
				this.pop[i] = a.crossover(b);
			}
		} else
			throw GeneticException("GeneticException: No entities were selected");
	}
	
	Population.prototype.mutate = function(p) {
		// introduce mutation into the population with a probability of p
		for (var i = 0; i < this.pop.length; i++) {
			if (Math.random() < p) {
				this.pop[i].mutate();
			}
		}
	}
	
	// Private functions that help stuff
	function isProperEntityConstructor(c) {
		var t = new c();
		return typeof t.fitness === "function" && typeof t.crossover === "function" && typeof t.mutate === "function";
	}
	
	function randomArrayElement(a) {
		return a[Math.floor(Math.random()*a.length)];
	}
	
	// Enumeration of selection algorithms
	var selections = {
		Roulette : selectionRoulette,
		Elitist : selectionElitist
	};
	
	// Exception object
	function GeneticException(message) {
		this.message = message;
	}
	
	// Returned public API
	return {
		Population : Population,
		SelectionAlgorithm : selections
	};
}(window));