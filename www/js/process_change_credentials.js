
app.processChangeCredentials= {
	
	init: function (option) {
	
	this.option= option || '';
	this.input= {};
	
	$('#continue').hide('');
	
		switch (this.option) {
		case 'change_username':
			if (app.user.username.length > 0) {
			$('#credentialsForm .current').html(app.t("Your current username is: ")+'<span class="username">'+app.user.username+"</span>").fadeIn();
			}
		break;
		case 'change_email':
			if (app.user.email.length > 0) {
			$('#credentialsForm .current').html(app.t("Your current email address is: ")+'<span class="email">'+app.user.email+"</span>").fadeIn();
			}
		break;
		}
		
	},
	
	addEvents: function () {
			
	// submit form
	$(document).off('click', '#submitCredentials').on('click','#submitCredentials', function (e) {
	
		var $this= app.processChangeCredentials;
		
		$('#credentialsForm :input').each(
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
			
	var $this= app.processChangeCredentials;
	var input= $this.input;
	
		if (!$this.validate()) {
		console.log('Change credentials form validation failed');
		return false;	
		}
		
		if (typeof(input.username) !== 'string') {
		input.username= app.storage.get('username');	
		}
		
		if (typeof(input.email) !== 'string') {
		input.email= app.storage.get('email');	
		}
		
		var userId= app.storage.get('userId');	

		var p= {};
		p.ajaxServer= 'user_manager';
		p.action= $this.option;
		p.url= app.serverUrl + 'umanager/';
		p.values= {user_id:userId,username:input.username,email:input.email,password:input.password,newpassword:input.newPassword};
		p.types= {user_id:1,username:2,email:2,password:2,newPassword:2}; // PDO data types values
		p.hasLoader= true;
		$this.ajaxParams= p;
		
		app.ajax.init();
		app.ajax.context= $this.option;
		app.ajax.successAction= $this.onSuccess;
		app.ajax.noResultAction= $this.onNoResult;
		app.ajax.errorAction= $this.onError;
		
		app.ajax.send(p);

	},
	
	validate: function () {
		
	var $this= app.processChangeCredentials;
	var input= $this.input;
	var inputList= {};
	
		switch ($this.option) {
			case 'change_username':
			inputList.username= true;
			break;
			case 'change_password':
			inputList.newPassword= true;
			break;
			case 'change_email':
			case 'reset_password':
			inputList.email= true;	
			break;
		}
	
	inputList.password= true;
	
	return app.util.validateForm(inputList, input);
			
	},
	
	onSuccess: function (data) {
		
	var hasMessage= false;
	
		if (typeof(data.username) === 'string') {
		app.user.setUsername(data.username);	
		}
		else if (typeof(data.email) === 'string') {
		app.storage.set('newEmail', data.email);
		app.user.logout();
		
		app.widgets.showMessage('We have saved your new email <span class="username" data-var="username"></span>, please check your inbox to activate <span class="email">'+data.email+'</span>', 'success', function() {$('[data-var=username]').text(app.user.username);});
		hasMessage= true;
		
		}

		if (!hasMessage) {
		app.widgets.showMessage('We have saved your changes <span data-var="username"></span>', 'success', function() {$('[data-var=username]').text(app.user.username);});		
		}
	
	$('#credentialsForm').hide('slow');
	$('#'+app.currentPage).append(app.widgets.getContinueButton('#index', 'home')).enhanceWithin();	
	
	},
	
	onNoResult: function (data) {

	app.widgets.showMessage('Wrong credentials... Try again.', 'error');
	console.log('No result: '+ data);

	},
	
	onError: function (data) {

	app.widgets.showMessage('Sorry, something went wrong...', 'error');

	}
	
}