// Badoid Class Definition
function Badoid(x, y, color) {
    // Physics Properties
    this.maxSpeed = 3;
    this.maxForce = 0.05;
    this.position = createVector(x, y);
    this.initialPosition = this.position.copy();
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    // Steering Forces
    this.seekForce = createVector(0, 0);
    this.fleeForce = createVector(0, 0);

    // Steering Weights
    this.seekWeight = 0;
    this.fleeWeight = 0;
    
    // Aesthetic Properties
    this.color = color; // Using a vector to store three related values
    this.size = 6;

    this.applyForce = function (force) {
        // Newton's Second Law: Force = Mass * Acceleration
        // => Acceleration = Force / Mass
        // Since this function adds forces we are going to increment acceleration instead of setting it.
        this.acceleration.add(p5.Vector.div(force, 1));
    }

    this.seek = function(target, weight = 1) {
        this.seekWeight = weight;
        var desired = this.getDesired(target);

        // Seek Logic: Go at maximum speed towards the target
        desired.setMag(this.maxSpeed);

        this.seekForce = desired;
        this.steer();
    }

    this.flee = function (target, weight = 1) {
        this.fleeWeight = weight;
        var desired = this.getDesired(target.position).mult(-1);

        // Flee Logic: Go away from target as fast as possible
        desired.setMag(this.maxSpeed);

        this.fleeForce = desired;
        this.steer();
    }

    // Find closest Goodoid, then seek it
    this.seekClosest = function (goodoids) {
        var minDistanceToGoodoid = 10000000;
        var minGoodoidPosition = createVector(0, 0);
        for (var i = 0; i < goodoids.length; i++) {
            var distanceToFood = p5.Vector.dist(this.position, goodoids[i].position);
            if (distanceToFood < minDistanceToGoodoid) {
                minDistanceToGoodoid = distanceToFood;
                minGoodoidPosition = goodoids[i].position;
            }
        }
        this.seek(minGoodoidPosition);
    }

    // Find closest Goodoid, then decrease its health
    this.damageClosest = function (goodoids, damage) {
        var minDistanceToGoodoid = 10000000;
        var minGoodoid;
        for (var i = 0; i < goodoids.length; i++) {
            var distanceToFood = p5.Vector.dist(this.position, goodoids[i].position);
            if (distanceToFood < minDistanceToGoodoid) {
                minDistanceToGoodoid = distanceToFood;
                minGoodoid = goodoids[i];
            }
        }
        if(minDistanceToGoodoid <= 5) {
            minGoodoid.health -= damage;
        }
    }

    this.steer = function() {
        // Calculate the desired force out of all the steering behaviors
        var desired = createVector(0, 0);
        desired.add(this.seekForce.mult(this.seekWeight));
        desired.add(this.fleeForce.mult(this.fleeWeight));

        var steering = p5.Vector.sub(desired, this.velocity);
        steering.limit(this.maxForce);
        this.applyForce(steering);
    }

    this.getDesired = function(target) {
        // "desired" is a vector from the current position to the target position
        return p5.Vector.sub(target, this.position);
    }

    this.update = function () {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit max velocity
        this.velocity.limit(this.maxSpeed); 
        // Update position 
        this.position.add(this.velocity);
        // Reset acceleration to recalculate it.
        this.acceleration.setMag(0);
    }

    this.display = function () {
        // Draw a triangle rotated in the direction of velocity
        var theta = this.velocity.heading() + PI / 2;
        fill(this.color.x, this.color.y, this.color.z);
        noStroke();
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.size * 2);
        vertex(-this.size, this.size * 2);
        vertex(this.size, this.size * 2);
        endShape(CLOSE);
        pop();
    }
}