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
      <div class="image_holder" v-if="imageUrl">
        <canvas ref="canvas" @mousedown="startDraw" @mouseup="endDraw"></canvas>
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
      startCoords: { x: null, y: null },
      endCoords: { x: null, y: null },
      rectangles: [],
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
    startDraw(event) {
      console.log(this.ctx)
      // Получаем координаты мыши относительно канваса
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Сохраняем координаты маркера в свойство
      this.startCoords = { x, y };
      console.log(this.startCoords);
    },
    endDraw(event) {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.endCoords = { x, y };
      console.log(this.endCoords);
      this.drawRectangle();
    },
    drawRectangle() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      ctx.canvas.width = ctx.canvas.clientWidth;
      ctx.canvas.height = ctx.canvas.clientHeight;
      const width = this.endCoords.x - this.startCoords.x;
      const height = this.endCoords.y - this.startCoords.y;
      const x = this.startCoords.x
      const y = this.startCoords.y
      this.rectangles.push({ x, y, width, height });
      for (let i = 0; i < this.rectangles.length; i++) {
        const rect = this.rectangles[i];
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
      };
    },
  },
  mounted() {
    // установка высоты и ширины изображения в натуральный размер
    const image = this.$refs.Image
    if (image) {
      image.onload = () => {
        image.style.width = `${image.naturalWidth}px`
        image.style.height = `${image.naturalHeight}px`
      }
    }
    const canvas = this.$refs.canvas
    console.log(canvas)
    if (this.canvas) {
      this.canvas.width = canvas.clientWidth
      this.canvas.height = canvas.clientHeight
    }
    
  },
}
</script>

<style>
/*content part */
.content {
  border: 3px solid white; /* **************** */

  position: relative;
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.content #projectName {
  position: absolute;
  align-items: center;
  top: 5px;
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
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.upload_img_box {
  /* margin: 15px; */
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

/*image holder part*/

.image_holder {
  position: relative;
  display: block;
  width: 100%;
  height: 90%;
  top: 40px;
}

.image_holder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.image_holder canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  position: absolute;
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
