<template>
    <!-- <button @click="getImagesFromFolder">Upload images</button> -->
    <div class="Images">
        <img v-for="(image, index) in images" :key="index" :src="image" @click="chooseThisImage(image)" />
    </div>
</template>

<script>
export default {
  data() {
    return {
        images: [],
    }
  },
  methods: {
    chooseThisImage(image) {
        this.$emit("chooseThisImage", image)
    }
  },
  created() {
    const images = require.context('@/images', false, /\.(png|jpe?g|gif|webp)$/);
    this.images = images.keys().map(key => images(key))
  },
}
</script>

<style>
.Images {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-left: 10px;
    margin-top: 10px;
}

.Images img {
    width: 60px;

}
</style>
