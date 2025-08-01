## Feedback Form
This form is used to give feedback to members. It replaces the Feedback form. 

### How it works
Anyone who wishes to send feedback to a member, will enter their name and then select the name of the member to whom they want to send feedback from the drop-down box.
Then you can enter the feedback. Once the form is submitted the receiver will get an email with your feedback and name.
You can send feedback to 4 members from a single form.

### Requirements
1. Google Account
2. Setup the form as shown [here](https://forms.gle/vf9hg2HL7DEMLV7i6). Capture the id of the form you created, it's usually in settings of the form
3. Create a new spreadsheet in Google sheets with 2 columns. First column contains the Names and the second column contains their emails. The first row is the name of the column. Capture the id of this sheet, you can get that from the url of the sheet. Make sure you sort the columns by Name, it will be easier to view them in the form.
4. Whenever you have a new member, their name will need to be added to the above spreadsheet.


### How to setup the form
1. Once the form is created, click on the 3 vertical dots in the top RHS. 
2. Click on "<> Apps Script"
3. Copy the script from [FeedbackForm.script](./FeedbackForm.script)
4. Copy the contents of [appscript.json](../appscript.json)
5. Create the triggers for your form as defined (here)[../images/FeedbackFormTriggers.jpg]
6. Once the form is ready, test it and then send a link to the form to your members.
 