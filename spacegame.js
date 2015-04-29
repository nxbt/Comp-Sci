var tick = 0;
//noprotect
//grabs id's from the index.html and stores them as DOM elements
var display = document.getElementById("display");

var gs = new GameState();

update();//kickstarts the update functions

function update() {//king of the update hierachy, calls sub update functions
  tick++;
  
  gs.update();
  
  window.requestAnimationFrame(update);//begins the update again, after the screen refreshes.
}

function Player() {//prototype
  //variables
  this.x = 10000;
  this.y = 10000;
  this.dx = 0;
  this.dy = 0;
  this.dir = 0;
  this.alive = true;
    
  var animation = 0;
  
  //constants
  var acel = 0.3;
  var turnRate = 5;
  var maxSpeed = 5;
  var width = 40;
  var height = 40;
  this.radius = 20;
  
  //creates the HTML object of the player
  var image = document.createElement("IMG");
  image.id = "player";
  image.src = "https://f.smtcs.rocks/brendant/player.png";
  image.style.height = height + "px";
  image.style.width = width + "px";
  image.style.left = window.innerWidth/2 - width/2 + "px";
  image.style.top = window.innerHeight/2 - height/2 + "px";
  display.appendChild(image);
  
  this.update = function() {//sub-update
    if(animation <= 3) {
      if(space) {
        this.dx += Math.cos((this.dir * Math.PI)/180) * acel;
        this.dy += Math.sin((this.dir * Math.PI)/180) * acel;
      
        animation ++;
        if(animation === 3) animation = 0;
      }
        else animation = 0;
      if(right) {
        this.dir += turnRate;
        if(this.dir > 360) this.dir -= 360;
      }
      if(left) {
        this.dir -= turnRate;
        if(this.dir < 0) this.dir += 360;
      }
    }
    
    if     (animation === 0) image.src = "https://f.smtcs.rocks/brendant/player.png";
    else if(animation === 1) image.src = "https://f.smtcs.rocks/brendant/player2.png";
    else if(animation === 2) image.src = "https://f.smtcs.rocks/brendant/player3.png";
    else if(animation === 4) image.src = "https://f.smtcs.rocks/brendant/ship3.png";
    else if(animation === 5) image.src = "https://f.smtcs.rocks/brendant/ship4.png";
    else if(animation === 6) image.src = "https://f.smtcs.rocks/brendant/ship5.png";
    else if(animation === 7) image.src = "https://f.smtcs.rocks/brendant/ship6.png";
    else if(animation === 8) image.style.display = "none";
      
      if(animation >= 4) {
          animation += 0.25;
      }
      
    //updates the players position
    this.x += this.dx;
    this.y += this.dy;
    
    //boundary
    if(this.x < 0){
      this.x = 0;
      this.dx = 0;
    }
    else if (this.x > 20000){
      this.x = 20000;
      this.dx = 0;
    }
    if(this.y < 0){
      this.y = 0;
      this.dy = 0;
    }
    else if (this.y > 20000){
      this.y = 20000;
      this.dy = 0;
    }
    
    image.style.transform = "rotateZ(" + this.dir + "deg)";
  };
  
  this.dead = function() {
    animation = 4;
    this.alive = false;
  };
  
  //moves the player to the center of the screen if the window's resized.
  window.onresize = function() {
      image.style.left = window.innerWidth/2 - width/2 + "px";
      image.style.top = window.innerHeight/2 - height/2 + "px";
    };
}

function Missile() {//prototype
  //variables
  this.x = 0;
  this.y = 0;
  this.dx = 0;
  this.dy = 0;
  this.dir = 0;
}

function Asteroid(){//prototype
  //variables
  this.x = Math.random() * 20000;
  this.y = Math.random() * 20000;
  this.dx = 0;
  this.dy = 0;
  this.dir = Math.floor(Math.random()*360);
  
  //constants
  var spin = Math.random() * 6 -3;
  var speed = Math.random() * 6;
  var width = 100;
  var height = 100;
  this.radius = 40;

  //creates the HTML object of the asteroid
  var image = document.createElement("IMG");
  image.className = "asteroid";
  image.src = "https://f.smtcs.rocks/brendant/asteroid1.png";
  image.style.height = height + "px";
  image.style.width = width + "px";
  image.style.transform = "rotateZ(" + (this.dir*180)/Math.PI + "deg)";
  image.style.top = this.y - player.y + "px";
  image.style.left = this.x - player.x + "px";
  display.appendChild(image);
 
  //sets vector speed
  this.dx = Math.cos(this.dir*Math.PI/180)*speed;
  this.dy = Math.sin(this.dir*Math.PI/180)*speed;
  
  this.update = function() {
    
    this.dir+= 1;
    image.style.transform = "rotateZ(" + this.dir + "deg)";
    
    //moves the asteroid
    this.x += this.dx;
    this.y += this.dy;
    
    //checks for player collision
    if(Math.sqrt(Math.abs((this.x + width/2) - (player.x + window.innerWidth/2))*Math.abs((this.x + width/2) - (player.x + window.innerWidth/2)) +
                 Math.abs((this.y + height/2) - (player.y + window.innerHeight/2))*Math.abs((this.y + height/2) - (player.y + window.innerHeight/2))) <
                 this.radius + player.radius && player.alive) {
      explosion_s.play();
      player.dead();
      window.setTimeout(function() {gs.switch(1);}, 2000);
    }
    
    //updates the image
    image.style.top = this.y - player.y + "px";
    image.style.left = this.x - player.x + "px";
 };
 
}


function Background(p) {
  var image = document.createElement("DIV");
  image.className = "background";
  image.style.top = -player.y/p + "px";
  image.style.left = -player.x/p + "px";
  display.appendChild(image);
  
  this.update = function() {
    image.style.top = -player.y/p + "px";
    image.style.left = -player.x /p + "px";
  };
}

function load_s(src) {
  var sound = document.createElement("AUDIO");
  sound.src = src;
  display.appendChild(sound);
  return sound;
}

function GameState() {
  var state = new MenuState();
  
  this.update = function() {
    state.update();
  };
  
  this.clear = function() {
    display.innerHTML = "";
  };
  
  this.switch = function(i) {
    this.clear();
    switch(i) {
      case 1:
        state = new MenuState();
        break;
      case 2:
        state = new PlayState();
        break;
      case 3:
        break;
    }
  };
}

function MenuState() {
  button = document.createElement("DIV");
  //PRETTYYYYY
  button.className = "button";
  button.onclick = function() {gs.switch(2);};
  button.innerHTML = "Start Game";
  display.appendChild(button);
  this.update = function() {
    
  };
}

function PlayState() {
  player = new Player();
  asteroids = [];
  stars = [new Background(2), new Background(3), new Background(4)];
  explosion_s = load_s("https://f.smtcs.rocks/brendant/Explosion.wav");
  
  this.update = function() {
    player.update();
  
  for(i = 0; i < asteroids.length; i++) {
    asteroids[i].update();
  }

  for(i = 0; i < stars.length; i++) {
    stars[i].update();
  }
  
  if(tick%10 === 0) {
    asteroids.push(new Asteroid());
  }
  };
}

//key events
var space = false;
var left = false;
var right = false;

//reads a key press, and starts the correct event
document.addEventListener("keydown", function(e) {
  if(e.keyCode == 37) left = true;
  if(e.keyCode == 39) right = true;
  if(e.keyCode == 32) space = true;
});

//reads a key release, and ends the correct event
document.addEventListener("keyup", function(e) {
  if(e.keyCode == 37) left = false;
  if(e.keyCode == 39) right = false;
  if(e.keyCode == 32) space = false;
});