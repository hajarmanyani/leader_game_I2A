# Compte Rendu de Projet - Comportements de Véhicules avec p5.js
# Réalisé par: Manyani Hajar
# Site: EMSI Casablanca

<h3>Introduction</h3>
<p>Ce mini-projet vise à implémenter différents comportements pour des véhicules animés sur un canevas HTML5 en utilisant la bibliothèque p5.js. Les comportements incluent le suivi d'un leader, l'évitement d'obstacles, le comportement wander, et l'interaction avec les bords de l'écran. <br>Les utilisateurs peuvent également ajuster les paramètres à l'aide de curseurs.</p>

<h3>Partie 1: Suivre un leader</h3>
<h4>Le leader a par exemple un comportement arrive et suit la souris</h4>
<p>Au début du code, un véhicule est créé pour servir de leader :</p>
<b>vehicules.push(new Vehicle(100, 100, imgVaisseau));</b>
<p>Dans la boucle draw() et en fonction du mode de démonstration (demo), le comportement du leader est défini :</p>
<b>switch (demo) {
  <br/>case "default":
    <br/>// Pour la démo par défaut, le leader suit la position de la souris
     <br/>for (let i = 0; i < vehicules.length; i++) {
      <br/>vehicules[i].maxSpeed = vitesseVehiculesSlider.value();
      <br/>let targetPoint = newPoint; // Utilisation du point vert comme cible
      <br/>vehicules[i].applyBehaviors(targetPoint, obstacles, vehicules);
      <br/>vehicules[i].update();
      <br/>vehicules[i].show();
    <br/>}
    <br/>break;
<br/>}</b>
<p>Dans la classe Vehicle, la méthode arrive(target) est utilisée pour définir le comportement du leader qui suit la souris :</p>
<b>arrive(target) {
  <br/>let force = p5.Vector.sub(target, this.pos);
  <br/>let desiredSpeed = this.maxSpeed;
  <br/>force.setMag(desiredSpeed);
  <br/>force.sub(this.vel);
  <br/>force.limit(this.maxForce);
  <br/>return force;
<br/>}</b>
<p>Explication du Comportement Arrive:</p>
<b><p>***La méthode arrive(target) calcule un vecteur de force (force) en soustrayant la position du leader (this.pos) de la position de la cible (target)</p>
<p>***Elle ajuste la vitesse désirée en fonction de la distance entre le leader et la cible. Si la distance est inférieure à un certain seuil (slowRadius), la vitesse est réduite progressivement.</p>
<p>***Ensuite, la force est réglée à une magnitude égale à la vitesse désirée et est limitée par le maximum de force (this.maxForce). Cette force est renvoyée pour être utilisée dans le calcul de la nouvelle accélération du leader.</p>
<p>Cette partie du code permet au leader de suivre la souris en utilisant un comportement arrive pour ajuster sa vitesse en fonction de la distance à la cible, assurant ainsi un mouvement en douceur et fluide.</p></b>
<br/>
<h4>Rester avec le leader : comportement arriver sur une cible (le leader, ou plutôt un point derrière le leader est la cible)</h4>
<p>***Plutôt que de suivre directement la position du leader, chaque véhicule suivant choisit comme cible un point situé derrière le leader.</p>
<p>***Cette cible est déterminée par la méthode arrive avec la position du leader comme argument</p>
<p>***Les véhicules suivants appliquent le comportement d'arrivée à cette cible, ce qui les incite à se déplacer vers ce point derrière le leader.</p>
<br/>
<h4>Ne pas se mettre devant le leader: comportement évasion quand on est dans la zone devant le leader</h4>
<p>***La méthode avoid est appelée pour chaque véhicule dans la fonction principale applyBehaviors.</p>
<p>***La position du point à l'avant du véhicule (pointAuBoutDeAhead) est calculée en utilisant la vélocité du véhicule.</p>
<p>***La méthode getObstacleLePlusProche est utilisée pour obtenir l'obstacle le plus proche du véhicule.</p>
<p>***Si un obstacle est détecté dans la zone définie devant le véhicule, une force d'évasion est appliquée pour éviter la collision.</p>
<p>***La force résultante est renvoyée pour être appliquée au véhicule.</p>
<br/>
<h4>Garder ses distances avec les autres: comportement séparation quand on est derrière.</h4>
<p>***La méthode separate est appelée dans la fonction principale applyBehaviors pour chaque véhicule.</p>
<p>***Elle prend en paramètre le tableau de tous les autres véhicules (boids).</p>
<p>***La variable desiredseparation définit la distance minimale souhaitée entre les véhicules pour éviter la collision.</p>
<p>***La boucle parcourt tous les autres véhicules pour calculer la distance et la direction par rapport au véhicule actuel.</p>
<p>***Si la distance est inférieure à la séparation souhaitée, une force de séparation est calculée en ajoutant la direction inverse pondérée par la distance.</p>
<br/>
<h3>Curseurs pour régler les paramètres</h3>
<p>***<b>avoidanceForceMultiplierSlider</b> : C'est le curseur associé à un coefficient multiplicateur pour la force d'évitement d'obstacles. Il va de 0 à 2, avec une valeur initiale de 0.5 et un pas de 0.01.</p>
<p>***<b>vitesseVehiculesSlider</b> : C'est le curseur associé à la vitesse des véhicules. Il va de 1 à 10, avec une valeur initiale de 4 et un pas de 0.1.</p>
<br/>
<h3>Tous les véhicules doivent éviter les obstacles</h3>
<p>J'ai utilisé la fonction avoid, qui calcule la force nécessaire pour éviter les obstacles environnants. Cette force est ensuite appliquée au véhicule. L'idée est que chaque véhicule prend en compte la présence d'obstacles et ajuste son mouvement pour éviter les collisions.<br/>
Cette fonction est appelée pour chaque véhicule dans la boucle de dessin (draw), contribuant ainsi à l'effet global où tous les véhicules interagissent avec les obstacles pour éviter les collisions.</p>
<br/>
<h3>En tapant une touche ou en cliquant avec la souris, on change le comportement des suiveurs</h3>
<p>Lorsque la touche "l" est pressée, la variable serpentActive est inversée, ce qui active ou désactive le mode serpent. En conséquence, la démo est définie sur "snake", entraînant un changement dans le comportement des véhicules pour suivre le leader à la queue leu leu.</p>
<img width="677" alt="Capture1" src="https://github.com/hajarmanyani/leader_game_I2A/assets/93662714/df008110-2704-466f-b737-bba030d067e8">
<br/>
<h3>Les véhicules ayant le comportement "wander"</h3>
<p>Le comportement "wander" (errance aléatoire) dans le contexte du code s'exprime principalement dans la fonction wander de la classe Vehicle. </p>
<p>***On génère un vecteur aléatoire qui représente une direction dans laquelle le véhicule va errer.</p>
<p>***On normalise ce vecteur pour assurer une magnitude constante.</p>
<p>***On le multiplie par le rayon de l'errance (wanderRadius) pour étendre la portée de l'errance.</p>
<p>***On ajuste la direction finale en utilisant la fonction seek pour diriger le véhicule vers le nouveau point.</p>
<br/>

