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
    document.querySelector('.classes').innerHTML += `<li class="list-group-item"><span id="span${c}" class="className" contenteditable="true" data-id="${c}">${classList[c]}</span> <img src="/img/edit.png" class="mt-n1 edit" style="cursor: pointer;" height="15px;" id="edit${c}" data-id="${c}"> <img src="img/delete.png" class="mt-n1 remove" style="cursor: pointer;" data-id="${c}" height="15px;"></li>`;
  }

  //Delete classes
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

  //Change class names
  document.querySelectorAll('.className').forEach(spanName => {
      spanName.addEventListener('input', function() {
          //Change the edit icon to submit icon
          document.getElementById("edit"+spanName.dataset.id).src = "img/submit.png";
          document.getElementById("edit"+spanName.dataset.id).classList.add('submit');
          document.getElementById("edit"+spanName.dataset.id).classList.remove('edit');

            //Update class names when submit icon is clicked
            document.querySelectorAll('.submit').forEach(btn => {
              btn.onclick = () => {
                  var newName = spanName.innerText;
                  console.log(newName);
                  classList[btn.dataset.id] = newName;
                  chrome.storage.sync.set({'mfClassList': classList}, function() {
                    console.log("Updated");
                    console.log(classList);
                  });

                  //change the submit icon to edit icon
                  document.getElementById("edit"+spanName.dataset.id).src = "img/edit.png";
                  document.getElementById("edit"+spanName.dataset.id).classList.remove('submit');
                  document.getElementById("edit"+spanName.dataset.id).classList.add('edit');
              };
            });

        });
  });

  //Highlighting classes when edit button is clicked
  document.querySelectorAll('.edit').forEach(btn => {
    btn.onclick = () => {
      var focusSpan = document.getElementById("span"+btn.dataset.id);
        setTimeout(function() {
          focusSpan.focus();
        }, 0);
    };
  });


});
