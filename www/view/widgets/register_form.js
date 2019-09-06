 app.widgets.registerForm= {
	 
	get: function () {
	var form= [];
	
	form.push('<div id="registerForm" class="form">');
				
	form.push('<ul class="innerForm" data-role="listview">');
		          
	form.push('<li><label for="username">'+ app.t('Username') +':</label>');
	form.push('<input name="username" id="username" value="" type="text"></li>');
	form.push('<li><label for="email">'+ app.t('Email') +':</label>');
	form.push('<input name="email" id="email" value="" type="email"></li>');
	form.push('<li><label for="password">'+ app.t('Password') +':</label>');
	form.push('<input name="password" id="password" value="" type="password"></li></ul>');
	form.push('<button id="registerSubmit">'+ app.t('Register') +'</button>');
	form.push('<i class="fa fa-angle-down arrow" style="display:none;"></i></div>');
	
	return $(form.join(''));
	}

 }