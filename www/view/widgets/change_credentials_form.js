app.widgets.changeCredentialsForm= {
	option: '',
	get: function (option) {
	
	this.option= option;
	var form=[];
	
		form.push('<div id="credentialsForm" class="form">');
		 
		form.push('<div class="current" style="display:none;"></div>');
		  
		form.push('<ul class="innerForm" data-role="listview">');
		       	
				if ('username' == option) {				  
				  form.push('<li><label for="username">'+ app.t('Username') +':</label>');
				  form.push('<input name="username" id="username"');
				  form.push('type="text"></li>');
				}
				else if ('email' == option) {	
				  form.push('<li><label for="email">'+ app.t('Your new email') +':</label>');
		          form.push('<input name="email" id="email"');
				  form.push('type="text"></li>');
				}
		
		var pwdMsg= ('password' == option) ? app.t('Your old password') : app.t('Your password');	

		form.push('<li><label for="password">'+ app.t('Password') +':</label>');
		form.push('<input name="password" id="password" placeholder="'+ pwdMsg +'" type="password"></li>');
		  
				if ('password' == option) {	
				form.push('<li><label for="newPassword">'+ app.t('New password') +':</label>');
				form.push('<input name="newPassword" id="newPassword" type="password" type="text">');
				form.push('</li>');
				}
				
		form.push('</ul><button id="submitCredentials">');
		form.push(app.t('Submit') +'</button><i class="fa fa-angle-down arrow" style="display:none;"></i></div>');
			
	return $(form.join(''));
	
	}
 }