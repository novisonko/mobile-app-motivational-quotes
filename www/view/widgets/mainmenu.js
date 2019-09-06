 app.widgets.mainmenu= {
	 
	get: function () {
	var menu= [];
	
		menu.push('<div id="mainMenu" class="" data-role="panel" data-position="left" data-display="overlay" data-position-fixed="true" data-swipe-close="true">');
		menu.push('<h3>'+ app.t('Menu') +'</h3>	<hr> <ul data-role="listview">');
		
		menu.push('<li><a href="#page_0_about" data-context="about">'+app.t('About this app')
			+'</a></li>');			
			
			if (app.user.isLoggedIn) {
			menu.push('<li><a href="page_10_account_settings">'+app.t('Account settings')+'</a></li>');
			}
			else {
			menu.push('<li><a href="#page_10_login" data-context="login">'+app.t('Login')+'</a></li>');
			menu.push('<li><a href="#page_10_register" data-context="register">'+app.t('Register')+'</a></li>');
			}
		
		menu.push('<li><a href="#page_12_partners">'+ app.t('Partners') +'</a></li>');			
	
	
		menu.push('<li><a href="@chat_rooms" data-context="chat_rooms">'+app.t('Chat')+'</a></li>');
		
		if (app.user.isLoggedIn) {
		menu.push('<li><a class="logout" href="#index" data-context="logout">'+ app.t('Log out') +'</a></li>');		
		}
		
		menu.push('<li><a class="exit" href="#index">'+ app.t('Exit') +'</a></li>');		

		menu.push('</ul>');		
		
		
		menu.push('</div>');
		
		return $(menu.join(''));
	},
	
	popup: function () {
		
	$( "#popupMainMenu" ).popup();
	},
	
	addCloseEvent : function (selector) {
		$(document).off('click', selector).on('click', selector, function(e) {
		$( "#popupMainMenu" ).popup( "close" );
		});
	}
	
 }