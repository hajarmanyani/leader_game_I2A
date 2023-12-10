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
