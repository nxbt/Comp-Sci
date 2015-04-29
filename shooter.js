var tick = 0;
var keycode = [];
var leader = 0;
//noprotect

var gs = new GameState();

update();

function update() { //king of the update hirearchy
  tick++;
    
  gs.update();
  
  window.requestAnimationFrame(update);
}


function Player(i, left, right, up, down, shoot, strafe) {
  this.x = i === 1 ? 15:575;
  this.y = i === 1 ? 575:15;
  this.size = 10;
  this.health = 100;
  this.dir = 0;
  this.score = 0;
  
  var sTimer = 0;
  var dx = 0;
  var dy = 0;
  var currTile = [];
  var weapon  = new Weapon(1);
  var wwait = 0;
  
  //constants
  var acel = 2;
  var maxAcel = 3;
  var fric = 1;
    
  var image = document.createElement("DIV");
  image.id = "player"+i;
  image.style.width = this.size + "px";
  image.style.height = this.size + "px";
  document.body.appendChild(image);
    
  
  var scoreboard = document.createElement("DIV");
  scoreboard.className = "score";
  scoreboard.id = "player" + i + "score";
  scoreboard.innerHTML = this.score;
  document.body.appendChild(scoreboard);
  
  var healthborder = document.createElement("DIV");
  healthborder.className = "healthbar";
  healthborder.style.width = 100 + "px";
  healthborder.style.left = (i === 1 ? 0: 500) + "px";
  healthborder.style.backgroundColor = (i === 1 ? "#660000":"#000033");
  document.body.appendChild(healthborder);
  
  var healthbar = document.createElement("DIV");
  healthbar.className = "healthbar";
  healthbar.id = "player" + i + "health";
  healthbar.style.width = this.health + "px";
  healthbar.innerHTML = this.health;
  healthbar.style.left = (i === 1 ? 0: 600 - this.health) + "px";
  document.body.appendChild(healthbar);
  var ammocounter=document.createElement("DIV");
  ammocounter.className="ammocounter";
  ammocounter.id="player"+i+"ammo";
  ammocounter.style.left = (i === 1 ? 110: 410 ) + "px";
  ammocounter.style.textAlign = i === 1 ? "left":"right";
  ammocounter.innerHTML = weapon.ammo;
  document.body.appendChild(ammocounter);
  this.update = function() {
        
    if(keycode[left]) {dx -= acel; if(!keycode[strafe])this.dir = 2;}
    if(keycode[right]){dx += acel; if(!keycode[strafe])this.dir = 4;}
    if(keycode[up])   {dy -= acel; if(!keycode[strafe])this.dir = 3;}
    if(keycode[down]) {dy += acel; if(!keycode[strafe])this.dir = 1;}
    if(!keycode[left] && !keycode[right]) {
      if(dx > fric) dx -= fric;
      else if(dx < -fric) dx += fric;
      else dx = 0;
    }
    if((!keycode[up] && !keycode[down]) || (keycode[left] || keycode[right])) {
      if(dy > fric) dy -= fric;
      else if(dy < -fric) dy += fric;
      else dy = 0;
    }
    if(dx > maxAcel) dx = maxAcel;
    if(dx < -maxAcel) dx = -maxAcel;
    if(dy > maxAcel) dy = maxAcel;
    if(dy < -maxAcel) dy = -maxAcel;
    
    if(weapon.cWait === 0 && weapon.ammo > 0 && keycode[shoot]) {
      weapon.fire(i, this.dir,this.x+(this.size/2) - 3,this.y+(this.size/2) - 3);
    }
    if(weapon.cWait === -1 && !keycode[shoot]){
      weapon.stopFire(i, this.dir,this.x+(this.size/2) - 3,this.y+(this.size/2) - 3);
    }
    if(weapon.ammo === 0) {
      wwait ++;
      if(wwait === 80) {
        guns[weapon.id - 1] = true;
        weapon = new Weapon(1);
        wwait = 0;
      }
    }
    
    weapon.update();
    
    this.x += dx;
    this.y += dy;
    
    currTile = [Math.floor((this.x+this.size/2)/tileSize), Math.floor((this.y+this.size/2)/tileSize)];
    
    if(this.x < currTile[0] * tileSize && map.tile[currTile[1]][currTile[0] - 1] === 1) {
      this.x = currTile[0] * tileSize;
      dx = 0;
    }
    else if(this.x + this.size > (currTile[0] + 1) * tileSize && map.tile[currTile[1]][currTile[0] + 1] === 1) {
      this.x = (currTile[0] + 1) * tileSize - this.size;
      dx = 0;
    }
    if(this.y < currTile[1] * tileSize && map.tile[currTile[1] - 1][currTile[0]] === 1) {
      this.y = currTile[1] * tileSize;
      dy = 0;
    }
    else if(this.y + this.size > (currTile[1] + 1) * tileSize && map.tile[currTile[1] + 1][currTile[0]] === 1) {
      this.y = (currTile[1] + 1) * tileSize - this.size;
      dy = 0;
    }
    
    if(weapon.id === 1 && map.tile[currTile[1]][currTile[0]] >= 2 && guns[map.tile[currTile[1]][currTile[0]] - 1]) {
      weapon = new Weapon(map.tile[currTile[1]][currTile[0]]);
      guns[map.tile[currTile[1]][currTile[0]]-1] = false;
    }
    
    if(leader === i) {
      sTimer++;
      if(sTimer === 180) {
        this.score++;
        sTimer = 0;
      }
    }
    
    if(this.score >= 100) gs.switch(3);
    
    healthbar.style.width = this.health + "px";
    healthbar.style.left = (i === 1 ? 0: 600 - this.health) + "px";
    healthbar.innerHTML = this.health;
    scoreboard.innerHTML = this.score;
    ammocounter.innerHTML = weapon.ammo === 0 ? "Reloading...":weapon.ammo;
    
    if(this.health <= 0) {
      leader = i * -1 + 3;
      this.health = 100;
      this.x = i === 1 ? 15:575;
      this.y = i === 1 ? 575:15;
      guns[weapon.id - 1] = true;
      if(i === 1) player2.score+= 5;
      else player1.score+= 5;
      weapon = new Weapon(1);
    }
    
    image.style.left = this.x + "px";
    image.style.top  = this.y + "px";
  };
}

function Weapon(i) {
  this.cWait = 0;
  this.id = i;
  
  switch(i) {
    case 1://pistol
      this.damage = 20;
      this.speed = 6;
      this.maxAmmo = 20;
      this.ammo = this.maxAmmo;
      this.cDown = 5;
      this.update = function() {
        if(this.cWait > 0) this.cWait --;
      };
      this.fire = function(k, dir, x, y) {
        bullets.push(new Bullet(this.speed,dir * 90,this.damage,x,y,k));
        this.cWait = -1;
        this.ammo --;
      };
      this.stopFire = function(k, dir, x, y) {
        this.cWait = this.cDown;
      };
      break;
    case 2://sniper
      this.damage = 50;
      this.speed = 9;
      this.maxAmmo = 10;
      this.ammo = this.maxAmmo;
      this.cDown = 60;
      this.update = function() {
        if(this.cWait > 0) this.cWait --;
      };
      this.fire = function(k, dir, x, y) {
        bullets.push(new Bullet(this.speed,dir * 90,this.damage,x,y,k));
        this.cWait = -1;
        this.ammo --;
      };
      this.stopFire = function(k, dir, x, y) {
        this.cWait = this.cDown;
      };
      break;
    case 3://shootgun
      this.damage = 40;
      this.speed = 3;
      this.maxAmmo = 15;
      this.ammo = this.maxAmmo;
      this.cDown = 20;
      this.update = function() {
        if(this.cWait > 0) this.cWait --;
      };
      this.fire = function(k, dir, x, y) {
        bullets.push(new Bullet(this.speed,dir * 90,this.damage,x,y,k));
        bullets.push(new Bullet(this.speed,(dir * 90) + 5,this.damage,x,y,k));
        bullets.push(new Bullet(this.speed,(dir * 90) - 5,this.damage,x,y,k));
        this.cWait = -1;
        this.ammo --;
      };
      this.stopFire = function(k, dir, x, y) {
        this.cWait = this.cDown;
      };
      break;
    case 4://machinegun
      this.damage = 25;
      this.speed = 4;
      this.maxAmmo = 120;
      this.ammo = this.maxAmmo;
      this.cDown = 5;
      this.update = function() {
        if(this.cWait > 0) this.cWait --;
      };
      this.fire = function(k, dir, x, y) {
        bullets.push(new Bullet(this.speed,dir * (Math.random() * 4 + 88),this.damage,x,y,k));
        this.cWait = this.cDown;
        this.ammo --;
      };
      this.stopFire = function(k, dir, x, y) {};
      break;
    
  }
}

function Bullet(spd, dir, dmg, x, y, i) {
  var dx;
  var dy;
  var tick = 0;
  
  var image = document.createElement("IMG");
  image.className = "bullet";
  image.src = "https://f.smtcs.rocks/dexterh/boolet.png";
  image.style.transform = "rotateZ(" + dir + "deg)";
  document.body.appendChild(image);
  
  dx = Math.cos(dir*Math.PI/180) * spd;
  dy = Math.sin(dir*Math.PI/180) * spd;
  
  this.update = function() {
    
    x += dx;
    y += dy;
    
    if(i === 2 && x >= player1.x && x <= player1.x + player1.size && y >= player1.y && y <= player1.y + player1.size) {
      player1.health -= dmg;
      
      document.body.removeChild(image);
      return "ded";
    }
    
    if(i === 1 && x > player2.x && x < player2.x + player2.size && y > player2.y && y < player2.y + player2.size) {
      player2.health -= dmg;
      
      document.body.removeChild(image);
      return "ded";
    }
    
    if(map.tile[Math.floor(x/tileSize)][Math.floor(y/tileSize)] === 1) {
      document.body.removeChild(image);
      return "ded";
    }
    
    image.style.left = x + "px";
    image.style.top = y + "px";
  };
}

function TileMap() {
  
  //creates tile grid, from (0,0) - (39,39) 
  this.tile = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
               [1,0,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
               [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1],
               [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,0,0,1,0,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
               [1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1],
               [1,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1],
               [1,1,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
               [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,1,0,0,1,0,0,1,1,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
               [1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1],
               [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
               [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
  for(i = 0; i < this.tile.length; i++) {
    for(k = 0; k < this.tile[i].length; k++) {
      if(this.tile[i][k] !== 0) new Tile(k,i,this.tile[i][k]);
    }
  }
}

function Tile(x,y,id) {
  var size = tileSize;
  
  var image = document.createElement("IMG");
  image.src = id === 1 ? "https://f.smtcs.rocks/dexterh/PraiseJebus.png":id===2? "http://f.smtcs.rocks/dexterh/sniper.png":id===3?"http://f.smtcs.rocks/dexterh/shootgun.png":"http://f.smtcs.rocks/dexterh/spraygun.png";
  image.className = "tile";
  image.style.top = y * size + "px";
  image.style.left = x * size + "px";
  image.style.width = size + "px";
  image.style.height = size + "px";
  document.body.appendChild(image);
}

function GameState() {
  var state = new PlayState();
  
  this.update = function() {
    state.update();
  };

    
  this.switch = function(i) {
    document.body.innerHTML = "";
    switch(i) {
      case 1:
        state = new MenuState();
        break;
      case 2:
        state = new PlayState();
        break;
      case 3:
        state = new EndState();
        break;
    }
  };
}

function PlayState() {
  bullets = [];
  guns = [true, true, true, true];
  tileSize = 15;
  player1 = new Player(1,65,68,87,83,32,16);
  player2 = new Player(2,37,39,38,40,191,190);
  map = new TileMap();
  
  this.update = function() {
    player1.update();
    player2.update();
    for(i = 0; i < bullets.length; i++) {
      if(bullets[i].update() === "ded") {
        bullets.splice(i,1);
        i--;
      }
    }
  };
}

function EndState() {
  document.body.innerHTML = "Player " + leader + " wins!  ";
  var button = document.createElement("BUTTON");
  button.innerHTML = "restart game";
  button.addEventListener("click", function() {gs.switch(2);});
  document.body.appendChild(button);
  
  this.update = function() {
    
  };
}

document.onkeydown = function(e) {
  keycode[e.keyCode] = true;
};

document.onkeyup = function(e) {
  keycode[e.keyCode] = false;
};
