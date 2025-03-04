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
		watch,
		shallowRef,
		onMounted,
		onUnmounted,
	} from 'vue';
	import { GoogleMap } from '@capacitor/google-maps';
	import { modalController } from '@ionic/vue';
  import LocationDetailsModal from '@/components/map/LocationDetailsModal.vue';
  import { useProfile } from '@/composables/profile';
  import { useLocation } from '@/composables/location';

  const { profile } = useProfile();
  const { location, current } = useLocation();
  const selection = inject('selection');
	const mapRef = ref<HTMLElement>();
	const map = shallowRef<GoogleMap>();
	const selected = ref(null);
	const places = ref([]);
	const zoom = ref(8);

	const addPlace = async (place: Location) => {
		const markerId = await map.value.addMarker({
		  coordinate: {
		    lat: place.latitude,
		    lng: place.longitude
		  },
		  zoom: place.zoom,
		});
		place.markerId = markerId;
	}

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

		await map.value?.setOnCameraIdleListener(async (event) => {
			zoom.value = event.zoom;
			places.value = await fetchNearby(event.bounds);
			for (let place of places.value) {
				await addPlace(place)
			}
		});

		await map.value?.setOnMarkerClickListener(async (event) => {
			const { latitude, longitude, markerId } = event;
			const place = places.value.find(x => x.markerId == markerId);
			if (place) {
				console.log(place.zoom)
				map.value.setCamera({
					coordinate: {
						lat: latitude,
						lng: longitude
					},
					zoom: place.zoom,
					animate: true,
				});
				await openModal(event, place);
			}
			//await map.value.enableClustering()
			return;
		});

		await map.value?.setOnMapClickListener(async (event) => {
			const { latitude, longitude } = event;
			if (selected.value) {
				await map.value.removeMarker(selected.value);
			}
			selected.value = await map.value.addMarker({
			  coordinate: {
			    lat: latitude,
			    lng: longitude,
			    zoom: zoom.value || 8,
			  },
			  tintColor: { r: 255, g: 155, b: 0, a: 1 },
			});
		  selection.value = {
		  	title: 'New location',
		  	zoom: zoom.value,
		  	coordinate: {
					lat: latitude,
			    lng: longitude
				}
		  }
		});
	}

	const getMyLocation = async () => {
		map.value.enableCurrentLocation(true);
	  map.value.setCamera({
			coordinate: {
				lat: location.value?.latitude || 0,
				lng: location.value?.longitude || 0,
			},
		});
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
	      component: LocationDetailsModal,
	      componentProps: { location: location },
	      event: event,
	      initialBreakpoint: 0.5,
	      breakpoints: [0, 0.25, 0.5, 0.75, 1],
	    });
	    modal.present();

	    const { data, role } = await modal.onWillDismiss();
		}
  }

	watch(() => location.value, async () => {
		if (map.value) {
			await getMyLocation();
		} 
	});

	onMounted(async () => {
		if (!map.value) await createMap();
		if (location.value) await getMyLocation();
	});

	defineExpose({ places, addPlace });
</script>