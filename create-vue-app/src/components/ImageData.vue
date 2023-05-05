<template>
  <div class="imgData">
    <div>
      {{ imageData.imageName ? ` Image: ${imageData.imageName};` : null }}
    </div>
    <div>
      {{ imageData.imageWidth ? ` width: ${imageData.imageWidth}px;` : null }}
      {{
        imageData.imageHeigth ? ` heigth: ${imageData.imageHeigth}px;` : null
      }}
      {{ imageData.imageSize ? ` size: ${imageData.imageSize}` : null }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageData: Object,
  },
}
</script>

<style>
.imgData {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  bottom: 0;
  letter-spacing: 3px;
  font-family: "Staatliches", cursive;
  color: rgba(255, 255, 255, 0.5);
}
</style>
