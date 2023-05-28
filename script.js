var rows = 15;
var cols = 15;
var theHeight = window.innerHeight;
var cellSize = theHeight/rows;
var shapes = [];
var timer = rows;
var fallingBlock = 0;
var colorList = [[0, 255, 0], [237, 145, 33], [255, 0, 0], [148, 0, 211], [255, 255, 0], [20, 100, 255], [135, 206, 235]];

var shapesLibrary = [];
var room = 1;


var Cell = function(x, y) {
    this.x = x;
    this.y = y;
    this.wall = false;
};


var Grid = function() {
    this.cells = [];
    for (var i = 0; i < rows; i++) {
		this.cells[i] = [];
		for (var j = 0; j < cols; j++) {
			this.cells[i].push(new Cell(i*cellSize, j*cellSize));
		}
    }
};


var grid = new Grid();


var Shape = function(arrOfCells) {
    this.cellI = 0;
    this.cellJ = floor(random(1, width-1) / cellSize);
    this.color = [255, 255, 255];
    this.falling = true;
    this.cells = arrOfCells;
    
    
    this.hitsWall = function() {
        for (var i = 0; i < this.cells.length; i++) {
            
            var currCellI = this.cellI + this.cells[i][1];
            if (currCellI >= rows-1) {
                return true;
            }
            
            var currCellJ = this.cellJ + this.cells[i][0];
            if (grid.cells[currCellI + 1][currCellJ].wall) {
                return true;
            }
        }
        return false;
    };
    
    this.setAsWall = function() {
        for (var i = 0; i < this.cells.length; i++) {
            var currCellI = this.cellI + this.cells[i][1];
            var currCellJ = this.cellJ + this.cells[i][0];
            grid.cells[currCellI][currCellJ].wall = true;
        }
    };
    
    this.moveY = function() {

        if (this.hitsWall()) {
            this.falling = false;
            this.setAsWall();
        }
        if (this.falling) {
            this.cellI++;
        }
    };
    this.moveX = function(deltaX) {
        this.cellJ += deltaX;
        
        if (this.cellJ <= 0) {
            this.cellJ = 0;
        }
        
        if (this.cellJ >= cols-1) {
            this.cellJ = cols-1;
        }
    };
    
    this.getX = function(index) {
        return (this.cells[index][0]+this.cellJ)*cellSize;
    };
    
    this.getY = function(index) {
        return (this.cells[index][1]+this.cellI)*cellSize;
    };
    

    this.draw = function() {
        fill(...this.color);
        
        for (var i = 0; i < this.cells.length; i++) {
            noStroke();
            rect(this.getX(i), this.getY(i), cellSize-2, cellSize-2);
            fill(0, 0, 0, 50);
            rect(this.getX(i)+5, this.getY(i), cellSize-10, cellSize/8);
            rect(this.getX(i)+5, this.getY(i)+cellSize-6, cellSize-9, cellSize/8);
            triangle(this.getX(i)+5, this.getY(i)+cellSize-6, this.getX(i), this.getY(i)+cellSize, this.getX(i)+5, this.getY(i)+cellSize);
            triangle(this.getX(i)+cellSize-5, this.getY(i)+cellSize-6, this.getX(i)+cellSize-5, this.getY(i)+cellSize, this.getX(i)+cellSize, this.getY(i)+cellSize);
            rect(this.getX(i), this.getY(i), cellSize/8, cellSize);
            rect(this.getX(i)+cellSize-6, this.getY(i), cellSize/8, cellSize);
            fill(this.color);
        }
    };
};


var setupShapesLibrary = function() {
    //1. L
    shapesLibrary.push(new Shape([[0, 0], [0, 1], [0, 2], [1, 2]]));
    //2. ---
    shapesLibrary.push(new Shape([[0, 0], [1, 0], [2, 0]]));
    /*3. **
         **
    */
    shapesLibrary.push(new Shape([[0, 0], [1, 0], [0, 1], [1, 1]]));
    
    /* 4. *
          **
          *
    */
    shapesLibrary.push(new Shape([[0, 0], [0, 1], [1, 1], [0, 2]]));
    
    /* 5. *
          **
           *
    */
    
    shapesLibrary.push(new Shape([[0, 0], [0, 1], [1, 1], [1, 2]]));
    
    // 6. P
    shapesLibrary.push(new Shape([[0, 0], [0, 1], [0, 2], [1, 0], [1, 1]]));
    // 7. ]
    shapesLibrary.push(new Shape([[1, 0], [1, 1], [1, 2], [0, 0], [0, 2]]));
    
};


var drawCell = function(cell) {
    fill(0);
	stroke(70, 102, 255);
	strokeWeight(1);
	rect(cell.x, cell.y, cellSize-2, cellSize-2, 3);
};



var drawGrid = function() {
    for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			drawCell(grid.cells[i][j]);
		}
	}
};


var drawShapes = function() {
    for (var i = 0; i < shapes.length; i++) {
        shapes[i].draw();
        shapes[i].moveY();
    }
    
    if (timer === rows || !shapes[fallingBlock].falling) {
        timer = rows;
        var newShapeIndex = round(random(0, shapesLibrary.length-1));
        var newShape = Object.assign({},shapesLibrary[newShapeIndex]);
        newShape.color = colorList[floor(random(0, colorList.length - 0.001))];
        shapes.push(newShape);
        fallingBlock = shapes.length - 1;
    }
    
    if (timer > 0) {
        timer--;
    } else {
        timer = rows;
    }
};


var drawEveryThing = function() {
	frameRate(1.5);
    background(0);
    drawGrid();
    drawShapes();
};


var startScreen = function() {
    background(0);
    drawGrid();
    fill(255);
    textSize(theHeight/16);
    textAlign(CENTER, CENTER);
    text("Play!", theHeight/2, theHeight/2);
    text("(press a key for rules)", theHeight/2, theHeight/1.5);
    textSize((Math.sin(Date.now() / 500) * 300) * 2);
    fill(0, 255, 0);
    text("TETRIS", theHeight/2, theHeight/3);
};


var rulesScreen = function() {
    background(0);
    drawGrid();
    textSize(30);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Rules:\n\nPress side arrows to move.\nPress down to drop in the current column.\nAnd the most important rule of all,\nHAVE FUN!\n\n(Click to play)", theHeight/2, theHeight/2);
};


function setup() {
	createCanvas(theHeight, theHeight);
	//background
	setupShapesLibrary();
}




var draw = function() {
    if (room === 1) {
		frameRate(60);
        startScreen();
    } else if (room === 2) {
		frameRate(1.5);
        drawEveryThing();
    } else if (room === -1) {
		frameRate(60);
        rulesScreen();
    }
};


var keyPressed = function() {
    if (room === 1) {
        room = -1;
    }
    if (room === 2) {
        if (keyCode === 37) {
            shapes[fallingBlock].moveX(-1);
            drawEveryThing();      
        } else if (keyCode === 39) {
            shapes[fallingBlock].moveX(1);
            drawEveryThing();      
        } else if (keyCode === 40) {
            shapes[fallingBlock].moveY();
            drawEveryThing();      
        }
    }
};


var mouseClicked = function() {
    if (room === 1) {
        room = 2;
    }
    
    if (room === -1) {
        room = 2;
    }
};
