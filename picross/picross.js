$(document).ready(function(){
    var MouseState = {isMouseDown: false, isEraseSelected: false};
    var puzzleSolution = [[]];
    //initializes mouse bindinds
    //mouseover conditions to consider clickdrags
    //mousedown conditions to consider both left and right clicks
    //contextmenu conditions to consider right clicks
    //mouseup to reset all conditions that may have applied
    function init(){
        $('#grid .row').on('mouseover', 'div.drawable',function(){
            console.log('moved over');
            if(MouseState.isMouseDown === true)
            {
            	processClick($(this));
            }
        });
        $('#grid .row').on('mousedown', 'div.drawable',function(){
            console.log('clicked');
            MouseState.isMouseDown = true;
            processClick($(this));
        });
        $('#grid .row').on('contextmenu', 'div.drawable',function(event){
        	console.log('right clicked');
        	MouseState.isEraseSelected = true;
        	processClick($(this));
        	event.preventDefault();
        });
        $('body').on('mouseup',function(){
            console.log('released');
            MouseState.isMouseDown = false;
            MouseState.isEraseSelected = false;
        });
    }
    
    //function takes in the object that was clicked/drag clicked and draws, or erases on that object
    //consults the MouseState object containing mouse states to decide whether to draw or erase
    //only class with 'drawable' will be able to be drawn on.
    function processClick($divObject)
    {
    	//erasing logic is as follows
    	//erase on a on spot turns to neutral
    	//erase on a neutral spot turns to off
    	//erase on an off turns back to neutral
        if(MouseState.isEraseSelected === true)
        {
            //revert back to neutral.
            if($divObject.hasClass('on') || $divObject.hasClass('off'))
            {
                $divObject.attr('class', '');
                $divObject.addClass('drawable');
            }
            else
            {
                $divObject.addClass('off');
            }
        }
        //draw condition is as follows
        //draw on a neutral spot turns to on
        //draw on a off spot does nothing (likely considered to be a misclick)
        //draw on an on spot does nothing
        else
        {
            if(!$divObject.hasClass('off'))
                $divObject.addClass('on');

            checkSolution();
        } 
    }
    
	//does a check of each row and col to see if they satisfy the requirements of the puzzle.
	function checkSolution(){
	    puzzleSolution;
	}
    
    //updates the appearance of the current action that's selected
    //TODO: default the icons selected to be none, update them in the processClick().
    //Have it take in an off, on, or neutral and have this function update the icons as needed.
    function selectIcon($icon){
        if(!$icon.hasClass('selected'))
        {
            $('.icon').each(function(index){$(this).toggleClass('selected');});
        }
        if($('#eraseIcon').hasClass('selected'))
        {
            MouseState.isEraseSelected = true;
        }
        else
        {
            MouseState.isEraseSelected = false;
        }
    }
    
    //importPuzzle takes in a string of numbers with , as delimiters
    //it'll reject the string if the string is malformed
    //the initial number indicates the length and width of the puzzle
    //all puzzles are perfect squares.
    function importPuzzle(puzzleString){
        if(typeof puzzleString === "string")
        {
            var tempArr = puzzleString.split(',');
            var puzzleArr = [[]];
            var dimension = tempArr[0];
            var tempArr = puzzleString.splice(0, 1);
            if((tempArr.length - 1) == tempArr[0] * tempArr[0])
            {
                //TODO: fill out this thing, its not even that hard
                //you're just crazy distracted.
                for(var i = 1; i < dimension; i++)
                {
                    for(var j = 0; j < dimension; j++)
                    {
                        
                    }
                }
            }
            else
            {
                throw "malformed puzzle string";
            }
        }
        else
        {
            throw "malformed puzzle string";
        }
    }
    
    //exportPuzzle takes what's currently on the grid, and turns it in to a string representation
    //it'll be a string of numbers with "," as delimiters 
    //the first number will be the dimension of the puzzle.
    //the puzzle will always be a perfect square.
    function exportPuzzle(){
        
    }
    
    
    
    init();
});