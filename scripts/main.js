function initMap() {
    var mapOptions = {
        center: { lat: 61.4487104, lng: 23.8564481},
        zoom: 14,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false
    };
    var map = new google.maps.Map(document.querySelector('#map'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initMap);
