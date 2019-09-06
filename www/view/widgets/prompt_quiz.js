app.widgets.promptQuiz= {
	 
	get: function (quizId, sourceId, title, unlock) {
		
		if ((quizId >= 0) && (sourceId >= 0) && (title.length > 0)) {
		
		var button=[];			

		var btnClass= 'class="ui-btn ui-corner-all ui-shadow ui-icon-plus ui-btn-icon-left"';

		button.push('<a class="promptQuiz" href="#'+app.quizTemplate+'" data-role="button"');
		button.push(' data-context="quiz" data-quizid="'+quizId+'" data-sourceid="'+sourceId+'" data-unlock="'+unlock+'">');
		button.push(app.t(title));
		button.push('</a>');
			
		return $(button.join(''));
		
		}
	}
}