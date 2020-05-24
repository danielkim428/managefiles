function addClasses() {
  var classList = {};

  document.querySelectorAll('li.js-menu-classes-list ul li:not(.more) a').forEach(link => {
    var className = link.querySelector('span').innerText;
    var classId = link.href.split('/')[5];
    classList[`${classId}`] = className;
  });

  return classList;
}

var classes = addClasses();

chrome.storage.sync.set({'mfClassList': classes}, function() {
  console.log(classes);
  console.log('Saved classes.');
});
