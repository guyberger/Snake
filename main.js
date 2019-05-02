
document.getElementById('restart').addEventListener("click", function()
{
    console.log('restarting');
    var restart_btn = document.getElementById('restart');
    restart_btn.style.display = 'none';
    startGame();
})

//Global settings variables 
var alive = true;
var speed = 100;    //miliseconds
var key_allowed = true;
var s;  // Snake

window.onkeyup = function(e) {
    if(!key_allowed) return;
    var key = e.keyCode ? e.keyCode : e.which;
    switch(key){
        case 37:    //left
            if(s.direction !== 'R')
                s.direction = 'L';
            break;
        case 38:    //up
            if(s.direction !== 'D')
                s.direction = 'U';
            break;
        case 39:    //right
            if(s.direction !== 'L')
                s.direction = 'R';
            break;
        case 40:    //down
            if(s.direction !== 'U')
            s.direction = 'D';
            break;
    }
    key_allowed = false;
}

function endGame(){
    alive = false;
    key_allowed = true;

    // remove the snake

    var snake = document.getElementsByClassName('fa-facebook');
    while(snake[0]){
        snake[0].parentNode.removeChild(snake[0]);
    }

    var food = s.food;
    var foodNode = document.getElementById('food-' + food[0] + '-' + food[1]);
    foodNode.parentElement.removeChild(foodNode);

    console.log('dead');

    var restart_btn = document.getElementById('restart');
    restart_btn.style.display = 'block';
}

//Box in which the snake moves and drawn
class Box{
    constructor(startx, starty){
        this.x = startx;
        this.y = starty;
        this.name = 'snake-' + startx + '-' + starty; 
    }
    draw(){
        var board = document.getElementById('game-board');
        var node = document.createElement('i');
        node.className = 'fab fa-facebook box';
        node.setAttribute("aria-hidden", "true");
        node.id = this.name;
        node.style.fontSize = '1.5em';
        //node.style.backgroundColor = 'black';
        node.style.left = this.x + 'px';
        node.style.top = this.y + 'px';
        board.appendChild(node);
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function drawBox(startx,starty){
    var board = document.getElementById('game-board');
    var node = document.createElement('div');
    node.className = 'box';
    node.id = 'box-' + startx + '-' + starty;
    
    // To see the board's boxes - uncomment
    /*
    var bgColor = node.style.backgroundColor;
    if(startx % 2 || starty % 2){
        node.style.backgroundColor = 'rgb(230, 245, 255)';
    }
    if(startx % 2 && starty % 2){
        node.style.backgroundColor = bgColor;
    }
    */
    node.style.backgroundColor = 'none';
    node.style.left = startx + 'px';
    node.style.top = starty + 'px';
    board.appendChild(node);
}


for(var i=0;i<500;i+=25){
    for(var j=0;j<500;j+=25){
        drawBox(i,j);
    }
}
class Snake{
    constructor(){
        var addbox = new Box(0,0);
        addbox.draw();
        this.food = [];
        this.boxes = [addbox];   //change 0,0 to a random value
        this.direction = 'R';
    }
    
    // Grow the snake one size
    grow(){
        var curr = this.boxes[0];
        var addx = 0;
        var addy = 0;
        switch(this.direction){
            case 'U':
                addy -= 25; break;
            case 'R':
                addx += 25; break;
            case 'D':
                addy += 25; break;
            case 'L':
                addx -= 25; break;
        }
        var addbox = new Box(curr.x + addx, curr.y + addy);
        this.boxes.unshift(addbox);
        if(this.isDead()) {
            this.boxes.shift();
            endGame();
        }
        else addbox.draw();
    }

    remove(){
        var len = this.boxes.length;
        var out = this.boxes.pop();
        var box = document.getElementById(out.name);
        box.parentNode.removeChild(box);
    }
    draw(){
        for(var i=0; i< this.boxes.length; i++){
            this.boxes[i].draw();
        }
    }

    // Check if the snake is dead
    isDead(){
        var head = this.boxes[0];
        if(head.x >= 500 || head.y >= 500 || head.x < 0 || head.y < 0)
            return true;
        for(var i=1; i<this.boxes.length; i++){
            if(head.x == this.boxes[i].x && head.y == this.boxes[i].y){
                return true;
            }
        }
        return false;
    }

    // Move the snake
    move(){
        this.grow();
        if(this.boxes[0].x === this.food[0] && this.boxes[0].y === this.food[1]){ //ate food
            s.food = plotNextFood();
        }
        else if(alive){
            this.remove();
        } 
    }
}

function plotFood(){
    var x = Math.floor(Math.random() * 20) * 25;    //between 0 - 475
    var y = Math.floor(Math.random() * 20) * 25;    //between 0 - 475
    var box = document.getElementById('box-' + x + '-' + y);
    var food = document.createElement('i');
    food.className = 'fa  fa-user-circle food';
    food.id = 'food-' + x + '-' + y;
    // food.style.left = x + 'px';
    // food.style.top = y + 'px';
    food.setAttribute("aria-hidden", "true");
    box.appendChild(food);
    return [x,y];
}



function plotNextFood(){
    var food = s.food;
    var foodNode = document.getElementById('food-' + food[0] + '-' + food[1]);
    foodNode.parentNode.removeChild(foodNode);
    return plotFood()
}


async function gameplay(){
    s.food = plotFood();
    while(alive){
        await sleep(speed);
        if(!alive) break;
        s.move();
        key_allowed = true;
    }
}

function startGame(){
    alive = true;
    s = new Snake();
    gameplay();
}

startGame();