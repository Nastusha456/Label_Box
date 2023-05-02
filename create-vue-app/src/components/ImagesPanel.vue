<template>
    <!-- <button @click="getImagesFromFolder">Upload images</button> -->
    <div class="Images">
        <img v-for="(image, index) in images" :key="index" :src="image.src" :style="{ borderColor: activeIndex === index ? '#2ecc71' : 'rgba(255, 255, 255, 0.5)' }" @click="chooseThisImage(image, index)" />
    </div>
</template>

<script>
export default {
  data() {
    return {
        images: [],
        activeIndex: -1,
    }
  },
  methods: {
    chooseThisImage(image, index) {
        this.$emit("chooseThisImage", image)
        this.activeIndex = index
    }
  },
  created() {
    const imageContext = require.context('@/images', false, /\.(png|jpe?g|gif|webp)$/i)
    console.log(imageContext(imageContext.keys()[0]))
    this.images = imageContext.keys().map(key => ({
        name: key.split('/').pop(),
        size: NaN,
        src: imageContext(key)
    }))
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
    background: none;
    border: 2px solid rgba(255, 255, 255, 0.5);
    color: rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    transition: 0.25s;
    cursor: pointer;
}
.Images img:hover {
    background: #2ecc71;
    border: 2px solid #17202a;
    color: #17202a;
}
</style>
