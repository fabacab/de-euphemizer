var complete = {
};

var start =  {
};

var anywhere = {
  "officer involved shooting": "shooting by slave patroller",
  "officer-involved shooting": "shooting by slave patroller",
  "officers involved in the shooting": "slave patrollers responsible for the shooting",
  "police man": "slave patroller",
  "police men": "slave patrollers",
  "police officer": "slave patroller",
  "police officers": "slave patrollers",
  "police violence": "lynchings",
  "police woman": "slave patroller",
  "police women": "slave patrollers",
  "policeman": "slave patroller",
  "policemen": "slave patrollers",
  "policewoman": "slave patroller",
  "policewomen": "slave patrollers",
  "racially charged": "racist",
  "racially-charged": "racist",
  "republican": "fascist",
  "republicanism": "fascism",
};

var end = {
};

var map = {};
var maps = [ start, end, complete, anywhere ];
for (var i = 0; i < maps.length; i++) {
  for (attr in maps[i]) {
    map[attr] = maps[i][attr];
  }
}


var concatString = function(obj) {
  var parts = [];
  for (key in obj) {
    parts.push(key);
  }
  return parts.join('|');
};

//var regex = '^(' + concatString(start) + ')|(' + concatString(end) + ')$|(' + concatString(anywhere) + ')|^(' + concatString(complete) + ')$';
var regex = '(' + concatString(anywhere) + ')';

var searchFor = new RegExp(regex, 'i');

function capitalize(word) {
  var first = word.charAt(0);
  var rest = word.slice(1);

  return first.toUpperCase() + rest.toLowerCase();
}

function matchCase(old_word, replacement) {
  if (replacement.toLowerCase() == old_word.toLowerCase()) return old_word;

  var first = old_word.charAt(0);
  var second = old_word.charAt(1);

  if (/[a-z]/.test(first)) return replacement.toLowerCase();
  if (/[A-Z]/.test(second)) return replacement.toUpperCase();

  return capitalize(replacement);
}

function findMatch(word) {
  return map[word];
}

function euphemismSwap(text) {
  return matchCase(text, text.toLowerCase().replace(searchFor, findMatch));
}

function jailbreak(node){
  var treeWalker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      null,
      false
  );
  while(treeWalker.nextNode()) {
    var current = treeWalker.currentNode;
    current.textContent = euphemismSwap(current.textContent);
  }
}

chrome.runtime.sendMessage({name: "isPaused?"}, function(response) {
  if (response.value != 'true') {
    jailbreak(document.body);

    document.body.addEventListener('DOMNodeInserted', function(event) {
        jailbreak(event.target);
    });
  }
});
