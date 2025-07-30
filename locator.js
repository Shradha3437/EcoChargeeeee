// Station Locator Functionality
let map
let markers = []
let filteredStations = []

function showNotification(message, type = "info") {
  alert(`${type.toUpperCase()}: ${message}`)
}

window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.2961, lng: 85.8245 },
    zoom: 12,
  })
  updateMapMarkers(filteredStations)
  getCurrentLocation()
}

document.addEventListener("DOMContentLoaded", () => {
  const sampleStations = [
    { id: 1, name: "Master Canteen Charging Hub", address: "Master Canteen, Bhubaneswar, Odisha 751001", chargerType: "dcfast", availability: "available", pricing: "paid", distance: "0.2 miles", connectors: 8, power: "150kW", price: "₹8/unit" },
    { id: 2, name: "Esplanade Mall Station", address: "Esplanade One Mall, Rasulgarh, Bhubaneswar, Odisha 751010", chargerType: "level2", availability: "busy", pricing: "free", distance: "0.5 miles", connectors: 4, power: "22kW", price: "Free" },
    { id: 3, name: "Baramunda Bus Stand Station", address: "Baramunda Bus Terminal, Bhubaneswar, Odisha 751003", chargerType: "dcfast", availability: "available", pricing: "paid", distance: "1.2 miles", connectors: 12, power: "350kW", price: "₹10/unit" },
    { id: 4, name: "KIIT University Campus Charger", address: "KIIT Campus, Patia, Bhubaneswar, Odisha 751024", chargerType: "level2", availability: "available", pricing: "paid", distance: "0.8 miles", connectors: 6, power: "11kW", price: "₹6/unit" },
    { id: 5, name: "Biju Patnaik Airport Station", address: "Biju Patnaik International Airport, Bhubaneswar, Odisha 751020", chargerType: "dcfast", availability: "busy", pricing: "paid", distance: "12.5 miles", connectors: 16, power: "250kW", price: "₹9/unit" }
  ]

  filteredStations = [...sampleStations]

  function renderStations(stations) {
    const stationList = document.getElementById("stationList")
    if (!stationList) return
    stationList.innerHTML = stations.length === 0 ? '<p class="no-results">No stations found matching your criteria.</p>' : stations.map(createStationElement).join("")
  }

  function createStationElement(station) {
    return `
      <div class="station-item">
        <div class="station-name">${station.name}</div>
        <div class="station-address">${station.address}</div>
        <div class="station-details">
          <div class="station-specs">
            <span class="spec-item"><i class="fas fa-bolt"></i> ${station.power}</span>
            <span class="spec-item"><i class="fas fa-plug"></i> ${station.connectors} connectors</span>
            <span class="spec-item"><i class="fas fa-map-marker-alt"></i> ${station.distance}</span>
          </div>
          <div class="station-info">
            <span class="station-price">${station.price}</span>
            <span class="station-status status-${station.availability}">${station.availability === "available" ? "Available" : "Busy"}</span>
          </div>
        </div>
        <div class="station-actions">
          <button class="btn btn-outline btn-sm" onclick="getDirections(${station.id})"><i class="fas fa-directions"></i> Directions</button>
          <button class="btn btn-primary btn-sm" onclick="reserveStation(${station.id})"><i class="fas fa-calendar"></i> Reserve</button>
        </div>
      </div>`
  }

  const searchInput = document.getElementById("locationSearch")
  const searchBtn = document.querySelector(".search-btn")

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim()
    filteredStations = query ? sampleStations.filter(s => s.name.toLowerCase().includes(query) || s.address.toLowerCase().includes(query)) : [...sampleStations]
    applyFilters()
  }

  searchInput?.addEventListener("input", () => setTimeout(performSearch, 300))
  searchBtn?.addEventListener("click", performSearch)

  function applyFilters() {
    let filtered = [...filteredStations]
    const chargerType = document.getElementById("chargerType")?.value
    const availability = document.getElementById("availability")?.value
    const pricing = document.getElementById("pricing")?.value

    if (chargerType) filtered = filtered.filter(s => s.chargerType === chargerType)
    if (availability) filtered = filtered.filter(s => s.availability === availability)
    if (pricing) filtered = filtered.filter(s => s.pricing === pricing)

    renderStations(filtered)
    updateMapMarkers(filtered)
  }

  ["chargerType", "availability", "pricing"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", applyFilters)
  })

  function getDummyCoordinates(id) {
    return { lat: 20.2961 + id * 0.01, lng: 85.8245 + id * 0.01 }
  }

  function updateMapMarkers(stations) {
    if (!map) return
    markers.forEach(m => m.setMap(null))
    markers = []
    stations.forEach(station => {
      const coords = getDummyCoordinates(station.id)
      const marker = new google.maps.Marker({
        position: coords,
        map,
        title: station.name
      })
      const infoWindow = new google.maps.InfoWindow({ content: `<strong>${station.name}</strong><br>${station.address}` })
      marker.addListener("click", () => infoWindow.open(map, marker))
      markers.push(marker)
    })
  }

  window.getDirections = stationId => {
    const station = sampleStations.find(s => s.id === stationId)
    if (station) window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.address)}`, "_blank")
  }

  window.reserveStation = stationId => {
    const station = sampleStations.find(s => s.id === stationId)
    if (station) showNotification(station.availability === "busy" ? "This station is currently busy. Please try another station." : `Reservation request sent for ${station.name}`, station.availability === "busy" ? "error" : "success")
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) return showNotification("Geolocation is not supported by this browser.", "error")
    navigator.geolocation.getCurrentPosition(
      position => {
        const userLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        searchInput.value = "Current Location"
        showNotification("Location found! Showing nearby stations.", "success")

        if (map) {
          map.setCenter(userLatLng)
          map.setZoom(14)

          const userMarker = new google.maps.Marker({
            position: userLatLng,
            map,
            title: "You are here",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff"
            }
          })
          markers.push(userMarker)
        }

        filteredStations.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        applyFilters()
      },
      error => {
        console.error("Geolocation error:", error)
        showNotification("Unable to get your location. Please enter an address manually.", "error")
      }
    )
  }

  const searchBox = document.querySelector(".search-box")
  if (searchBox) {
    const locationBtn = document.createElement("button")
    locationBtn.type = "button"
    locationBtn.className = "location-btn"
    locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>'
    locationBtn.title = "Use current location"
    locationBtn.style.cssText = "padding: 12px; background: #4CAF50; color: white; border: none; cursor: pointer; margin-left: 5px;"
    locationBtn.addEventListener("click", getCurrentLocation)
    searchBox.appendChild(locationBtn)
  }

  renderStations(sampleStations)
})
