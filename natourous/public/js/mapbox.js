const mapBox = document.getElementById('map');
//dom elements
//delegation
if(mapBox){
const locations = JSON.parse(document.getElementById('map').dataset.locations);


mapboxgl.accessToken = 'pk.eyJ1IjoiZGFyc2hhbmoiLCJhIjoiY2s3dWk0c3lxMHpocTNlcGdiM3FoNWZ6bCJ9.e42vZjm2mXOZTgnaSq251g';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/darshanj/ck7uierxf0fvb1ip5v9icrib2',
scrollZoom: false
// center: [-118.2437,34.112493],
// zoom: 11,
// interactive: false
});

const bounds = new mapboxgl.LngLatBounds(); 

locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    // Add popup
    new mapboxgl.Popup({
        offset: 10
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
  
   


    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds,
    {padding:{
        top: 200,
        bottom: 200,
        left: 100,
        right: 100
    }});
  }