//Author: Roshan D'Souza (rosh.dsouza.mail@gmail.com)
//To use this script, add the proper required scopes
//Change the SSId it's the ID for the spreadsheet, that contains the data.
//The spreadsheet should have 2 columns i.e. Name and Email
//The First row is the header.
//Then match the other variables that are below, with your form.
// After you implement the script, run the function loadNames in the Apps Script UI

// Restrict the script's authorization
// to the form it is bound to.

//@OnlyCurrentDoc



var MembersList = [];
//The below vars should be changed for the feedback form 
var SSId= "1R-DvNXF1f4kdnVsI79e1RH1A1d25AqK4SYoOFBYkCDg"; // Id of form that stores data
var TitleForSenderMemberDropDown = "Select your name"; // Title on the form, to get the name 
var TitleForRecepientMemberDropDown = "Select the member for feedback" ; // Title on the form, to select the name of the member to whom feedback 
var TitleForFeedbackText = "Feedback"; // Title on the form, where the feedback will be provided


function getMembersFromSheet() {
  var data = SpreadsheetApp.openById(SSId).getSheetByName("data");
  //start range from 2nd row and first column, get last row and last column.
  var values = data.getRange(2, 1, data.getLastRow() -1, data.getLastColumn() ).getValues();
  for (var row in values) {
      var name = values[row][0];
      var email = values[row][1];
      Logger.log(values[row][0] + ":" + values[row][1]);
      if ((name != "") && (row != "")) {
        var Member = {}
        Member.Name = name
        Member.Email = email
        MembersList.push(Member)
      }
  }
  return MembersList
}

function getFormIds(form) {
  var items = form.getItems();
  var itemIds = [];
  for (i = 0 ; i < items.length; i=i+1) {
    Logger.log(items[i].getTitle())
    if ( (items[i].getTitle() == TitleForRecepientMemberDropDown ) || ( items[i].getTitle() == TitleForSenderMemberDropDown)  ){
        itemIds.push(items[i].getId());
        Logger.log(items[i].getId().toString());
    }
  }
  return itemIds;

}

function loadNames() {
  
  var form = FormApp.getActiveForm();
  Logger.log("Loading Names");
  //var items = form.getItems()
  //Logger.log(items[0].getTitle() + ":" + items[0].getId().toString());

  var memberNames = getMembersFromSheet();
  var listMembersName = [];
  
  for (var i = 0; i < memberNames.length; i = i + 1) {
    listMembersName.push(memberNames[i].Name)
    Logger.log(memberNames[i].Name)
  } 
  var itemIds = getFormIds(form);
  if (itemIds.length > 0) {
    for (var i=0 ; i< itemIds.length; i=i+1) {
      var item = form.getItemById(itemIds[i]);
      item.asListItem().setChoiceValues([""])
      item.asListItem().setChoiceValues(listMembersName);
    } 
  }else {
    Logger.log("No form element found.");
  }
  
}


// Create a form submit installable trigger
// using Apps Script.
function createFormSubmitTrigger() {
 
  Logger.log("Reached Form submit")
  // Get the form object.
  var form = FormApp.getActiveForm();

  // See if the trigger has already been set up.
  // Since we know this project should only have a single trigger
  // we'll simply check if there are more than 0 triggers. If yes,
  // we'll assume this function was already run so we won't create
  // a trigger.
  var currentTriggers = ScriptApp.getProjectTriggers();

  if(currentTriggers.length > 0)
    return;
  
  // Create a trigger that will run the onFormSubmit function
  // whenever the form is submitted.

  ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create();
}

// A function that is called by the form submit
// trigger. The parameter e contains information
// submitted by the user.
function onFormSubmit(e) {
 
  Logger.log("Starting Form submit")
  // Get the response that was submitted.
  var formResponse = e.response;
  Logger.log("Reached OnFormSubmit")
  // Get the items (i.e., responses to various questions)
  // that were submitted.
  var itemResponses = formResponse.getItemResponses();

  // Create a variable emailBody to store the body
  // of the email notification to be sent.
  // var senderName = formResponse.getItemById(1765878349).itemResponse.getResponse();
  // if (senderName == "") {
  //   Logger.log("Failed to find Sender Name");
  // } else {
  //   Logger.log("Found sender " + senderName);
  // }

  var emailSubject = "Feedback from :";
  var destnEmail = "";
  var memberNames = getMembersFromSheet();
  // Put together the email body by appending all the
  // questions & responses to the variable emailBody.
  var senderName = "";
  var recepientName = "";
  itemResponses.forEach(function(itemResponse) {
    var feedback = "";
 
    if (itemResponse.getItem().getTitle()== TitleForSenderMemberDropDown ) {
        senderName = itemResponse.getResponse();
        if (senderName == "" ) {
          Logger.log("Failed to find Senders Name " );
        } else {
          Logger.log("Sender Name:" + senderName + " . DoNot Reply");
          emailSubject = emailSubject + senderName;
        }
    }

    if (itemResponse.getItem().getTitle()== TitleForRecepientMemberDropDown ) {
        if (itemResponse.getResponse() != "") {
          recepientName = itemResponse.getResponse();
          destnEmail = getMemberEmail(itemResponse.getResponse());
          if (destnEmail == "" ) {
            Logger.log("Failed to find Email for " + itemResponse.getResponse());
          } else {
            feedback = "";
          }
        }
        
    }

    if (itemResponse.getItem().getTitle()== TitleForFeedbackText ) {
        feedback = itemResponse.getResponse();
        var emailBody = "Hi "+ recepientName + ", \n\n  You have received the following feedback :\n\n" + feedback + "\n\n LakeLine Toastmasters Automated Service.\n\nPlease DONOT Reply back.";
        recepientName = "";
        if ((destnEmail != "") && (feedback != "") ) {
            sendEmail(destnEmail, emailBody, emailSubject)
        } 
         destnEmail = "";
    }
  });

  //delete all responses
  var form = FormApp.getActiveForm();
  form.deleteAllResponses();
  
}

function getMemberEmail(name) {
  if (MembersList.length > 0 ) {
  

  var filteredValues = MembersList.filter(function(value) {
    //Logger.log(value);
    return value.Name == name ;
    });
  return filteredValues[0].Email;

  } else {
    Logger.log("No members were loaded")
  }
  return "";
}

function getMemberName(email) {
  if (MembersList.length > 0 ) {
    var filteredValues = MembersList.filter(function(value) {
      //Logger.log(value);
    return value.Email == email ;
    });
  return filteredValues[0].Name;

    } else {
      Logger.log("No members were loaded")
    }
    return "";
}

// A function that sends the email
// notification.
function sendEmail(destination, emailBody, emailSubject ) {
  //Logger.log("Sending email to " + destination + " . subject :" + emailSubject )
  GmailApp.sendEmail(destination, emailSubject, emailBody);
}
