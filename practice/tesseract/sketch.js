var angle = 0;
var points = [];
var toggleXYZ = 0;
var button;

function setup() {
  colorMode(RGB);
  createCanvas(windowWidth,windowHeight,WEBGL);
  points.push(new P4Vector(-1, -1, -1, 1));
  points.push(new P4Vector(1, -1, -1, 1));
  points.push(new P4Vector(1, 1, -1, 1));
  points.push(new P4Vector(-1, 1, -1, 1));
  points.push(new P4Vector(-1, -1, 1, 1));
  points.push(new P4Vector(1, -1, 1, 1));
  points.push(new P4Vector(1, 1, 1, 1));
  points.push(new P4Vector(-1, 1, 1, 1));
  points.push(new P4Vector(-1, -1, -1, -1));
  points.push(new P4Vector(1, -1, -1, -1));
  points.push(new P4Vector(1, 1, -1, -1));
  points.push(new P4Vector(-1, 1, -1, -1));
  points.push(new P4Vector(-1, -1, 1, -1));
  points.push(new P4Vector(1, -1, 1, -1));
  points.push(new P4Vector(1, 1, 1, -1));
  points.push(new P4Vector(-1, 1, 1, -1));
  button = createButton('Change Spin Axis');
  button.position(0,0);
  button.mousePressed(changeSpinAxis);
}

function changeSpinAxis(){
  if(toggleXYZ == 0) toggleXYZ = 1;
  else if(toggleXYZ == 1) toggleXYZ = 2;
  else toggleXYZ = 0;
}

function draw() {
  background(0);
  //translate(width/2, height/2);
  if(toggleXYZ == 0) rotateY(-PI/2);
  else if(toggleXYZ == 1) rotateX(-PI/2);
  else rotateZ(-PI/2);
  var projected3d = []; //16

  for (var i = 0; i < points.length; i++) {
    var v = points[i];

    var rotationXY = [
      [cos(angle), -sin(angle), 0, 0],
      [sin(angle), cos(angle), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];

    var rotationZW = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, cos(angle), -sin(angle)],
      [0, 0, sin(angle), cos(angle)]
    ];

    var rotated = matmul4(rotationXY, v, true);
    rotated = matmul4(rotationZW, rotated, true);
    var distance = 2;
    var w = 1 / (distance - rotated.w);

    var projection = [
      [w, 0, 0, 0],
      [0, w, 0, 0],
      [0, 0, w, 0]
    ];

    var projected = createVector(0,0,0);
    projected = matmul(projection, rotated);
    console.log(projected);
    projected = createVector(projected[0][0],projected[1][0],projected[2][0]);
    projected.mult(windowWidth/8);
    projected3d.push(projected);

    stroke(255,255,0);
    strokeWeight(12);
    noFill();

    point(projected.x, projected.y, projected.z);
  }

  // Connecting
  for (var i = 0; i < 4; i++) {
    connect(0, i, (i+1) % 4, projected3d );
    connect(0, i+4, ((i+1) % 4)+4, projected3d);
    connect(0, i, i+4, projected3d);
  }

  for (var i = 0; i < 4; i++) {
    connect(8, i, (i+1) % 4, projected3d );
    connect(8, i+4, ((i+1) % 4)+4, projected3d);
    connect(8, i, i+4, projected3d);
  }

  for (var i = 0; i < 8; i++) {
    connect(0, i, i + 8, projected3d);
  }

  //angle = map(mouseX, 0, width, 0, TWO_PI);
  angle -= 0.02;
}

function connect(offset,i,j,points) {
  var a = points[i+offset];
  var b = points[j+offset];
  strokeWeight(3);
  stroke(255,0,0);
  line(a.x, a.y, a.z, b.x, b.y, b.z);
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}