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
          :style="{ cursor: canvasCursor }"
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
      dots: [],
      labels: [],
      visibleLabels: [],
      isDrowing: false,
      isDragging: false,
      startMouseX: 0,
      startMouseY: 0,
      startImageX: 0,
      startImageY: 0,
    }
  },
  props: {
    scale: {
      // Определение пропса scale
      type: Number,
      required: true,
    },
    selectedMode: String,
    color: String,
    selectedCursor: String,
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
        const ctx = canvas.getContext("2d")
        ctx.canvas.width = ctx.canvas.clientWidth
        ctx.canvas.height = ctx.canvas.clientHeight
        this.drawAllLabels(ctx)
        this.drawDots(ctx, this.dots, 3, this.color)
      }
    },
    labels: {
      handler(newVal, oldVal) {
        // Обработка изменений в массиве
        this.$emit("update-labels", this.labels)
        // console.log(this.labels)
      },
      deep: true,
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
    },
    remove_img_btn() {
      this.imageUrl = null
      this.imageWidth = null
      this.imageHeigth = null
      this.imageSize = null
      this.imageName = null
      this.rectangles = []
      this.dots = []
      ;(this.labels = []), (this.isDrowing = false)

      this.imageData = {
        imageWidth: this.imageWidth,
        imageHeigth: this.imageWidth,
        imageSize: this.imageSize,
        imageName: this.imageName,
      }
      this.$emit("getImgData", this.imageData)
      this.imageWidth = null
      this.imageWidth = null
      this.imageSize = null
      this.imageName = null
    },
    Download_btn() {
      if (this.imageUrl !== "") {
        const link = document.createElement("a")
        link.setAttribute("href", this.imageUrl)
        link.setAttribute("download", this.selectedFile)
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },

    drawDots(ctx, dots, radius, color) {
      for (const dot of dots) {
        ctx.beginPath()
        ctx.arc(dot.x * this.scale, dot.y * this.scale, radius, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
      }
    },

    jarvis(dots) {
      let points = [...dots]
      if (points.length < 1) {
        return points
      }
      const hull = []
      const leftMost = points.reduce((min, point) =>
        point.x < min.x ? point : min
      )
      let p = leftMost
      do {
        hull.push(p)
        let q = points[0]
        for (let i = 1; i < points.length; i++) {
          if (q === p || this.orientation(p, q, points[i]) > 0) {
            q = points[i]
          }
        }
        p = q
      } while (p !== leftMost)

      return hull
    },
    // Функция, проверяющая, в какую сторону повернуты три точки
    orientation(p, q, r) {
      return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
    },

    contour(points) {
      const leftMost = points.reduce((min, point) =>
        point.x < min.x ? point : min
      )
      const rightMost = points.reduce((max, point) =>
        point.x > max.x ? point : max
      )
      const topMost = points.reduce((min, point) =>
        point.y < min.y ? point : min
      )
      const bottomMost = points.reduce((max, point) =>
        point.y > max.y ? point : max
      )
      const contour = {
        left: leftMost.x,
        right: rightMost.x,
        top: topMost.y,
        bottom: bottomMost.y,
      }

      return contour
    },
    CreatePolygon() {
      if (this.dots.length === 0) {
        return
      }
      const coordinates = this.jarvis(this.dots)
      const contour = this.contour(coordinates)
      const color = this.color
      let labelId = 1
      if (this.labels.length != 0) {
        labelId = this.labels[this.labels.length - 1].labelId + 1
      }
      this.dots = []
      const label = { coordinates, contour, color, labelId }
      this.labels.push(label)
      this.visibleLabels.push(label)
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")
      ctx.canvas.width = ctx.canvas.clientWidth
      ctx.canvas.height = ctx.canvas.clientHeight
      this.drawAllLabels(ctx)
    },

    drawLabel(ctx, points, color, fill) {
      if (points.length === 0) {
        return
      }
      ctx.fillStyle = fill
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(points[0].x * this.scale, points[0].y * this.scale)
      for (const point of points.slice(1)) {
        ctx.lineTo(point.x * this.scale, point.y * this.scale)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    },
    drawAllLabels(ctx) {
      for (const label of this.visibleLabels) {
        const points = label.coordinates
        const color = label.color ? label.color : "black"
        this.drawLabel(ctx, points, color, "transparent")
      }
    },
    findLabel(offsetX, offsetY, labels) {
      let minSquare = Infinity
      let foundLabel = null
      for (const label of labels) {
        let square =
          (label.contour.right - label.contour.left) *
          (label.contour.bottom - label.contour.top)
        if (
          label.contour.left <= offsetX &&
          offsetX <= label.contour.right &&
          label.contour.top <= offsetY &&
          offsetY <= label.contour.bottom &&
          square <= minSquare
        ) {
          minSquare = square
          foundLabel = label
        }
      }
      return foundLabel
    },
    findAllLabels(offsetX, offsetY, labels) {
      const filteredLabels = labels.filter(
        (label) =>
          label.contour.left <= offsetX &&
          offsetX <= label.contour.right &&
          label.contour.top <= offsetY &&
          offsetY <= label.contour.bottom
      )
      const sortedLabels = filteredLabels.sort(
        (label1, label2) =>
          (label2.contour.right - label2.contour.left) *
            (label2.contour.bottom - label2.contour.top) -
          (label1.contour.right - label1.contour.left) *
            (label1.contour.bottom - label1.contour.top)
      )

      return sortedLabels
    },
    findDotIntoLabel(offsetX, offsetY, label) {
      if (label) {
        for (const dot of label.coordinates) {
          const distance = (offsetX - dot.x) ** 2 + (offsetY - dot.y) ** 2
          if (distance <= 45) {
            return dot
          }
        }
      }
      return null
    },
    findDotFromDots(offsetX, offsetY) {
      if (this.dots.length !== 0) {
        for (const dot of this.dots) {
          const distance = (offsetX - dot.x) ** 2 + (offsetY - dot.y) ** 2
          if (distance <= 45) {
            return dot
          }
        }
      }
      return null
    },
    deleteDot(ctx, label, dot) {
      if (label) {
        const label_index = this.labels.indexOf(label)
        const visibleLabel_index = this.visibleLabels.indexOf(label)
        const dot_index = label.coordinates.indexOf(dot)
        const color = label.color
        if (dot_index !== -1) {
          label.coordinates.splice(dot_index, 1)
          this.dots = this.dots.concat(label.coordinates)
        }
        if (label_index !== -1) {
          this.labels.splice(label_index, 1)
        }
        if (visibleLabel_index !== -1) {
          this.visibleLabels.splice(visibleLabel_index, 1)
        }
        this.drawDots(ctx, this.dots, 3, color)
      } else if (dot) {
        const dot_index = this.dots.indexOf(dot)
        const color = this.color
        if (dot_index !== -1) {
          this.dots.splice(dot_index, 1)
        }
        this.drawDots(ctx, this.dots, 3, color)
      }
    },
    findLabelById(id, labels) {
      for (const label of labels) {
        if (label.labelId == id) {
          return label
        }
      }
      return null
    },
    deleteLabelFromLabels(label, labels) {
      const label_index = labels.indexOf(label)
      if (label_index !== -1) {
        labels.splice(label_index, 1)
      }
    },
    deleteLabelBtn(id) {
      const visibleLabel = this.findLabelById(id, this.visibleLabels)
      if (visibleLabel) {
        this.deleteLabelFromLabels(visibleLabel, this.visibleLabels)
      }

      const label = this.findLabelById(id, this.labels)
      if (label) {
        this.deleteLabelFromLabels(label, this.labels)
      }

      // Процесс рисования
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")
      ctx.canvas.width = ctx.canvas.clientWidth
      ctx.canvas.height = ctx.canvas.clientHeight

      this.drawAllLabels(ctx)
      this.drawDots(ctx, this.dots, 3, this.color)
    },
    changeLabelColorBtn(id) {
      const newColor = this.color
      const visibleLabel = this.findLabelById(id, this.visibleLabels)
      if (visibleLabel) {
        const visibleLabel_index = this.visibleLabels.indexOf(visibleLabel)
        if (visibleLabel_index !== -1) {
          this.visibleLabels[visibleLabel_index].color = newColor
        }
      }
      const label = this.findLabelById(id, this.labels)
      if (label) {
        const label_index = this.labels.indexOf(label)
        if (label_index !== -1) {
          this.labels[label_index].color = newColor
        }
      }

      // Процесс рисования
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")
      ctx.canvas.width = ctx.canvas.clientWidth
      ctx.canvas.height = ctx.canvas.clientHeight

      this.drawAllLabels(ctx)
      this.drawDots(ctx, this.dots, 3, this.color)
    },
    visibleLabelBtn(id) {
      const visibleLabel = this.findLabelById(id, this.visibleLabels)
      if (visibleLabel) {
        this.deleteLabelFromLabels(visibleLabel, this.visibleLabels)
      } else {
        const label = this.findLabelById(id, this.labels)
        if (label) {
          this.visibleLabels.push(label)
        }
      }

      // Процесс рисования
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")
      ctx.canvas.width = ctx.canvas.clientWidth
      ctx.canvas.height = ctx.canvas.clientHeight

      this.drawAllLabels(ctx)
      this.drawDots(ctx, this.dots, 3, this.color)
    },
    AddNewLabels(labels) {
      for (const label of labels) {
        if (!label.coordinates) {
          label.contour = this.contour(label.coordinates)
          if (!label.color) {
            label.color = this.color
          }
          this.labels.push(label)
          this.visibleLabels.push(label)
        }
      }

      // Процесс рисования
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")
      ctx.canvas.width = ctx.canvas.clientWidth
      ctx.canvas.height = ctx.canvas.clientHeight

      this.drawAllLabels(ctx)
      this.drawDots(ctx, this.dots, 3, this.color)
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
      } else if (this.selectedMode === "mooving") {
        this.isDragging = true
        this.startMouseX = event.clientX
        this.startMouseY = event.clientY
        this.startImageX = parseInt(this.$refs.image_holder.style.left) || 0
        this.startImageY = parseInt(this.$refs.image_holder.style.top) || 0
      } else if (this.selectedMode === "dot") {
        const canvas = this.$refs.canvas
        const rect = canvas.getBoundingClientRect()
        const x = (event.clientX - rect.left) / this.scale
        const y = (event.clientY - rect.top) / this.scale
        this.dots.push({ x, y })
      } else if (this.selectedMode === "eraser") {
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext("2d")
        ctx.canvas.width = ctx.canvas.clientWidth
        ctx.canvas.height = ctx.canvas.clientHeight
        const rect = canvas.getBoundingClientRect()
        const x = (event.clientX - rect.left) / this.scale
        const y = (event.clientY - rect.top) / this.scale

        // Удаление точки внутри метки
        const dotFromDots = this.findDotFromDots(x, y)
        if (dotFromDots) {
          this.deleteDot(ctx, null, dotFromDots)
        } else {
          const label = this.findLabel(x, y, this.visibleLabels)
          const dot = this.findDotIntoLabel(x, y, label)
          this.deleteDot(ctx, label, dot)
        }
        this.drawAllLabels(ctx)
        this.drawDots(ctx, this.dots, 3, this.color)
      }
    },
    mouseMove(event) {
      // Процесс рисования
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")
      ctx.canvas.width = ctx.canvas.clientWidth
      ctx.canvas.height = ctx.canvas.clientHeight
      const rect = canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left) / this.scale
      const y = (event.clientY - rect.top) / this.scale

      this.drawAllLabels(ctx)
      this.drawDots(ctx, this.dots, 3, this.color)

      const label = this.findLabel(x, y, this.visibleLabels)
      if (label) {
        const color = label.color ? label.color : "#000000"
        const fill = this.hexToRgbA(color, 0.3)
        this.drawLabel(ctx, label.coordinates, color, fill)
        this.drawDots(ctx, label.coordinates, 3, color)
      }

      if (this.isDrowing && this.selectedMode === "markup") {
        // Процесс рисования
        const width = x - this.startCoords.x * this.scale
        const height = y - this.startCoords.y * this.scale

        this.drawRect(ctx, width, height, this.color)
        this.drawDots(ctx, this.dots, 3, this.color)
      } else if (this.isDragging) {
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
    },
    mouseUp(event) {
      if (this.isDrowing && this.selectedMode === "markup") {
        // Конец рисования
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext("2d")
        const rect = canvas.getBoundingClientRect()
        let x = (event.clientX - rect.left) / this.scale
        let y = (event.clientY - rect.top) / this.scale
        this.endCoords = { x, y }
        const width = this.endCoords.x - this.startCoords.x
        const height = this.endCoords.y - this.startCoords.y
        x = this.startCoords.x
        y = this.startCoords.y
        // const coordinates = [{x:x, y:y}, {x:x, y:y + height}, {x:x + width, y:y + height}, {x:x + width, y:y}]
        const dots = [
          { x: x, y: y },
          { x: x, y: y + height },
          { x: x + width, y: y + height },
          { x: x + width, y: y },
        ]
        const coordinates = this.jarvis(dots)
        const contour = this.contour(coordinates)
        // const contour = {
        //   left: x,
        //   right: x + width,
        //   top: y,
        //   bottom: y + height,
        // }
        const color = this.color
        let labelId = 1
        if (this.labels.length != 0) {
          labelId = this.labels[this.labels.length - 1].labelId + 1
        }
        const label = { coordinates, contour, color, labelId }
        this.labels.push(label)
        this.visibleLabels.push(label)
        this.drawAllLabels(ctx)
        this.drawDots(ctx, this.dots, 3, this.color)
        this.isDrowing = false
      } else {
        this.isDragging = false
      }
    },
    drawRect(ctx, width, height, color) {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.rect(
        this.startCoords.x * this.scale,
        this.startCoords.y * this.scale,
        width,
        height
      )
      ctx.stroke()
    },
    hexToRgbA(hex, alpha) {
      let r = parseInt(hex.slice(1, 3), 16)
      let g = parseInt(hex.slice(3, 5), 16)
      let b = parseInt(hex.slice(5, 7), 16)

      return `rgba(${r}, ${g}, ${b}, ${alpha})`
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
  computed: {
    canvasCursor() {
      return this.selectedCursor
    },
  },
}
</script>

<style scoped>
/*content part */
.content {
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.upload_img_box {
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
  width: 1000%;
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
