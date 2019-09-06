app.CHAT= function () {

	var obj= {
		/**
		*initialize
		*/
		init: function() {

		this.canListen= false;
		this.inBackground= false;
		
		this.database= 'dbeez_chat';
		this.collection= 'messages';
		
		this.currentRoom= app.context.id || 0;	

		// maximum number of rooms to display
		this.maxDisplayRooms= 5;
		// maximum size of room - in number of users
		this.maxSizeRoom= 100;
		
		// max number of messages hidden
		this.maxOldMessages= 40;	
		// max number of displayed messages
		this.maxMessagesDisplay= 10;
		
		// max number of messages
		this.maxMessages= this.maxOldMessages + this.maxMessagesDisplay;
		
		// listen to server time interval
		this.listenInterval= 5000;
		
		// position of message in list
		this.messagePosition= app.storage.get('chat'+this.currentRoom+'MessagePosition') || 'right';
		
		this.savedMessages= new app.SAVED_MESSAGES();
		app.savedMessages= this.savedMessages;
		
		// clean
		$('#messageList li').remove();		
		$('#showOld').html('');
		
		// initialize messageContent
		app.adjustDisplay (function () {
		$('#messageContent').val('');			
		});
				
		},
		/**
		*add show old button
		*/
		addShowOldBtn: function () {
		var btn= ('<button id="showOldBtn" data-role="button" data-corners="false">'+app.t('Show previous')+'</button>'+
		'<button id="hideOldBtn" style="display:none;" data-role="button" data-corners="false">'+app.t('Hide previous')+'</button>');
		
			if ($('#messageList li.old').length) {
				
				if ($('#showOldBtn').length == 0) {
				$('#top-nav').append($(btn)).enhanceWithin();
				}
				
			$(document).off('click', '#showOldBtn').on('click', '#showOldBtn', function (e) {
				app.chat.showOldMessages();	
				app.chat.messagesScrollToTop();
				app.chat.adjustDisplay();
			});
					
			$(document).off('click', '#hideOldBtn').on('click', '#hideOldBtn', function (e) {
				app.chat.hideOldMessages();
				app.chat.messagesScrollToBottom();
				app.chat.adjustDisplay();
			});
			
			}
		},
		/**
		adjust display 
		*/
		adjustDisplay: function () {
		
		var $showOldBtn= $('#showOldBtn');
		
			if (!$showOldBtn.length) {
			app.chat.addShowOldBtn();
			}
		
		var $hideOldBtn= $('#hideOldBtn');
		var oldLength= $('#messageList li.old').length;
		
			if (0 == oldLength) {
			$showOldBtn.hide();
			$hideOldBtn.show();
			}			
			else if (0 < oldLength) {
			$showOldBtn.show();
			$hideOldBtn.hide();
			}		
			
		},
		/**
		*get rooms
		*/
		getRooms: function() {
			
		var p= {};
		p.url= app.serverUrl + 'chat/';
		p.action= 'select';
		p.query= {projection:{room_id:1,message:0,time:0},sort:{time:-1},limit:1000};
		this.ajaxParams= p;
		
		app.ajax.init();
		app.ajax.context= "get chat rooms from server";
		app.ajax.displayServerMessage= false;
		app.ajax.successAction= this.sortLoadRooms;
		app.ajax.send(p);

		},
		/**
		*Sort rooms then add to page
		*/
		sortLoadRooms: function(data) {
		var found=[];
		var imax= data.length;
		var rooms= [];
			for(var i=0; i < imax; i++) {
				if (typeof(found[data[i].room_id]) === 'undefined'){
				found[data[i].room_id]= 1;	
				}
				else {
				found[data[i].room_id]++;
				}
			}

			function compare (roomA,roomB) {
			var idA= roomA.room_id;
			var idB= roomB.room_id;
				if (found[idA] < found[idB]) {
					return -1;
				}
				else if (found[idA] == found[idB]) {
					return 0;
				}
				else {
				return 1;	
				}
			}
			
			data.sort(compare);
			
			// load rooms
			var imax= data.length;
			for(var i=0; i < data.length; i++) {
				if (i < this.maxDisplayRooms) {
				var room_id= data[i].room_id;
					if (found[room_id] < this.maxSizeRoom) {
					app.currentContent['row_'+i]=[room_id, app.t('Room')+' '+room_id];
					}
				}
				else break;
			}
		},
		/**
		*initialize messenger service
		*/
		initMessenger: function() {

		/* debug
		console.log('initMessenger with room id '+this.currentRoom);*/
		
		var $this= app.chat;
		
		// insert saved messages
		$this.savedMessages.init(this.currentRoom);
		$this.savedMessages.load();
		var counter= 0;
		var messages= $this.savedMessages.messages;
		var imax= messages.length - 1;

			while ((typeof(messages[imax]) !== 'undefined') && (counter <= (this.maxMessages-1))) {
			this.addMessage('prepend', messages[imax]);	
			imax--;
			counter++;
			}
		
		// format time
		window.setTimeout(app.chat.formatTimestamp, 0);
		
		this.lastMessageReceived= '';
		var sm= $this.savedMessages;
		this.lastMessageTime= Number(app.storage.get(sm.getLastMessageTimeName())) || (app.util.getTimestamp()-(3600*24));
		this.lastMessageId= app.storage.get(sm.getLastMessageIdName()) || 'unknown';	
	
		// enlarge when document is clicked
		$(document).off('click').on('click',function (e) {
			
		// estimate page height
		var pageHeight= $('#media-query-bridge').height();
		
			if (pageHeight <= 375) {	
			// chat message container			
			$('#messageList').removeClass('shortList').removeClass('longList').addClass('mediumList');
			}	
		});
		
		// reduce when textarea is clicked
		$(document).off('click', '#messageContent').on('click','#messageContent', function (e) {
			
		// estimate page height
		var pageHeight= $('#media-query-bridge').height();
		
			if (pageHeight <= 375) {	
			// chat message container	
			$('#messageList').removeClass('mediumList').removeClass('longList').addClass('shortList');	
			}
		
		/*place cursor at start of text
		$(this).selectRange(0);*/
		e.stopPropagation();
		});
		
		//scroll to bottom when textarea is clicked
		$('#messageContent').focus(function(e) {	
		e.stopPropagation();	
		app.chat.waitToScrollToBottom();			
		});
			
		/* activate send message button
		* and define click event
		*/
		$(document).off('click', '#sendMessageButton').on('click', '#sendMessageButton', function (e) {		
		
		sendMessage();	
		app.chat.messagesScrollToBottom();	
		e.stopPropagation();
		});
		
			// send message
			var sendMessage= function () {
			var message= $('#messageContent').val();
				
				if (!$this.validate(message)) {
				return;
				}
			
			$this.sendMessage(message);
				
			}// end function

		},
		/**
		* Listen to server for new messages
		*/
		listen: function() {

		var $this= app.chat;
			
			if (!app.isOnline()) {
			return;
			}
			
			if ($this.canListen && (app.chat.listenInterval > 0)) {
				
			var sm= $this.savedMessages;
			
			var p= {};
			p.database= app.chat.database;
			p.collection= app.chat.collection;
			p.url= app.serverUrl + 'chat/';
			p.action= 'select';
			p.query= {filter:{room_id:{$eq:$this.currentRoom},_id:{$ne:$this.lastMessageId},
			username:{$ne:app.user.username},time:{$gte:$this.lastMessageTime}},
			projection:{_id:1,username:1,avatar:1,room_id:1,message:1,time:1},sort:{time:-1},limit:2};
			$this.ajaxParams= p;
			
			app.ajax.init();
			app.ajax.context= "listen for chat messages";
			app.ajax.send(p);

			app.ajax.successAction= $this.appendServerMessages;
			app.ajax.noResultAction= $this.onNoResult;
			
			window.setTimeout($this.listen, app.chat.listenInterval);
			
			}
			else {console.log("Error: chat can't listen!");}
		},
		/**
		*validate message
		*/
		validate: function (msg) {
			
			if (msg.length >= 2) {
			return true;	
			}
			else if (msg.length < 2) {
				if (isNaN(msg)) {
				app.widgets.showMessage('At least 2 characters!', 'error'); 
				}
				else if (msg.length > 0) {
				return true;
				}
			}

		return false;
		},
		/**
		*Send message to server 
		*/
		sendMessage: function (message) {
		
		var $this= app.chat;
	
			if (!app.isOnline()) {
			return;
			}		
		
		var p= {};	
		p.database= app.chat.database;
		p.collection= app.chat.collection;
		p.url= app.serverUrl + 'chat/';
		p.message= message;
		p.action= 'insert';
		p.query= {0:{username:app.user.username,room_id:$this.currentRoom,message:p.message,avatar:app.user.avatar}};
		$this.ajaxParams= p;
		
		app.ajax.init();
		app.ajax.context= "send chat message";
		app.ajax.successAction= $this.appendSentMessage;
		
		app.ajax.errorAction= function (data) {
			app.widgets.showMessage('Network error');
			console.log('Send message failed!');
			window.setTimeout(function(){$('#'+app.currentPage+' .systemMessage').hide();}, 5000);
			}
		
		app.ajax.send(p);

		},
		/**
		*Update message list with sent message
		*/
		appendSentMessage: function (data) {
			
			if (typeof(data._id) !== 'undefined') {
				
			var $this= app.chat;
			// local reference of sent message		
			var p= $this.ajaxParams;	
			
			// update lastMessage data
			var id= $this.lastMessageId= data._id;
			var time= $this.lastMessageTime= data.time;
		
			// calculate approximative time difference with server
			app.serverTimeDiff= app.util.getTimestamp() - Number(time);
			
			var message= p.message;
			var username= app.user.username;
			var avatar= app.user.avatar;
				
			// save message
			
			var htmlMessage= app.chat.makeHtmlMessage(id, time, username, message, avatar);
			$this.savedMessages.saveMessage(htmlMessage, id, time);
			app.chat.addMessage('append', htmlMessage);
			
			app.chat.messagesScrollToBottom();
			
			// clear
			$('#messageContent').val('');
			
			window.setTimeout(app.chat.formatTimestamp, 0);
			
			}
			else {
			console.log('Unexpected result in chat.appendSentMessage. data is '+app.util.dump(data));	
			}		
		},
		/**
		*Update message list
		*/
		appendServerMessages: function (data) {
		
		var $this= app.chat;
		
			if (Array.isArray(data)) {
			var str;	
			var imax= data.length-1;
			
				for(var i=imax;i>=0;i--)
				{
				
				// message saved
				var id= data[i]._id;						
				var time= Number(data[i].time);				
				var message= data[i].message;
				
					if (time < $this.lastMessageTime) {
					console.log('message time inferior to last received');
					continue;
					}
					else if (id == $this.lastMessageId) {
					console.log('message id already received');
					continue;				
					}					
					else if (message == $this.lastMessageReceived) {
					console.log('message content already received');
					continue;
					}
					else {
					
					// update
					$this.lastMessageId= id;
					$this.lastMessageTime= time;
					$this.lastMessageReceived= message;	
					}
				
				var roomId= data[i].room_id;
				var username= data[i].username;
				var avatar= data[i].avatar;
			
				// append to list			
					var htmlMessage= app.chat.makeHtmlMessage(id, time, username, message, avatar);
					$this.savedMessages.saveMessage(htmlMessage, id, time);
					app.chat.addMessage('append', htmlMessage);
					
					if (app.chat.inBackground) {
					app.chatMessageNotify(roomId, time, username, message, avatar, htmlMessage);
					}
				}
				
			window.setTimeout(app.chat.formatTimestamp, 0);
		
			}
			else {
			console.log('chat message data is not an array');
			}

		},
		/**
		*Add to message list
		*/
		addMessage: function (option, message) {
		
		var $message= $(message).addClass('new');
		
			if ('append' == option) {
			$('#messageList').append($message);	
			}
			else {
			$('#messageList').prepend($message);		
			}
				
			app.chat.hideOldMessage();
			app.chat.removeOldMessage();
			app.chat.adjustDisplay();

		},
		/**
		*Make an html message line from data
		*/
		makeHtmlMessage: function  (id, time, username, message, avatar) {
		
		// convert
		var timestamp= Number(time)+app.serverTimeDiff;
		
		var $this= app.chat;
		var userClass= (username == app.user.username) ? 'myself' : 'otheruser';
		var position= ($this.messagePosition == 'right') ? 'left' : 'right';
		$this.messagePosition= position;
		app.storage.set('chat'+this.currentRoom+'MessagePosition', position);
		
		var html=[];
		html.push('<li data-id="'+id+'" data-time="'+time+'" class="chat-item '+userClass+'">');
		html.push('<div class="chat-col-'+position+'">');
		html.push('<div class="username">'+username+'</div>');
		html.push('<div class="avatar"><img src="'+app.homeDir+avatar+'"></div>');			  
		html.push('<div class="message">');
		html.push('<div class="chat-text">'+message+'</div>');
		html.push('<div class="chat-time" data-timestamp="'+timestamp+'"></div>');
		html.push('</div></div></li>');
		
		return (html.join(' '));
		
		},
		/**
		*Hide old messages
		*/
		hideOldMessage: function () {
		var $this= app.chat;
		var $displayed= $('#messageList li.new');
		
			if ($this.maxMessagesDisplay < $displayed.length) {
			$displayed.first().removeClass('new').addClass('old').hide();	
			}
		},
		/**
		*Remove old message
		*/
		removeOldMessage: function () {
		var $this= app.chat;
		var $old= $('#messageList li.old');
		
			if ($this.maxOldMessages < $old.length) {
			$('#messageList li.old').first().remove();	
			}
		},
		/**
		*Show old message
		*/
		showOldMessages: function () {
		var $this= app.chat;
		var $old= $('#messageList li.old');
		var counter= 0;
		var maxShow= 1;
		var total= $old.length;
		
			$old.each(function (ix) {
				if (ix > (total - maxShow - 1)) {
				$(this).addClass('new').removeClass('old').show('slow');
				}
			});
		},
		/**
		*Hide old messages
		*/
		hideOldMessages: function () {
		var $this= app.chat;
		var $new= $('#messageList li.new');
		var size= $new.length;
		
		$new.each(function (ix) {		
			if ((ix+1) <= (size - $this.maxMessagesDisplay)) {
			$(this).removeClass('new').addClass('old').hide('slow');		
			}
			$this.removeOldMessage();
		});

		},
		
		/**
		*Scroll to last message
		*/
		messagesScrollToBottom: function () {
		
		var $el= app.chat.messageList || $('#messageList');

			if (($el.length > 0) && !$el.is(":focus")){
			
			var mlist= document.getElementById("messageList");

				if ((typeof(mlist) === 'object') && (mlist != null) && (mlist.scrollHeight > 0) )  {					
				app.util.scrollToBottom($el, mlist.scrollHeight);
				}
				
			}
			
		// save message list
		app.chat.messageList= $el;
		
		},
		/**
		*wait to scroll to bottom
		*/
		waitToScrollToBottom: function () {
		var $this= app.chat;
		
			if ($('#messageList').height() != $this.shortHeight) {
			window.setTimeout(app.chat.waitToScrollToBottom, 100);
			}
			else {
			app.chat.messagesScrollToBottom();	
			}
		},
		/**
		*Scroll to first message
		*/
		messagesScrollToTop: function () {
		
		var $el= $('#messageList');
		
			if (!$el.is(":focus")){
			var scrollHeight= document.getElementById("messageList").scrollHeight;
			$el.scrollTop(0);
			}			  
		},
		/**
		*format timeStamp
		*/
		formatTimestamp: function () {
		var timeAgo;
		var $el= $('#messageList .chat-time');
			$el.each(function (ix) {
			var timestamp= Number($(this).jqmData('timestamp'));
			timestamp += app.serverTimeDiff;
			timeAgo= app.util.timeAgo(timestamp);
			var text= ((typeof(timeAgo) !== 'undefined') && (timeAgo.length > 0)) ? timeAgo +' '+ app.t('ago') : '';
			$(this).text(text);
			});
			
		},
		/**
		*No result action
		*/
		onNoResult: function (data) {
			
			if (typeof(app.chatErrorDisplayed) === 'undefined') {
			app.chatErrorDisplayed= 0;
			}
			
			if (app.chatErrorDisplayed < 3) {
			app.widgets.showMessage('There is a bug on the network and the request failed... Sorry, try again later.', 'error');
			}
			
		app.chatErrorDisplayed++;
		
		console.log('No result: '+ data);

		}
	}
	
	return obj;
}

