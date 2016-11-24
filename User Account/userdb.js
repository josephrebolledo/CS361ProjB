//1st = listen to the click
//2nd = get user info
//3rd == create a request a GET
//4rd = send request by setting header and user-input
//5th = on load - get result and sent result to html output
//6th = default case, show the error


//The function uses post form to post user information to server
//post the url using the user input from the form
//Contents are parsed from the server to a variable and then parsed text content to the html

document.addEventListener("DOMContentLoaded", postInfo);


function postInfo() {

  document.getElementById("submitPost").addEventListener("click", function(event) {

    var userData = {
      fname: null
    };
    var userData = {
      lname: null
    };
    var userData = {
      dob: null
    };
    var userData = {
      email: null
    };
    var userData = {
      tel: null
    };
    var userData = {
      usertype: null
    };

    if (document.getElementById("fName").value === "") {
      userData.fname = null;
      console.log(userData.name);

    } else {

      userData.fname = document.getElementById("fName").value;
    }

    userData.lname = document.getElementById("lName").value;
    userData.dob = document.getElementById("dob").value;
    userData.email = document.getElementById("emailAdd").value;
    userData.tel = document.getElementById("phoneNum").value;
    var checkBox = document.getElementById("userCheck").checked;

    if (checkBox == true) {
      userData.usertype = 1;
    } else {
      userData.usertype = 2;
    }
    console.log(checkBox);


    //Commented out if Ajax call required
/*
    var newForm = new XMLHttpRequest();

    newForm.open("POST", "http://localhost:3000/userform/", true);
    newForm.setRequestHeader("Content-Type", "application/json");
    console.log(newForm.readyState);

    console.log(userData);

    newForm.addEventListener("load", function() {

      if (newForm.status >= 200 && newForm.status < 400) {

        //Commented out for debugging
        //var result = newForm;
        //console.log(result);
        console.log(newForm);
        console.log(newForm.readyState);

      } else {

        console.log("Could not get the result, Error: " + newForm.statusText);
      }

    });

    newForm.send(JSON.stringify(userData));
    event.preventDefault();
*/
  });
}