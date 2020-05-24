chrome.runtime.onInstalled.addListener(function() {
  // Initialize variable = false
  chrome.storage.sync.set({'mfInitialized': false}, function() {
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        // When in a ManageBac class site
        pageUrl: {hostContains: '.managebac.com', pathContains: 'classes'},
      })
      ],
        // Show page
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      if (tabs[0].url.includes("managebac")) {
          let classId = tabs[0].url.split('/')[5];
          chrome.storage.sync.get('mfClassList', function(result) {
          const classList = result.mfClassList;
          const name = classList[`${classId}`];
          suggest({filename: `managebac/${name}/` + item.filename});
        });
    } else {
        suggest({filename: item.filename});
    }
  });
  return true;
});
