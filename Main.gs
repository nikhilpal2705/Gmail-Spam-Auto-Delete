function Main() {
  var labelName = "BLOCKED"; 
  var threads = GmailApp.getSpamThreads();
  if(threads.length > 0){
    GmailApp.createLabel(labelName);
    var label = GmailApp.getUserLabelByName(labelName);
    MoveFromSpamToLabel(threads, label);
    DeleteEmailByLabel(labelName, label);
  }
}