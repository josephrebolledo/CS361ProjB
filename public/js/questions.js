var url = 'http://52.40.59.238:3000'

$(()=>{
  //bindButtons(); called later for voice issue
   search();
    if(responsiveVoice.voiceSupport())
	console.log("Voice Support Active");
});

function bindButtons(answer) {
	$('.glyphicon, .glyphicon-volume-up').on('click', ()=> {
		responsiveVoice.speak(answer);
	});
}

function search() {
    var daURL = url + "/getquestions";
//	$("#results-template").fadeOut(1000);
		$("#results-template").html("");
		$("#results-template").text("");

    $.ajax({
	type: "GET",
	url: daURL,
    }).done((data)=>{
	var response = JSON.parse(data);
	showQuestion(response);
    });

}


function shuffle(a) {
    var currentIndex = a.length;
    var tempVal, randomIndex;

    while(0 != currentIndex) {
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -=1;
	tempVal = a[currentIndex];
	a[currentIndex] = a[randomIndex];
	a[randomIndex] = tempVal;
    }
    return a;

}

function showQuestion(results) {
    var template = "";
    if(results.data[0] !== undefined) {
	var a = results.data[0];
	var correct = a.answer;
	var questions = [];

	questions.push(a.answer, a.incorrect_1, a.incorrect_2, a.incorrect_3);
	questions = shuffle(questions);
	for(i = 0; i < questions.length; i++) {
	    template += '<div class="span2 q"><dl>' +
		'<dt class="answer">' + questions[i] + '</dt></dl></br></div>';
	}
	$('#results-template').append(template);	
	$('#results-template').parent().removeClass("hidden").fadeIn(500);
	    $('dt').each((index, record)=>{
		console.log($(record).text() + ' vs ' + correct);
		if($(record).text() == correct)
		   // $(record).attr('id', 'audio');
		    $(record).parent().data('foo', a.id);
	    });
	    $(".span2, .q").on("click", (event)=>{
		checkAnswer(event, a.id);
	    });
	setTimeout(function() {
		responsiveVoice.speak(correct);
		bindButtons(correct);
	}, 1800);
    } else {
	template += "<div><h1>You've answered all available questions!</h1></div>";
	$('#results-template').append(template).parent().removeClass("hidden").fadeIn(500);
    }
}

function checkAnswer(event, id) {
    var corr = ($(event.target).parent().data('foo') > 0 ? 1 : 0);
    $(".span2, .q").off();
	$(".glyphicon, .glyphicon-volume-up").off();
    showCorrect(corr);
   // var q = { 'id' : id,
//	      'correct' : corr
//	    }
    var daURL = url + "/submitanswer?id=" + id + "&correct=" + corr;
    console.log(daURL);
    $.ajax({
	type: "GET",
	url: daURL,
    }).done((data)=>{
	setTimeout(function() {search();}, 1500);
    });

}

function showCorrect(corr) {

    $("#results-template").fadeOut(500).html("");
    $("#results-template").text("");
    var display = (corr ? "CORRECT!! Nice Job" : "INCORRECT! Better luck next time!");
    var template = '<div><h1>' + display + '</h1></div';
    $('#results-template').append(template).fadeIn(500);
}
