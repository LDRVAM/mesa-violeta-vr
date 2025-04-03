const init = async function() {

    let zoomLevel = 7;
    mapboxgl.accessToken = 'pk.eyJ1Ijoianp1bmlnYXVhYmNzIiwiYSI6ImNtMXBqOXYyOTA1bHoya29kb25nenc4bW8ifQ.zWcn0JIIEkDDfJA6aWJFcQ';
    const lat = 24.1250; 
    const lng = -110.3155;
    const props = {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        projection: 'globe',
        zoom: zoomLevel,
        center: [lng, lat]
    };
    const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
    const response = await fetch(`${baseUrl}/data/places.json`, {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const places = await response.json();

    const map = new mapboxgl.Map(props);

    console.log("lugares cargados: ", places)

    map.addControl(new mapboxgl.NavigationControl());

    map.on('style.load', () => {
        map.setFog({});

        map.flyTo({
            zoom: 15,
            speed: 0.5,
            curve: 1,
            easing: (t) => t
        });
    });

    places.forEach(p => {

        const el = document.createElement('div');
        el.classList.add('marker');

        console.log("Creando marcador para:", p.name, "en", p.lng, p.lat);
        console.log("Coordenadas de cada lugar:", p.name, "Lng:", p.lng, "Lat:", p.lat);

        const bg = p.bg ? p.bg : 'maps-icon.svg';
       

        el.style.backgroundImage = `url('images/${bg}')`;
        el.addEventListener('click', ()=> {
            location.href = p.link;
        })

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        }).setText(p.name);


        const marker = new mapboxgl.Marker(el)
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map);

        el.addEventListener('mouseenter', () => { popup.addTo(map); });
        el.addEventListener('mouseleave', () => { popup.remove(); });

    });

};


window.addEventListener('load', init);
