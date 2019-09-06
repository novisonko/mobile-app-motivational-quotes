app.widgets.footer= {
	 
	get: function () {
	var footer=[];

		switch (app.currentPage) {
		
		case 'index':
		case 'index_about':
			
		$('div#'+app.pageTemplate+'>div[data-role=footer]').remove();	
	
		footer.push('<div class="footer default-footer footer-tall" data-role="footer" data-position="fixed" data-tap-toggle="false">');
		footer.push('</div>');	
		break;
		
		}		
		
	return $(footer.join(''));
		
	}
}