<template>
  <div class="mt-5 row text-center mx-5">
    <div class="col-sm-8 d-flex justify-content-start">
      <h1>The Gallery</h1>
    </div>
    <div class="col-sm-4 d-flex justify-content-end">
      <router-link class="nav-link" to="/AddPhoto"
        ><button class="btn btn-primary">Add Photo +</button></router-link
      >
    </div>
  </div>
  <div class="mt-5 row text-center mx-5 form-group">
    <label for="album">Album:</label>
    <select
      class="form-control"
      id="album"
      @change="onchange()"
      v-model="selectedalbum"
    >
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
      <a
        class="link-gambar p-0"
        @click="showModal(photo.id)"
        :title="photo.title"
      >
        <img
          :src="photo.thumbnailUrl"
          class="m-1 p-0"
          width="150"
          loading="lazy"
      /></a>
    </div>
  </div>
  <div class="row mt-3 mx-4 d-flex justify-content-center">
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li v-for="page in Pages" class="page-item" :key="page.page">
          <a
            :class="'page-link ' + { active: activePage == page.page }"
            href="#"
            @click="paginate(page.page)"
            >{{ page.page }}</a
          >
        </li>
      </ul>
    </nav>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="photoModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="photoModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div
        v-for="image in photo"
        :key="image.id"
        class="modal-content"
        width="700px"
      >
        <div class="modal-header">
          <h5 class="modal-title" id="photoModalLabel">Photo Detail</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body row">
          <div class="col-sm-6">
            <img :src="image.url" class="w-100" />
          </div>
          <div class="col-sm-6 row">
            <div class="col-sm-12 text-left">
              <h2>Title :</h2>
              <i
                ><h5>{{ image.title }}</h5></i
              >
            </div>
            <div class="col-sm-12 text-left">
              <h6>Original Url :</h6>
              <a :href="image.url" target="blank">{{ image.url }}</a>
            </div>
          </div>
        </div>
        <div class="modal-footer row">
          <div class="col-sm-6 d-flex justify-content-start">
            <button
              type="button"
              class="btn btn-info"
              @click="editPhoto(image.id)"
            >
              Edit</button
            >&nbsp;
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteImage(image.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";
import $ from "jquery";

export default {
  name: "Gallery",
  setup() {
    const photos = ref([]);
    const photo = ref([]);
    const album = ref([1]);
    const Pages = ref([]);
    const $router = useRouter();
    const albumIdParams = $router.currentRoute._rawValue.params.albumId;
    let selectedalbum = ref(1);
    if (albumIdParams != null) selectedalbum.value = albumIdParams;

    const loadAlbum = async () => {
      try {
        const response = await api("/list-album");
        album.value = response.data;
      } catch (err) {
        console.error(err);
      }
    };

    const loadPhotos = async (
      albumId = selectedalbum.value,
      pagination = 1
    ) => {
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

    const loadPhoto = async (id) => {
      try {
        const response = await api(`/photos-view/${id}`);
        photo.value = response.data;
      } catch (err) {
        console.error(err);
      }
    };

    const editPhoto = async (id) => {
      let element = $("#photoModal");
      $(element).modal("hide");
      $router.push({ name: "EditPhoto", params: { id: id } });
    };

    const deletePhoto = async (id) => {
      try {
        if (confirm("Are you sure")) {
          const deleteData = {
            id: id,
          };
          const response = await api.post(`/photos/delete`, deleteData);
          console.log(response);
          // photo.value = response.data;
        }
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(async () => {
      if (albumIdParams != null) {
        selectedalbum = { value: albumIdParams };
        await loadAlbum();
        await loadPhotos(albumIdParams);
      } else {
        await loadAlbum();
        await loadPhotos();
      }

      await loadPhotos();
    });

    return {
      photos,
      photo,
      album,
      loadPhotos,
      Pages,
      selectedalbum,
      loadPhoto,
      deletePhoto,
      editPhoto,
    };
  },
  methods: {
    onchange: function () {
      this.loadPhotos(this.selectedalbum);
    },
    paginate: function (page) {
      this.loadPhotos(this.selectedalbum, page);
      this.activePage = page;
    },
    showModal: function (id) {
      let element = $("#photoModal");
      $(element).modal("show");
      this.loadPhoto(id);
    },
    deleteImage: function (id) {
      this.deletePhoto(id);
      let element = $("#photoModal");
      $(element).modal("hide");
      this.loadPhotos(this.selectedalbum.value, this.activePage);
    },
  },
};
</script>
