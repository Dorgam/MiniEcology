// ID used to link the Genotype with the Phenotype
var id_counter = 0;

var badoids;

var goodoidsGenotype;
var goodoidsPhenotype;

var goodoidsPositions = [];

var foods;

var foodNum = 10;
var foodScore = 10;

var badoidNum = 10;
var goodoidNum = 100;

// Stat Variables
var lastGenerationFitness = 0;
var maxGenerationFitness = 0;
var maxGoodoidFitness = 0;

function createSimulationElements() {
  for (var i = 0; i < badoids.length; i++) {
    badoids[i].position = badoids[i].initialPosition.copy();
  }

  goodoidsPhenotype = [];
  for (var i = 0; i < goodoidsGenotype.population.length; i++) {
    goodoidsPhenotype.push(new Goodoid(goodoidsGenotype.population[i].id, goodoidsPositions[i].x, goodoidsPositions[i].y, createVector(0, 0, 255)))
    goodoidsPhenotype[i].seekWeight = goodoidsGenotype.population[i].seekFoodWeight;
    goodoidsPhenotype[i].fleeWeight = goodoidsGenotype.population[i].fleeBadoidsWeight;
  }
}

function setup() {
  createCanvas(640, 480);
  foods = [];
  for (var i = 0; i < foodNum; i++) {
    foods.push(new Food(random(width), random(height), foodScore));
  }

  badoids = [];
  for (var i = 0; i < badoidNum; i++) {
    badoids.push(new Badoid(random(width), random(height), createVector(255, 0, 0)));
  }

  for(var i = 0; i < goodoidNum; i++) {
    goodoidsPositions.push(createVector(random(width), random(height)));
  }

  goodoidsGenotype = new Population(goodoidNum);
  createSimulationElements();
}

function draw() {
  background(51);

  for(var i = 0; i < foods.length; i++) {
    foods[i].display();
  }

  for(var i = 0; i < badoids.length; i++) {
    badoids[i].seekClosest(goodoidsPhenotype);
    badoids[i].damageClosest(goodoidsPhenotype, 5);
    
    badoids[i].update();
    badoids[i].display();
  }

  for (var i = goodoidsPhenotype.length - 1; i > -1; i--) {
    goodoidsPhenotype[i].age();
    goodoidsPhenotype[i].seekClosest(foods);
    goodoidsPhenotype[i].fleeClosest(badoids);
    goodoidsPhenotype[i].eatClosest(foods, 5);

    goodoidsPhenotype[i].update();
    goodoidsPhenotype[i].display();

    if (goodoidsPhenotype[i].isDead()) {
      var goodoidGenotype = getGenotypeWithID(goodoidsPhenotype[i].id);
      goodoidGenotype.fitness = goodoidsPhenotype[i].score;
      goodoidsPhenotype.splice(i, 1);
    }
  }

  if(goodoidsPhenotype.length == 0) {
    lastGenerationFitness = getAverageFitness();
    if (lastGenerationFitness > maxGenerationFitness)
    {
      maxGenerationFitness = lastGenerationFitness;
    }
    maxGoodoidFitness = getMaxGoodoidFitness();
    goodoidsGenotype.naturalSelection();
    goodoidsGenotype.generate();
    id_counter = 0;    
    createSimulationElements();
  }

  ShowStats();
}

function ShowStats() {
  fill("white");
  text('Generation: ' + goodoidsGenotype.generations, 10, 30);
  text('Last Generation Average Fitness: ' + lastGenerationFitness, 10, 50);
  text('Max Generation Fitness: ' + maxGenerationFitness, 10, 70);
  text('Max Goodoid Fitness in Last Generation: ' + maxGoodoidFitness, 10, 90);
}

// Get average fitness of the last generation
function getAverageFitness() {
  var averageFitness = 0;
  for(var i = 0; i < goodoidsGenotype.population.length; i++) {
    averageFitness += goodoidsGenotype.population[i].fitness;
  }
  return float(averageFitness / goodoidsGenotype.population.length);
}

// Get individual maximum fitness in last generation
function getMaxGoodoidFitness() {
  var maxFitness = 0;
  for (var i = 0; i < goodoidsGenotype.population.length; i++) {
    if (goodoidsGenotype.population[i].fitness > maxFitness) {
      maxFitness = goodoidsGenotype.population[i].fitness;
    }
  }
  return maxFitness;
}

function getGenotypeWithID(id) {
  for(var i = 0; i < goodoidsGenotype.population.length; i++) {
    if(goodoidsGenotype.population[i].id == id) {
      return goodoidsGenotype.population[i];
    }
  }
}