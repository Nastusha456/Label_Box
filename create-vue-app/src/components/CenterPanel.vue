<template>
  <div class="content">
    <p id="projectName">***Project name***</p>
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
      <button id="remove_img_btn" @click="remove_img_btn">
        <i class="bx bxs-message-square-x"></i>
      </button>
      <img :src="imageUrl" alt="img" id="image" />
    </div>
    <button id="clearAll"><span>Reset</span><i class="bx bx-reset"></i></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: "",
      selectedFile: null,
      Edited: false,
    }
  },
  methods: {
    SelectFile() {
      this.$refs.fileInput.click()
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
      this.imageUrl = URL.createObjectURL(this.selectedFile)
      if (this.Edited == false) {
        this.Edited = true
      }
    },
    remove_img_btn() {
      this.imageUrl = ""
    },
    Download_btn() {
      const image = this.$refs.image
      if (this.imageUrl !== "") {
        if (this.edited) {
          const canvas = document.createElement("canvas")
          canvas.width = image.naturalWidth
          canvas.height = image.naturalHeight
          const context = canvas.getContext("2d")
          context.drawImage(image, 0, 0)
          const jpegUrl = canvas.toDataURL("image/jpeg")
          const link = document.createElement("a")
          link.setAttribute("href", jpegUrl)
          link.setAttribute("download", this.selectedFile)
          link.style.display = "none"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          const link = document.createElement("a")
          link.setAttribute("href", this.imageUrl)
          link.setAttribute("download", this.selectedFile)
          link.style.display = "none"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
  },
}
</script>

<style>
/*content part */
.content {
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

.choose_image {
  width: 70%;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.upload_img_box {
  margin-top: 10px;
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

/*clear or reset btn */
#clearAll {
  position: absolute;
  bottom: 10px;
  right: 20px;
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  padding: 10px;
  color: #17202a;
  background: #ff7043;
  transform: translateX(150px);
  box-shadow: 0.1px 4px 8px 5px rgba(0, 0, 0, 0.1);
}

#clearAll span {
  margin-right: 10px;
}
</style>
