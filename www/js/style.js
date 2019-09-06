app.style= {
	
	init: function () {
	var $this= app.style;
	
	$this.styles= [];
	
	},
	
	define: function () {
	
	var s= [];
	app.style.styles= s;
	var i= 0;
	var ref= app.styleRef;
	
	s[i++]='css/'+ref+'/cards.css';
	s[i++]='css/'+ref+'/nativedroid2-color.css';

	},
	
	load: function () {
	
	var $this= app.style;

	var max= $this.styles.length;
		for (var i=0; i < max; i++) {
			$this.insert($this.styles[i]);
			/* debug
			console.log('loaded content style: ' + $this.styles[i]);
			*/
		}
	},
	
	insert: function (source) {
	$('<link/>', {
   rel: 'stylesheet',
   type: 'text/css',
   href: source,
	}).appendTo('head');
	}
}


