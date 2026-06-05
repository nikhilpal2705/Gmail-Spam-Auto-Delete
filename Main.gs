function Main() {
  const blockedLabelName = 'BLOCKED';
  // Reuse the label if it already exists so repeated runs stay idempotent.
  const blockedLabel = GmailApp.getUserLabelByName(blockedLabelName) || GmailApp.createLabel(blockedLabelName);
  const spamThreads = GmailApp.getSpamThreads();

  // Nothing to do if Gmail currently has no spam threads.
  if (spamThreads.length === 0) {
    return;
  }

  // Step 1: inspect each spam thread and flag only the ones with blocked senders.
  for (const thread of spamThreads) {
    // A thread is blocked only when at least one message sender matches the block list.
    if (!thread.getMessages().some(message => isBlockedSender(message.getFrom()))) {
      continue;
    }

    // Move the matching thread out of Spam and mark it for deletion.
    thread.addLabel(blockedLabel);
    thread.moveToArchive();
  }

  // Step 2: permanently delete every message that was marked blocked.
  deleteMessagesWithLabel(blockedLabel);
}

function isBlockedSender(fromHeader) {
  // Gmail returns sender text in formats like "Name <user@domain.com>".
  const emailMatch = fromHeader.match(/<([^>]+)>/) || fromHeader.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);
  const senderEmail = (emailMatch ? emailMatch[1] : fromHeader).trim().toLowerCase();
  const senderDomain = senderEmail.includes('@') ? senderEmail.split('@')[1] : '';

  // Match exact email addresses first, then the root domain and any subdomain beneath it.
  return spamAddresses.some(address => senderEmail === address.toLowerCase()) || spamDomains.some(domain => {
    const blockedDomain = domain.toLowerCase();
    return senderDomain === blockedDomain || senderDomain.endsWith('.' + blockedDomain);
  });
}

// Permanently delete every message that was marked with the blocked label.
function deleteMessagesWithLabel(label) {
  if (label) {
    // Use the label as the source of truth for what should be permanently removed.
    const threads = label.getThreads();
    for (const thread of threads) {
      const messages = thread.getMessages();
      for (const message of messages) {
        // Advanced Gmail service permanently deletes the message instead of moving it to Trash.
        Gmail.Users.Messages.remove('me', message.getId());
      }
    }

    // Clean up the temporary label after all matching messages are removed.
    label.deleteLabel();
  }
}
