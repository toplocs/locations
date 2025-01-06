<template>
  <capacitor-google-map
    ref="mapRef"
    style="display: inline-block; width: 100%; height: 80vh"
  />
</template>

<script setup lang="ts">
	import { ref, shallowRef, onMounted } from 'vue';
	import { GoogleMap } from '@capacitor/google-maps';

	const mapRef = ref<HTMLElement>()
	const newMap = shallowRef<GoogleMap>()

	async function createMap() {
	  if (!mapRef.value) return
	  newMap.value = await GoogleMap.create({
	    id: 'locations-app',
	    element: mapRef.value,
	    apiKey: import.meta.env.VITE_MAPS_API_KEY,
	    config: {
	      center: {
	        lat: 33.6,
	        lng: -117.9,
	      },
	      zoom: 8,
	    },
	  })
	}

	onMounted(async () => {
		await createMap();
	});
</script>