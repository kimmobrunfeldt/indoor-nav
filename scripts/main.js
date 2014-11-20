function initIndoorMapView() {
    $('#indoor-map').panzoom();
}

function initMapView() {
    var mapOptions = {
        center: { lat: 61.4487104, lng: 23.8564481},
        zoom: 14,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false
    };
    var map = new google.maps.Map(document.querySelector('#map'), mapOptions);

    var marker = new google.maps.Marker({
        position: {
            lat: 61.449846,
            lng: 23.855787
        },
        map: map,
        title:"Tietotalo",
        icon: "images/building.png"
    });

    google.maps.event.addDomListener(marker, 'click', function() {
        PUSH({url: "indoorMap.html", transition: "slide-in" });
    });
}

function getViewName() {
    // /index.html -> index
    var pathname = window.location.pathname;
    var view;

    if (pathname.length < 2) {
        view = 'index';
    } else {
        view = pathname.substr(1, pathname.length - 6);
    }

    return view;
}

function initView(viewName) {
    var views = {
        index: initMapView,
        indoorMap: initIndoorMapView
    };

    initFunc = views[viewName];
    initFunc();
}

function onLoad() {
    var viewName = getViewName();
    initView(viewName);
}

window.addEventListener('push', onLoad);
google.maps.event.addDomListener(window, 'load', onLoad);
