/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested initialization place for your code.
// It is completely optional and not required.
// It implements a Cordova "hide splashscreen" function, that may be useful.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, app:false, dev:false */
/*global myEventHandler:false, cordova:false, device:false */


// there should only be one of these...
window.app = window.app || {
	init: function () {
	
	// set home directory
	var end= location.pathname.lastIndexOf('/');
	this.homeDir = location.pathname.substr(0, end+1);
	// used to store adjust display callbacks
	this.adjustDisplayCallbacks= [];
	
	// default online status
	app.online= true;
	
	},
	user: {
			
		init: function () {
			
		this.user_id= Number(app.storage.get('user_id')) || 0 ;
		this.isLoggedIn= app.util.bool(app.storage.get('isLoggedIn'));
		this.username= app.storage.get('username') || "";
		this.email= app.storage.get('email') || "";

		this.avatar=  app.storage.get('avatar') || 'images/avatars/avatar.png';
		this.email= (typeof(app.storage.get('email')) === 'string') ? app.storage.get('email') : '';

		},
		setUsername: function (username) {
			app.storage.set('username', username);
			app.user.username= username;
		},
		setEmail: function (email) {
			app.storage.set('email', email);
			app.user.email= email;
		},
		setUserId: function (userId) {
			app.storage.set('userId', userId);
			app.user.userId= userId;
		},
		logout: function () {
		app.storage.remove('userId');
		app.storage.remove('username');
		app.storage.remove('email');
		app.storage.remove('isLoggedIn');
		app.user.isLoggedIn= false;
		}
	},
	/**
	*translate
	*/
	t: function (text) {
		
		if (arguments.length > 1) {
		var imax= arguments.length;
		
			for (var i=1; i < imax; i++) {
			var ref='v'+(i-1);
			text= app.util.varReplace(ref, arguments[i], text);
			}
		}
		
	return text;
	
	},
	/**
	*Storage handler
	**/
	storage: {
		init: function () {
			
		this.separator= '/&/';
		
			if(typeof(Storage) !== "undefined") {
				this.hasStorage= true;
				return true;
			}
			else {
				console.log('No storage object available');
				return false;	
			}
		},
		serialize: function(varObj, varKeys) {
		var list= [];
		
			if ((typeof(varObj) === 'object') && Array.isArray(varKeys)) {
			var imax= varKeys.length;
				for(var i=0; i < imax; i++) {
					if (typeof(varObj[varKeys][i]) === 'string') {
					list.push(varKeys[i]+':'+varObj[varKeys[i]]);
					}
					else {
					console.log('Error: storage.serialize found a non-string value at key' + varKeys[i]);	
					}
				}
			var serialized= list.join(',');
			serialized= '{'+serialized+'}';		
			return serialized;
			}
			else {
			console.log('Error: invalid parameter for stotage.serialize');	
			}
		},
		get: function(key, split) {	
		split= split || false;
		
			if (this.hasStorage) {
				if (split) {
				var item= localStorage.getItem(key);
					if (item.length > 0) {
					return item.split(this.separator);	
					}					
				}
			return localStorage.getItem(key);
			}
		},
		set: function(key, value, join) {
		join= join || false;
		
			if (this.hasStorage) {
				if (join && Array.isArray(value)) {
				var item= value.join(this.separator);
				}			
			localStorage.setItem(key, value);
			}			
		},
		remove: function(key) {

			if (this.hasStorage) {	
			localStorage.removeItem(key);
			}			
		}
	},
	getServerSettings: function() {
		
	},
	
	widgets: {
		getContinueButton: function (page, name, domClass) {
		var domClass= domClass || 'continueButton';
		return $('<div class="container"><a href="'+page+'" class="'+domClass+'" data-role="button" data-context="'+name+'">'+app.t(name)+'</a></div>');
		},
		
		showMessage: function (message, type, callback) {
		var $el= $('.systemMessages');
			if (typeof($el) === 'object') {
			$el.remove();
			}
			
			$el= $('<div id="systemMessage" class="systemMessages '+type+'">'+message+'</div>');
			$el.prependTo(app.widgets.contentDiv).show('slow').enhanceWithin();
			
			if (typeof(callback) === 'function') {
				window.setTimeout(callback, 0);
			}
			
			window.setTimeout(function () {
				$('#systemMessage').fadeOut('slow').remove();
			}, 6000);
			
		},		
		showPreviousPageButton: function () {
		var previous= app.history.getPrevious();
			if ((app.context.backButton == app.pageTemplate) && (typeof(previous) === 'object')) {
			app.widgets.contentDiv.prepend('<a data-role="button" class="backButton" href="'+previous.currentPage+'">'+app.t('Back')+'</a>').enhanceWithin();
			}
		}
	},
	/**
	*Navigate back
	*/
	back: function () {
	var pageImage;
	var previous;
	
		do {
		app.history.back();
		pageImage= app.history.getImage();
		}
		while ( (app.quizTemplate == pageImage.pageTemplate) 
			|| (app.getUsernameTemplate == pageImage.pageTemplate)
			|| (app.resetPasswordTemplate == pageImage.pageTemplate)
			|| (null != pageImage.pageTemplate.match(/(_chat_)/)) // ignore chat pages
			|| (null != pageImage.pageTemplate.match(/(_change_)/)) // ignore forms
			|| (app.loginTemplate == pageImage.pageTemplate)
			|| (app.registerTemplate == pageImage.pageTemplate)
			);
		
		// same
		if (pageImage.currentPage == app.currentPage) {
		return;	
		}
	
	// transfer image data to current context
	app.history.useImage(pageImage);
	
	// stop history.add()
	app.history.navigating= true;
	
	app.util.changePage(app.util.getPagePath(app.currentPage), app.util.getDataUrl(app.currentPage));
	
	},
	/**
	*Navigate home
	*/
	home: function () {

	app.currentPage= 'index';
	app.pageTemplate= 'index';
	app.contentSourceId= 0;
	var newPagePath = app.homeDir + 'index.html';
	var dataUrl= newPagePath;
	
	app.util.changePage(newPagePath, dataUrl); 
	
	},
	adjustDisplay: function (callback) {
		if (typeof(callback) === 'function') {
		app.adjustDisplayCallbacks[app.adjustDisplayCallbacks.length]= callback;
		}
		else {
		var imax= app.adjustDisplayCallbacks.length;
			for (var i=0; i < imax; i++) {
				app.adjustDisplayCallbacks[i]();
			}
		app.adjustDisplayCallbacks= [];
		}
	},
	/**
	* Confirm exit app
	**/
	askExit: function () {
    navigator.notification.confirm("Are you sure you want to exit?", function(buttonIndex) {
            switch(buttonIndex) {
                case 1:
                navigator.app.exitApp();
                break;
            }
        }, app.t('Confirmation'), [ app.t('Yes'), app.t('No') ]);
	},
	/**
	* Offline
	**/
	onOffline: function () {
		app.online= false;
	},
	/**
	* Online
	**/
	onOnline: function () {
		app.online= true;
	},
	/**
	* No internet
	*/
	noInternet: function () {
	app.widgets.showMessage('There\'s no Internet connection!', 'error');
	},
	/**
	* check if online
	*/
	isOnline: function () {
		
		if (app.online) {
		return true;
		}
			
		app.noInternet();
		return false;
	},
	
	goHome: function (context) {
	$.mobile.loading( 'show' );			
	// redirect to home	
	app.newContext.name= context;		
	app.pageTemplate= app.currentPage= 'index';	
	app.util.changePage(app.util.getPagePath('index'), app.util.getDataUrl('index'));

	}
};         

/**
*Context object
*/
var CONTEXT= function () {
		this.id= 0;
		this.name= 'new';
		this.redirected= false;
		// show back button
		this.backButton= false;
	}

// temporary store context values...
app.newContext= new CONTEXT();

app.ajax = {};
app.chat = {};
app.processContent= {};
app.quiz= {};
app.quizContent= {};
app.appContent= [];
app.pagecontentSourceId= [];
app.hasActiveForm= false;

app.templates= {};

app.landscapeHideHeader= false;

app.fatalError= false;

// Set to "true" if you want the console.log messages to appear.

app.LOG = app.LOG || false ;

app.consoleLog = function() {           // only emits console.log messages if app.LOG != false
    if( app.LOG ) {
        var args = Array.prototype.slice.call(arguments, 0) ;
        console.log.apply(console, args) ;
    }
} ;



// App init point (runs on custom app.Ready event from init-dev.js).
// Runs after underlying device native code and webview/browser is ready.
// Where you should "kick off" your application by initializing app events, etc.

// NOTE: Customize this function to initialize your application, as needed.

app.initEvents = function() {
    "use strict" ;
    var fName = "app.initEvents():" ;
    app.consoleLog(fName, "entry") ;

    // NOTE: initialize your third-party libraries and event handlers

    // initThirdPartyLibraryNumberOne() ;
    // initThirdPartyLibraryNumberTwo() ;
    // initThirdPartyLibraryNumberEtc() ;

    // NOTE: initialize your application code

    // initMyAppCodeNumberOne() ;
    // initMyAppCodeNumberTwo() ;
    // initMyAppCodeNumberEtc() ;

    // NOTE: initialize your app event handlers, see app.js for a simple event handler example

    // TODO: configure following to work with both touch and click events (mouse + touch)
    // see http://msopentech.com/blog/2013/09/16/add-pinch-pointer-events-apache-cordova-phonegap-app/

//...overly simple example...
//    var el, evt ;
//
//    if( navigator.msPointerEnabled || !('ontouchend' in window))    // if on Win 8 machine or no touch
//        evt = "click" ;                                             // let touch become a click event
//    else                                                            // else, assume touch events available
//        evt = "touchend" ;                                          // not optimum, but works
//
//    el = document.getElementById("id_btnHello") ;
//    el.addEventListener(evt, myEventHandler, false) ;

    // NOTE: ...you can put other miscellaneous init stuff in this function...
    // NOTE: ...and add whatever else you want to do now that the app has started...
    // NOTE: ...or create your own init handlers outside of this file that trigger off the "app.Ready" event...

    app.initDebug() ;           // just for debug, not required; keep it if you want it or get rid of it
    app.hideSplashScreen() ;    // after init is good time to remove splash screen; using a splash screen is optional

    // app initialization is done
    // app event handlers are ready
    // exit to idle state and wait for app events...

    app.consoleLog(fName, "exit") ;
} ;
document.addEventListener("app.Ready", app.initEvents, false) ;



// Just a bunch of useful debug console.log() messages.
// Runs after underlying device native code and webview/browser is ready.
// The following is just for debug, not required; keep it if you want or get rid of it.

app.initDebug = function() {
    "use strict" ;
    var fName = "app.initDebug():" ;
    app.consoleLog(fName, "entry") ;

    if( window.device && device.cordova ) {                     // old Cordova 2.x version detection
        app.consoleLog("device.version: " + device.cordova) ;   // print the cordova version string...
        app.consoleLog("device.model: " + device.model) ;
        app.consoleLog("device.platform: " + device.platform) ;
        app.consoleLog("device.version: " + device.version) ;
    }

    if( window.cordova && cordova.version ) {                   // only works in Cordova 3.x
        app.consoleLog("cordova.version: " + cordova.version) ; // print new Cordova 3.x version string...

        if( cordova.require ) {                                 // print included cordova plugins
            app.consoleLog(JSON.stringify(cordova.require('cordova/plugin_list').metadata, null, 1)) ;
        }
    }

    app.consoleLog(fName, "exit") ;
} ;



// Using a splash screen is optional. This function will not fail if none is present.
// This is also a simple study in the art of multi-platform device API detection.

app.hideSplashScreen = function() {
    "use strict" ;
    var fName = "app.hideSplashScreen():" ;
    app.consoleLog(fName, "entry") ;

    // see https://github.com/01org/appframework/blob/master/documentation/detail/%24.ui.launch.md
    // Do the following if you disabled App Framework autolaunch (in index.html, for example)
    // $.ui.launch() ;

    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
    if( window.intel && intel.xdk && intel.xdk.device ) {           // Intel XDK device API detected, but...
        if( intel.xdk.device.hideSplashScreen )                     // ...hideSplashScreen() is inside the base plugin
            intel.xdk.device.hideSplashScreen() ;
    }

    app.consoleLog(fName, "exit") ;
} ;