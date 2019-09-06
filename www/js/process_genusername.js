app.processGenUsername= {
	
	init: function () {
	this.input= {};
	this.continueButton= '<a id="continue" href="page_11_chat_rooms" data-role="button" data-context="chat_rooms">'+app.t('Chat rooms')+'</a>';
	
		if (app.user.username.length > 0) {
		$('#'+app.currentPage+' .ui-content .form').append($(this.continueButton).hide()).enhanceWithin();
		$('#continue').show('slow');
		}
	},
	
	addEvents: function () {
			
		// submit form
		$(document).off('click', '#submitGenUsername').on('click','#submitGenUsername', function (e) {
		
		var $this= app.processGenUsername;
		
		$this.onSubmit();
		
		});
		
	},
	
	onSubmit: function () {
				
		if (!app.isOnline()) {
		return;
		}	
			
	var $this= app.processGenUsername;

	var p= {};
	p.action= 'generate_username';
	p.url= app.serverUrl + 'generate_username/';
	p.query= {};
	p.hasLoader= true;
	$this.ajaxParams= p;
	
	app.ajax.init();
	app.ajax.context= "Generate username";
	
	app.ajax.successAction= $this.onSuccess;
	app.ajax.noResultAction= $this.onNoResult;	
	app.ajax.errorAction= $this.onError;
	
	app.ajax.send(p);
	
	},
	
	onSuccess: function (data) {
	
	var $this= app.processGenUsername;
		
		if (typeof(data.username) !== 'undefined') {
		
		app.user.setUsername(data.username);

		app.hasTempUsername= true;
		
		app.widgets.showMessage('Your temporary username is <span data-var="username"></span>', 'success', function() {$('[data-var=username]').text(app.user.username);});
		
		$('#'+app.pageTemplate+' .ui-content .container').append($($this.continueButton).hide()).enhanceWithin();
		$('#continue').show('slow');
		
		}
		else {
		$this.onNoResult('No username received');
		}
	},
		
	onNoResult: function (data) {
	
	app.widgets.showMessage('Network error... Sorry something went wrong', 'error');
	console.log('No result: '+ data);

	},
	
	onError: function (data) {

	app.widgets.showMessage('Network error... Check your Internet connection', 'error');
	console.log('Error: '+ data[0] +' '+ data[1]);

	}
}