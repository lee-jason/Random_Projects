var SnakeWatch = function(){

	//need to create a rectangle the size of the browser width and height,
	//top bot 16 squares on all sides.
	var $snakeCanvas = $('#board');
	var snakeCanvas = $('#board')[0];
	var snakeContext = snakeCanvas.getContext("2d");
	snakeCanvas.width = $snakeCanvas.width();
	snakeCanvas.height = $snakeCanvas.height();
	
	var rowCount = 16;
	var colCount = 16;
	var blockWidth = snakeCanvas.width / colCount;
	var blockHeight = snakeCanvas.height / rowCount;
	//blockSize = digit between 0.01-1.00, to be used as a percentage of total box size
	var snakeBlockSize = .75;
	var snakeHeadBlockSize = .95;
	var snakeBlockWidth = blockWidth * snakeBlockSize;
	var snakeBlockHeight = blockHeight * snakeBlockSize;
	
	var appleBlockSize = .65;
	var appleBlockWidth = blockWidth * appleBlockSize;
	var appleBlockHeight = blockHeight * appleBlockSize;
	
	
	var eyeColor = "#805140";
	var tongueColor = "#FF4545";
	var appleColor = "#FF0055";
	var snakeColor = '#09FF00';
	var snakeHeadColor = '#00FF95';
	//eyeScale and tongueScale equals a percentage of the total box height or width, depending on which direction the snake is facing
	var eyeScale = .4;
	var tongueScale = .5;

	//single snake object that keeps track of the state of the board
	var snakeState = {
		length: 0,
		headLocation: 0,
		appleLocation: 0
	}
	
	//hours to Index enum to get the correct index mapping for the board
	//1 o clock maps to index 8 on the board
	//6 o clock maps to index 33 on the board and so on..
	var hoursToIndexEnum = [];
	hoursToIndexEnum[0] = 7;
	hoursToIndexEnum[1] = 12;
	hoursToIndexEnum[2] = 17;
	hoursToIndexEnum[3] = 22;
	hoursToIndexEnum[4] = 27;
	hoursToIndexEnum[5] = 32;
	hoursToIndexEnum[6] = 37;
	hoursToIndexEnum[7] = 42;
	hoursToIndexEnum[8] = 47;
	hoursToIndexEnum[9] = 52;	
	hoursToIndexEnum[10] = 57;
	hoursToIndexEnum[11] = 2;

	function initAnimation(){
		setInterval(function(){
			animate();
		}, 1000)
	}
	
	function animate()
	{
		updateState(new Date);
		//updateState(new Date(1,1,1980, 12, 5, 61));
		drawGrid();
		drawSnake(snakeState.length, snakeState.headLocation);
		drawApple(snakeState.appleLocation);	
	}
	
	function updateState(date)
	{
		var currentTime = date;
		var seconds = currentTime.getSeconds();
		var minutes = currentTime.getMinutes();
		var hours = currentTime.getHours() % 12;
		
		snakeState.length = minutes;
		snakeState.headLocation = (seconds + hoursToIndexEnum[hours % 12]) % 60;
		snakeState.appleLocation = hoursToIndexEnum[hours];
	}
	
	function drawGrid()
	{
		blockWidth = snakeCanvas.width / colCount;
		blockHeight = snakeCanvas.height / rowCount;
		snakeContext.strokeStyle = "#fff";
		snakeContext.fillStyle = "#000";
		
		snakeContext.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
		
		for(var i = 0; i < colCount; i++)
		{
			//cols
			if(i == 0 || i == 1)
			{
				//cols
				snakeContext.moveTo(i*blockWidth, 0);
				snakeContext.lineTo(i*blockWidth, snakeCanvas.height);
				
				//rows
				snakeContext.moveTo(0, i*blockHeight);
				snakeContext.lineTo(snakeCanvas.width, i*blockHeight);
				
				snakeContext.stroke();
			}
			//ultimate and penultimate full row lengths
			if(i == rowCount - 1 || i == rowCount)
			{
				snakeContext.moveTo(0, i*blockHeight);
				snakeContext.lineTo(snakeCanvas.width, i*blockHeight);
			}
			//ultimate and penultimate full col lengths
			if(i == colCount - 1 || i == colCount)
			{
				snakeContext.moveTo(i*blockWidth, 0);
				snakeContext.lineTo(i*blockWidth, snakeCanvas.height);
			}
			//col top
			snakeContext.moveTo(i*blockWidth, 0);
			snakeContext.lineTo(i*blockWidth, blockHeight);
			//col bot
			snakeContext.moveTo(i*blockWidth, blockHeight * (rowCount - 1))
			snakeContext.lineTo(i*blockWidth, blockHeight * rowCount)
			//row left
			snakeContext.moveTo(0, i*blockHeight);
			snakeContext.lineTo(blockWidth, i*blockHeight);
			//row right
			snakeContext.moveTo(blockWidth * (colCount - 1), i*blockHeight);
			snakeContext.lineTo(blockWidth * colCount, i*blockHeight);
		}
		snakeContext.stroke();
	}
	
	function drawSnake(length, headLocation){
		//private variable that will paint a spot a color
		//the way boxes are indexed is as follows
		//2d array where only the outer edges are filled.
		/*
			5x5
			[11][0][1][2]
			[10][ ][ ][3]
			[9 ][ ][ ][4]
			[8 ][7][6][5]
		*/
		//length can't be larger than 60
		//headLocation can't be smaller than 0, larger than 60
		if(length > 60 || length < 0 || headLocation < 0 || headLocation > 60)
		{
			throw "drawSnake: parameters too wild";
		}
		var endLocation = 0;
		(headLocation - length >= 0 ? endLocation = headLocation - length : endLocation = 60 + (headLocation - length))
		//when tail goes further back than index 0
		if(endLocation > headLocation)
		{
			for(var i = headLocation; i >= 0; i--)
			{
				drawSpot(i, snakeColor);
			}
			for(var i = 59; i > endLocation; i--)
			{
				drawSpot(i, snakeColor);
			}
		}
		//when end location finishes after index 0.
		else
		{
			for(var i = headLocation; i > endLocation; i--)
			{
				drawSpot(i, snakeColor);
			}
		}
		//repaint the head color as a different color to detect movement.
		drawSpot(headLocation, snakeHeadColor, true);
	}
	
	function drawApple(index)
	{
		drawSpot(index, appleColor)
	}
	
	function drawSpot(index, color, isHead){
		var color = color || "#fff";
		snakeContext.fillStyle = color;
		//step 1. find center of block
		//step 2. find top left of the snake fill block
		//step 3. draw the fill block
		//step 3.1 If head, draw the eyes and tongue in appropriate locations.
		
		
		//originPoint being the top left of the rectangle
		//TODO: find a better way to figure out the array to location, this is ridiculous
		var originX = 0;
		var originY = 0;
		
		var location = dotLocation(index);
		switch (location)
		{
			case "top":
			{
				originX = (index+1) * blockWidth;	
				originY = 0;
				break;
			}
			case "right":
			{
				originX = (colCount - 1) * blockWidth;
				originY = (index - 14) * blockHeight;
				break;
			}
			case "bottom":
			{
				originX = (44-index) * blockWidth;
				originY = (rowCount - 1) * blockHeight;
				break;
			}
			case "left":
			{
				originX = 0;
				originY = (59-index) * blockHeight;
				break;
			}
		}
		

		
		var centerX = originX + blockWidth/2;
		var centerY = originY + blockHeight/2;
		
		var snakeFillOriginX = centerX - snakeBlockWidth/2;
		var snakeFillOriginY = centerY - snakeBlockHeight/2;
		
		snakeContext.fillRect(snakeFillOriginX, snakeFillOriginY, snakeBlockWidth, snakeBlockHeight);
		
		//if its the headblock, draw the eyes and tongue
		if(isHead)
		{
			snakeContext.fillStyle = eyeColor;
			var eyeOffset = centerX;
			//snakeContext.fillRect(
		}
		
		//private function that returns if the dot is 'top' 'right' 'bottom' 'left'
		//dots on the edges will be indexed as one or the other, doesn't matter right now
		function dotLocation(index)
		{
			//top row
			if(index >= 0 && index <= 14)
			{
				return 'top';
			}
			//right row
			else if(index >= 15 && index <= 29)
			{
				return 'right';
			}
			//bot row
			else if(index >= 30 && index <= 44)
			{
				return 'bottom';
			}
			//left row
			else if(index >= 45 && index <= 59)
			{
				return 'left';
			}
		}
	}
	
	this.init = new function(){
		initAnimation();
	}
}

$(document).ready(function(){
	var snakeWatch = new SnakeWatch();
	//snakeWatch.animate();
})
