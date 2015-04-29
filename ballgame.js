window.requestAnimationFrame(update);
var display = document.getElementById("display");
document.onmousemove = function(e) {mouse.getPos(e);};

var score = 0;
var scoreHigh = getCookie("highScore");

var mouse = new Mouse();
var gs = new GameState();
var overlay = new Overlay();

function update() { //updates the game
  gs.update();
  overlay.update();
  window.requestAnimationFrame(update);
}

function Mouse() { //mouse object creator
  var x = 0;
  var y = 0;
  
  this.getPos = function(e) {
    x = e.clientX;
    y = e.clientY;
  };
  
  this.getx = function() {
    return x;
  };
  
  this.gety = function() {
    return y;
  };
}

function Ball() {//ball object creator
  var moveSpeed = 3;
  var size = 15;
  
  var x;
  var y;
  var dx;
  var dy;
  var dir;
  
  dir = floran(4);
  
  if(dir === 1) {
    y = 0;
    x = floran(960);
  }
  else if(dir === 2) {
    x = 0;
    y = floran(640);
  }
  else if(dir === 3) {
    y = 640;
    x = floran(960);
  }
  else if(dir === 4) {
    y = floran(640);
    x = 960;
  }
  
  var ball = document.createElement("DIV");
  ball.id = "ball";
  display.appendChild(ball);
  
  ball.style.width = size + "px";
  ball.style.height = size + "px";
  
  this.update = function() {
    this.calcDir();
    
    x += dx;
    y += dy;
    
    ball.style.left = x + "px";
    ball.style.top = y +"px";
    
    if(mouse.getx() >= x && mouse.getx() <= x+size && mouse.gety() >= y && mouse.gety() <= y+size) {
      gameOver();
    }
  };
  
  this.calcDir = function() {
    var angle = Math.atan2((y+size/2) - mouse.gety(),(x+size/2) - mouse.getx());
    
    dx = -Math.cos(angle)*moveSpeed;
    dy = -Math.sin(angle)*moveSpeed;
    
  };
  
  this.speedup = function() {
    moveSpeed += 0.1;
  };
}

function Laser() { //laser object creator
  var x = 0;
  var y = 0;
  var dir;
  var dx = 0;
  var dy = 0;
  var vel = 5;
  var width = 0;
  var height = 0;
  
  
  dir = floran(4);
  
  if(dir === 1) {
    dy = vel;
    x = floran(960);
    width = 15;
    height = 60;
  }
  else if(dir === 2) {
    dx = vel;
    width = 60;
    height = 15;
    y = floran(640);
  }
  else if(dir === 3) {
    width = 15;
    height = 60;
    dy = -vel;
    y = 640;
    x = floran(960);
  }
  else if(dir === 4) {
    width = 60;
    height = 15;
    dx = -vel;
    y = floran(640);
    x = 960;
  }
  
  var laser = document.createElement("div");
  laser.className = "laser";
  laser.style.width = width + "px";
  laser.style.height = height + "px";
  display.appendChild(laser);
  
  laser.style.left = x + "px";
  laser.style.top = y + "px";
  
  this.update = function() {
    if(dx !== 0) {
      x += dx;
      laser.style.left = x + "px";
    }
    else {
      y += dy;
      laser.style.top = y + "px";
    }
    
    if(mouse.getx() >= x && mouse.getx() <= x+width && mouse.gety() >= y && mouse.gety() <= y+height) {
      gameOver();
    }
    else if(x > 960 || x < 0 || y > 640 || y < 0) {
      display.removeChild(laser);
      return true;
    }
    else return false;
  };
  
}

function Button(id) { //button object creator
  var x = 0;
  var y = 0;
  var mouseOver = false;
  var timer = 0;
  var timeLimit = 20;
  var opacity = 1;
  var size = 20;
  var growthRate = 1;
  
  var button = document.createElement("DIV");
  button.className = "button";
  
  display.appendChild(button);
  
  button.style.opacity = 1;
  button.style.width = size + "px";
  button.style.height = size + "px";
  
  button.onmouseenter = function() {mouseOver = true;};
  button.onmouseleave = function() {mouseOver = false;};
  
  this.setPos = function(xPos, yPos) {
    x = xPos-size;
    y = yPos-size;
    button.style.left = x + "px";
    button.style.top = y + "px";
  };
  
  this.update = function() {
    if(mouseOver && timer <= timeLimit) {
      timer++;
      opacity -= 1/timeLimit;
      x -= growthRate/2;
      y -= growthRate/2;
      size += growthRate;
      button.style.opacity = opacity;
      button.style.left = x + "px";
      button.style.top = y + "px";
      button.style.width = size + "px";
      button.style.height = size + "px";
    }
    else if(timer >= 1) {
      timer --;
      opacity += 1/timeLimit;
      button.style.opacity = opacity;
      x += growthRate/2;
      y += growthRate/2;
      size -= growthRate;
      button.style.left = x + "px";
      button.style.top = y + "px";
      button.style.width = size + "px";
      button.style.height = size + "px";
    }
    if(timer === timeLimit) return id;
    return -1;
  };
}


function Overlay(t) { //overlay object creator, mainly used for screen effects.
  
  var timer = 0;
  var state = 0;
  
  var overlay = document.getElementById("overlay");
  
  this.update = function() {
    if(timer > 0) timer--;
    if(timer === 0 && state === 1) this.effect(0);
    if(state === 1) {
      overlay.style.opacity = timer*2/100;
    }
    if(state === 2 && mouse.getx() <= 960 && mouse.gety() <= 640) this.effect = 0;
  };
  
  this.effect = function(t) {
    state = t;
    switch(t) {
      case 0:
      overlay.style.zIndex = "-100";
        break;
      case 1:
        overlay.style.zIndex = "100";
        overlay.style.backgroundColor = "white";
        timer = 50;
        break;
      case 2:
        overlay.style.zIndex = "100";
        overlay.style.backgroundColor = "white";
        overlay.style.opacity = "0.5";
        break;
      case 3:
        break;
  }
  };
}


function GameState() { //handles game states, which determin what will happen in game
  var state;
  if(getCookie("highScore") === false) {
    state = new TutorialState();
    setCookie("highScore", 0, 365);
    scoreHigh = 0;
  }
  else state = new MenuState();//current state
  
  this.switch = function(s) {//changes current state
    if(s === -1) return;
    clearDisplay();
    switch(s) {
      case 0:
        state = new MenuState();
        break;
      case 1:
        state = new PlayState();
        break;
      case 2:
        state = new ScoreState();
        break;
      case 3:
        state = new LeaderState();
        break;
    }
  };
  
  this.update = function() {
    state.update();
  };
  
}

//each state is a different section of the game
function MenuState() {//the main menu
  
  var button =[new Button(1), new Button(3)];
 
  button[0].setPos(480,320);
  button[1].setPos(40,630);
  
  var title = document.createElement("DIV");
  title.id = "title";
  title.innerHTML = "You're the Mouse: The Game";
  display.appendChild(title);
  
  this.update = function() {
    for(var i = button.length-1; i >= 0; i--) {
      gs.switch(button[i].update());
    }
  };
}

function PlayState() {//the actual game
  var ball1 = new Ball();
  var lasers = [new Laser()];
  var timer = 0;
  var paused = false;
  score = 0;
  
  var counter = document.createElement("DIV");
  counter.id = "counter";
  display.appendChild(counter);
  
  this.update = function() {
    counter.innerHTML = score;
    if(paused && mouse.getx() <= 960 && mouse.gety() <= 640) {
      paused = false;
      overlay.effect(0);
    }
    else if((mouse.getx() > 960 || mouse.gety() > 640) && !paused) {
      overlay.effect(2);
      paused = true;
    }
    if(paused) return false;
    
    timer++;
    if(timer%15 === 0) lasers.push(new Laser());
    ball1.update();
    for(var i = 0; i < lasers.length; i++) {
      if(lasers[i].update()) {
        lasers.splice(i,1);
        score++;
      }
    }
    if(timer%60 === 0) ball1.speedup();
  };
}

function ScoreState() {//displays the local score and high score
  var scores = [];
  
  if(scoreHigh < score) {
    scoreHigh = score;
    setCookie("highScore", score, 365);
  }
  
  $.get("https://f.smtcs.rocks/files/brendant/getScore.php")
    .done(function(data) {
      scores = data.split(",");
      if(score > parseInt(scores[scores.length-1])) getName();
    });
  
  function getName() {
    for(i = 1; i < scores.length; i+=2) {
      if(score > parseInt(scores[i])) {
        id = prompt("You made a new high score! Enter 3 capital letters that will be displayed as your name.", "AAA");
        var letters = /^[A-Za-z]+$/;
        if(!id.match(letters) || id.length !== 3) {
            do {
              id = prompt("Illegal name", id);
            } while(!id.match(letters) || id.length !== 3);
        }
        id = id.toUpperCase();
        scores.splice(i-1,0,id,score);
        scores.pop();
        scores.pop();
        scores = scores.toString();
        $.post("https://f.smtcs.rocks/files/brendant/setScore.php", "input=" + scores);
        return;
      }
    }
  }
  
  var button = [new Button(1), new Button(3)];
  
  button[0].setPos(480,320);
  button[1].setPos(40,630);
  
  var dispScore = document.createElement("DIV");
  dispScore.innerHTML= score;
  dispScore.id = "score";
  display.appendChild(dispScore);
  
  var dispScoreHigh = document.createElement("DIV");
  dispScoreHigh.innerHTML = "High: " + scoreHigh;
  dispScoreHigh.id = "scoreHigh";
  display.appendChild(dispScoreHigh);
  
  this.update = function() {
    for(var i = button.length-1; i >= 0; i--) {
      gs.switch(button[i].update());
    }
  };
}

function LeaderState() {
  var scores = [];
    
  var title = document.createElement("DIV");
  title.innerHTML = "Leader Boards:<br/><br/>";
  title.className = "scores";
  display.appendChild(title);
    
  $.get("https://f.smtcs.rocks/files/brendant/getScore.php")
    .done(function(data) {
      scores = data.split(",");
      draw();
    });
    
  var button = [new Button(0)];
  
  button[0].setPos(40,630);
  
  function draw() {
    for(i = 0; i < scores.length; i+=2) {
        var score = document.createElement("DIV");
        score.innerHTML = scores[i] + ": " + scores[i + 1] + " pts";
        score.className = "scores";
        display.appendChild(score);
    }
  }
  
  this.update = function() {
    for(var i = button.length-1; i >= 0; i--) {
      gs.switch(button[i].update());
    }
  };
}

function TutorialState() {
  var text = document.createElement("P");
  text.id = "text";
  text.innerHTML = "Hello, and welcome to <i>You're the Mouse: The Game</i>! In this game, " +
  "You must make sure that your mouse cursor doesn't touch anything white. If it does, it's " +
  "game over! The longer you survive, the higher your score.<br/><br/>There are two types o" +
  "f obstacles: lasers, and the ball. lasers will just moves from one side of the screen to" +
  " the other, but the ball will follow your mouse, so you'll have to always be on your guard" +
  ".<br/><br/>Hover over the circle to exit the tutorial.";
  display.appendChild(text);
  
  var button = [new Button(0)];
  
  button[0].setPos(460,230);
  
  this.update = function() {
      gs.switch(button[0].update());
  };
}


function floran(range) {
  return Math.floor(Math.random()*range)+1;
}

function clearDisplay() {
  while(display.firstChild) {
    display.removeChild(display.firstChild);
  }
}

function gameOver() {
    //ends the game and exits to the score screen
  overlay.effect(1);
  gs.switch(2);
}


function setCookie(cname, cvalue, exdays) {
    //creates or changes a cookie | made by w3schools: http://www.w3schools.com/js/js_cookies.asp
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    //finds a cookie and returns the value | made by w3schools: http://www.w3schools.com/js/js_cookies.asp
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return false;
}