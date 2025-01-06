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
		navigator?.geolocation.getCurrentPosition((position) => {
			const currentLocation = {
				coordinate: {
					lat: position.coords.latitude,
       		lng: position.coords.longitude,
				}
      };
      map.value.setCamera(currentLocation);
      location.value = currentLocation;
		}, (e) => {
      console.error(e);
    });
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
		const nearby = await fetchNearby(location.value.coordinate);
		if (nearby) {
			const markerId = await map.value.addMarker({
			  coordinate: {
			    lat: nearby.latitude,
			    lng: nearby.longitude
			  }
			});
			await map.value.setCamera({
			  coordinate: {
			    lat: nearby.latitude,
			    lng: nearby.longitude
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