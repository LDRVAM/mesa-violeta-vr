AFRAME.registerComponent('spot', {
    schema: {
        linkto: { type: 'string', default: '' },
        spotgroup: { type: 'string', default: '' }
    },
    init: function() {
        const el = this.el;
        const data = this.data;
        const imgSrc = el.classList.contains('atras') ? '#atras' : el.classList.contains('adelante') ? '#adelante' : null;

        el.setAttribute('src', imgSrc);
        el.setAttribute('look-at', '#cam');
        el.addEventListener('click', function(e) {
            const sky = document.querySelector('#sky');
            sky.setAttribute('src', data.linkto);


            const spotComp = document.querySelector('#spots');
            const currentSpot = this.parentElement.getAttribute('id');
            spotComp.emit('reloadspot', { newspot: data.spotgroup, currentSpot: currentSpot });
        });
    }
});

// Register 'hotspots' component
AFRAME.registerComponent('hotspots', {
    init: function() {
        const el = this.el;
        el.addEventListener('reloadspot', function(e) {
            const currentSpotGroup = document.querySelector(`#${e.detail.currentSpot}`);
            currentSpotGroup.setAttribute('scale', '0 0 0');
            const newspotgroup = document.querySelector(`#${e.detail.newspot}`);
            newspotgroup.setAttribute("scale", "1 1 1");
        });
    }
});
function autoPlayVideos(videoIds) {
    videoIds.forEach(id => {
        const videoElement = document.getElementById(id);
        if (videoElement) {
            videoElement.addEventListener('loadeddata', () => {
                videoElement.play();
            });
        } else {
            console.warn(`El elemento con ID "${id}" no se encontró.`);
        }
    });
}
autoPlayVideos(['video', 'atras', 'adelante']);

AFRAME.registerComponent('visibilidad', {
    schema: {
        openImageId: { type: 'string', default: '' },
        imageId: { type: 'string', default: '' },
        closeId: { type: 'string', default: '' },
        videoId: { type: 'string', default: '' }
    },
    init: function() {
        const openImage = document.querySelector(`#${this.data.openImageId}`);
        const hspImage = document.querySelector(`#${this.data.imageId}`);
        const closeButton = hspImage.querySelector(`#${this.data.closeId}`);
        const el = this.el;
        el.addEventListener('click', (e) => {

            openImage.setAttribute('visible', 'false');
            hspImage.setAttribute('visible', 'true');
            this.vid(true);
        });
        /*openImage.addEventListener('mouseenter', () => {
            openImage.setAttribute('visible', 'false');
            hspImage.setAttribute('visible', 'true');
            this.vid(true);
        });*/

        closeButton.addEventListener('click', () => {
            openImage.setAttribute('visible', 'true');
            hspImage.setAttribute('visible', 'false');
            this.vid(false);
        });
    },
    vid: function(isVisible) {
        const videoElement = document.getElementById(this.data.videoId);
        if (videoElement) {
            if (isVisible) {
                videoElement.play();
            } else {
                videoElement.pause();
                videoElement.currentTime = 0;
            }
        }
    }
});
