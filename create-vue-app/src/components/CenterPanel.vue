<template>
  <div class="content" ref="content">
    <div class="image_container" ref="image_container">
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
      <div class="image_holder" ref="image_holder" v-if="imageUrl">
        <canvas
          ref="canvas"
          @mousedown="mouseDown"
          @mouseup="mouseUp"
          @mousemove="mouseMove"
        ></canvas>
        <img
          :src="imageUrl"
          alt="img"
          id="image"
          @load="onImageLoad"
          ref="Image"
        />
      </div>
    </div>
    <!-- <div id="imgData">
      <div>
        {{ this.imageName ? ` Image: ${this.imageName};` : null }}
      </div>
      <div>
        {{ this.imageWidth ? ` width: ${this.imageWidth}px;` : null }}
        {{ this.imageHeigth ? ` heigth: ${this.imageHeigth}px;` : null }}
        {{ this.imageSize ? ` size: ${this.imageSize}КБ` : null }}
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: null,
      selectedFile: null,
      imageData: {},
      imageWidth: null,
      imageHeigth: null,
      imageSize: null,
      imageName: null,
      startCoords: { x: null, y: null },
      endCoords: { x: null, y: null },
      rectangles: [],
      isDrowing: false,
      isDragging: false,
      startMouseX: 0,
      startMouseY: 0,
      startImageX: 0,
      startImageY: 0,

      // Edited: false,
    }
  },
  props: {
    scale: {
      // Определение пропса scale
      type: Number,
      required: true,
    },
    selectedMode: String,
  },
  watch: {
    scale(newVal, oldVal) {
      const image = this.$refs.Image
      const canvas = this.$refs.canvas
      if (image) {
        image.style.width = `${image.naturalWidth * this.scale}px`
        image.style.height = `${image.naturalHeight * this.scale}px`
        canvas.style.width = `${image.naturalWidth * this.scale}px`
        canvas.style.height = `${image.naturalHeight * this.scale}px`
        this.drawRectangle()
      }
    },
  },
  methods: {
    onImageLoad() {
      this.imageWidth = this.$refs.Image.naturalWidth
      this.imageHeigth = this.$refs.Image.naturalHeight
      this.imageSize = Math.ceil((this.selectedFile.size / 1024) * 10) / 10
      this.imageName = this.selectedFile.name

      this.imageData = {
        imageWidth: this.imageWidth,
        imageHeigth: this.imageWidth,
        imageSize: this.imageSize,
        imageName: this.imageName,
      }
      this.$emit("getImgData", this.imageData)
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
      this.rectangles = []
      this.isDrowing = false

      this.imageData = {
        imageWidth: this.imageWidth,
        imageHeigth: this.imageWidth,
        imageSize: this.imageSize,
        imageName: this.imageName,
      }
      this.$emit("getImgData", this.imageData)
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
    mouseDown(event) {
      if (this.selectedMode === "markup") {
        //Начало рисования
        // Получаем координаты мыши относительно канваса
        const canvas = this.$refs.canvas
        const rect = canvas.getBoundingClientRect()
        const x = (event.clientX - rect.left) / this.scale
        const y = (event.clientY - rect.top) / this.scale

        // Сохраняем координаты маркера в свойство
        this.startCoords = { x, y }
        this.isDrowing = true
      } else {
        this.isDragging = true
        this.startMouseX = event.clientX
        this.startMouseY = event.clientY
        this.startImageX = parseInt(this.$refs.image_holder.style.left) || 0
        this.startImageY = parseInt(this.$refs.image_holder.style.top) || 0
      }
    },
    mouseMove(event) {
      if (this.isDrowing && this.selectedMode === "markup") {
        // Процесс рисования
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext("2d")
        ctx.canvas.width = ctx.canvas.clientWidth
        ctx.canvas.height = ctx.canvas.clientHeight
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const width = x - this.startCoords.x * this.scale
        const height = y - this.startCoords.y * this.scale
        ctx.beginPath()
        ctx.rect(
          this.startCoords.x * this.scale,
          this.startCoords.y * this.scale,
          width,
          height
        )
        ctx.stroke()
        for (let i = 0; i < this.rectangles.length; i++) {
          const rect = this.rectangles[i]
          ctx.beginPath()
          ctx.rect(
            rect.x * this.scale,
            rect.y * this.scale,
            rect.width * this.scale,
            rect.height * this.scale
          )
          ctx.stroke()
        }
      } else {
        if (this.isDragging) {
          const offsetX = event.clientX - this.startMouseX
          const offsetY = event.clientY - this.startMouseY
          this.$refs.image_holder.style.left = this.startImageX + offsetX + "px"
          this.$refs.image_holder.style.top = this.startImageY + offsetY + "px"
          // Проверка на выход курсора мыши за границу
          const rectCont = this.$refs.content.getBoundingClientRect()
          const mouseX = event.clientX
          const mouseY = event.clientY
          if (
            mouseX <= rectCont.left ||
            mouseX >= rectCont.left + rectCont.width ||
            mouseY <= rectCont.top ||
            mouseY >= rectCont.top + rectCont.height
          ) {
            // Курсор мыши достиг границы div
            this.isDragging = false
          }
        }
      }
    },
    mouseUp(event) {
      if (this.selectedMode === "markup") {
        // Конец рисования
        const canvas = this.$refs.canvas
        const rect = canvas.getBoundingClientRect()
        const x = (event.clientX - rect.left) / this.scale
        const y = (event.clientY - rect.top) / this.scale
        this.endCoords = { x, y }
        this.drawRectangle()
        this.isDrowing = false
      } else {
        this.isDragging = false
      }
    },
    drawRectangle() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")
      ctx.canvas.width = ctx.canvas.clientWidth
      ctx.canvas.height = ctx.canvas.clientHeight
      const width = this.endCoords.x - this.startCoords.x
      const height = this.endCoords.y - this.startCoords.y
      const x = this.startCoords.x
      const y = this.startCoords.y
      this.rectangles.push({ x, y, width, height })
      for (let i = 0; i < this.rectangles.length; i++) {
        const rect = this.rectangles[i]
        ctx.beginPath()
        ctx.rect(
          rect.x * this.scale,
          rect.y * this.scale,
          rect.width * this.scale,
          rect.height * this.scale
        )
        ctx.stroke()
      }
    },
  },
  updated() {
    // установка высоты и ширины изображения в натуральный размер
    const image = this.$refs.Image
    const canvas = this.$refs.canvas
    if (image) {
      image.onload = () => {
        image.style.width = `${image.naturalWidth * this.scale}px`
        image.style.height = `${image.naturalHeight * this.scale}px`
        canvas.style.width = `${image.naturalWidth * this.scale}px`
        canvas.style.height = `${image.naturalHeight * this.scale}px`
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
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
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
  height: 170px;
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
  /* height: 90%; */
  max-height: 100vh;
  padding-top: 40px; /* отступ сверху */
  padding-bottom: 40px; /* отступ снизу */
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
