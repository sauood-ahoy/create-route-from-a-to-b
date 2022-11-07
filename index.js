const mapElement = document.querySelector('#mapContainer');

let platform;
let defaultLayers;
let map;

async function initializeMap() {
  platform = await AhoyMapView.service().Platform(SUBSCRIPTION_KEY);
  defaultLayers = platform.createDefaultLayers();
  map = AhoyMapView.Map(mapElement, defaultLayers.vector.normal.map, {
    zoom: 4,
    center: {
      lat: 34,
      lng: 41,
    },
  });

  // default interactions for pan/zoom
  const mapEvents = AhoyMapView.mapevents().MapEvents(map);
  const behavior = AhoyMapView.mapevents().Behavior(mapEvents);

  // Create the default UI components
  const ui = AhoyMapView.ui().UI.createDefault(map, defaultLayers);
  addMarkerAtPoints();
  createRoute();
}
async function createRoute() {
  const createrRouteRes = await AhoyMapView.createRoute({
    transportMode: 'car',
    origin: { lat: 25.118709, lng: 55.200736 },
    destination: { lat: 25.237545, lng: 55.301214 },
  });
  createrRouteRes.forEach((route) => {
    let linestring = AhoyMapView.getCoOrdinates().fromFlexiPolyline(
      route.polyline
    );
    // Create a polyline to display the route:
    let routeLine = AhoyMapView.polyline(4, 'blue', linestring);
    // Add the route polyline and the two markers to the map:
    map.addObject(routeLine);
    // Set the map's viewport to make the whole route visible:
    map
      .getViewModel()
      .setLookAtData({ bounds: routeLine.getBoundingBox(), zoom: 11 });
  });
}

function addMarkerAtPoints() {
  const markerA = AhoyMapView.map().createMarker({
    lat: 25.118709,
    lng: 55.200736,
  });
  const markerB = AhoyMapView.map().createMarker({
    lat: 25.237545,
    lng: 55.301214,
  });
  map.addObject(markerA);
  map.addObject(markerB);
}

initializeMap();
