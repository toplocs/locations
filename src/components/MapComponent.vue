<template>
  <capacitor-google-map
    ref="mapRef"
    style="display: inline-block; width: 100%; height: 80vh"
  />
</template>

<script setup lang="ts">
	import axios from 'axios';
	import { ref, watch, shallowRef, onMounted } from 'vue';
	import { GoogleMap } from '@capacitor/google-maps';
	import { Geolocation } from '@capacitor/geolocation';

	const mapRef = ref<HTMLElement>();
	const map = shallowRef<GoogleMap>();
	const location = ref(null);

	const createMap = async () => {
	  if (!mapRef.value) return
	  map.value = await GoogleMap.create({
	    id: 'locations-app',
	    element: mapRef.value,
	    apiKey: import.meta.env.VITE_MAPS_API_KEY,
	    config: {
	      center: {
	        lat: 0,
	        lng: 0,
	      },
	      zoom: 8,
	    },
	  });
	}

	const getMyLocation = async () => {
		map.value.enableCurrentLocation(true);
		const coordinates = await Geolocation.getCurrentPosition();
		const lat = coordinates.coords.latitude;
  	const lng = coordinates.coords.longitude;
    await map.value.addCircles([{
	    center: { lat, lng },
	    radius: 50000,
	    fillColor: 'rgba(0, 0, 255)',
	    strokeColor: '#0000FF',
	    strokeWeight: 2,
	    fillOpacity: 0.1,
	    geodesic: true,
	    clickable: false,
	    title: '50km Radius',
	  }]);
	  location.value = {
	  	coordinate: {
				lat: lat,
     		lng: lng,
			}
	  };
	}

	const fetchNearby = async ({ lat, lng }) => {
		try {
	    const response = await axios.get(`/api/location/byCoords?lat=${lat};&lng=${lng}`);

	    return response.data;
	  } catch (error) {
	    console.error(error);
	  }
	}

	watch(location, async () => {
		const places = await fetchNearby(location.value.coordinate);
		for (let place of places) {
			console.log(place);
			const markerId = await map.value.addMarker({
			  coordinate: {
			    lat: place.latitude,
			    lng: place.longitude
			  }
			});
			await map.value.enableClustering();
			await map.value.setOnMarkerClickListener((event) => {
				console.log(event);
			});
		}
	});

	onMounted(async () => {
		await createMap();
		await getMyLocation();
	});
</script>