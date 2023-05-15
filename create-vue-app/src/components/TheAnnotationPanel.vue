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
      class="number-input"
      type="number"
      :min="minScale"
      :max="maxScale"
      :step="step"
      v-model="scale"
      @input="onSliderChange"
    />
    <input
      type="radio"
      id="moving"
      name="workSettings"
      value="moving"
      @input="onModeChange"
      checked
    />
    <div class="label-editor" @click="ModeChange('moving')">
      <i class="bx bx-move bx-burst-hover"></i>
      <p>Move</p>
    </div>
    <the-annotation-panel-toolbar
      v-if="isLabelEditorShow"
      ref="LabelEditor"
      @mode-change="mode_change"
      @connectInSeries="ConnectDots"
      @createPolygon="CreatePolygon"
      @changeColor="changeColor"
      @changeCursor="changeCursor"
    />
    <div class="label-editor" @click="ShowLabelEditor">
      <i class="bx bxs-edit bx-fade-right-hover"></i>
      <p>label editor</p>
    </div>
  </div>
</template>

<script>
import TheAnnotationPanelToolbar from "@/components/TheAnnotationPanelToolbar.vue"

export default {
  components: {
    TheAnnotationPanelToolbar,
  },
  data() {
    return {
      minScale: 0.1,
      maxScale: 5,
      scale: 1,
      step: 0.1,
      selectedMode: "moving",
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
    ConnectDots() {
      this.$emit("connectInSeries")
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
      if (this.isLabelEditorShow === false) {
        this.ModeChange("moving")
      }
      this.$emit("show-label-editor")
    },
    changeColor(color) {
      this.$emit("changeColor", color)
    },
    changeCursor(value) {
      this.$emit("changeCursor", value)
    },
    plusNewLabel() {
      this.isLabelEditorShow = true
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

.number-input {
  width: 40px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
</style>
