function displayInitialize() {
  document.querySelector('.initialize-div').style.display = 'block';

  document.querySelector('#initialize-button').onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          console.log(tabs[0].url);
          chrome.tabs.executeScript(
            tabs[0].id,
            {
              file: '/initialize.js'
            }
          );
        });
        chrome.storage.sync.set({'mfInitialized': true}, function(result) {
             document.querySelector('.initialize-div').style.display = 'none';
        });
      };
    }

    chrome.storage.sync.get(['mfInitialized'], function(result) {
      if (result.mfInitialized == false) {
        displayInitialize();
    }
});

chrome.storage.sync.get(['mfClassList'], function(result) {
  var classList = result.mfClassList;

  for (const c in classList) {
    document.querySelector('.classes').innerHTML += `<li class="list-group-item"><span class="className ${c}" contenteditable="true" data-id="${c}">${classList[c]}</span> <img src="edit.png" class="mt-n1" style="cursor: pointer;" height="15px;" id="edit${c}" data-id="${c}"> <img src="delete.png" class="mt-n1 remove" style="cursor: pointer;" data-id="${c}" height="15px;"></li>`;
  }

  document.querySelectorAll('.remove').forEach(btn => {
    btn.onclick = () => {
      const classId = btn.dataset.id;
      delete classList[classId];
      chrome.storage.sync.set({'mfClassList': classList}, function() {
          console.log("Deleted");
      });
      btn.parentNode.remove();
    };
  });

  document.querySelectorAll('.className').forEach(spanName => {
      spanName.addEventListener('input', function() {
            document.getElementById("edit"+spanName.dataset.id).src = "submit.png";
            document.getElementById("edit"+spanName.dataset.id).classList.add('submit');

            document.querySelectorAll('.submit').forEach(btn => {
              btn.onclick = () => {
                  var newName = spanName.innerText;
                  console.log(newName);
                  classList[btn.dataset.id] = newName;
                  chrome.storage.sync.set({'mfClassList': classList}, function() {
                    console.log("Updated");
                    console.log(classList);
                  });
                  document.getElementById("edit"+spanName.dataset.id).src = "edit.png";
                  document.getElementById("edit"+spanName.dataset.id).classList.remove('submit');
              };
            });

        });
  });


});
