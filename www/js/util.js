app.util= {
	/**
	*Change page
	*/
	changePage: function (newPagePath, dataUrl) {
	$( ":mobile-pagecontainer" ).pagecontainer( "change", newPagePath, { transition: "fade", unlockSamePageTransition : false,
		  showLoadMsg: true, reload: true, dataUrl: dataUrl, changeHash: true, type: 'post' } );
		 
	},
	/**
	*Get the page path
	*/
	getPagePath: function (newPage) {
	
	var pagePath;
	
		if (newPage === 'index') {
         pagePath = app.homeDir + 'index.html';
        }
        else {
         pagePath= app.homeDir + 'view/' + app.pageTemplate + '.html';
        }	
		
	return pagePath;
	
	},
	/**
	*Get the data url to save in history
	*/
	getDataUrl: function (newPage) {
	
	var dataUrl;
	
		if (newPage === 'index') {
		dataUrl= app.homeDir + newPage + '.html';
        }
        else {			
		dataUrl= app.homeDir + 'view/' + newPage + '.html';
        }
		
	return dataUrl;
	
	},
	/**
	Replace old value with new value
	*
	*/
	varReplace: function (oldVal, newVal, content) {
			var re= new RegExp('\{\{'+oldVal+'\}\}','g');
			return content.replace(re, newVal);
			},
	/*
	*Get unix timestamp in seconds
	*/
	getTimestamp: function () {
	return Math.floor(Date.now() / 1000);
	},
	/*
	*Unix timestamp to date
	*/
	timestampToDate: function (timestamp) {
		
	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	var date = new Date(timestamp*1000);
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		
	},
	/**
	*Time ago 
	*/
	timeAgo: function (timestamp) {

	var now= app.util.getTimestamp();
	var interval= now - timestamp;

	if (interval <= 60) {
	return;
	}

	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	var date = new Date(interval*1000);
	
	// days
	var oneDay = 24*60*60; // hours*minutes*seconds
	var days= Math.floor(interval/oneDay);
	// hours
	var hours = date.getHours();
	// minutes
	var minutes = "0" + date.getMinutes();
	minutes= Number(minutes.substr(-2));
	// seconds
	var seconds = "0" + date.getSeconds();
	seconds= Number(seconds.substr(-2));
	
	// Will display time in 10:30:23 format
	var ago = [];
		if (days > 0) {ago.push(days + app.t('d '));}
		
		if (hours > 0) {
			if (days > 0){ago.push(": ");}
		ago.push(hours + app.t('h '));
		}
		
		if (minutes > 0) {
			if (hours > 0){ago.push(": ");}
		ago.push(minutes + app.t('mn'));
		}
		
		if (seconds > 0) {
			if (minutes > 0){ago.push(": ");}
		ago.push(seconds + app.t('s'));
		}
		
	return ago.join('');
	},
	/*
	*Get current year
	*/
	getCurrentYear: function () {
	var d = new Date();
	return d.getFullYear(); 	
	},
		
	validateEmail: function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
	},
	
	validateForm: function (inputList, input) {
		
	var fields= {};
	// set whether field is required
	fields.username= inputList.username || false;
	fields.email= inputList.email || false;
	fields.password= inputList.password || false;
	fields.newPassword= inputList.newPassword || false;
	
	var empty={};
	var incorrect= {};
	
		if (fields.username && (0 == input.username.length)) {
		empty.username= true;
		}
		
		if (fields.email && (0 == input.email.length)) {
		empty.email= true;
		}
		
		if (fields.password && (0 == input.password.length)) {
		empty.password= true;
		}
		
		if (fields.newPassword && (0 == input.newPassword.length)) {
		empty.password= true;
		}
		
		if (fields.password && (typeof(input.email) !== 'undefined') && (input.email.length > 0) && !app.util.validateEmail(input.email)) {			
		incorrect.email= 'The email address is not valid';
		}
	
	var message='';
	var list= [];
	var i= 0;
		for (var name in empty) {
			if (empty.hasOwnProperty(name)) {
			list[i]= '<li>'+app.t(name)+'</li>';	
			}
		i++;
		}
		
		if (list.length > 0) {
		message= '<ul class="empty">'+app.t('Please enter the following: ')+list.join('')+'</ul>';
		}
		
	var list= [];
	var i= 0;
		for (var name in incorrect) {
			if (incorrect.hasOwnProperty(name)) {
			list[i]= '<li>'+incorrect[name]+'</li>';	
			}
		i++;
		}
		
		if (list.length > 0) {
		message += '<ul class="incorrect">'+list.join('')+'</ul>';
		}
		
		if (message.length == 0) {
		return true;
		}
	
	app.widgets.showMessage(message, 'error');	
	return false;
	},
	
	/**
	* returns a boolean from a string
	*/
	bool: function (value) {
		if ((typeof(value) === 'string') && ('true' == value.trim())) {
		return true;
		}
	return false;
	},
	/**
	*shuffle an array
	*/
	shuffle: function (o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
	},
	
	/**
	*inspect variables
	*/
	dump: function (v) {
	return JSON.stringify(v, null, 4);
	},
	
	/**
	*Get window height
	*/
	getWinHeight: function(){
    return Math.max(
        $(document).height(),
        $(window).height()
    );
	},
	
	/**
	*Scroll to bottom
	*/
	scrollToBottom: function ($el, scrollHeight) {

		if(($el.length > 0) && (scrollHeight > 0)) {
		 $el.scrollTop(scrollHeight);
		}
		else if (app.debug) {
		confirm('Error: app.util.scrollToBottom');
		}
	},
	/**
	*add padlocks
	*/
	addPadlocks: function () {
	$('div.locked').each(function (ix) {$(this).append($('<i class="fa fa-lock locked-sign"></i>'));});
	},
	/**
	*unlock first
	*/
	unlockFirst: function () {
		$el= $('div.first-locked');
		$el.removeClass('locked').addClass('unlocked');
		$('div.first-locked i.locked-sign').remove();
		$('div.first-locked a.locked').removeClass('locked').addClass('unlocked');
		app.firstUnlocked= true;
	},
	/**
	*unlock all pages
	*/
	unlockAllLinks: function () {
	$('.locked').removeClass('locked').addClass('unlocked');
	},
	/**
	*update unlocked pages
	*/
	updateAllowedLinks: function () {
		$('a.locked').each(function (ix) {
		var href= $(this).attr('href');
		var reMatch= href.match(/(page_.+)$/);
		var page;
		
			if (reMatch != null) {   
			page= reMatch[0];
				if (1 == app.storage.get('unlocked_'+page)) {
				$(this).removeClass('locked').addClass('unlocked');
				$('.'+page+' .locked-sign').remove();
				}
			}
			
		});
	}
}
