function basename(url) {
    let filename = '';
    try {
        filename = new URL(url).pathname.split('/').pop();
    } catch (e) {
        console.error(e);
    }
    return filename;

}

function populateList() {
    let thelist = document.getElementById('theList');
    window.imglist.forEach(img => {
        let filename = basename(img);
        let f = document.createElement('figure');
        let i = document.createElement('img');
        let fc = document.createElement('figcaption');
        i.src = img;
        i.style.height = '100px';
        i.style.width = '100px';
        fc.innerHTML = filename;
        f.appendChild(i);
        f.appendChild(fc);

        let li = document.createElement('li');
        li.appendChild(f);

        thelist.appendChild(li);
        //a little kludgy, but if image is below min size, remove it from the list. we can't get the image dimensions before they have been loaded.
        i.onload = function () {
            //console.info(basename(this.src) + ' ' + this.naturalWidth + 'x' + this.naturalHeight);
            if (this.naturalWidth < 500 && this.naturalHeight < 500) {
                console.info('removing' + basename(this.src) + ' ' + this.naturalWidth + 'x' + this.naturalHeight);
                //remove li element
                this.parentElement.parentElement.remove();
            }
        }
    });
}

window.addEventListener('load', populateList);
