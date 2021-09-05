var map = L.map('map', { drawControl: true }).setView([-6.891105, 107.610389], 15);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
/* if (navigator.geolocation) {
  // navigator.geolocation.getCurrentPosition();
  console.log("Geolocation is supported.");
  navigator.geolocation.getCurrentPosition((success) => {
    // console.log(success.coords);
    map.panTo(new L.LatLng(success.coords.latitude, success.coords.longitude));
    // var map = L.map('map').setView([success.coords.latitude, success.coords.longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      minZoom: 4,
      maxZoom: 18,
      subdomains: ['a','b','c']
    }).addTo( map );

  });
} else {
  console.log("Geolocation is not supported by this browser.");
} */
var marker = L.marker([-6.891105, 107.610389]).addTo(map);
/* var polygon = L.polygon([
    [-6.80, 107.6],
    [-6.90, 107.7],
    [-6.89, 107.610389]
]).addTo(map); */

/* function drawPolygon() {
  // var coords =  [[48,-3],[50,5],[44,11],[48,-3]] ;
  var coords = document.getElementById("coordPolygon").value;

  var a = JSON.parse(coords);

  var polygon = L.polygon(a, { color: 'red' });
  polygon.addTo(map);

  map.fitBounds(polygon.getBounds());
} */

var area = [];

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var MyCustomMarker = L.Icon.extend({
  options: {
    // shadowUrl: null,
    iconAnchor: new L.Point(12, 12),
    iconSize: new L.Point(24, 24),
    // iconUrl: 'link/to/image.png'
  }
});

var options = {
  position: 'topright',
  draw: {
    polyline: {
      shapeOptions: {
        color: '#f357a1',
        weight: 10
      }
    },
    polygon: {
      allowIntersection: true, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#bada55'
      }
    },
    circle: false, // Turns off this drawing tool
    rectangle: {
      shapeOptions: {
        clickable: false
      }
    },
    marker: {
      /* icon: new MyCustomMarker() */
    }
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: false
  }
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType,
  layer = e.layer;

  if (type === 'marker') {
    layer.bindPopup('A marker!');
  } else if (type === 'polyline') {
    layer.bindPopup('A polyline!');
  } else {
    console.log(layer.getLatLngs());
    var size = 0;
    for (i = 0; i < layer.getLatLngs()[0].length; i++) {
      if (i === layer.getLatLngs()[0].length - 1) {
        size += ((layer.getLatLngs()[0][i].lat * layer.getLatLngs()[0][0].lng) - (layer.getLatLngs()[0][i].lng * layer.getLatLngs()[0][0].lat))/2
      } else {
        size += ((layer.getLatLngs()[0][i].lat * layer.getLatLngs()[0][i + 1].lng) - (layer.getLatLngs()[0][i].lng * layer.getLatLngs()[0][i + 1].lat))/2
      }
    }
    size < 0 ? size = size * -1.0 : size = size
    area.push({
      coords: layer.getLatLngs()[0],
      size: size * 111000 * 111000
    });
    console.log(area);
    layer.bindPopup('Area is Approximately: ' + size * 111000 * 111000 + ' m2');
    // console.log(area);
  }

  editableLayers.addLayer(layer);
});
