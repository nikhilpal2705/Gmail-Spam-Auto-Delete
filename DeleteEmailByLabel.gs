/* Permanently delete all email with specific label. */

function DeleteEmailByLabel(labelName, label) {
  if ( label != null ) {
    var threads = label.getThreads();
    if ( threads != null ) {
      for (var i = 0; i < threads.length; i++) {
        var messages = threads[i].getMessages();
        if ( messages != null ) {
          for (var j = 0; j < messages.length; j++) {
            Gmail.Users.Messages.remove('me', messages[j].getId());
          }
        }
      }
    }
  }
  GmailApp.deleteLabel(label);
}