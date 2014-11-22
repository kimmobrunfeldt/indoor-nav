var ROOMS = {
    'TB103': {
        location: [3204, 1748]
    },
    'TB109': {
        location: [1824, 1792]
    },
    'TC163': {
        location: [1236, 1656]
    }
};

var ROOMS_KEYS = [];
for (var room in ROOMS) {
    if (ROOMS.hasOwnProperty(room)) ROOMS_KEYS.push(room);
}

// In pixels in tietotalo.jpg
var START_LOCATION = [3576, 1704];
var LOCATION_SIZE = [100, 100];
var MARKER_SIZE = [200, 200];

function showRoute(destination) {
    $indoorMap = $('#indoor-map');
    $marker = $indoorMap.find('#marker');
    $route = $indoorMap.find('#route');

    $marker.css({
        left: ROOMS[destination].location[0] - MARKER_SIZE[0] / 2,
        top: ROOMS[destination].location[1] - MARKER_SIZE[0]
    });

    $route.attr('src', 'images/route-' + destination + '.svg');

    $marker.show();
    $route.show();
}

function setLocation(location) {
    $location = $('#location');

    $location.css({
        left: location[0] - LOCATION_SIZE[0] / 2,
        top: location[1] - LOCATION_SIZE[0] / 2
    });
}

function hideRoute() {
    $indoorMap = $('#indoor-map');

    $indoorMap.find('#marker').hide();
    $indoorMap.find('#route').hide();
}

function initIndoorMapView() {
    var $elem = $('#indoor-map');
    hideRoute();

    $elem.panzoom({
        minScale: 0.1,
        maxScale: 2,
    });
    $elem.panzoom("zoom", 0.2, { silent: true });
    $elem.panzoom("pan", -691, -208, { silent: true} );

    var $search = $('#search');
    $search.autocomplete({
        source: ROOMS_KEYS
    });

    $search.on('autocompleteselect', function(event, ui) {
        var selected = ui.item.value;
        console.log(selected, 'selected');
        showRoute(selected);
    });

    setLocation(START_LOCATION);
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
    var parts = pathname.split('/');
    var last = parts[parts.length - 1];

    var view;

    if (last.length < 2) {
        view = 'index';
    } else {
        view = last.substr(0, last.length - 5);
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
