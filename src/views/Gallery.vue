<template>
  <div class="mt-5 row text-center mx-5"><h1>This Is Gallery</h1></div>
  <div class="mt-5 row text-center mx-5 form-group">
    <label for="album">Album:</label>
    <select class="form-control" id="album" @change="onchange()" v-model="key">
      <option
        v-for="album in album"
        :key="album.albumId"
        :value="album.albumId"
      >
        {{ album.albumId }}
      </option>
    </select>
  </div>
  <div class="row d-flex justify-content-around">
    <div v-for="photo in photos" :key="photo.id">
      <a :href="photo.url" class="link-gambar p-0" :title="photo.title">
        <img :src="photo.thumbnailUrl" class="w-100 m-1 p-0" loading="lazy"
      /></a>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import api from "@/api";

export default {
  name: "Gallery",
  setup() {
    const photos = ref([]);
    const album = ref([]);

    const loadAlbum = async () => {
      try {
        const response = await api("/list-album");
        album.value = response.data;
      } catch (err) {
        console.error(err);
      }
    };

    const loadPhotos = async (albumId = 1) => {
      try {
        const response = await api(`/photos/${albumId}/2`);
        photos.value = response.data.data;
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(async () => {
      await loadAlbum();
      await loadPhotos();
    });

    return { photos, album };
  },
  methods: {
    onchange: function () {
      console.log(this.key);
    },
  },
};
</script>
