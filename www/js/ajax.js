app.ajax= {
	context: "Unknown ajax context",
	init: function(){
		this.type= "post";
		this.dataType= "json";
		this.context= '';
		this.data= 
		
		/* let user read message returned by server
		*/
		this.displayServerMessage= false;
		
		/**
		*override for action after success
		*/
		this.successAction= function (data) {};
		/**
		*override for action after success
		*/
		this.noResultAction= function (data) { console.log('Sorry, this query returned an empty result...'); };
		/**
		*override for action after error
		*/
		this.errorAction= function (data) {};
		},
	success: function(data){
	
	$.mobile.loading( 'hide' );
	
	 app.ajax.data= data; 
		
			if (Array.isArray(data) && (200 == data[0]) && (0 < data[1])) {
			// send response to object success method
			app.ajax.successAction(data[2]);
			}
			else if (Array.isArray(data)) {
				
				if ((typeof(data[1]) === 'string') && (data[1].length > 10)) {
				app.ajax.noResultAction(data[1]);
				}
				
				console.log(data[0]+' '+data[1]);				
			}
			else if ((typeof(data) === 'string') && app.ajax.displayServerMessage) { 
			app.widgets.showMessage(data);
			}
			else if (typeof(data) === 'string') { 
			app.ajax.noResultAction(data);
			}
			else { 
			app.widgets.showMessage('Sorry, something went wrong...');
			
				if (app.debug) {
				console.log(data);	
				}
			}
			
			if (app.debug) {	
			console.log('ajax context SUCCESS, context is : '+app.ajax.context);
			}
		},

	error: function(data){
	
	console.log(app.util.dump(data));
	
	$.mobile.loading( 'hide' );
	
			app.ajax.data= data; 
				if (Array.isArray(data)) {
				app.ajax.errorAction(data[1]);
					if (app.debug) {
					console.log('ajax context ERROR, response is "'+data[0]+' '+data[1]+'", context is : '+app.ajax.context);	
					}	
				}
				else {
				app.ajax.errorAction(data);
					if (app.debug) {
					console.log('ajax context ERROR, response is "'+data+'", context is : '+app.ajax.context);	
					}
				}
			},

	send: function(p){
	var message;
	var ajaxServer= p.ajaxServer || '';
	
		switch(ajaxServer) {
			
		case "user_manager":
		message= {api_key:app.apiKey,app_ref:app.appRef,action:p.action,values:p.values,types:p.types};
		break;
		
		default:
		message= {api_key:app.apiKey,app_ref:app.appRef,database:p.database,collection:p.collection,action:p.action,query:p.query};
		break;	
		}
		
		if ((typeof(p.hasLoader) !== 'undefined') && (p.hasLoader === true)) {
		$.mobile.loading( 'show' );
		window.setTimeout(function () { $.mobile.loading( 'hide' ); }, 15000);
		}
		
		$.ajax({
		type: this.type,
		dataType: this.dataType,
		url: p.url,
		data: message,
		success: this.success,
		error: this.error
		});	
	}
};
