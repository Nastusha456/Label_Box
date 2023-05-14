<template>
  <div class="Images">
    <div
      v-for="image in images"
      :key="image.id"
      @dblclick="chooseThisImage(image)"
    >
      <img
        :src="image.urls.full"
        :style="{
          border:
            activeIndex === image.id
              ? '3px solid #2ecc71'
              : '2px solid rgba(255, 255, 255, 0.5)',
        }"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      images: [],
      activeIndex: -1,
    }
  },
  methods: {
    ...mapGetters(["getImagesPath", "getAPI_KEY"]),

    async openProject() {
      const path = this.getImagesPath()
      const API_KEY = this.getAPI_KEY()

      await axios
        .get(path, {
          headers: { Authorization: API_KEY },
        })
        .then((response) => {
          this.images = response.data
        })
        .catch((error) => {
          alert.log(error)
        })
    },

    chooseThisImage(image) {
      this.$emit("chooseThisImage", image)
      this.activeIndex = image.id
    },
    addImg(newImg) {
      this.images.push(newImg)
    },
  },
}
</script>

<style scoped>
.Images {
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  width: 100%;
  overflow-y: scroll;
}

.Images img {
  margin-top: 3px;
  margin-left: 5px;
  height: 60px;
  width: 60px;
  background: none;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  transition: 0.25s;
  cursor: pointer;
}
.Images img:hover {
  background: #2ecc71;
  border: 2px solid #2ecc71;
}
</style>
