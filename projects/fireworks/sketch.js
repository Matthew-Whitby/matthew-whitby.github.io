var fireworks = [];
var gravity;

function setup(){
  createCanvas(400,300);
  gravity = createVector(0,0.2);
  stroke(255);
  strokeWeight(4);
}

function draw() {
  background(51);
  fireworks.push(new Firework());
  for each(firework in fireworks){
    firework.update();
    firework[i].show();
  }
  /*for (var i = 0;i < fireworks.length; i++){
    fireworks[i].update();
    fireworks[i].show();
  }*/

}
