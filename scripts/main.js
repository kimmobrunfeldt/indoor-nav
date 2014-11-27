var percentRef = new Firebase('https://indoor-proto.firebaseio.com/percent');

percentRef.on('value', function(snapshot) {
    onData(snapshot.val());
});


var ROOMS = {
    'TB109': {
        location: [1824, 1792],
        distance: 50,
        zoom: 0.15,
        pan: [-371, -231],
        route: 'M3576,1704 L3372,1708 L1932,1732 L1824,1792'
    },
    'TB103': {
        location: [3204, 1748],
        distance: 10,
        zoom: 0.2,
        pan: [-655, -276],
        route: 'M3576,1704 L3372,1708 L3196,1748'
    },    
    'TC163': {
        location: [1236, 1656],
        distance: 100,
        zoom: 0.12,
        pan: [-264, -190],
        route: 'M3576,1704 L3372,1708 L1312,1732 L1236,1656'
    }
};

var ROOMS_KEYS = [];
for (var room in ROOMS) {
    if (ROOMS.hasOwnProperty(room)) ROOMS_KEYS.push(room);
}

var roomIndex = 0;

// In pixels in tietotalo.jpg
var START_LOCATION = [3576, 1704];
var LOCATION_SIZE = [70, 70];
var MARKER_SIZE = [200, 200];

var currentDestination;

function onData(data) {
    setRoutePosition(data.value);
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

    var svg = createRouteSvg(destination);
    $route.html('');
    $route[0].appendChild(svg);

    setRoutePosition(0);
    $('#destination').html(destination);


    $marker.show();
    $route.show();
    $routeInfo.show();
}

function createRouteSvg(destination) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 4183 3213");

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", ROOMS[destination].route);
    path.setAttribute("stroke", '#47ACFF');
    path.setAttribute("stroke-width", 30);
    path.setAttribute("fill-opacity", 0);
    svg.appendChild(path);

    path.id = 'route-path'

    return svg;
}

function setRoutePosition(percent) {
    if (!currentDestination) return;

    var distance = ROOMS[currentDestination].distance;
    var distanceLeft = distance - distance * percent;
    var timeLeft = distanceLeft / 4;

    $('#distance-left').html(distanceLeft.toFixed());
    $('#time-left').html(timeLeft.toFixed());

    var path = $('#route-path')[0];
    var length = path.getTotalLength();
    var pathDistance = percent * length;
    var point = path.getPointAtLength(pathDistance);

    $('#location').css({
        left: point.x - LOCATION_SIZE[0] / 2,
        top: point.y - LOCATION_SIZE[0] / 2
    });
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

function initIndexView() {
    setTimeout(function() {
        $('#splash').addClass('zoom');
        $('.hidden').removeClass('hidden');
        setTimeout(function() {
            $('#splash').hide();
            $('#locating').fadeOut();
        }, 1800);
    }, 3000)

    var $elem = $('#indoor-map');
    hideRoute();

    $elem.panzoom({
        minScale: 0.1,
        maxScale: 2,
    });
    $elem.panzoom("zoom", 0.2, { silent: true });
    $elem.panzoom("pan", -691, -208, { silent: true} );

    var $search = $('#search');

    $search.on('click', function() {
        var room = ROOMS_KEYS[roomIndex];
        showRoute(room);

        roomIndex++;
        if (roomIndex > ROOMS_KEYS.length) {
            roomIndex = 0;
        }
    });

    setLocation(START_LOCATION);
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
        index: initIndexView
    };

    initFunc = views[viewName];
    initFunc();
}

function onLoad() {
    var viewName = getViewName();
    initView(viewName);


}

$(window).load(onLoad);
