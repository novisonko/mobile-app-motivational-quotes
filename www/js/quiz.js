app.QUIZ= function () {
	
	var obj= {
		/**
		*initialize
		*/
		init: function() {

		this.correctAnswerList= [];
		this.comment='';
		this.questionNumber= 0;
		this.quizId= app.quiz.quizId;
		this.unlock= app.quiz.unlock;
		this.sourceId= app.quiz.sourceId;
		this.score= 0;
		this.hasLegend= false;
		app.context.backButton= app.quizTemplate;
		// initialize DOM	
		$('div#'+app.quizTemplate+'>div[data-role=header] h3').text(app.t('Quiz')+' '+this.quizId);
		$('#score').hide();
		$('#nextQuestion').hide();

			if ((typeof(app.quizContent[this.sourceId]) !== 'undefined') && (typeof(app.quizContent[this.sourceId]['quiz_'+this.quizId]) !== 'undefined')) {
			this.quiz= app.quizContent[this.sourceId]['quiz_'+this.quizId];		
			this.name= app.t(this.quiz.name) || app.t('Quiz');
			this.maxQuestions= 0;
			var i= 0;
			
				while(typeof(this.quiz['q_'+i]) !== 'undefined') {
				this.maxQuestions++;
				i++;
				}
				
				if (0 < this.maxQuestions) {
				this.maxScore= this.maxQuestions * 100;
				// save template string
				this.loadContent();
				this.addEvents();
				}
				else {
				console.log('Could not find quiz questions for '+this.name);
				return false;	
				}
			}
			else {
			console.log('Could not find quiz content for '+this.name);
			return false;
			}

		},
		
		/**
		*Define events
		*/
		addEvents: function() {
		
		// select an answer
		$(document).off('click', '.option').on('click','.option', function (e) {
		$(this).toggleClass('selectedOption');
		$(this).toggleClass('notSelectedOption');
		});
		
		// submit an answer	
		$(document).off('click', '#submitAnswer').on('click', '#submitAnswer', function (e) {

		// get selected answers
			var selected=[];
			$('.selectedOption').each(function(ix) {
			selected.push(Number($(this).jqmData('optionNumber')));
			console.log('number is '+ $(this).jqmData('optionNumber'));
			console.log('element is '+ $(this).html());
			});
			
			//console.log('selected 0 is '+ selected[0]);
			
			
			// if empty selection
			if (0 == selected.length) {
			 app.widgets.showMessage('Please select at least one option!');
			 return false;
			 }
			else {		
			app.quiz.evalDisplayCorrect(selected);	
			}

		});
		
		// go to next question
		$(document).off('click', '#nextQuestion').on('click','#nextQuestion', function (e) {

		var $this= app.quiz;
		
			if (($this.questionNumber+1) < $this.maxQuestions) {
			$this.nextQuestion();	
			}
			else {
			 app.widgets.showMessage('Please select at least one option!');
			 return false;	
			}
		});

		},
		/**
		*Evaluate answers, show correct answer
		*/
		evalDisplayCorrect: function(selected) {
			
			var $this= app.quiz;
		
			// number of correct answers
			var correctSelected= 0;
			//list of wrong answers objects
			var $wrongSelected= [];
			
			var imax= $this.correctAnswerList.length;
			
			// loop through options with .each()
			$('.option').each(function(ix) {
			$el= $(this);
			
				for (var i=0; i < imax; i++) {
					
					// find correct answers
					if ($this.correctAnswerList[i] == Number($el.jqmData('optionNumber'))) {
						if ($el.hasClass('selectedOption')) {						
						$el.removeClass('selectedOption').addClass('correctAnswerSelected');	
						// count correct
						correctSelected++;
						}
						else if ($el.hasClass('notSelectedOption')) {
						$el.removeClass('selectedOption').addClass('correctAnswerNotSelected');		
						}					
					}			
				}

			}); // closes each()
			
			//vibrate if correct answers
			if (correctSelected > 0) {
			navigator.vibrate(500);
			}
						
			// display as wrong answer if selected and no match
			$wrongSelected= $('.selectedOption');
			$wrongSelected.each(function(ix) {			
			$(this).removeClass('selectedOption').addClass('wrongSelected');
			});
			
			// calculate score from number of correct answers
			$this.evalScore(correctSelected, $wrongSelected.length, imax);
			
			// disable options
			$('.option').each(function(ix) {			
			$(this).removeClass('option').addClass('optionDisabled');
			});
			
			// disable submit
			$('#submitAnswer').attr('id', 'submitAnswerDisabled');
			
			// decide what to do next
			$this.evalAfterAnswer();
		
		},
		/**
		* Choose what to do after an answer was processed
		*/
		evalAfterAnswer: function() {
		var $this= app.quiz;
		
			// show next button
			if ((this.questionNumber+1) < this.maxQuestions)  {
			$('#nextQuestion').show('slow');
			}
			else {
			$this.displayFinal();	
			}
		},
		/**
		*Go to next question
		*/
		nextQuestion: function() {
			
			this.toggleLegend();
			$('#nextQuestion').hide();	
			$('#question').html('');
			$('#options li').remove();
			$('#comment').remove();
			$('#submitAnswerDisabled').attr('id', 'submitAnswer');
		
			if ((this.questionNumber+1) < this.maxQuestions) {
			// reset question meta
			$('#questionMeta').html(this.questionMeta);
			this.questionNumber++;
			this.loadContent();
			app.adjustDisplay();
			}
			else {
			console.log('Could not load next quiz question');
			return false;	
			}
		},	
		/**
		*Add content
		*/
		loadContent: function() {
			
			if (typeof(app.quizContent[this.sourceId]['quiz_'+this.quizId]['q_'+this.questionNumber]) 
				=== 'undefined'){
			console.log('Question '+ this.questionNumber +' not found in quiz ' + this.quizId);
			return false;
			}
			
			var questionContent= this.quiz['q_'+this.questionNumber];
			
			if ((typeof(questionContent.correct) === 'undefined') ||!Array.isArray(questionContent.correct)){
			console.log('correct answer for qQuestion '+ this.questionNumber +' not found in quiz ' + this.quizId);
			return false;
			}	

			this.correctAnswerList= questionContent.correct;
			var qNumber= app.quiz.questionNumber+1;
			$('#question').html('<span id="q-number">'+qNumber+'</span>'+questionContent.q);
			this.comment= questionContent.c;
			var i= 0;
				while(typeof(questionContent['o_'+i]) !== 'undefined') {
				var $el= $('<li class="option notSelectedOption">'+questionContent['o_'+i]+'</li>');
				$el.jqmData('optionNumber', i);
				console.log ('submitted element is ' + $el.html());
				console.log ('submitted data is ' + $el.jqmData('optionNumber'));
				
				// make random
				var append= true;
				var rand= Math.ceil(Math.random()*2); // 1 or 2
					if (rand == 1) {
					append= false;	
					}
					if (append) {
					$('#options').append($el);
					}
					else {
					$('#options').prepend($el);
					}
				i++;
				}		
		},
		/**
		*Show the legend
		*/
		toggleLegend: function () {
			
			if (app.quiz.hasLegend === false) {
			
			var $right= $('#right .text');
			$right.text(app.t('Correct answer'));
			
			var $wrong= $('#wrong .text');
			$wrong.text(app.t('Wrong answer'));
			
			var $missed= $('#missed .text');
			$missed.text(app.t('Correct but not selected'));
			
			app.quiz.hasLegend= true;
			
			}
		
		$('#legend').fadeToggle('fast');			
			
		},		
		/**
		*Calculate score
		*/
		evalScore: function(numCorrect, numWrong, maxCorrect) {
		
		var $this= app.quiz;

		console.log('numCorrect is '+ numCorrect +' numWrong is :'+ numWrong +' maxCorrect is:'+ maxCorrect);	
		
		
			if (numCorrect > maxCorrect) {
			console.log('Logical error in quiz. numCorrect is '+ numCorrect +'  while maxCorrect is:'+ maxCorrect);
			}
			// selected wrong and correct answers
			else if ((numCorrect+numWrong) > maxCorrect) {
			$this.score += Math.floor(((numCorrect/maxCorrect)*100)-((numWrong/maxCorrect)*100));
			}
			// part correct
			else if (numCorrect <= maxCorrect) {
			$this.score += Math.floor((numCorrect/maxCorrect)*100);
			}
			
		var finalScore= $this.getFinalScore();
		
		// show score
		$this.toggleLegend();
		$('#score').text(app.t('Your score is {{v0}}', finalScore)).show('slow');
		
			// unlock page
			if (($this.unlock.length > 0) && (1 != app.storage.get('unlocked_'+$this.unlock)) && (finalScore >= app.unlockScore) && ($this.unlock.length > 0)) {
			app.storage.set('unlocked_'+$this.unlock, 1);
			app.widgets.showMessage(app.t('Well done! You have unlocked the next chapter'), 'success');
			}
		
		},
		/**
		*Show comment
		*/
		displayComment: function() {
		$('<div class="comment">'+this.comment+'</di>').hide().prependTo('#quiz').fadeIn('slow');
		},
		
		/**
		*Show final score
		*/
		displayFinal: function() {
		var $this= app.quiz;
		
		var finalScore= $this.getFinalScore();
		var message= app.t('Your final score is <span class="finalScore">{{v0}}</span> points out of a maximum of <span class="maxScore">{{v1}}</span> points',finalScore, 100);
		
		$('#score').html(message);
		app.widgets.showMessage(message);
		
		},
		
		/**
		*get final score
		*/
		getFinalScore: function () {
		var $this= app.quiz;
			
			return Math.floor(($this.score/$this.maxScore)*100);
		}
	}
	
	return obj;
}