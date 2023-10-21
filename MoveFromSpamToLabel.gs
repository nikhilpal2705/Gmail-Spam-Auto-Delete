/* Add label to Spam mails and move it from Spam. */

function MoveFromSpamToLabel(threads, label) {
  var addresses = Addresses();
  for (var i = 0; i < threads.length; i++){
    var messages = threads[i].getMessages();
    for (var j = 0; j<messages.length; j++){
      for (var k = 0; k<addresses.length; k++){
        if (messages[j].getFrom().indexOf(addresses[k]) > -1){
          threads[i].addLabel(label);
          threads[i].moveToArchive();
        }
      }
    }
  }
}