app.processResetPwd= {
	
	init: function () {

	$('#continue').hide('');
	
	},
	
	addEvents: function () {

	var $this= app.processResetPwd;		
	
		// submit form
		$(document).off('click', '#resetPwdSubmit').on('click','#resetPwdSubmit', function (e) {

		$this.onSubmit();
		
		});
		
	},
	
	onSubmit: function () {
		
		if (!app.isOnline()) {
		return;
		}
			
	var $this= app.processResetPwd;

	var username= app.storage.get('username');	
	var email= app.storage.get('email');	
	var userId= app.storage.get('userId');	

	var p= {};
	p.ajaxServer= 'user_manager';
	p.action= 'request_new_password';
	p.url= app.serverUrl + 'umanager/';
	p.values= {user_id:userId,username:username,email:email};
	p.types= {user_id:1,username:2,email:2}; // PDO data types values
	p.hasLoader= true;
	$this.ajaxParams= p;
	
	app.ajax.init();
	app.ajax.context= "request_new_password";
	app.ajax.successAction= $this.onSuccess;
	app.ajax.noResultAction= $this.onNoResult;
	app.ajax.errorAction= $this.onError;

	app.ajax.send(p);

	},
	
	validate: function () {
		
	var $this= app.processResetPwd;
	var input= $this.input;
	var inputList= {};
	inputList.email= true;
	
	return app.util.validateForm(inputList, input);
	
	},
	
	onSuccess: function (data) {
		
		if (data.email === 'done') {		
		app.goHome('pwd_reset');
		}
		else {
		app.widgets.showMessage('There was a problem on the network... Please try again later', 'error');		
		}

	},
	
	onNoResult: function (data) {

	app.widgets.showMessage('Wrong credentials... Try again.', 'error');
	console.log('No result: '+ data);

	},
	
	onError: function (data) {

	app.widgets.showMessage(data[1], 'error');
	console.log('Error: '+ data[0] +' '+ data[1]);

	}
	
}