app.processContent= {
	/**
	*Load page content from content objects
	*
	*/
	loadPageContent: function () {

		if (typeof(app.currentContent) === 'undefined' ) {
		console.log('current content not found for ' + app.pageTemplate);
		return;			
		}
	
		if (typeof(app.currentContent['pageVar']) === 'undefined') {		
		console.log('content of pageVar is empty for ' + app.pageTemplate);	
		return;
		}
	
	var pageVar= app.currentContent['pageVar'];

		$('#'+app.pageTemplate+' [data-var]').each(function (ix) {
		var $el= $(this);
		var varName= $el.attr('data-var');
		
			if (typeof(app.context[varName]) !== 'undefined') {
			$el.html(app.context[varName]);
			}
			else if (typeof(pageVar[varName]) !== 'undefined') {
			$el.html(pageVar[varName]);
			}
			else {
			$el.hide();
			console.log('No value for varName '+ varName);		
			}
			
		});

	},
	
	/**
	*Load page rows (page loop items) from content objects
	*
	*/
	loadRowsContent: function () {

		if (typeof(app.currentContent) === 'undefined' ) {
		console.log('current content not found for ' + app.pageTemplate);
		return;			
		}
	
	// make sure there's no content
	$('#'+app.pageTemplate +' .contentRow').each(function(ix){ 
	$(this).removeClass('contentRow').remove();
	});
	
	var $templates= $('#'+app.pageTemplate +' .tmpl');

	var $templateParent= $templates.parent();

	var $template= $('<div />');
	
	$templates.each(function(ix){ 
	var $el= $(this).clone().show();
	$el.removeClass('tmpl').addClass('contentRow');

	$template.append($el);	
	$(this).hide();
	});
		
	var $container= $('<div />');
	
	var countRows= 0;
	
		while ( typeof(app.currentContent['row_'+countRows]) !== 'undefined' ) {
		
		var $html= $template.html();				
		
		var row= app.currentContent['row_'+countRows];
		
			for (var nameVar in row) {
				
				if (row.hasOwnProperty(nameVar)) {
				
				var varValue= row[nameVar];	
				
				$html=app.util.varReplace(nameVar, varValue, $html);
		
				}
			}					

		
		// mark the first locked item
		$html= $($html);
		if ((0 == countRows) && $html.hasClass('locked')) {		
		$html.addClass('first-locked');	
		}
		
		$container.append($html);	
		countRows++;
		
		}
		
	$templateParent.append($container.html());	

	},
	/**
	*Load page rows (page loop items) from content objects
	*
	*/
	loadQuizList: function () {

		if (typeof(app.currentContent) === 'undefined' ) {
		console.log('current content not found for ' + app.pageTemplate);
		return;			
		}
		
	var countQuiz= 0;
	
		while ( typeof(app.currentContent['quiz_'+countQuiz]) !== 'undefined' ) {
		
		var quiz= app.currentContent['quiz_'+countQuiz];
		
		$('#'+app.pageTemplate+' .quizList').append(app.widgets.promptQuiz.get(quiz.quizId, quiz.sourceId, quiz.title, quiz.unlock)).enhanceWithin();	
		
		countQuiz++;
		
		}

	},
	/**
	*Load page html file content
	*
	*/
	loadHtmlContent: function () {
		var max= 20;
		
		app.lastContentGroup= 0;
		app.lastPage= 0;
		app.lastRow= 0;
		
		for (var i=0; i <= max; i++) {
			if ((typeof(app.appContent) === 'object') && (typeof(app.appContent[i]) === 'object')) {
			
			var contentGroup= app.appContent[i];
			var pageRefList= [i, i+'_1', i+'_2'];
			var j= 0;
			
			// add page_0 reference
			app.appContent[0]['page_0']= app.appContent[0]['index'];
			
				// if page object exists
				while(typeof(contentGroup['page_'+pageRefList[j]]) === 'object') {
				
				var pageRef= pageRefList[j];
				var page= contentGroup['page_'+pageRef];
				
					// if page has file content
					if ((typeof(page.hasHtmlContent) !== 'undefined') && page.hasHtmlContent) {
											
					// create temp DOM element and load html file
					$('<div></div>').attr('id', 'html_'+pageRef).jqmData('contentSourceId', i).jqmData('pageRef', pageRef).hide().appendTo($('body')).load(app.homeDir+'model/html/content_'+pageRef+'.html', function () {
							
						// inside asynchronous callback
						var i= $(this).jqmData('contentSourceId');
						var pageRef= $(this).jqmData('pageRef');
						
						// last
						app.lastContentGroup= i;
						app.lastPage= 'page_'+pageRef;
						
						// grab rows and add to content object
						var $rows= $('#html_'+pageRef+' .row');
						
							if ($rows.length > 0) {
								
							// pass values to rows
							$rows.jqmData('contentSourceId', i);
							$rows.jqmData('pageRef', pageRef);
							
								$rows.each(function (ix) {
								
								// inside asynchronous function for each
								var i= $(this).jqmData('contentSourceId');
								var pageRef= $(this).jqmData('pageRef');
								
								var page= app.appContent[i]['page_'+pageRef];
								// transfer row content
								page['row_'+ix]= {};
								page['row_'+ix].text= $(this).html();
								
								// save
								app.lastRow= ix;
								
								});
							}
							// or grab whole html content
							else {
								var page= app.appContent[i]['page_'+pageRef];
								page['text']= $(this).html();
								
							}
						});
					}
				
				j++;
				
				} // closes while
			}
		}// closes for
	
	// clean up	
	window.setTimeout(app.processContent.removeLoadedHtml, 1000);

	},
	/**
	*Remove loaded html content from DOM
	*/
	removeLoadedHtml: function () {
	
	var minContent= 7;
	var lastPage= 'page_7';
	var minRow= 10;
	var max= 20;

		// check if loaded
		if (typeof(app.appContent[minContent][lastPage]['row_'+minRow]) === 'object') {
			
			for (var i=0; i <= max; i++) {
				
			var pageRefList= [i, i+'_1', i+'_2'];
			var j= 0;
			
				// if page object exists
				while($('#html_'+pageRefList[j]).length > 0) {
					
				$('#html_'+pageRefList[j]).remove();
					
				j++;
				
				}
			}
			
			console.log('Loaded html removed');
		}
		else {
		window.setTimeout(app.processContent.removeLoadedHtml, 1000);
		}
	}
}