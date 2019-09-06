/*
 * App events
 */


// Wait for device API libraries to load
//
//	document.addEventListener("deviceready", onDeviceReady, false);
// before page creation
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady () {
window.addEventListener('backbutton', onBackKeyDown, false);	
$(window).on("orientationchange", orientationChange);
}

function onBackKeyDown(e) {
	e.preventDefault();
    // Handle the back button
	app.back(); 
}

function orientationChange(e) {

    if(e.orientation == 'landscape') {
	//"landscape";	
	$('.default-footer').removeClass('footer-tall').addClass('footer-short');
	app.adjustForLandscape();
	}
	else {
	$('.default-footer').removeClass('footer-short').addClass('footer-tall');
	app.adjustForPortrait();
	}		
}

$(window).on("navigate", function (e, data) {

  e.preventDefault();
	
  var direction = data.state.direction;

  if (direction == 'back') {
	app.back();
  }
  else if (direction == 'forward'){
	app.home();
  }

});

/*********************************
* on window resize
***********************************
*/
$(window).resize(function(){

	window.setTimeout(function () {

	app.adjustForPortrait();
	app.adjustForLandscape();
	
	}, 300);

});

// on page container creation
$(document).on("pagecontainercreate", function(e, data) {
	
// load style
app.style.init();
app.style.define();
app.style.load();

// load html file content
app.processContent.loadHtmlContent();

});

// before page creation
$(document).on("pagecontainerbeforeload", function(e, data) {

$("#"+app.pageTemplate).remove();
});

/**
*********************************************************
* on page creation event
*********************************************************
*/
$(document).on("pagecreate", function(e, data) {

app.onPageCreateEvent= e;

// Reset
app.landscapeHideHeader= false;

//set context
app.context= app.newContext;
app.newContext= new CONTEXT();

// set currentTemplate

var to= $.mobile.path.parseUrl(data.toPage);
	
	// content source id

	if ('index' === app.currentPage) {
	app.contentSourceId= 0;	
	}
	else if (typeof(app.clicked) === 'object') {
	
	// element clicked, from processLinks
	var $el= app.clicked;
	
	// get content group number to pull content
	var str1= app.currentPage.substr(app.currentPage.indexOf('_')+1, 2);
		if (str1.indexOf('_') != -1) {
		var str1= str1.substr(0, 1);	
		}
	// sourceId of content in appContent object	
	app.contentSourceId= +str1;					
	
		if (typeof(app.contentSourceId) != 'number') {
		console.log('Error: no content group for page ' + app.currentPage);
		app.fatalError= true;
		return;
		}
		
		// get quiz parameters
		if ('quiz' == app.context.name) {
		app.quiz= new app.QUIZ();
		app.quiz.quizId= $el.jqmData('quizid');
		app.quiz.sourceId= $el.jqmData('sourceid');
		app.quiz.unlock= $el.jqmData('unlock');
		}
		else {
		// cancel values
		delete app.quiz.quizId;
		delete app.quiz.sourceId;
		}
		
	delete app.clicked;	

	}// end if

// init page
	
var widgets= app.widgets;

// current page
var $page= app.widgets.pageDiv= $("#"+app.pageTemplate);

// content div
widgets.contentDiv= $('#'+app.pageTemplate+' div[data-role="content"]');

// add back button
app.adjustDisplay(function () {
app.widgets.showPreviousPageButton();
});

	// find page content reference
	if ((typeof(app.appContent) === 'undefined') || (typeof(app.appContent[app.contentSourceId]) === 'undefined')) {
	console.log('page content not found for "' + app.currentPage + '"');
	app.fatalError= true;
	return;
	}
	else {
	app.currentContent= app.appContent[app.contentSourceId][app.currentPage];
	}
		
	/**
	*Load html widgets
	*/	
	// load login form
	if ('login' == app.context.name) {
	widgets.contentDiv.append(widgets.loginForm.get()).enhanceWithin();
	app.processLogin.init();
	app.processLogin.addEvents();
	}

	// load register form
	else if ('register' == app.context.name) {
	widgets.contentDiv.append(widgets.registerForm.get()).enhanceWithin();
	app.processRegister.init();
	app.processRegister.addEvents();
	}
	// load change username form
	else if ('change_username' == app.context.name) {
	widgets.contentDiv.append(widgets.changeCredentialsForm.get('username')).enhanceWithin();
	app.processChangeCredentials.init('change_username');
	app.processChangeCredentials.addEvents();
	}
	
	// load change email form
	else if ('change_email' == app.context.name) {
	widgets.contentDiv.append(widgets.changeCredentialsForm.get('email')).enhanceWithin();
	app.processChangeCredentials.init('change_email');
	app.processChangeCredentials.addEvents();
	}
	
	// load change password form
	else if ('change_password' == app.context.name) {
	widgets.contentDiv.append(widgets.changeCredentialsForm.get('password')).enhanceWithin();
	app.processChangeCredentials.init('change_password');
	app.processChangeCredentials.addEvents();
	}
	
	// load reset password form
	else if ('reset_password' == app.context.name) {
	widgets.contentDiv.append(widgets.resetPwdForm.get()).enhanceWithin();
	app.processResetPwd.init();
	app.processResetPwd.addEvents();
	}
	
	// append main html widgets after other html widgets

	$page.prepend(widgets.header.get()).enhanceWithin();	

	$page.append(widgets.footer.get()).enhanceWithin();	

	if (0 == $('#mainMenu').length) {	
	$('body').append(widgets.mainmenu.get()).enhanceWithin();
	}
	
	//Create html elements references
	// header
	widgets.headerDiv= $('#'+app.pageTemplate+' div[data-role="header"]');
	// footer div
	widgets.footerDiv= $('#'+app.pageTemplate+' div[data-role="footer"]');


	// append extra templates
	app.processTemplates.add();

	// load content after all html
	app.processContent.loadPageContent(); 
	app.processContent.loadRowsContent();
	app.processContent.loadQuizList();

	/***
	* Processing starts
	*/

	// process generate username
	if ('get_username' == app.context.name) {	
	app.processGenUsername.init();
	app.processGenUsername.addEvents();
	}
	// load chat
	else if (null != app.context.name.match(/^chat_.+$/)) {
	
	app.ajax.init();
	app.chat= new app.CHAT();
	app.chat.init();
	
		if ('chat_rooms' == app.context.name) {
		app.chat.getRooms();
		// debug
		console.log('in chat_rooms, app.user.username: '+app.user.username);	
		}
		else if ('chat_messages' == app.context.name) {
		app.chat.initMessenger();
		app.chat.canListen= true;
		app.chat.listen();
		window.setTimeout(function() { app.chat.addShowOldBtn();}, 0);
		}
	}
	else {
	app.chat.listenInterval= '120000';
	app.chat.inBackground= true;
	}
	
	//load quiz
	if ((typeof(app.quiz.quizId) === 'number') 
		&& (typeof(app.quiz.sourceId) === 'number')) {
	app.quiz.init();
	}

	//After page has been created
	app.afterPageCreate();
});

/**
*After page has been created
*/
app.afterPageCreate= function() {

// add padlocks to blocked section
app.util.addPadlocks();

// unlock first
app.util.unlockFirst();

// update blocked section
app.util.updateAllowedLinks();

/**************************************
*	Events
***************************************
*/

// log out
 $(document).off('click', '.logout').on('click', '.logout', function (e) {
$('#mainMenu').remove();	
app.user.logout();	
});

	// display messages after redirect
	
	if ("loggedin" == app.context.name) {	
	window.setTimeout(function () { app.widgets.showMessage('Hello, you are connected as <span data-var="username"></span>', 'success', function() {$('[data-var=username]').text(app.user.username);}); }, 1000);
	}
	else if ("logout" == app.context.name) {	
	window.setTimeout(function () {app.widgets.showMessage(app.t('Your account was disconnected!'), 'success');}, 1000);
	}
	else if ("registered" == app.context.name) {	
	window.setTimeout(function () {
		app.widgets.showMessage('You are registered <span data-var="username"></span>. Please check your mail \
		to confirm your email address: <span data-var="email"></span>', 'success', 
		function() {$('[data-var=username]').text($this.input.username);
		$('[data-var=email]').text($this.input.email);}); 
		}, 1000);
	}
	else if ("pwd_reset" == app.context.name) {
	window.setTimeout(function () {
		app.widgets.showMessage('We have sent you an email to reset your password', 'success');	
		}, 1000);
	}
	
// exit	app
 $(document).off('click', '.exit').on('click', '.exit', function (e) {
app.askExit();
});

// offline event
document.addEventListener("offline", app.onOffline, false);

// online event
document.addEventListener("online", app.onOnline, false);

// add click event to all links
$(document).off('click', 'a').on('click', 'a', app.processLink);

// add message click event
 $(document).off('click', '#systemMessage').on('click', '#systemMessage', function(){	
	$('#systemMessage').hide('slow');
});	

// reduce form when input is clicked
$(document).off('click', '.innerForm :input').on('click', '.innerForm :input', function (e) {	

app.reduceInnerFormHeight();

// set active form
$('#'+app.pageTemplate+' .form').first().addClass('isActiveForm');
app.hasActiveForm= true;

// hide header
app.widgets.headerDiv.hide('slow');
app.widgets.pageDiv.addClass('topFixed');
$('#'+app.pageTemplate+' .form .arrow').show();

e.stopPropagation();
e.preventDefault();	
});

//restore inner form height
$(document).off('click', '#'+app.pageTemplate+' .innerForm').on('click', '#'+app.pageTemplate+' .innerForm',function (e) {

app.restoreInnerFormHeight();

// set active form state
$('#'+app.pageTemplate+' .form').first().removeClass('isActiveForm');
app.hasActiveForm= false;

e.stopPropagation();	
e.preventDefault();
});
//restore inner form height
$(document).off('click', '#'+app.pageTemplate+' .form').on('click', '#'+app.pageTemplate+' .form',function (e) {
app.restoreInnerFormHeight();

// set inactive form
$('#'+app.pageTemplate+' .form').first().removeClass('isActiveForm');
app.hasActiveForm= false;

	// show header
	if ($('#'+app.pageTemplate+' .hasLandscapeForm').length == 0) {
	app.widgets.headerDiv.show('slow');
	app.widgets.pageDiv.removeClass('topFixed');
	}

$('#'+app.pageTemplate+' .form .arrow').hide();
	
e.stopPropagation();	
e.preventDefault();
});

//restore inner form height
$(document).off('click', '#'+app.pageTemplate+' .ui-page').on('click', '#'+app.pageTemplate+' .ui-page',function (e) {
app.restoreInnerFormHeight();
$('#'+app.pageTemplate+' .form').first().removeClass('isActiveForm');
app.hasActiveForm= false;

e.stopPropagation();	
e.preventDefault();
});

// load dynamic content
$('[data-var="username"]').each(function (ix) {
$(this).text(app.user.username);
});

	// chat
	if ('chat_messages' == app.context.name) {
	
	// scroll to last message
	window.setTimeout(app.chat.messagesScrollToBottom, 1000);	

	app.landscapeHideHeader= true;
	
	}
	
	
	// hide section if no quiz
	if (($('#quizList').length > 0) && ($('.promptQuiz').length == 0)) {
		$('#quizList').hide();
	}
	
	// hide header in landscape for forms
	if ($('#'+app.pageTemplate+' .form').length > 0) {
	app.landscapeHideHeader= true;	
	}

// call adjust display functions
app.adjustDisplay();

	// request to confirm new email
	if (app.online && app.isLoggedIn && ('index' == app.currentPage) && (null != app.storage.get('newEmail'))) {
	
	app.widgets.showMessage('Activate your new email address and login to change your email to <span class="email" data-var="email"></span>', 'success', function() {$('[data-var=email]').text(app.storage.get('newEmail'));});
		
	}

// save in history
app.history.add();

// adjust user interface elements
app.adjustForPortrait();
// adjust user interface elements
app.adjustForLandscape();

//finally
$.mobile.loading( 'hide' );

};

/**
*pagecontainer show event
*/
$(document).on( "pagecontainershow", function( event, ui ) {

	if (true === app.fatalError) {
	$('.ui-page').hide();
	confirm('A fatal error occured, please restart this app');
	}
	
});

/**
*Reduce inner form height
*/
app.reduceInnerFormHeight= function ($clicked) {

// save form height
	if ((typeof(app.widgets.innerFormHeight) === 'undefined') || (app.widgets.innerFormHeight === 0)) {
	app.widgets.innerFormHeight= $('#'+app.pageTemplate+' .innerForm').first().height();	
	}

var $form= $('#'+app.pageTemplate+' .form').first();	
var $innerForm= $('#'+app.pageTemplate+' .innerForm').first();	

var pageHeight= $('#media-query-bridge').height();

	// reduce innerForm for small screen
	if (pageHeight <= 375) {					
	$innerForm.height(95);	
	$('#'+app.pageTemplate+' .form .arrow').show('slow');
	}

	if (typeof($clicked) === 'object') {
	// scroll to top
	var innerFormScroll= $innerForm.scrollTop();
	var top= $clicked.offset().top - $innerForm.offset().top - 25;

		// if scrolling within the form
		if ( innerFormScroll > top) {
		top= innerFormScroll;	
		}
		
	// scroll to element
	$innerForm.scrollTop(top);

	}

// keep objects in memory
app.widgets.form= $form;
app.widgets.innerForm= $innerForm;

}
/**
*Restore inner form height
*/
app.restoreInnerFormHeight= function () {
	
	if ((typeof(app.widgets.form) === 'object') && (typeof(app.widgets.innerForm) === 'object') && (typeof(app.widgets.innerFormHeight) === 'number') && (app.widgets.innerFormHeight > 0)) {
		
		if ($('#'+app.pageTemplate+' .hasLandscapeForm').length > 0) {
		app.widgets.innerForm.height(250);	
		}
		else {
		app.widgets.innerForm.height(app.widgets.innerFormHeight);	
		}

	app.widgets.form.removeClass('isActiveForm');
	app.hasActiveForm= false;

	$('#'+app.pageTemplate+' .form .arrow').hide();
	// clean up
	delete app.widgets.form;
	delete app.widgets.innerForm;
	delete app.widgets.innerFormHeight;
	}

}

/**
adjust UI for landscape
**/
app.adjustForLandscape= function() {

// page html elements	
var widgets= app.widgets;

var pageHeight= $('#media-query-bridge').height();
		
	if (pageHeight <= 375) {
		
		if ($('#'+app.pageTemplate+' .form').length > 0) {
		app.widgets.contentDiv.removeClass('hasPortraitForm').addClass('hasLandscapeForm');
		}
		
	// chat message container
	$('#messageList').removeClass('shortList').removeClass('longList').addClass('mediumList');
	
		if (app.landscapeHideHeader) {
		// main container
		widgets.headerDiv.hide('slow');
		widgets.pageDiv.addClass('topFixed');
		}		
		
		if (pageHeight <= 75) {	
		// chat message container
		$('#messageList').removeClass('mediumList').removeClass('longList').addClass('shortList');

		}
		
		// if a form is active
		if (app.hasActiveForm) {
		app.reduceInnerFormHeight();		
		}
		
	}
}

/**
adjust UI for portrait
**/
app.adjustForPortrait= function() {

// page html elements	
var widgets= app.widgets;

var pageHeight= $('#media-query-bridge').height();
	
	if (pageHeight > 375) {
		
		if ($('#'+app.pageTemplate+' .form').length > 0) {
		app.widgets.contentDiv.removeClass('hasLandscapeForm').addClass('hasPortraitForm');
		}
		
	// chat message container
	$('#messageList').removeClass('shortList').removeClass('mediumList').addClass('longList');
	
		if (app.landscapeHideHeader && !app.hasActiveForm) {
		// main container
		widgets.headerDiv.show('slow');
		widgets.pageDiv.removeClass('topFixed');
		}

	}
}
