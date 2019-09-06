app.processRegister= {
	
	init: function () {
	this.input= {};
	
	$('#continue').hide('slow');
		
	},
	
	addEvents: function () {
			
		// submit form
		$(document).off('click', '#registerSubmit').on('click','#registerSubmit', function (e) {
		e.preventDefault();
		var $this= app.processRegister;
		
		$('#registerForm :input').each(
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
			
	var $this= app.processRegister;
	var input= $this.input;
	
		if (!$this.validate()) {
		console.log('Register form validation failed');
		return false;	
		}
	
	var p= {};
	p.ajaxServer= "user_manager";
	p.action= 'user_registration';
	p.url= app.serverUrl + 'umanager/';
	p.values= {username:input.username,email:input.email,password:input.password};
	p.types= {username:2,email:2,password:2}; // PDO data types values
	p.hasLoader= true;
	$this.ajaxParams= p;
	
	app.ajax.init();
	app.ajax.context= "User registration";
	app.ajax.successAction= $this.onSuccess;
	
	app.ajax.errorAction= $this.onError;
	
	app.ajax.send(p);

	},
	
	validate: function () {
		
	var $this= app.processRegister;
	var input= $this.input;
	var inputList= {};
	inputList.username= true;
	inputList.email= true;
	inputList.password= true;
	
	return app.util.validateForm(inputList, input);
	
	},
	
	onSuccess: function (data) {

	app.goHome('registered');
	
	},
	
	onError: function (data) {

	app.widgets.showMessage('Network error! Action failed.', 'error');
	console.log('Error: '+ data);

	}
	
}