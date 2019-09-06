/**
*Redirect link
*
*How to create a page: a page has a template (physical file, reference is app.pageTemplate) and a name (ref is newPage or app.currentPage). The template ref is used to find the page file. The page ref is used to find the page content in the app.pageContent object. The page content object is referenced by the app.contentSourceId index.
*/
app.redirectLink= function ($el, newPage) {
var user= app.user;
var redirectTo= '';
var pageTemplate= '';
var continueTo= '';
var contextName= '';

	switch (newPage) {
		
		case '@chat_rooms':

			if (0 == user.username.length)  {
				
				app.contentSourceId= 11;
				pageTemplate= 'page_'+ app.contentSourceId +'_get_username';
				redirectTo= 'page_'+ app.contentSourceId +'_get_username';
				continueTo= 'page_'+ app.contentSourceId +'_chat_rooms';
				contextName= 'get_username';
			}
			else {
				app.contentSourceId= 11;
				pageTemplate= 'page_'+ app.contentSourceId +'_chat_rooms';
				redirectTo= 'page_'+ app.contentSourceId +'_chat_rooms';
				continueTo= 'page_'+ app.contentSourceId +'_chat_rooms';
				contextName= 'chat_rooms';
				
			}
			
		break;
		
		case '@change_username':
		case '@change_password':
		case '@change_email':
		
		var reMatch= newPage.match(/@change_(.+)/);
		
			if (reMatch != null) {
			redirectTo= 'page_change_' + reMatch[0];
			continueTo= 'index';
			contextName= 'change_credentials_'+reMatch[0];
			app.contentSourceId= 10;
			pageTemplate= 'page_'+app.contentSourceId+'_'+reMatch[0];		
			}
			
		break;
		
	}
	
	if (redirectTo.length == 0) {
	return false;	
	}

	$.mobile.loading( 'show' );		

	continueTo= (continueTo.length > 0) ? continueTo : 'index'; 
	
	// if no template, redirect to home page
	var newPagePath= (pageTemplate.length > 0) ? app.homeDir + 'view/' + pageTemplate + '.html' : app.homeDir + 'index.html';	
	
	app.newPage= redirectTo;
	app.pageTemplate= pageTemplate;
	app.continueTo= continueTo;
	app.newContext.redirected= true;
	app.newContext.name= contextName;

	return true;
}