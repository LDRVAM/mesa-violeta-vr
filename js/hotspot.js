function init() {
    console.log("Init function running");
    const close = document.querySelector('.close');
    close.addEventListener('click', () => {
        console.log("click")
        history.back();
    });

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
                const opcion = document.querySelector('#surgidero, #balandra, #conchalito');

                if(opcion) {
                    const id = opcion.id;
                    if(id === "surgidero") {
                        cambiarTexto(data.linkto.replace('#', ''));
                    } else if(id === "balandra") {
                        cambiarTextBal(data.linkto.replace('#', ''));
                        //reiniciar video
                        const doctor = document.querySelector('#drAvila');
                        doctor.currentTime = 0; 
                        doctor.pause();
                        const test = document.querySelector('#testimonial');
                        test.currentTime = 0; 
                        test.pause();
                    } else if(id === "conchalito") {
                        cambiarTextoConAudio(data.linkto.replace('#', ''));
                    }
                }
                
                

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
function cambiarTextBal(sceneId) {
    const scenes = {
        'pointBal1': 'Escenario 1',
        'pointBal2': 'Escenario 2',
        'pointBal3': 'Escenario 3',
        'pointBal4': 'Escenario 4',
        'pointBal5': 'Escenario 5'
    };

    const texto = document.querySelector('#scene-value');
    texto.setAttribute('value', scenes[sceneId]);
}
function cambiarTexto(sceneId) {
    const scenes = {
        'point1': 'Escenario 1',
        'point2': 'Escenario 2',
        'point3': 'Escenario 3',
        'point4': 'Escenario 4',
        'point5': 'Escenario 5'
    };

    const texto = document.querySelector('#scene-value');
    texto.setAttribute('value', scenes[sceneId]);
}

function cambiarTextoConAudio(sceneId) {
    const scenes = {
        'point1': 'Escenario 1',
        'point2': 'Escenario 2',
        'point3': 'Escenario 3',
        'point4': 'Escenario 4',
        'point5': 'Escenario 5',
        'point6': 'Escenario 6',
        'point7': 'Escenario 7',
        'point8': 'Escenario 8'
    };

    const texto = document.querySelector('#scene-value');
    texto.setAttribute('value', scenes[sceneId]);

    const audioControl = document.querySelector('#audio-control');
    if (sceneId === 'point4') {
        audioControl.components.sound.playSound();
    } else {
        audioControl.components.sound.stopSound();
    }
}

window.addEventListener('load', function () {
    init();
});