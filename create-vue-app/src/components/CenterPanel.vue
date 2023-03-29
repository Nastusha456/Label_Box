<template>
  <div class="content">
    <p id="projectName">*** {{ projectName }} ***</p>
    <div>
      <div class="choose_image">
        <div v-if="!imageUrl" class="upload_img_box" @click="SelectFile">
          <i class="bx bxs-image-add"></i><br />
          <input
            ref="fileInput"
            type="file"
            @change="onFileSelected"
            id="selectedImage"
            accept="image/jpeg, image/png"
          />
          <p>choose Image from folder</p>
        </div>
      </div>
      <canvas id="image_canvas"></canvas>
      <div class="image_holder" v-if="imageUrl">
        <img
          :src="imageUrl"
          alt="img"
          id="image"
          @load="onImageLoad"
          ref="Image"
        />
      </div>
    </div>
    <div id="imgData">
      <div>
        {{ this.imageName ? ` Image: ${this.imageName};` : null }}
      </div>
      <div>
        {{ this.imageWidth ? ` width: ${this.imageWidth}px;` : null }}
        {{ this.imageHeigth ? ` heigth: ${this.imageHeigth}px;` : null }}
        {{ this.imageSize ? ` size: ${this.imageSize}КБ` : null }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectName: "Project name",
      imageUrl: null,
      selectedFile: null,
      imageWidth: null,
      imageHeigth: null,
      imageSize: null,
      imageName: null,
      // Edited: false,
    }
  },
  methods: {
    onImageLoad() {
      this.imageWidth = this.$refs.Image.naturalWidth
      this.imageHeigth = this.$refs.Image.naturalHeight
      this.imageSize = Math.ceil((this.selectedFile.size / 1024) * 10) / 10
      this.imageName = this.selectedFile.name
    },
    SelectFile() {
      this.$refs.fileInput.click()
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
      this.imageUrl = URL.createObjectURL(this.selectedFile)

      // if (this.Edited == false) {
      //   this.Edited = true
      // }
    },
    remove_img_btn() {
      this.imageUrl = null
      this.imageWidth = null
      this.imageHeigth = null
      this.imageSize = null
      this.imageName = null
    },
    Download_btn() {
      // const image = this.$refs.image
      if (this.imageUrl !== "") {
        // if (this.Edited) {
        //   const canvas = document.createElement("canvas")
        //   canvas.width = image.naturalWidth
        //   canvas.height = image.naturalHeight
        //   const context = canvas.getContext("2d")
        //   context.drawImage(image, 0, 0)
        //   const jpegUrl = canvas.toDataURL("image/jpeg")
        //   const link = document.createElement("a")
        //   link.setAttribute("href", jpegUrl)
        //   link.setAttribute("download", this.selectedFile)
        //   link.style.display = "none"
        //   document.body.appendChild(link)
        //   link.click()
        //   document.body.removeChild(link)
        // } else {
        const link = document.createElement("a")
        link.setAttribute("href", this.imageUrl)
        link.setAttribute("download", this.selectedFile)
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      // }
    },
  },
  mounted() {
    // установка высоты и ширины изображения в натуральный размер
    const image = this.$refs.Image
    console.log(image)
    if (image) {
      image.onload = () => {
        image.style.width = `${image.naturalWidth}px`
        image.style.height = `${image.naturalHeight}px`
      }
    }
  },
}
</script>

<style>
/*content part */
.content {
  border: 3px solid white; /* **************** */

  position: relative;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.content #projectName {
  position: absolute;
  align-items: center;
  top: 10px;
  letter-spacing: 3px;
  font-family: "Staatliches", cursive;
  color: rgba(255, 255, 255, 0.5);
}

.content #imgData {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  letter-spacing: 3px;
  font-family: "Staatliches", cursive;
  color: rgba(255, 255, 255, 0.5);
}

.choose_image {
  width: 70%;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.upload_img_box {
  margin: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  cursor: pointer;
  border: 1px dashed rgba(255, 255, 255, 0.5);
}

.upload_img_box:hover {
  background: rgba(255, 255, 255, 0.1);
}

.upload_img_box:hover i {
  color: #ff7043;
}

.upload_img_box p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2em;
}

.upload_img_box:hover p {
  color: #ff7043;
}

.upload_img_box i {
  font-size: 2.2em;
  color: rgba(255, 255, 255, 0.5);
}

#selectedImage {
  display: none;
}

/*canvas */
#image_canvas {
  display: none;
}

/*image holder part*/

.image_holder {
  position: relative;
  display: block;
  width: 100%;
  height: 80%;
}

.image_holder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.image_holder button {
  position: absolute;
  display: block;
  top: -30px;
  left: 0px;
  outline: none;
  border: none;
  cursor: pointer;
  color: #ff7043;
  font-size: 1.8em;
  background: none;
  transform: rotate(270deg);
}
</style>
