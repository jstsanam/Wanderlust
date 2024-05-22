// mapToken is coming from show.ejs file
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",  // container ID
  style: "mapbox://styles/mapbox/streets-v12",  //style URL
  center: listing.geometry.coordinates,  // starting position [ long, lat ]
  zoom: 12   // starting zoom
})

const marker = new mapboxgl.Marker({color: "#ea4335"})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25}).setHTML(
      `<h6>${listing.title}</h6>
      <p>Here you will stay!</p>`
    )
  )
  .addTo(map);
