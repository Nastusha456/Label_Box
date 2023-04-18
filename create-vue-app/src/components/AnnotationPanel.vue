<template>
  <div class="annotationPanel">
    <div class="label-editor" @click="ZoomOut">
      <i class="bx bxs-minus-circle"></i>
    </div>
    <input
      type="range"
      :min="minScale"
      :max="maxScale"
      :step="step"
      v-model="scale"
      @input="onSliderChange"
    />
    <div class="label-editor" @click="ZoomIn">
      <i class="bx bxs-plus-circle"></i>
    </div>
    <input
      type="number"
      :min="minScale"
      :max="maxScale"
      :step="step"
      v-model="scale"
      @input="onSliderChange"
    />
    <input
      type="radio"
      id="mooving"
      name="workSettings"
      value="mooving"
      @input="onModeChange"
      checked
    />
    <div class="label-editor" @click="ModeChange('mooving')">
      <i class="bx bx-move"></i>
      <p>Move</p>
    </div>
    <label-editor
      v-if="isLabelEditorShow"
      @mode-change="mode_change"
      @createPolygon="CreatePolygon"
      @changeColor="changeColor"
      @changeCursor="changeCursor"
    />
    <div class="label-editor" @click="ShowLabelEditor">
      <i class="bx bxs-edit"></i>
      <p>label editor</p>
    </div>
  </div>
</template>

<script>
import LabelEditor from "@/components/LabelEditor.vue"

export default {
  components: {
    LabelEditor,
  },
  data() {
    return {
      minScale: 0.1,
      maxScale: 5,
      scale: 1,
      step: 0.1,
      selectedMode: "mooving",
      isLabelEditorShow: false,
    }
  },
  methods: {
    ZoomOut() {
      if (this.scale > this.minScale) {
        this.scale = Math.floor((Number(this.scale) - this.step) * 10) / 10
        this.$emit("slider-change", this.scale)
      }
    },
    ZoomIn() {
      if (this.scale < this.maxScale) {
        this.scale = Math.ceil((Number(this.scale) + this.step) * 10) / 10
        this.$emit("slider-change", this.scale)
      }
    },
    CreatePolygon() {
      this.$emit("createPolygon")
    },
    onSliderChange(event) {
      this.scale = event.target.value
      this.$emit("slider-change", this.scale)
    },
    onModeChange(event) {
      this.selectedMode = event.target.value
      this.$emit("mode-change", this.selectedMode)
    },
    ModeChange(value) {
      this.selectedMode = value
      document.getElementById(value).checked = true
      this.$emit("mode-change", this.selectedMode)
      this.changeCursor("move")
    },
    mode_change(value) {
      this.selectedMode = value
      this.$emit("mode-change", this.selectedMode)
    },
    ShowLabelEditor() {
      this.isLabelEditorShow = !this.isLabelEditorShow
      this.$emit("show-label-editor")
    },
    changeColor(color) {
      this.$emit("changeColor", color)
    },
    changeCursor(value) {
      this.$emit("changeCursor", value)
    },
  },
}
</script>

<style scoped>
.annotationPanel {
  margin-top: 0px;
  position: relative;
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.label-editor {
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: 0.5s;
}

.label-editor i {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 3px;
  font-size: 1.7em;
}

.label-editor:hover i {
  color: #ff7043;
}

.label-editor:hover p {
  opacity: 1;
  margin: 3px;
  color: #ff7043;
  font-size: 12px;
}

.label-editor p {
  opacity: 0;
}

input[type="number"] {
  width: 40px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
</style>
