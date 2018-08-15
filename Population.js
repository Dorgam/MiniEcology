function Population(num) {
  this.population = [];                   
  this.matingPool = [];                   
  this.generations = 0;

  for (var i = 0; i < num; i++) {
    this.population[i] = new DNA(id_counter++, 1, 100);
  }
  
  this.naturalSelection = function() {
    this.matingPool = [];
    var maxFitness = 0;

    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    // Based on fitness, each member will get added to the mating pool a certain number of times
    // a higher fitness = more entries to mating pool = more likely to be picked as a parent
    // a lower fitness = fewer entries to mating pool = less likely to be picked as a parent
    for (var i = 0; i < this.population.length; i++) {
      var fitness = map(this.population[i].fitness,0,maxFitness,0,1);
      var n = floor(fitness * 100) + 1;  // Arbitrary multiplier, we can also use monte carlo method
      for (var j = 0; j < n; j++) {              // and pick two random numbers
        this.matingPool.push(this.population[i]);
      }
    }
  }

  // Create a new generation
  this.generate = function() {
    // Refill the population with children from the mating pool
    for (var i = 0; i < this.population.length; i++) {
      var a = floor(random(this.matingPool.length));
      var b = floor(random(this.matingPool.length));
      var partnerA = this.matingPool[a];
      var partnerB = this.matingPool[b];
      var child = partnerA.crossover(partnerB);
      child.id = this.population[i].id;
      child.mutate(this.mutationRate);
      this.population[i] = child;
    }
    this.generations++;
  }
}
