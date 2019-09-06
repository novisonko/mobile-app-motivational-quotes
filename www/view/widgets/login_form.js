 app.widgets.loginForm= {
	 
	get: function () {
	var form= [];
	
	form.push('<div id="loginForm" class="form">');
	
	form.push('<ul class="innerForm" data-role="listview">');
	form.push('<li><label for="email">'+ app.t('Email') +':</label>');
	form.push('<input name="email" id="email" value="" type="email"></li>');
	form.push('<li><label for="password">'+ app.t('Password') +':</label>');
	form.push('<input name="password" id="password" value="" type="password"></li></ul>');
	form.push('<button id="loginSubmit">'+ app.t('Sign in') +'</button>');
	form.push('<i class="fa fa-angle-down arrow" style="display:none;"></i></div>');
	
	return $(form.join(''));
	
	}
 }