<template>
  <capacitor-google-map
  	id="map"
    ref="mapRef"
    style="display: inline-block; width: 100%; height: calc(100%);"
  />
</template>

<script setup lang="ts">
	import axios from 'axios';
	import { ref, inject, shallowRef, onMounted, watchEffect } from 'vue';
	import { GoogleMap } from '@capacitor/google-maps';
	import { popoverController } from '@ionic/vue';
  import LocationPopover from '@/components/map/LocationPopover.vue';

	const emit = defineEmits(['updateLocation'])
	const mapRef = ref<HTMLElement>();
	const map = shallowRef<GoogleMap>();
	const profile = inject('profile');
	const location = inject('location');
	const current = inject('current');
	const selection = ref(null);
	const selected = ref(null);
	const places = ref([]);
	const zoom = ref(8);

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

		await map.value.setOnCameraIdleListener(async (event) => {
			zoom.value = event.zoom;
			places.value = await fetchNearby(event.bounds);
			for (let place of places.value) {
				const markerId = await map.value.addMarker({
				  coordinate: {
				    lat: place.latitude,
				    lng: place.longitude
				  },
				});
				place.markerId = markerId;
			}
		});

		await map.value.setOnMarkerClickListener(async (event) => {
			const { latitude, longitude, markerId } = event;
			const place = places.value.find(x => x.markerId == markerId);
			if (place) {
				map.value.setCamera({
					coordinate: {
						lat: latitude,
						lng: longitude
					},
					zoom: place.value?.zoom || 8,
					animate: true,
				});
				selection.value = {
			  	title: place.title,
			  	coordinate: {
						lat: latitude,
						lng: longitude
					}
			  };
			  emit('updateLocation', selection);
				await openPopover(event, place);
			}
			//await map.value.enableClustering()
		});

		await map.value.setOnMapClickListener(async (event) => {
			const { latitude, longitude } = event;
			if (selected.value) {
				await map.value.removeMarker(selected.value);
			}
			selected.value = await map.value.addMarker({
			  coordinate: {
			    lat: latitude,
			    lng: longitude
			  },
			  tintColor: { r: 0, g: 0, b: 255, a: 1 },
			});
			selection.value = {
		  	title: 'New location',
		  	zoom: zoom.value,
		  	coordinate: {
					lat: latitude,
			    lng: longitude
				}
		  };
		  emit('updateLocation', selection);
		});
	}

	const getMyLocation = async () => {
		if (location.value) {
			map.value.enableCurrentLocation(true);
		  map.value.setCamera({
				coordinate: {
					lat: location.value.latitude,
					lng: location.value.longitude,
				},
			});
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

	const fetchNearby = async ({ northeast, southwest }) => {
		try {
	    const response = await axios.get(`/api/v2/location/byBounds`, {
	    	params: {
	        northeast: JSON.stringify(northeast), 
	        southwest: JSON.stringify(southwest),
	      }
	    });

	    return response.data;
	  } catch (error) {
	    console.error(error);
	  }
	}

	const openPopover = async (event: Event, location: Location) => {
		if (location) {
			const popover = await popoverController.create({
	      component: LocationPopover,
	      componentProps: { location: location },
	      event: event,
	    });
	    await popover.present();
		}
  }

	watchEffect(async () => {
		if (map.value) {
			await getMyLocation();
			await map.value.addMarker({
			  coordinate: {
			    lat: current.value.latitude,
			    lng: current.value.longitude
			  },
			  title: 'Current Location',
			  tintColor: { r: 0, g: 255, b: 0, a: 1 }, //only on mobile
			  zIndex: 9,
			});
		}
	});

	onMounted(async () => {
		await createMap();	
	});
</script>