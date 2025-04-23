function init() {
    console.log("Init function running");
    const close = document.querySelector('.close');
    if (close) {  // Verifica si existe antes de agregar el evento
    close.addEventListener('click', () => {
        console.log("click");
        history.back();
    });
}


    // Register 'spot' component
    AFRAME.registerComponent('spot', {
        schema: {
            linkto: { type: 'string', default: '' },
            spotgroup: { type: 'string', default: '' }
        },
        init: function () {
            const el = this.el;
            const data = this.data;
            const imgSrc = el.classList.contains('atras') ? '#atras' : el.classList.contains('adelante') ? '#adelante' : null;

            el.setAttribute('src', imgSrc);
            el.setAttribute('look-at', '#cam');
            el.addEventListener('click', function (e) {
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
        init: function () {
            const el = this.el;
            el.addEventListener('reloadspot', function (e) {
                const currentSpotGroup = document.querySelector(`#${e.detail.currentSpot}`);
                currentSpotGroup.setAttribute('scale', '0 0 0');
                const newspotgroup = document.querySelector(`#${e.detail.newspot}`);
                newspotgroup.setAttribute("scale", "1 1 1");
            });
        }
    });
}

AFRAME.registerComponent('visibilidad', {
    schema: {
        openImageId: { type: 'string', default: '' },
        imageId: { type: 'string', default: '' },
        closeId: { type: 'string', default: '' },
        videoId: { type: 'string', default: '' }
    },
    init: function () {
        const openImage = document.querySelector(`#${this.data.openImageId}`);
        const hspImage = document.querySelector(`#${this.data.imageId}`);
        const closeButton = hspImage.querySelector(`#${this.data.closeId}`);
     
        openImage.addEventListener('mouseenter', () => {
            openImage.setAttribute('visible', 'false');
            hspImage.setAttribute('visible', 'true');
            this.vid(true);
        });

        closeButton.addEventListener('mouseenter', () => {
            openImage.setAttribute('visible', 'true');
            hspImage.setAttribute('visible', 'false');
            this.vid(false);
        });
    },
    vid: function (isVisible) {
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

AFRAME.registerComponent('carousel', {
    schema: {
        imageIds: { type: 'array', default: [] }
    },

    init: function () {
        this.slides = this.data.imageIds.map(id => ({ image: `#${id}` }));

        if (this.slides.length === 0) {
            console.warn('Error no hay ids');
            return;
        }

        this.currentIndex = 0;
        this.updateSlide();

        const nextButton = this.el.querySelector('.carousel-next');
        const prevButton = this.el.querySelector('.carousel-prev');

        nextButton.addEventListener('mouseenter', () => this.nextSlide());
        prevButton.addEventListener('mouseenter', () => this.prevSlide());
    },

    updateSlide: function () {
        if (this.slides.length === 0) return;

        const currentSlide = this.slides[this.currentIndex];
        const imageEl = this.el.querySelector('#carousel-image');
        imageEl.setAttribute('src', currentSlide.image);
    },

    nextSlide: function () {
        if (this.slides.length === 0) return;

        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlide();
    },

    prevSlide: function () {
        if (this.slides.length === 0) return;

        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
    }
});


window.addEventListener('load', function () {
    init();
});