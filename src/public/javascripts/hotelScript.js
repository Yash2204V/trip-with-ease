let map, marker;

function initMap() {
    map = L.map('map').setView([28.6139, 77.2090], 10); // Default to Delhi
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

async function handleSearch(e) {
    e.preventDefault();
    const searchQuery = document.getElementById('searchInput').value;
    if (!searchQuery) return;

    const searchButton = document.getElementById('searchButton');
    searchButton.disabled = true;
    searchButton.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            map.setView([lat, lon], 10);

            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon]).addTo(map);
            }
        } else {
            alert('Location not found');
        }
    } catch (error) {
        console.error('Error searching for location:', error);
        alert('An error occurred while searching for the location');
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = 'Search';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
});