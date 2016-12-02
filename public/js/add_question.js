var url = "http://localhost:3000";   

var queryURL = url + "/query_word";
var submitURL = url + "/add_question_do";
var bakSubmitURL = submitURL; 

//query word and populate select boxes
$.ajax({
type: "GET",
url: queryURL,
success: function(response) {
    response = JSON.parse(response);
    var option = '';
    var answerBox = document.getElementsByClassName("wordList");

    //append word list to all answer boxes
    for (var j=0; j<answerBox.length;j++){
        
        for (var i=0;i<response.length;i++){
            var option = document.createElement("OPTION");
            option.text = response[i].word;
            option.value = response[i].word;
            answerBox[j].appendChild(option);
        }
        answerBox[j].appendChild(option);
    }
}
});

//handle submitForm Action
        var theButton = document.getElementById("submitButton");
        theButton.addEventListener("click" , function(){
        var correctAnswer = document.getElementById("correctAnswer");
        var incorrect1 = document.getElementById("incorrectAnswer1");
        var incorrect2 = document.getElementById("incorrectAnswer2");
        var incorrect3 = document.getElementById("incorrectAnswer3");

        correctAnswer = correctAnswer.value;
        incorrect1 = incorrect1.value;
        incorrect2 = incorrect2.value;
        incorrect3 = incorrect3.value;

        submitURL = submitURL + "?answer="+correctAnswer+"&incorrect_1="+incorrect1+"&incorrect_2="+incorrect2+"&incorrect3="+incorrect3;
        console.log(submitURL);
        $.ajax({

            type: "GET",
            url: submitURL,
            success: function(response) {
                var responseTextArea = document.createElement("p");
                var responseText = document.createTextNode(response);
                responseTextArea.appendChild(responseText);
                document.getElementById("responseArea").appendChild(responseTextArea);
                responseText = "";
                submitURL = bakSubmitURL;
                
            }
        });
    });
