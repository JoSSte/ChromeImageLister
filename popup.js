// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
    console.log('popup.js storage Synced');
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
        document.body.style.backgroundColor = color;
        console.log('popup.js:setPageBackgroundColor() executed');
    });
}
console.log('popup.js read');

var callback = function (results) {
    // ToDo: Do something with the image urls (found in results[0])

    document.body.innerHTML = '';
    for (var i in results[0]) {
        var img = document.createElement('img');
        img.src = results[0][i];

        document.body.appendChild(img);
    }
    console.log('popup.js:callback() executed');
};

chrome.tabs.query({ // Get active tab
    active: true,
    currentWindow: true
}, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
        code: 'Array.prototype.map.call(document.images, function (i) { return i.src; });'
    }, callback);
});