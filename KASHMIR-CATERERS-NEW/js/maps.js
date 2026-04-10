/* ================================
   GOOGLE MAPS INTEGRATION
   ================================ */

let map;
let markers = [];
const locations = [
    {
        id: 'office',
        name: 'Office Location',
        address: 'Srinagar, Jammu & Kashmir',
        fullAddress: 'Main Office, Lal Chowk, Srinagar',
        lat: 34.083651,
        lng: 74.797371,
        type: 'office',
    },
    {
        id: 'current-event',
        name: 'Current Event',
        address: 'Mumbai, Maharashtra',
        fullAddress: 'Royal Grand Hotel Ballroom, Mumbai',
        lat: 19.0760,
        lng: 72.8777,
        type: 'event',
    },
    {
        id: 'upcoming-event',
        name: 'Upcoming Event',
        address: 'Delhi, Delhi',
        fullAddress: 'Garden Palace Convention Center, Delhi',
        lat: 28.6139,
        lng: 77.2090,
        type: 'event',
    },
];

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeMap();
    }, 500);
});

// ================================
// MAP INITIALIZATION
// ================================

function initializeMap() {
    const mapElement = document.getElementById('map');
    
    if (!mapElement) {
        console.warn('Map container not found');
        return;
    }
    
    // Default center (office location)
    const defaultCenter = {
        lat: locations[0].lat,
        lng: locations[0].lng,
    };
    
    // Create map
    map = new google.maps.Map(mapElement, {
        zoom: 5,
        center: defaultCenter,
        styles: getMapStyle(),
        gestureHandling: 'cooperative',
    });
    
    // Add markers
    addMarkers();
    
    // Fit bounds to show all markers
    fitMapBounds();
}

// ================================
// ADD MARKERS TO MAP
// ================================

function addMarkers() {
    locations.forEach((location) => {
        const marker = new google.maps.Marker({
            position: {
                lat: location.lat,
                lng: location.lng,
            },
            map: map,
            title: location.name,
            icon: getMarkerIcon(location.type),
            animation: google.maps.Animation.DROP,
        });
        
        // Add click listener
        marker.addListener('click', () => {
            selectLocation(locations.indexOf(location));
            openInfoWindow(location, marker);
        });
        
        markers.push(marker);
    });
}

// ================================
// MARKER ICONS
// ================================

function getMarkerIcon(type) {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    
    switch (type) {
        case 'office':
            return baseUrl + 'blue-dot.png';
        case 'event':
            return baseUrl + 'red-dot.png';
        default:
            return baseUrl + 'yellow-dot.png';
    }
}

// ================================
// INFO WINDOWS
// ================================

let currentInfoWindow = null;

function openInfoWindow(location, marker) {
    if (currentInfoWindow) {
        currentInfoWindow.close();
    }
    
    const infoWindowContent = `
        <div style="max-width: 200px; padding: 10px;">
            <h3 style="margin: 0 0 8px 0; font-size: 1rem;">${location.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 0.9rem; color: #666;">
                ${location.fullAddress}
            </p>
            <a href="#" 
               onclick="event.preventDefault(); getDirections(${location.lat}, ${location.lng})"
               style="color: var(--secondary); font-weight: 600; font-size: 0.9rem; text-decoration: none;">
                Get Directions →
            </a>
        </div>
    `;
    
    currentInfoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
    });
    
    currentInfoWindow.open(map, marker);
}

// ================================
// LOCATION SELECTION
// ================================

function selectLocation(index) {
    if (index < 0 || index >= locations.length) return;
    
    const location = locations[index];
    
    // Update active state in location cards
    document.querySelectorAll('.location-card').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    // Pan map to location
    map.panTo({
        lat: location.lat,
        lng: location.lng,
    });
    
    // Zoom in
    map.setZoom(12);
    
    // Open info window
    if (markers[index]) {
        openInfoWindow(location, markers[index]);
    }
}

// ================================
// GET DIRECTIONS
// ================================

function getDirections(lat, lng) {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
}

// ================================
// FIT BOUNDS
// ================================

function fitMapBounds() {
    if (markers.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((marker) => {
        bounds.extend(marker.getPosition());
    });
    
    map.fitBounds(bounds);
    
    // Adjust zoom if too close
    const listener = map.addListener('idle', () => {
        if (map.getZoom() > 12) {
            map.setZoom(5);
        }
        google.maps.event.removeListener(listener);
    });
}

// ================================
// MAP STYLING
// ================================

function getMapStyle() {
    return [
        {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [
                {
                    weight: '2',
                },
            ],
        },
        {
            featureType: 'all',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#9c9c9c',
                },
            ],
        },
        {
            featureType: 'all',
            elementType: 'labels.text',
            stylers: [
                {
                    visibility: 'on',
                },
            ],
        },
        {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [
                {
                    color: '#f2f2f2',
                },
            ],
        },
        {
            featureType: 'landscape.man_made',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#f2f2f2',
                },
            ],
        },
        {
            featureType: 'landscape.natural.terrain',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#f2f2f2',
                },
            ],
        },
        {
            featureType: 'poi',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'road',
            elementType: 'all',
            stylers: [
                {
                    saturation: -100,
                },
                {
                    lightness: 45,
                },
            ],
        },
        {
            featureType: 'road.highway',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'simplified',
                },
            ],
        },
        {
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'transit',
            elementType: 'all',
            stylers: [
                {
                    visibility: 'off',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'all',
            stylers: [
                {
                    color: '#d4e8f0',
                },
                {
                    visibility: 'on',
                },
            ],
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#d4e8f0',
                },
            ],
        },
    ];
}

// ================================
// DYNAMIC LOCATION MANAGEMENT (For Admin)
// ================================

function addNewLocation(name, address, lat, lng, type = 'event') {
    const newLocation = {
        id: 'loc-' + Date.now(),
        name: name,
        address: address,
        fullAddress: address,
        lat: lat,
        lng: lng,
        type: type,
    };
    
    locations.push(newLocation);
    
    // Reinitialize map with new location
    if (map) {
        const marker = new google.maps.Marker({
            position: {
                lat: lat,
                lng: lng,
            },
            map: map,
            title: name,
            icon: getMarkerIcon(type),
            animation: google.maps.Animation.DROP,
        });
        
        marker.addListener('click', () => {
            openInfoWindow(newLocation, marker);
        });
        
        markers.push(marker);
        fitMapBounds();
    }
    
    return newLocation;
}

// ================================
// EXPORT LOCATIONS
// ================================

function getLocationsData() {
    return locations.map((loc) => ({
        id: loc.id,
        name: loc.name,
        address: loc.fullAddress,
        latitude: loc.lat,
        longitude: loc.lng,
        type: loc.type,
    }));
}