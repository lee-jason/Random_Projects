
//TODO: there's a bug where after around 10 minutes, the text thing just barfs out like all the previous texts in the past 3 minutes multiple times..
//WHY WHY.. I think set interval is to blame or something.asdklfjasdkl;vnh
//or just say, if there's an overflow, don't write out the textaskl;djfasdkl;f
nicoNicoTwitch = function(){
	var helper = {
		//min inclusive, max exclusive
		getRandomInt: function(min, max) {
		  return Math.floor(Math.random() * (max-1 - min + 1) + min);
		},
		//gets me the time in the future at which point the text will begin its exit.
		textStartExitTime: function(textObj){
			var now = Date.now();
			//the amount of time it takes to process a frame * the # of frames that text will take to begin to reach the other side
			return now + parseInt((1000/fps)*(nicoCanvas.width / textObj.velocity));
		},
		//gets me the time in the future at which point the text will finish its exit.
		textEndExitTime: function(textObj){
			var now = Date.now();
			//the amount of time it takes to process a frame * the # of frames that the text will finish its exit
			return now + parseInt((1000/fps)*((nicoCanvas.width + textObj.width) / textObj.velocity));
		},
		stackTop: function(array){
			if(array.length >0)
			{
				return array[array.length-1]
			}
			else 
				return undefined;
		}
	}
	
	var emoticonUrlMap = [];
	var FLASH_COMMAND_BAR_HEIGHT = 25
	var $videoScreen = $('#player');
	var vidWidth = parseFloat($videoScreen.css('width'));
	var vidHeight = parseFloat($videoScreen.css('height')) - FLASH_COMMAND_BAR_HEIGHT; // -25 to make up for flash's command bar on bottom
	
	//the amount of frames per second you want the thing to run at
	var fps = 30;
	

	var $nicoCanvas = $('<canvas/>', {id: 'nicoOverlay', width: vidWidth, height: vidHeight, css: 'z-index:1000; position:absolute; top:0px; left:0px'});
	$nicoCanvas.css('z-index', 1000);
	$nicoCanvas.css('position', 'absolute');
	$nicoCanvas.css('top', '0px');
	$nicoCanvas.css('left', '0px');
	$videoScreen.append($nicoCanvas);
	var nicoCanvas = document.getElementById('nicoOverlay');
	//have to reset the width and height of canvas since jquery doesn't seem to do it for you.
	//default new canvas is 300width, 150height, which is not what we want.
	nicoCanvas.width = vidWidth;
	nicoCanvas.height = vidHeight;
	
	var nicoContext = nicoCanvas.getContext("2d");
	
	
	//code for drawing a border
	nicoContext.rect(0, 0, nicoCanvas.width, nicoCanvas.height);
	nicoContext.strokeStyle = '#FF00F0'
	nicoContext.lineWidth = 3;
	nicoContext.stroke();
	
	
	//so in this implementation of mimicking niconico, an array of text.  The amount of values will be the height of the video player divided by the size of the text? +- some margin
	//incoming text can only be queued for each index if the current text in the same line has completly exited before the beginning of queued line touches the beginning.  multiple text on same line should never collide.
	
	var TextObject = function(text, posX, posY, width, velocity, color){
		this.text = text || "";
		this.posX = posX || nicoCanvas.width;
		this.posY = posY || 0;
		this.width = width || 0;
		this.velocity = velocity || 0;
		this.color = color || "yellow";
	}
	//constant textBaseline being top. and the font. probably will change in future.
	nicoContext.textBaseline = "top";
	nicoContext.font = "bold 24px sans-serif";
	nicoContext.strokeStyle = '#000000';
	nicoContext.lineWidth = 1;
	
	//2d array that holds text objects.  each index can hold a list of text Objects. 
	//pre fill textObj Array with another set of arrays so that we can easily use array methods on it
	//pre fill textListTimer with 0 seconds to let insertText know the rows are empty
	//the purpose textListTimer is for insertText to easily know which array has time available.  It'll always show the latest exit time for each respective row
	var textRowHeight = 30;
	var textObjArray = [];
	var textListTimer = [];
	var EMOTE_PIXEL_WIDTH = 30;
	//initialize each textObjArray entry with an empty array.
	for(var i = textRowHeight; i <= nicoCanvas.height; i+= textRowHeight)
	{
		textObjArray.push([]);
		//need to divide by textRowHeight since that'll give me the count of how many times it ran through this loop.
		textListTimer[(i/textRowHeight) - 1] = 0;
	}
	
	//this function will appropriately assign text to the correct row such that
	//1. new text shall be placed as close to the top as possible
	//2. text should never overlap each other.
	function insertText(text, color){
		var tempTextObj = new TextObject();
		textPreProcObj = textPreProcess(text);
		tempTextObj.text = textPreProcObj.text;
		//the way width needs to be calculated needs to also consider the space that the emotes take up.
		//lets say that each emote is constant EMOTE_PIXEL_WIDTH for now. In the future, should create an emote object that identifies the width of the img.
		tempTextObj.width = nicoContext.measureText(text).width + (textPreProcObj.emoteCount * EMOTE_PIXEL_WIDTH);
		//speed is calculated post text process, emotes are calculated to be around 8 characters long. current speed setup is longer text moves across the screen faster.
		if(tempTextObj.text.length < 30){
			tempTextObj.velocity = helper.getRandomInt(3,6);
		}
		else if(tempTextObj.text.length < 60){
			tempTextObj.velocity = helper.getRandomInt(5,9);
		}
		else{
			tempTextObj.velocity = helper.getRandomInt(8, 13);
		}
		//default color is white, but color should change based on what the user's color is.
		tempTextObj.color = color || "#ffffff";
		
		
		var startExitTime = helper.textStartExitTime(tempTextObj);
		var endExitTime = helper.textEndExitTime(tempTextObj);
		
		for(var i = 0, length = textListTimer.length; i < length; i++)
		{
			//only able to add to current row if the two texts will never overlap.
			//what this means is that the second statement can't be faster than the first
			//the second statement can't come out while the first one is still being spewed, if there is a first one to begin with.
			if((startExitTime > textListTimer[i]))
			{
				if(helper.stackTop(textObjArray[i]) != undefined)
				{
					if((helper.stackTop(textObjArray[i]).posX + helper.stackTop(textObjArray[i]).width) < nicoCanvas.width)
					{
						tempTextObj.posY = textRowHeight * i;
						textObjArray[i].push(tempTextObj);
						textListTimer[i] = endExitTime;
						return i;
					}
					else
					{
						//this is the valley of continues where the first statement is still being spewed, go to the next row
						continue;
					}
				}
				else
				{
					tempTextObj.posY = textRowHeight * i;
					textObjArray[i].push(tempTextObj);
					textListTimer[i] = endExitTime;
					return i;
				}
			}
		}
		//if we weren't able to find a good area to put the new text, pick one row at random and just stuff it in there.
		//yeah its going to overlap but.. who cares.
		//actually if we can't find a good area to put the new text, just ignore it. code commented out jsut incase if I want to change it later.
		/*
		var randomRow = helper.getRandomInt(0, textObjArray.length);
		tempTextObj.posY = textRowHeight * randomRow;
		textObjArray[randomRow].push(tempTextObj);
		textListTimer[randomRow] = endExitTime;
		*/
		return;
	}
	
	//this function will apply some pre-processing to the text to remove any html from emoticons and replacing it with a placeholder
	//will replace all emoticon spans with @@\w||| where ## is the number emoticon. will also check and if new emoticons need to be added to the emoticonUrlMap
	//emoticons come in this form <img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/30259/1.0" alt="HeyGuys" title="HeyGuys"> <img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/86/1.0" alt="BibleThump" title="BibleThump">
    //"<img class=\"emoticon\" src=\"http://static-cdn.jtvnw.net/emoticons/v1/30259/1.0\" alt=\"HeyGuys\" title=\"HeyGuys\"> <img class=\"emoticon\" src=\"http://static-cdn.jtvnw.net/emoticons/v1/86/1.0\" alt=\"BibleThump\" title=\"BibleThump\">"
	
	//since parsing through reg exp is a pain here's how its going to go down
	//create an array of the numbers you find in the <span>s by looping through the text.  that'll be stored in emoteNumArr
	//then go back through the text the same amount of times that the emoteNumArr.length and put the replacement string in with the numbers
	//stupid right? there has to be a better way.

    
    
	//turns out we need to return the updated text, as well as the amount of emotes are in the sentence.
    var extractEmoteUrl = /<img class="emoticon".*?src="(.+?)".*?title="(\w+)".*?>/g;
	var emoticonSpanHtmlRegExp = /<img.+?>/;
	function textPreProcess(text){
		var filteredText = text;
		var emoteKeyArr = [];
        var currEmoteUrlKey = [];
		var emoteCount = 0;
		if(emoticonSpanHtmlRegExp.test(filteredText))
		{
			//programming note: getting multiple instances of a reg exp match requires you to place a /g global and go through the exec multiple times until you hit a null, how is that acceptable...
			while((currEmoteUrlKey=extractEmoteUrl.exec(filteredText)) !== null)
			{
                addToEmoteMap(currEmoteUrlKey[2], currEmoteUrlKey[1]);
				//push the second index since exec captures returns the complete match then the captured match........
				emoteKeyArr.push(currEmoteUrlKey[2]);
			}
			for(var i = 0, emoteLength = emoteKeyArr.length; i < emoteLength; i++)
			{
				filteredText = filteredText.replace(emoticonSpanHtmlRegExp, "@@"+emoteKeyArr[i]+"|||");
			}
			emoteCount = emoteLength;
		}
		return {text: filteredText, emoteCount: emoteCount};
	}
    
    //simple function adds keyword and url to emoticonUrlMapping if it doesn't exist yet.
    function addToEmoteMap(keyword, url){
        if(!emoticonUrlMap[keyword]){
            emoticonUrlMap[keyword] = url;
        }
    }


		//animate takes in that 2d array of strings and processes it,
		//removes strings when they reach the end are not visible.
		//also interprets image icons and displays those instead of string.
		//split the text string to catch emotes tokens @@\w+|||
		//print the array and in between each split, insert the image.
		//TODO: issue with the animate in that 
		var emoteTokenRegExpYesCap = /@{2}(\w+)\|{3}/g;
		var emoteTokenRegExpNoCap = /@{2}\w+\|{3}/g
		window.requestAnimFrame = (function(callback) {
			return function(callback) {window.setTimeout(callback, 1000 / fps);};
		})();
      function animate() {
	  
	    // clear
        nicoContext.clearRect(0, 0, nicoCanvas.width, nicoCanvas.height);
	  
        // update AND draw in the same step..?
		for(var i = 0, textArrayLength = textObjArray.length; i < textArrayLength; i++)
		{
			for(var j = 0, textRowLength = textObjArray[i].length; j < textRowLength; j++)
			{
				
				var textObject = textObjArray[i][j];
				//prevents stuff from crashing if the textObject is removed from a previous frame.
				if(textObject)
				{
					var textSplit = textObject.text.split(emoteTokenRegExpNoCap);
					//draw for each split,
					//step 1. print the stuff at the location of posX
					//step 2. calculate the location of the end of the string, keep a running pointer of the width of the building string
					//step 3. print the image (if available) at the current running width.
					//step 4. update the location of the end of the string by adding the constant EMOTE_PIXEL_WIDTH
					//note: this width is different from the textObject.width in that the textObject.width is the TOTAL,
					//this width is the running width while painting the string in canvas.
					//if everything turns out good, this width should be the same as the total width.
					var offset = 0;
					var tempToken = undefined;
					for(var k = 0, splitLength = textSplit.length; k < splitLength; k++)
					{
						nicoContext.fillStyle = textObject.color;
						//fillText draws the innards of the text
						nicoContext.fillText(textSplit[k], textObject.posX + offset ,textObject.posY);
						//stroke test draws the borders of the text
						nicoContext.strokeText(textSplit[k], textObject.posX + offset ,textObject.posY);
						//add to offset
						offset += nicoContext.measureText(textSplit[k]).width;

						//parse token regexp on the normal non split text since that has all the tokens in it.
						//the for loop will loop through and get the emotes sequentially
						tempToken  = emoteTokenRegExpYesCap.exec(textObject.text);
						
						if(tempToken !== null && tempToken !== undefined)
						{
							if(emoticonUrlMap[tempToken[1]])
							{
								var imageObj = new Image();
								imageObj.src = emoticonUrlMap[tempToken[1]];
								nicoContext.drawImage(imageObj, textObject.posX + offset, textObject.posY);
							}
							offset += EMOTE_PIXEL_WIDTH;
						}
					}
					
					//update
					textObject.posX = textObject.posX - textObject.velocity;
					//if text object made it off screen, remove it from the array
					//else reupdate the entry in the array.
					if(textObject.posX < -textObject.width)
					{
						textObjArray[i].splice(j, 1);
					}
					else
					{
						textObjArray[i][j] = textObject;
					}
				}
			}
		}
		
        // request new frame
		requestAnimFrame(function() {
		  animate();
		});
	  }

	  
	  //dom reading stuff.
	  //the dom reader doesn't work, deprecated and not replaced by anything better...
	  //we store a list of all the last id's that we have read since last update
	  //in the next chat update, we ping the latest id and only collect the chats that come after that
	  //display the chats and store the last id in our ids read since last update.

	function gatherAndDisplayChat(lastOutputtedTextID){
		
		var $lines;
		//condition for when we're just starting, display ALL the nicks
		if(lastOutputtedTextID === undefined)
		{	
			$lines = $('.chat-line');
		}
		else
		{
			$lines = $('#'+lastOutputtedTextID).nextAll(".chat-line");
		}
		if($lines.length != 0)
		{
			$lines.each(function(index){
				var color = ($(this).find('.from').attr('style') ? $(this).find('.from').attr('style').split(":")[1] : "white");
				$(this).find('.message').each(function(index){
					insertText($(this).html(), color);
				});
			});
			
			lastOutputtedTextID = $lines.last().attr('id');
		}
		scheduleTextScrape(lastOutputtedTextID);
		return lastOutputtedTextID;
	}
	
	function scheduleTextScrape(lastOutputtedTextID){
		setTimeout(function(){gatherAndDisplayChat(lastOutputtedTextID)}, 1000);
	}
	  
		  
    //returns array of url mapping
    //the map will be generated as the user puts in the emote.  This way we don't need to parse through twitch's ridiculous amounts of emotes which are now currently at the 30000~ count.
    //a map of emote name to url is created and new values are inserted, the proper canvas string is fofrmed
	function getEmoticonList(){
		var emoticonUrlMap = [];
		var insideParensRegExp = /\(([^)]+)\)/;
		var $iconList = $('<div/>', {id:'iconList'});
		$('body').append($iconList);
		$iconList.css('display', 'none');
		
		//Since the emoticon list is ever expanding, we need to find out a good way to find out how long the list is.
		//the only way to determine if an emoticon exists for a certain number is to create the element and then find out if it has an existing css 'background-image'
		var emoticonLimitFound = false;
		var maxEmoticonLimit = 0;
		var emoticonCountProgression = 500;
		while(!emoticonLimitFound)
		{
			maxEmoticonLimit += 500;
			$iconList.html('<span class="emo-'+maxEmoticonLimit+' emoticon"></span>');
			($iconList.find('.emoticon').css('background-image') == 'none' ? emoticonLimitFound = true : maxEmoticonLimit += emoticonCountProgression);
		}
		var emoteStringBuilder = [];
		for (var i = 0; i < maxEmoticonLimit; i++)
		{
			emoteStringBuilder.push('<span class="emo-'+i+' emoticon"></span>');
		}
		$iconList.html(emoteStringBuilder.join(' '));
		
		$iconList.find('.emoticon').each(function(index){
			var backgroundImage = $(this).css('background-image');
			if(backgroundImage !== 'none')
			{
				emoticonUrlMap[index] = insideParensRegExp.exec(backgroundImage)[1];
			}
		});
		return emoticonUrlMap;
	}
	
	this.init = function(){
		//emoticonUrlMap = getEmoticonList();
		insertText("initialized");
		animate();
	  	scheduleTextScrape();
	}
}

var nico = new nicoNicoTwitch();
nico.init();