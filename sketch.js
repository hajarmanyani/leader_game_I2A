let target;
let obstacles = [];
let vehicules = [];
let points = [];
let serpentActive = false;
let demo = "default";
let enEvasion = false;
let imgVaisseau;
let rectangle;
let sound;
let avoidanceForceMultiplierSlider;
let vitesseVehiculesSlider;

function preload() {
imgVaisseau = loadImage('assets/images/vaisseau.png');
soundFormats('mp3', 'ogg');
sound = loadSound('assets/sounds/sound.mp3');
}


function setup() {
createCanvas(windowWidth, windowHeight);

// Créer des curseurs pour régler les paramètres
//wanderRadiusSlider = createSlider(10, 100, 50);
avoidanceForceMultiplierSlider = createSlider(0, 2, 0.5, 0.01);
vitesseVehiculesSlider = createSlider(1, 10, 4, 0.1);

target = createVector(mouseX, mouseY);
vehicules.push(new Vehicle(100, 100, imgVaisseau));
obstacles.push(new Obstacle(width / 2, height / 2, 100, color(0, 255, 0)));

// Définir le rectangle (zone rouge) à la position initiale
rectangle = new Rectangle(width / 2 - 50, height / 2 - 50, 100, 100);

sound.setVolume(0.5); // Réglez le volume selon vos préférences
sound.loop(); // Jouer le son en boucle
}

function draw() {
background(0, 0, 0, 100);

// Mettez à jour la position du rectangle avec la position actuelle de la souris
rectangle.x = mouseX - rectangle.width / 2;
rectangle.y = mouseY - rectangle.height / 2;

// Dessiner le rectangle jaune transparent
rectangle.show();

// Mettez à jour la position de la cible après avoir ajouté le nouveau point
target = createVector(mouseX, mouseY);

// Ajouter le nouveau point après avoir mis à jour le rectangle et la cible
let offset = createVector(-50, 0);
let newPoint = p5.Vector.add(target, offset);
points.push(newPoint);

// Appliquer les comportements aux véhicules en fonction de la démo
switch (demo) {
  case "default":
    // Code pour la démo par défaut
    for (let i = 0; i < vehicules.length; i++) {
      vehicules[i].maxSpeed = vitesseVehiculesSlider.value(); // Utiliser la valeur du curseur pour définir la vitesse
      let targetPoint = newPoint; // Utilisez le point vert comme cible
      vehicules[i].applyBehaviors(targetPoint, obstacles, vehicules);
      vehicules[i].update();
      vehicules[i].show();
    }
    break;
  case "snake":
    // Code pour la démo du serpent
    vehicules.forEach((vehicle, index) => {
      let forceArrive;

      if (index == 0) {
        // C'est le 1er véhicule, il suit la cible/souris
        forceArrive = vehicle.arrive(target);
      } else {
        // les véhicules suivants suivent le véhicule précédent
        let vehiculePrecedent = vehicules[index - 1];
        forceArrive = vehicle.arrive(vehiculePrecedent.pos, 40);
      }

      // Ajouter la force d'évitement d'obstacles
      let avoidForce = vehicle.avoidObstacles(obstacles);

      avoidForce.mult(avoidanceForceMultiplierSlider.value()); // Utiliser la valeur du curseur
      vehicle.maxSpeed = vitesseVehiculesSlider.value();
      // On applique la force au véhicule
      vehicle.applyForce(forceArrive);
      vehicle.applyForce(avoidForce);

      // On met à jour la position et on dessine le véhicule
      vehicle.update();
      vehicle.show();
    });
    break;
}

// Vérifier si les véhicules entrent dans le rectangle
vehicules.forEach(v => {
  if (rectangle.contains(v)) {
    // Si les véhicules sont dans le rectangle, les éloigner rapidement
    let awayForce = createVector(random(-5, 5), random(-5, 5));
    awayForce.mult(10);
    v.applyForce(awayForce);
    enEvasion = true;  // Activer le mode évasion
  } else if (enEvasion) {
    // Si les véhicules ne sont plus dans le rectangle, revenir vers le point vert
    let seekForce = v.seek(newPoint);
    v.applyForce(seekForce);
    enEvasion = false;  // Désactiver le mode évasion
  }
});

// Dessiner le point vert
fill(0, 255, 0);
noStroke();
circle(newPoint.x, newPoint.y, 16);

// Dessiner le point rouge au centre de la largeur du rectangle
fill(255, 0, 0);
noStroke();
let centerX = rectangle.x + rectangle.width / 2;
let centerY = rectangle.y + rectangle.height / 2;
circle(centerX, centerY, 34);

// Dessiner la ligne entre le point rouge et le point vert
//stroke(255);
//line(centerX, centerY, newPoint.x, newPoint.y);

// Dessiner les obstacles
obstacles.forEach(o => {
o.show();
});
}

function mousePressed() {
obstacles.push(new Obstacle(mouseX, mouseY, random(30, 100), color(0, 255, 0)));
}

function keyPressed() {
if (key == "v") {
vehicules.push(new Vehicle(random(width), random(height), imgVaisseau));
} else if (key == "l") {
serpentActive = !serpentActive;
demo = "snake";
} else if (key == "d") {
Vehicle.debug = !Vehicle.debug;
} else if (key == "f") {
for (let i = 0; i < 10; i++) {
let v = new Vehicle(random(10, 20), random(height / 2 - 10, height / 2 + 10), imgVaisseau);
v.maxSpeed = 10;
v.color = "purple";
vehicules.push(v);
}
}
}

class Rectangle {
constructor(x, y, w, h) {
this.x = x;
this.y = y;
this.width = w;
this.height = h;
}

show() {
fill(255, 165, 0, 150);
noStroke();
rect(this.x, this.y, this.width, this.height);
}

contains(vehicle) {
return (
vehicle.pos.x > this.x &&
vehicle.pos.x < this.x + this.width &&
vehicle.pos.y > this.y &&
vehicle.pos.y < this.y + this.height
);
}
}