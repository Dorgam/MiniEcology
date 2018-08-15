// Food element to be eaten by Goodoids
function Food(x, y, score = 10) {
    this.position = createVector(x, y);

    this.display = function () {
        noStroke();
        fill("green");
        ellipse(this.position.x, this.position.y, 8, 8);
    }
}