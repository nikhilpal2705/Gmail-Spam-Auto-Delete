function Main() {
  const labelName = 'BLOCKED';
  const threads = GmailApp.getSpamThreads();
  if (threads.length > 0) {
    const label = GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);

    // Add label to Spam mails and move it from Spam.
    for (let thread of threads) {
      for (let message of thread.getMessages()) {
        let fromId = message.getFrom();
        console.log(fromId)
        if (spamAddresses.some(address => fromId.includes(address))) {
          thread.addLabel(label);
          thread.moveToArchive();
        }
      }
    }
    deleteEmailByLabel(label);
  }
}

// Permanently delete all email with specific label.
function deleteEmailByLabel(label) {
  if (label) {
    const threads = label.getThreads();
    for (let thread of threads) {
      let messages = thread.getMessages();
      for (let message of messages) {
        Gmail.Users.Messages.remove('me', message.getId());
      }
    }
    label.deleteLabel();
  }
}
