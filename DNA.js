
function DNA(id, minWeight = 0, maxWeight = 1) {
  this.id = id;
  this.seekFoodWeight = random(minWeight, maxWeight);
  this.fleeBadoidsWeight = random(minWeight, maxWeight);
  this.fitness = 0;
  this.mutationRate = 0.05;
  this.maxMutationValue = 0.5;

  this.crossover = function(partner) {
    var child = new DNA();
    child.seekFoodWeight = this.seekFoodWeight;
    child.fleeBadoidsWeight = partner.fleeBadoidsWeight;
    return child;
  }

  this.mutate = function(mutationRate) {
      if (random(1) < mutationRate) {
        if(random(1) < 0.5) {
          this.seekFoodWeight = this.seekFoodWeight + random(maxMutationValue);
          this.fleeBadoidsWeight = this.fleeBadoidsWeight + random(maxMutationValue);
        } else {
          this.seekFoodWeight = this.seekFoodWeight - random(maxMutationValue);
          this.fleeBadoidsWeight = this.fleeBadoidsWeight - random(maxMutationValue);
        }
      }
  }
}
