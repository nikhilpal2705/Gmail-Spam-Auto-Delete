# Gmail Spam Auto Delete

A small Google Apps Script project that permanently deletes spam messages from specific senders.

The script scans your Gmail spam folder, checks each message sender against a configured block list, labels matching threads as `BLOCKED`, moves them out of spam, and then permanently deletes the matching messages using the Gmail API.

> Warning: this project uses permanent deletion. Deleted messages are removed through the Gmail API and are not moved to Trash first.

## Files

- `Main.gs` - contains the main spam scanning and deletion logic.
- `Addresses.gs` - contains the `spamAddresses` block list.

## How It Works

1. `Main()` gets all threads currently in Gmail Spam.
2. It checks every message sender in those threads.
3. If the sender contains any address from `spamAddresses`, the thread is labeled `BLOCKED`.
4. Matching threads are archived out of Spam.
5. `deleteEmailByLabel()` permanently deletes messages with the `BLOCKED` label.
6. The temporary `BLOCKED` label is removed.

## Requirements

- A Google account with Gmail.
- Access to Google Apps Script.
- The Advanced Gmail service enabled in Apps Script.
- The Gmail API enabled in the linked Google Cloud project.

## Full Setup Guide

### 1. Create a Google Apps Script Project

1. Open [Google Apps Script](https://script.google.com/).
2. Click **New project**.
3. Rename the project, for example: `Gmail Spam Auto Delete`.

### 2. Add the Script Files

Create two script files in the Apps Script editor:

#### `Main.gs`

Copy the contents of this repository's `Main.gs` file into `Main.gs`.

#### `Addresses.gs`

Create another file named `Addresses.gs` and copy the contents of this repository's `Addresses.gs` file into it.

### 3. Update the Blocked Sender List

Edit `spamAddresses` in `Addresses.gs`:

```javascript
const spamAddresses = [
  "spam@example.com",
  "newsletter@example.com"
];
```

Add one sender address per line. The script uses `includes()`, so a value can match part of the sender string. For example, `example.com` can match multiple senders from that domain.

### 4. Enable the Advanced Gmail Service

1. In the Apps Script editor, click **Services** in the left sidebar.
2. Click **+ Add a service**.
3. Select **Gmail API**.
4. Click **Add**.

This is required because the script calls:

```javascript
Gmail.Users.Messages.remove('me', message.getId());
```

### 5. Enable the Gmail API in Google Cloud

1. In Apps Script, click **Project Settings**.
2. Find the Google Cloud Platform project linked to the script.
3. Open the project in Google Cloud Console.
4. Go to **APIs & Services** > **Library**.
5. Search for **Gmail API**.
6. Click **Enable** if it is not already enabled.

### 6. Run the Script Manually

1. Go back to the Apps Script editor.
2. Select the `Main` function from the function dropdown.
3. Click **Run**.
4. Review and approve the requested Gmail permissions.

The first run may show a Google security warning because this is your own unpublished script. Continue only if you trust the code.

### 7. Verify Behavior

Before using a large block list, test with one known spam sender:

1. Add one sender address to `spamAddresses`.
2. Confirm there is a matching message in your Spam folder.
3. Run `Main()`.
4. Confirm the matching message was permanently deleted.

### 8. Add an Automatic Trigger

To run the cleanup automatically:

1. In Apps Script, click **Triggers** in the left sidebar.
2. Click **+ Add Trigger**.
3. Choose function: `Main`.
4. Choose deployment: `Head`.
5. Choose event source: `Time-driven`.
6. Choose how often you want it to run, such as hourly or daily.
7. Click **Save**.

## Customization

### Change the Temporary Label Name

In `Main.gs`, update:

```javascript
const labelName = 'BLOCKED';
```

### Match Domains Instead of Full Addresses

Because sender matching uses `fromId.includes(address)`, you can block by domain:

```javascript
const spamAddresses = [
  "@example.com",
  "mailer.example.net"
];
```

Use domain matches carefully because they can delete messages from multiple senders.

## Safety Notes

- Start with a small sender list and test manually.
- Do not add broad strings like `gmail.com`, `newsletter`, or `info` unless you really want broad deletion.
- Review `Addresses.gs` regularly.
- This script only checks messages already in Gmail's Spam folder.

## Troubleshooting

### `Gmail is not defined` or `Gmail.Users.Messages.remove` fails

Enable the Advanced Gmail service in Apps Script and make sure the Gmail API is enabled in the linked Google Cloud project.

### The script runs but nothing is deleted

- Confirm the target email is in the Spam folder.
- Confirm the sender text contains one of the values in `spamAddresses`.
- Run the script manually and check **Executions** in Apps Script for logs or errors.

### Authorization errors

Re-run the script manually from Apps Script and approve the required permissions. If permissions changed, remove and re-add the Gmail API service.

## License

No license has been specified yet.
