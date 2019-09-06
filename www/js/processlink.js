app.processLink= function(e) {

	e.preventDefault();			
	
	var href= $(this).attr('href');
			
	// redirect to new page or not
	if (!app.redirectLink($(this), href)) {
	
	var context= $(this).jqmData('context') || 'home';	
			
		if ('#mainMenu' === href) {
		return;	
		}
		else if ('#index' === href) {
		
			if (app.currentPage == 'index') {
				
				if ('logout' == context) {
				app.goHome('logout');	
				}
			console.log('already on index page...');	
			return;	
			
			}
			
		$.mobile.loading( 'show' );			
		app.newPage= 'index';	
		app.newContext.name= context;
		}
		else {
			
		var reMatch= href.match(/(page_.+)$/);
		
			if (reMatch != null) {   
			app.newPage= reMatch[0];
			
			// check if unlocked
			if ($(this).hasClass('locked')) {
			console.log(app.newPage+' not unlocked');
			return;	
			}
			
			// get context
			app.newContext.name= context;
			
			}
			else if (app.debug){
			console.log('Page regex did not find a match for ' + $(this).attr('href'));		
			return;
			}
		}
		
    }										
		
	$.mobile.loading( 'show' );	
	
	// get id
	app.newContext.id= Number($(this).jqmData('id')) || 0;		

	app.clicked= $(this);		
	app.onPageChange($(this));
	
}