<template>
  <capacitor-google-map
    ref="mapRef"
    style="display: inline-block; width: 100%; height: calc(100% - 50px);"
  />
</template>

<script setup lang="ts">
	import axios from 'axios';
	import { ref, watch, inject, shallowRef, onMounted } from 'vue';
	import { GoogleMap } from '@capacitor/google-maps';
	import { Geolocation } from '@capacitor/geolocation';

	const mapRef = ref<HTMLElement>();
	const map = shallowRef<GoogleMap>();
	const profile = inject('profile');
	const location = ref(null);
	const current = ref(null);

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

	  return { lat, lng };
	}

	const updateCurrentLocation = async (lat, lng) => {
	  try {
	    const response = await axios.post('/api/location/updateCurrent', {
	    	profileId: profile.value?.id,
	      lat: lat,
	      lng: lng,
	    });

	    return response.data;
	  } catch (error) {
	    console.error(error);
	    return { error: error.message };
	  }
	}

	/*const findClosestLocation = (latitude, longitude, locations) => {
		let closestLocation = null;
	  let minDistance = Infinity;
	  const toRadians = (degrees) => degrees * (Math.PI / 180);
	  const calculateDistance = (lat1, lon1, lat2, lon2) => {
	    const R = 6371; // Earth's radius in kilometers
	    const dLat = toRadians(lat2 - lat1);
	    const dLon = toRadians(lon2 - lon1);
	    const a =
	      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	      Math.cos(toRadians(lat1)) *
	        Math.cos(toRadians(lat2)) *
	        Math.sin(dLon / 2) *
	        Math.sin(dLon / 2);
	    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    return R * c; // Distance in kilometers
	  };
	  locations.forEach(x => {
	    const distance = calculateDistance(
	      latitude,
	      longitude,
	     	x.latitude,
	      x.longitude
	    );
	    if (distance < minDistance) {
	      minDistance = distance;
	      closestLocation = x;
	    }
	  });

	  return closestLocation;
	};*/

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
			const markerId = await map.value.addMarker({
			  coordinate: {
			    lat: place.latitude,
			    lng: place.longitude
			  }
			});
			//await map.value.enableClustering();
			await map.value.setOnMarkerClickListener((event) => {
				console.log(event);
			});
		}
	});

	watch(current, async () => {
		await map.value.addMarker({
		  coordinate: {
		    lat: current.value.latitude,
		    lng: current.value.longitude
		  },
		  title: 'Current Location',
		  iconUrl: '/icons/beachflag.png',
		  iconOrigin: { x: 1, y: 1 },
  		iconAnchor: { x: 0, y: 35 },
		  tintColor: { r: 0, g: 0, b: 255, a: 1 }, //only on mobile
		  zIndex: 9,
		});
	});

	onMounted(async () => {
		await createMap();
		const { lat, lng } = await getMyLocation();
		current.value = await updateCurrentLocation(lat, lng);
	});
</script>