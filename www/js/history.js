app.pageImage= function () {

var context= app.context;
		
this.currentPage= app.currentPage;
this.pageTemplate= app.pageTemplate;
this.contentSourceId= app.contentSourceId;
// new context object created for each view on pagecreate event
this.context= app.context;

}

app.history= {

	/**
	*Initialize
	*/
	init: function () {
		this.ix= -1;
		this.list= [];
		this.navigating= false;
	},
	/**
	*get next index
	*/
	nextIndex: function () {
	return ++app.history.ix;
	},
	/**
	*add a page image
	*/
	add: function () {
		
	var $this= app.history;
	
		// cancel if navigating...
		if (true === $this.navigating) {
		$this.navigating= false;		
		return;	
		}		
	
	$this.list[$this.nextIndex()]= new app.pageImage();

	},
	/**
	*Step back in history
	*/
	back: function () {
	var $this= app.history;

	var arr= [];
	var max= app.history.list.length-2;
	
		if (max < 0) {
		return;	
		}
		
		for(var i = 0; i <= max; i++) {
		arr.push($this.list[i]);
		}
		
	$this.list= arr;
	$this.ix--;

	},
	/**
	*get current page image values
	*/
	getImage: function (index) {
	var $this= app.history;
	
		if (typeof(index) !== 'number') {
		var pageImage= $this.list[$this.list.length - 1];		
		} 
		else if (index >= 0) {
		var pageImage= $this.list[index];	
		}		
	
	return pageImage;
	
	},
	/**
	*Transfer pageImage value to current context
	*/
	useImage: function (pageImage) {
		
	app.currentPage= pageImage.currentPage;
	app.pageTemplate= pageImage.pageTemplate;
	app.contentSourceId= pageImage.contentSourceId;
	app.context= pageImage.context;
	
	},
	/**
	*get previous
	*/
	getPrevious: function () {
	var $this= app.history;
	
		var ix= $this.list[$this.list.length - 2];
		var previous= app.history.getImage(ix);
		if (typeof(previous) === 'object') {
		return previous;
		}
	}
}