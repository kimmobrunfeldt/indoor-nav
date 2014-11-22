var ROOMS = [
    'TB109',
    'TB110',
    'TB217',
    'TB216',
    'TC106'
];

function initIndoorMapView() {
    var $elem = $('#indoor-map');

    $elem.panzoom({
        minScale: 0.1,
        maxScale: 2,
    });
    $elem.panzoom("zoom", 0.2, { silent: true });
    $elem.panzoom("pan", -750, -1560, { silent: true} );

    var $search = $('#search');
    $search.autocomplete({
      source: ROOMS
    });

    $search.on('autocompleteselect', function(event, ui) {
        var selected = ui.item.value;
        console.log(selected, 'selected');
    });
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
    console.log('Init view', viewName);

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
$(onLoad);
