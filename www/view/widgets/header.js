app.widgets.header= {
	 
	get: function () {
	var header=[];

		switch (app.currentPage) {

			default:
			$('div#'+app.pageTemplate+'>div[data-role=header]').remove();
			
			header.push('<div data-role="header" data-position="fixed" data-tap-toggle="false">');			
			header.push('<a href="#mainMenu" data-context="menu"><i class="fa fa-bars"></i></a>');	
			header.push('<h3 data-var="title"></h3>');										
			header.push('<a href="#index" data-context="home"><i class="fa fa-home"></i></a>');	
			header.push('</div>');
			break;
		}
		
	return $(header.join(''));
	
	}
 }