$(document).ready(function(){
	//make body height guaranteed higher than window size
	if($('body').outerHeight(true) < window.innerHeight){
		var verticalMargin = $('body').outerHeight(true) - $('body').innerHeight();
		$('body').css('height', window.innerHeight - verticalMargin + 'px');
	};
	//first find out how many images are in the imageShuffler
	var imgCount = $('#horizImageShuffler').children('img').length;
	var currImage = 1;
	var prevImage = imgCount;
	var delay = 5000;

	//initiate timeout of image swap
	nextImage();
	window.setInterval(nextImage, delay);


	function nextImage(){
		if(currImage > imgCount)
		{
			currImage = 1;
			prevImage = imgCount;
		}
		$('#horizImageShuffler img:nth-child('+currImage+')').fadeIn('slow', function(){});
		$('#horizImageShuffler img:nth-child('+prevImage+')').fadeOut('slow', function(){});
		currImage = currImage + 1;
		prevImage = currImage - 1;
	}
	
	//first decide whether the menu hover should appear on first page load
	if($(this).width() <= 960)
	{
		$('#menuLink').unbind('mouseenter');
		$('#menuLink').unbind('mouseleave');
	}
	//else its browser sized
	else
	{
		//set menu subnav to appear on hover and disappear on leaving
		$('#menuLink').mouseenter(function(){$('#menuNav').css('display', 'block');}).mouseleave(function(){$('#menuNav').css('display', 'none');});
		$('#menuNav').mouseenter(function(){$('#menuNav').css('display', 'block');}).mouseleave(function(){$('#menuNav').css('display', 'none');});
	}
	//then decide accordingly when user resizes
	$(window).on('resize', function(){
		//if window width is mobile sized
		if($(this).width() <= 960)
		{
			$('#menuLink').unbind('mouseenter');
			$('#menuLink').unbind('mouseleave');
		}
		//else its browser sized
		else
		{
			//set menu subnav to appear on hover and disappear on leaving
			$('#menuLink').mouseenter(function(){$('#menuNav').css('display', 'block');}).mouseleave(function(){$('#menuNav').css('display', 'none');});
			$('#menuNav').mouseenter(function(){$('#menuNav').css('display', 'block');}).mouseleave(function(){$('#menuNav').css('display', 'none');});
		}
	});
});