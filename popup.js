// Initialize button with user's preferred color
let listImages = document.getElementById("listImages");

chrome.storage.sync.get("color", ({ color }) => {
    listImages.style.backgroundColor = color;
    console.log('popup.js storage Synced');
});

// When the button is clicked, inject setPageBackgroundColor into current page
listImages.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scanForImages,
    },
        (injectionResults) => {
            for (const frameResult of injectionResults) {
                if(frameResult.result.length > 0){
                    //open image list html
                    let imgListWindow = window.open('imglist.html', 'imgListWindow', 'status,top=0,right=0,width=350,height=' + window.screen.availHeight );
                    //send array to popup
                    imgListWindow.imglist = frameResult.result;
                }
            }
        });
});

// The body of this function will be executed as a content script inside the current page
function scanForImages() {
    let imglist = Array.prototype.map.call(document.images, function (i) { return i.src; });
    console.log('popup.js:scanForImages() executed. ' + imglist.length + " images found");
    return imglist;
}

const tabId = getTabId();