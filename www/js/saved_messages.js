/**
*Saved messages
*/
app.SAVED_MESSAGES= function () {
	
	var obj= {
		
		init: function (room_id) {
		this.isValid= false;
		
		this.room_id= room_id;
		
			if (typeof(room_id) != 'number') {
				console.log('Error: invalid room_id, must be a number');
				return false;
			}
			else {
			this.isValid= true;
			}
			
		this.lastStorageIx= this.lastStorageIx ||  (app.storage.get(this.getLastStorageIxName()) ||  0);
		

		// maximum number of messages saved per room
		this.maxSize= 100;
		this.messages= [];
		},
		/**
		*get name used for last message id in storage object
		**/
		getLastStorageIxName: function () {
			return 'chat'+app.savedMessages.room_id+'lastStorageIx';
		},
		/**
		*get name used for last message time in storage object
		**/
		getLastMessageTimeName: function () {
			return 'chat'+app.savedMessages.room_id+'lastMessageTime';
		},
		/**
		*get name used for last message database id in storage
		**/
		getLastMessageIdName: function () {
			return 'chat'+app.savedMessages.room_id+'lastMessageId';
		},
		/**
		*save value of last message index in storage
		**/
		setLastStorageIx: function (ix) {
			app.savedMessages.lastStorageIx= ix;
			app.storage.set(app.savedMessages.getLastStorageIxName(), ix);
		},
		/**
		*Make a message name using the message id
		**/
		getMessageName: function (messageId) {
			return 'chat'+app.savedMessages.room_id+'ms'+messageId;
		},
		/**
		*get the last message name
		**/
		getLastMessageName: function () {
			return app.savedMessages.getMessageName(app.savedMessages.lastStorageIx);
		},
		/**
		*get the next message name
		**/
		getNextMessageName: function () {
			return app.savedMessages.getMessageName(app.savedMessages.lastStorageIx+1);
		},
		/**
		*save a message
		**/
		saveMessage: function (htmlMessage, id, time) {
		var $this= app.savedMessages;
			
			// start saving from id 0 if the maximum is reached
			if (($this.maxSize-1) == $this.lastStorageIx) {
			var ix= $this.lastStorageIx= 0;	
			}
			else {
			var ix= ++$this.lastStorageIx;	
			}
			
			$this.messages.push(htmlMessage);
			app.storage.set($this.getMessageName(ix), htmlMessage);
			$this.setLastStorageIx(ix);
			$this.setLastMessageId(id);	
			$this.setLastMessageTime(time);
		},
		/**
		*Check if object has messages left
		*/
		hasMessages: function () {
		
			return (app.savedMessages.messages.length > 0) || false;
		},
		/**
		*Set last message time
		*/
		setLastMessageTime: function(time) {
		var $this= app.savedMessages;

		//debug
		//confirm('last time was '+$this.lastMessageTime+' new time is ' +time);
		 
		$this.lastMessageTime= time;
			
		app.storage.set($this.getLastMessageTimeName(), time);

		},
		
		/**
		*Set last message database id
		*/
		setLastMessageId: function(id) {
		var $this= app.savedMessages;
		
		// debug
		//confirm('last id was '+$this.lastMessageId+' new id is ' +id);
		 
		$this.lastMessageId= id;
		app.storage.set($this.getLastMessageIdName(), id);
		
		},

		/**
		*Get last message in the list
		*/
		getLastMessage: function() {
			return app.savedMessages.messages[app.savedMessages.lastStorageIx];
		},
		/**
		*load messages from storage
		*/
		load: function () {
		var $this= app.savedMessages;
		
			var index= $this.lastStorageIx; 
			var counter= 0;
						
			if (0 < $this.maxSize) {
				while ((counter <= $this.maxSize) 
					&& typeof(app.storage.get($this.getMessageName(index)) !== 'undefined')) {
					// return to maxsize if 0 is reached
					if (index == 0) {
					index= $this.maxSize-1;	
					}			
		
				$this.messages.unshift(app.storage.get($this.getMessageName(index)));
				counter++;
				index--;
				}
			}

		}
	}
	
	return obj;
}