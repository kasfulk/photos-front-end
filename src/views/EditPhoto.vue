<template>
  <div class="row m-5">
    <div class="col-sm-6">
      <form>
        <div class="form-group row">
          <label for="albumId" class="col-4 col-form-label">Album ID</label>
          <div class="col-8">
            <select
              class="form-control"
              id="album"
              v-model="selectedalbum"
              @change="textChange()"
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
        </div>
        <div class="form-group row">
          <label for="title" class="col-4 col-form-label">Title</label>
          <div class="col-8">
            <textarea
              id="title"
              name="title"
              cols="40"
              rows="5"
              class="form-control"
              v-model="title"
              @change="textChange()"
            ></textarea>
          </div>
        </div>
        <div class="form-group row">
          <label for="url" class="col-4 col-form-label">URL</label>
          <div class="col-8">
            <input
              id="url"
              name="url"
              type="text"
              class="form-control"
              v-model="url"
              @change="textChange()"
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="thumbnailUrl" class="col-4 col-form-label"
            >Thumbnail URL</label
          >
          <div class="col-8">
            <input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="text"
              class="form-control"
              v-model="thumbnailUrl"
              @change="textChange()"
            />
          </div>
        </div>
        <div class="form-group row">
          <div class="d-flex justify-content-start px-5">
            <button
              name="submit"
              type="button"
              @click="submitPhoto()"
              class="btn btn-primary"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="col-sm-6">
      <div v-for="image in photo" :key="image.id" class="modal-body row">
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
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";

export default {
  name: "Gallery",
  setup() {
    const router = useRouter();
    const photo = ref([]);
    const album = ref([1]);
    const selectedalbum = ref(1);

    const loadAlbum = async () => {
      try {
        const response = await api("/list-album");
        album.value = response.data;
      } catch (err) {
        console.error(err);
      }
    };

    const loadPhoto = async (data) => {
      try {
        photo.value = data;
      } catch (err) {
        console.error(err);
      }
    };

    const submit = async (data) => {
      try {
        await api.post("/photos/add", data);
        router.push({ name: "Gallery", params: { albumId: data.albumId } });
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(async () => {
      await loadAlbum();
    });

    return {
      photo,
      album,
      selectedalbum,
      loadPhoto,
      submit,
    };
  },
  methods: {
    textChange: function () {
      const data = [
        {
          albumId: this.selectedalbum,
          title: this.title,
          url: this.url,
          thumbnailUrl: this.thumbnailUrl,
        },
      ];
      this.loadPhoto(data);
    },
    submitPhoto: function () {
      const data = {
        albumId: this.selectedalbum,
        title: this.title,
        url: this.url,
        thumbnailUrl: this.thumbnailUrl,
      };
      this.submit(data);
    },
    getData: async function () {
      const response = await api("/photos-view/354");
      const fieldData = response.data[0];
      console.log(fieldData);
      this.selectedalbum = fieldData.albumId;
      this.title = fieldData.title;
      this.url = fieldData.url;
      this.thumbnailUrl = fieldData.thumbnailUrl;
      this.textChange();
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
