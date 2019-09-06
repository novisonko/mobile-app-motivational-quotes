app.widgets.resetPwdForm= {

	get: function () {
	var form= [];
	
	form.push('<div id="resetPwdForm" class="form">');
	form.push('<button id="resetPwdSubmit">'+ app.t('Submit') +'</button>');
	form.push('</div>');
	
	return $(form.join(''));
	}

 }