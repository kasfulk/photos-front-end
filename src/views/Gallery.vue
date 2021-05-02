<template>
  <div class="mt-5 row text-center mx-5"><h1>This Is Gallery</h1></div>
  <div class="mt-5 row text-center mx-5 form-group">
    <label for="album">Album:</label>
    <select class="form-control" id="album" @change="onchange()" v-model="key">
      <option
        v-for="album in album"
        :key="album.albumId"
        :v-bin:value="album.albumId"
        :selected="album.albumId == 1"
      >
        {{ album.albumId }}
      </option>
    </select>
  </div>
  <div class="row d-flex px-5 justify-content-around">
    <div v-for="photo in photos" :key="photo.id">
      <a :href="photo.url" class="link-gambar p-0" :title="photo.title">
        <img :src="photo.thumbnailUrl" class="w-100 m-1 p-0" loading="lazy"
      /></a>
    </div>
  </div>
  <div class="row mt-3 mx-4 d-flex justify-content-center">
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li v-for="page in Pages" class="page-item" :key="page.page">
          <a class="page-link" href="#" @click="paginate()">{{ page.page }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import api from "@/api";

export default {
  name: "Gallery",
  setup() {
    const photos = ref([]);
    const album = ref([1]);
    const Pages = ref([]);

    const loadAlbum = async () => {
      try {
        const response = await api("/list-album");
        album.value = response.data;
      } catch (err) {
        console.error(err);
      }
    };

    const loadPhotos = async (albumId = 1, pagination = 1) => {
      try {
        const response = await api(`/photos/${albumId}/${pagination}`);
        let pages = [];
        for (let i = 1; i <= response.data.totalPage; i++) {
          pages.push({
            page: i,
          });
        }
        Pages.value = pages;
        photos.value = response.data.data;
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(async () => {
      await loadAlbum();
      await loadPhotos();
    });

    return { photos, album, loadPhotos, Pages };
  },
  methods: {
    onchange: function () {
      this.loadPhotos(this.key);
    },
    paginate: function () {
      console.log(this);
    },
  },
};
</script>
