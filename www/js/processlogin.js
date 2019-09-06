app.processLogin= {
	
	init: function () {
	this.input= {};	

	},
	
	addEvents: function () {
			
		// submit form
		$(document).off('click', '#loginSubmit').on('click','#loginSubmit', function (e) {

		var $this= app.processLogin;
		
		$('#loginForm :input').each(
			function (ix) {
				var $input= $(this);
				var name= $input.attr('name');
				$this.input[name]= $input.val();
			}
		);
		
		$this.onSubmit();
		
		});
		
	},
	
	onSubmit: function () {
			
		if (!app.isOnline()) {
		return;
		}	
			
	var $this= app.processLogin;
	var input= $this.input;
	
		if (!$this.validate()) {
		console.log('Login form validation failed');
		return false;	
		}
	
	var p= {};
	p.ajaxServer= "user_manager";
	p.action= 'user_exists';
	p.url= app.serverUrl + 'umanager/';
	p.values= {email:input.email,password:input.password};
	p.types= {email:2,password:2}; // PDO data types values
	p.hasLoader= true;
	$this.ajaxParams= p;
	
	app.ajax.init();
	app.ajax.context= "user login";
	app.ajax.successAction= $this.onSuccess;
	app.ajax.noResultAction= $this.onNoResult;
	
	app.ajax.errorAction= $this.onError;
	
	app.ajax.send(p);
	
	},
	
	validate: function () {
		
	var $this= app.processLogin;
	var input= $this.input;
	var inputList= {};
	inputList.email= true;
	inputList.password= true;
	
	return app.util.validateForm(inputList, input);
	
	},
	
	onSuccess: function (data) {
		
	var $this= app.processLogin;

		if ('no' == data.activated) {
		app.widgets.showMessage('Please activate your account. Check your mail to confirm your email address: <span data-var="email"></span>', 'success', function() {$('[data-var=email]').text($this.input.email);});
		}
		else if ('yes' == data.activated) {		
		
		// if email was changed and is activated, remove
		if (data.email == app.storage.get('newEmail')) {
		app.storage.remove('newEmail');
		}

		app.user.setUserId(data.user_id);
		app.user.setUsername(data.username);
		app.user.setEmail(data.email);
		app.user.isLoggedIn= true;
		app.storage.set('isLoggedIn', app.user.isLoggedIn);

		//refresh menu
		$('#mainMenu').remove();
		$('body').append(app.widgets.mainmenu.get()).enhanceWithin();		
		}

		app.goHome('loggedin');
		
	},
	
	onNoResult: function (data) {
	
	var msg= 'Wrong credentials... Login failed.';
	
		if (null != app.storage.get('newEmail')) {
		msg += "<br><strong>"+app.t("Reminder: You have changed your email address")+"</strong>";
		}
	
	app.widgets.showMessage(msg, 'error');
	console.log('No result: '+ data);

	},
	
	onError: function (data) {

	app.widgets.showMessage('Sorry, something went wrong...', 'error');
	console.log('Error: '+ data);

	}
	
}