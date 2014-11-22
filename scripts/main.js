var peer = new Peer('indoor-proto', {key: '63fmbimtok9y66r', debug: 3});
peer.on('connection', function(conn) {
    conn.on('data', onData);
});

var ROOMS = {
    'TB103': {
        location: [3204, 1748],
        distance: 10,
        zoom: 0.2,
        pan: [-655, -276]
    },
    'TB109': {
        location: [1824, 1792],
        distance: 50,
        zoom: 0.15,
        pan: [-371, -231]
    },
    'TC163': {
        location: [1236, 1656],
        distance: 100,
        zoom: 0.12,
        pan: [-264, -190]
    }
};

var ROOMS_KEYS = [];
for (var room in ROOMS) {
    if (ROOMS.hasOwnProperty(room)) ROOMS_KEYS.push(room);
}

// In pixels in tietotalo.jpg
var START_LOCATION = [3576, 1704];
var LOCATION_SIZE = [70, 70];
var MARKER_SIZE = [200, 200];

var currentDestination;

function onData(data) {
    console.log(data)
    setRoutePosition(data.percent);
}

function showRoute(destination) {
    currentDestination = destination;

    $indoorMap = $('#indoor-map');
    $marker = $indoorMap.find('#marker');
    $route = $indoorMap.find('#route');
    $routeInfo = $('#route-info');

    var room = ROOMS[destination];

    $marker.css({
        left: room.location[0] - MARKER_SIZE[0] / 2,
        top: room.location[1] - MARKER_SIZE[0]
    });

    $indoorMap.panzoom("zoom", room.zoom, { silent: true });
    $indoorMap.panzoom("pan", room.pan[0], room.pan[1], { silent: true });

    $route.attr('src', 'images/route-' + destination + '.svg');
    setRoutePosition(destination, 0);
    $('#destination').html(destination);

    $marker.show();
    $route.show();
    $routeInfo.show();
}

function setRoutePosition(percent) {
    var distance = ROOMS[currentDestination].distance;
    var distanceLeft = distance - distance * percent;
    var timeLeft = distanceLeft / 4;

    $('#distance-left').html(distanceLeft.toFixed());
    $('#time-left').html(timeLeft.toFixed());
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
    $('#route-info').hide();
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
    });

    $search.on('focus', function() {
        $search.autocomplete('search', 'T');
        console.log('focus')
    });

    $search.on('autocompletefocus', function(event, ui) {
        var selected = ui.item.value;
        console.log(selected, 'selected');
        showRoute(selected);
        hideKeyboard();
    });

    setLocation(START_LOCATION);

    setTimeout(function() {
        $('.hidden').removeClass('hidden');
    }, 100)
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

function hideKeyboard() {
    document.activeElement.blur();
    $("input").blur();
};

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
