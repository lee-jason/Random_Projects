$(document).ready(function(){
	//make body height guaranteed higher than window size
	if($('body').outerHeight(true) < window.innerHeight){
		var verticalMargin = $('body').outerHeight(true) - $('body').innerHeight();
		$('body').css('height', window.innerHeight - verticalMargin + 'px');
	};

	//first find out how many images are in the imageShuffler
	var imgCount = $('#vertImageShuffler').children('img').length;
	var currImage = 1;
	var prevImage = imgCount;
	var delay = 5000;
	var mobileWidth = 960

	//initiate timeout of image swap
	nextImage();
	window.setInterval(nextImage, delay);

	//fade in initial oversized image
	//scroll all the way right
	//wait for a second or two
	//fadeout and fadein new image
	//repeat scrolling and fade out fade int
	//if image is last in queue, 
	

	function nextImage(){
		if(currImage > imgCount)
		{
			currImage = 1;
			prevImage = imgCount;
		}
		$('#vertImageShuffler img:nth-child('+currImage+')').fadeIn('slow', function(){});
		$('#vertImageShuffler img:nth-child('+prevImage+')').fadeOut('slow', function(){});
		currImage = currImage + 1;
		prevImage = currImage - 1;
	}
	window.nextImage = nextImage;


	
	//first decide mobile/desktop functionality (menu hover/collapsable categories) should appear on first page load
	if($(this).width() <= mobileWidth)
	{
		bindMenuAppearOff();
		bindMenuCollapseOn();
	}
	else
	{
		bindMenuAppearOn();
	}
	
	//then decide accordingly when user resizes
	$(window).on('resize', function(){
		//if window width is mobile sized
		if($(this).width() <= mobileWidth)
		{
			bindMenuAppearOff();
		}
		//else its browser sized
		else
		{
			//set menu subnav to appear on hover and disappear on leaving
			bindMenuAppearOn()
		}
	});
	

	
	//govern when side menu navigation appears or not..
	window.topPosOfLeftMenuNav = 0;
	window.leftNavTriggered = 0;

	$(window).scroll(function() {
		//only check side nav if window size is desktop sized
		//since. side nav is not needed for mobile versions.
		if($(window).width() > mobileWidth)
		{
			checkLeftMenuNav();
		}
		else{
			$('#vertMenuNav').css('display', 'none');
		}
	});
	function checkLeftMenuNav()
	{
		window.topPosOfLeftMenuNav = $('#vertImageShuffler').height() + $('#vertImageShuffler').position().top - $(window).scrollTop();
			//fade in when scroll bar passed certain point, right now its 450 point
			if($(window).scrollTop() > 450)
			{
				if(window.leftNavTriggered == 0)
				{
					window.leftNavTriggered = 1;
					$('#vertMenuNav').stop(true, true).fadeIn('slow'); 
				}
				if(window.topPosOfLeftMenuNav < 20)
				{
					$('#vertMenuNav').css('top', 20);
				}
				else
				{
					$('#vertMenuNav').css('top', topPosOfLeftMenuNav);
				}
			}
			//fade out since scroll bar is before certain mark
			else{
				$('#vertMenuNav').css('top', topPosOfLeftMenuNav);
				if(window.leftNavTriggered == 1)
				{
					window.leftNavTriggered = 0;
					$('#vertMenuNav').stop(true, true).fadeOut('slow');
				}
			}
		
	}
	
	function bindMenuCollapseOn()
	{
		//switch the +/- icon depending on whether section is expanded or not.
		function toggleExpandIcon(jqSpecificIcon)
		{
			if(jqSpecificIcon.html() == "+")
			{
				jqSpecificIcon.html('-');
			}
			else
			{
				jqSpecificIcon.html('+');
			}
		}
		
		//bind menu scrolldown-fadein animations but only for smaller window sizes.
		$('#lunchTitle').on('click', function() {$('#lunchContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow"); toggleExpandIcon($(this).children('.expandIcon'));});
		$('#chef_specialTitle').on('click', function() {$('#chef_specialContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow"); toggleExpandIcon($(this).children('.expandIcon'))});
		$('#appetizerTitle').on('click', function() {$('#appetizerContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#soupTitle').on('click', function() {$('#soupContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#seafoodTitle').on('click', function() {$('#seafoodContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#beef_lambTitle').on('click', function() {$('#beef_lambContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#poultryTitle').on('click', function() {$('#poultryContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#porkTitle').on('click', function() {$('#porkContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#moo_shiTitle').on('click', function() {$('#moo_shiContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#chop_sueyTitle').on('click', function() {$('#chop_sueyContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#egg_fu_yungTitle').on('click', function() {$('#egg_fu_yungContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#vegetableTitle').on('click', function() {$('#vegetableContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
		$('#dinnerTitle').on('click', function() {$('#dinnerContent').stop(true, true).animate({height: "toggle", opacity: "toggle"}, "slow")});
	}
	
	function bindMenuAppearOn()
	{
			//set menu subnav to appear on hover and disappear on leaving
		$('#menuLink').mouseenter(function(){$('#menuNav').css('display', 'block');}).mouseleave(function(){$('#menuNav').css('display', 'none');});
		$('#menuNav').mouseenter(function(){$('#menuNav').css('display', 'block');}).mouseleave(function(){$('#menuNav').css('display', 'none');});
	}
	
	function bindMenuAppearOff()
	{
		$('#menuLink').off('mouseenter');
		$('#menuLink').off('mouseleave');
	}
	
	//bind scrollbar animations to each nav menu item
	var scrollTiming = 300;
	$('.topLink').on('click', function(){$(window).scrollTo($('body'), scrollTiming);});
	$('.lunchLink').on('click', function(){$(window).scrollTo($('#lunchSection'), scrollTiming);});
	$('.chef_specialLink').on('click', function(){$(window).scrollTo($('#chef_specialSection'), scrollTiming);});
	$('.appetizerLink').on('click', function(){$(window).scrollTo($('#appetizerSection'), scrollTiming);});
	$('.soupLink').on('click', function(){$(window).scrollTo($('#soupSection'), scrollTiming);});
	$('.seafoodLink').on('click', function(){$(window).scrollTo($('#seafoodSection'), scrollTiming);});
	$('.beef_lambLink').on('click', function(){$(window).scrollTo($('#beef_lambSection'), scrollTiming);});
	$('.poultryLink').on('click', function(){$(window).scrollTo($('#poultrySection'), scrollTiming);});
	$('.porkLink').on('click', function(){$(window).scrollTo($('#porkSection'), scrollTiming);});
	$('.moo_shiLink').on('click', function(){$(window).scrollTo($('#moo_shiSection'), scrollTiming);});
	$('.chop_sueyLink').on('click', function(){$(window).scrollTo($('#chop_sueySection'), scrollTiming);});
	$('.egg_fu_yungLink').on('click', function(){$(window).scrollTo($('#egg_fu_yungSection'), scrollTiming);});
	$('.vegetableLink').on('click', function(){$(window).scrollTo($('#vegetableSection'), scrollTiming);});
	$('.dinnerLink').on('click', function(){$(window).scrollTo($('#dinnerSection'), scrollTiming);});
	

	
});