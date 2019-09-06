app.processTemplates= {
	add: function () {
			
		// add to page 1
		if (('page_1' == app.pageTemplate) && ($('#page_1 .tmpl').length == 0)) {
		$('#page_1 .pagemenu').load(app.templates.page_1, app.processContent.loadRowsContent);

		}
	}
}