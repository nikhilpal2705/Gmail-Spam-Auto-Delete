function Main() {
  const spamThreads = GmailApp.getSpamThreads();
  let deletedMessages = 0;

  for (const thread of spamThreads) {
    for (const message of thread.getMessages()) {
      if (!isBlockedSender(message.getFrom())) {
        continue;
      }

      // Advanced Gmail service permanently deletes the message instead of moving it to Trash.
      Gmail.Users.Messages.remove('me', message.getId());
      deletedMessages += 1;
    }
  }

  console.log(`Deleted ${deletedMessages} matching spam message(s).`);
}

function isBlockedSender(fromHeader) {
  const senderEmail = extractSenderEmail(fromHeader);
  if (!senderEmail) {
    return false;
  }

  const senderDomain = senderEmail.split('@')[1];

  // Match exact email addresses first, then the root domain and any subdomain beneath it.
  return spamAddresses.some(address => senderEmail === address.trim().toLowerCase()) || spamDomains.some(domain => {
    const blockedDomain = domain.trim().toLowerCase();
    return senderDomain === blockedDomain || senderDomain.endsWith(`.${blockedDomain}`);
  });
}

function extractSenderEmail(fromHeader) {
  // Gmail may return either "Name <user@example.com>" or "user@example.com".
  const angleBracketMatch = fromHeader.match(/<\s*([^<>\s]+@[^<>\s]+)\s*>/);
  const bareEmailMatch = fromHeader.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);
  const senderEmail = angleBracketMatch ? angleBracketMatch[1] : bareEmailMatch ? bareEmailMatch[0] : '';

  return senderEmail.trim().toLowerCase();
}
