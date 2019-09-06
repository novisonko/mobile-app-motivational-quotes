app.onPageChange= function ($el) {

// newPage from redirectLink or processLink

var newPage= app.newPage;
	
	if (newPage.match(/^page(_\d{1,2}_\d{1,2}_\d{1,2})$/) != null) {
	app.pageTemplate= 'page_1_1_1';	
	}
	else if (newPage.match(/^page(_\d{1,2}_\d{1,2})$/) != null) {
	app.pageTemplate= 'page_1_1';	
	}
	else if (newPage.match(/^page(_\d{1,2})$/) != null) {
	app.pageTemplate= 'page_1';	
	}
	else {
	app.pageTemplate= newPage;	
	}
		
var newPagePath= app.util.getPagePath(newPage);
var dataUrl= app.util.getDataUrl(newPage);
  
app.currentPage= newPage;

// url to save in history is different from template url
app.util.changePage(newPagePath, dataUrl);

}