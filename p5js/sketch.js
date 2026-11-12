
let cubes = [];
let cubeColor;

let cubeSize = 35;

// Physics parameters
let attractionStrength = 0.003;
let restorationStrength = 0.012;
let randomStrength = 0.12;
let damping = 0.94;
let maxSpeed = 4;

function setup() {
  createCanvas(710, 400, WEBGL);
  angleMode(DEGREES);
  strokeWeight(5);
  noFill();

  cubeColor = color(32, 8, 64);

  createCubes();
}

function draw() {
  background(250, 180, 200);

  orbitControl();

  stroke(cubeColor);

  let t = millis() * 0.0005;

  let target = getMousePosition();

  for (let cube of cubes) {
    updateCube(cube, target, t);
    drawCube(cube);
  }
}

// Initialize cubes in a spherical formation
function createCubes() {
  for (let zAngle = 0; zAngle < 180; zAngle += 30) {
    for (let xAngle = 0; xAngle < 360; xAngle += 30) {

      let x = -400 * cos(xAngle) * sin(zAngle);
      let y = 400 * cos(xAngle) * cos(zAngle);
      let z = 400 * sin(xAngle);

      let home = createVector(x, y, z);

      cubes.push({
        home: home.copy(),
        pos: home.copy(),
        vel: p5.Vector.random3D().mult(random(1, 2)),
        seed: random(1000)
      });
    }
  }
}

// Get mouse coordinates
function getMousePosition() {
  return createVector(
    mouseX - width / 2,
    mouseY - height / 2,
    0
  );
}

// Update cube physics
function updateCube(cube, target, t) {

  // Mouse attraction
  let attraction = p5.Vector.sub(target, cube.pos);
  attraction.mult(attractionStrength);

  // Restoration force
  let restore = p5.Vector.sub(cube.home, cube.pos);
  restore.mult(restorationStrength);

  // Random movement
  let randomForce = calculateRandomForce(cube, t);

  // Apply forces
  cube.vel.add(attraction);
  cube.vel.add(restore);
  cube.vel.add(randomForce);

  // Apply damping
  cube.vel.mult(damping);

  // Limit speed
  cube.vel.limit(maxSpeed);

  // Update position
  cube.pos.add(cube.vel);
}

// Calculate smooth random force
function calculateRandomForce(cube, t) {

  let force = createVector(
    noise(cube.seed, t) - 0.5,
    noise(cube.seed + 100, t) - 0.5,
    noise(cube.seed + 200, t) - 0.5
  );

  force.mult(randomStrength);

  return force;
}

// Draw individual cube
function drawCube(cube) {

  push();

  translate(
    cube.pos.x,
    cube.pos.y,
    cube.pos.z
  );

  rotateZ(cube.vel.heading());

  box(cubeSize);

  pop();
}

// Randomize color
function randomizeColor() {
  cubeColor = color(
    random(255),
    random(255),
    random(255)
  );
}

// Change color on mouse click
function mousePressed() {
  randomizeColor();
}
