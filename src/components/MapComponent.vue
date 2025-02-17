<template>
  <capacitor-google-map
  	id="map"
    ref="mapRef"
    style="display: inline-block; width: 100%; height: calc(100%);"
  />
</template>

<script setup lang="ts">
	import axios from 'axios';
	import {
		ref,
		inject,
		shallowRef,
		onMounted,
		watchEffect
	} from 'vue';
	import { GoogleMap } from '@capacitor/google-maps';
	import { modalController } from '@ionic/vue';
  import LocationModal from '@/components/map/LocationModal.vue';

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
	    //forceCreate: true,
	    apiKey: import.meta.env.VITE_MAPS_API_KEY,
	    config: {
	      center: {
	        lat: 0,
	        lng: 0,
	      },
	      zoom: 8,
	      styles: [{
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
	      }, {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }],
	      }]
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
				await openModal(event, place);
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

	const openModal = async (event: Event, location: Location) => {
		if (location) {
			const modal = await modalController.create({
	      component: LocationModal,
	      componentProps: { location: location },
	      event: event,
	      initialBreakpoint: 0.5,
	      breakpoints: [0, 0.25, 0.5, 0.75, 1],
	    });
	    modal.present();

	    const { data, role } = await modal.onWillDismiss();
		}
  }

	watchEffect(async () => {
		if (map.value) {
			await getMyLocation();
		} 
	});

	onMounted(async () => {
		await createMap();
	});
</script>