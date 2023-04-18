<template>
  <div style="display: flex; flex-direction: row; margin: 3px">
    <input
      type="radio"
      id="markup"
      name="workSettings"
      value="markup"
      @input="onModeChange"
    />
    <div class="label-editor" @click="ModeChange('markup')">
      <i class="bx bx-selection"></i>
      <p>Markup</p>
    </div>
    <input
      type="radio"
      id="dot"
      name="workSettings"
      value="dot"
      @input="onModeChange"
    />
    <div class="label-editor" @click="ModeChange('dot')">
      <i class="bx bx-message-square-edit"></i>
      <p>Dot</p>
    </div>
    <input
      type="radio"
      id="eraser"
      name="workSettings"
      value="eraser"
      @input="onModeChange"
    />
    <div class="label-editor" @click="ModeChange('eraser')">
      <i class="bx bxs-eraser"></i>
      <p>Eraser</p>
    </div>
    <div class="label-editor" @click="CreatePolygon">
      <i class="bx bx-shape-polygon"></i>
      <p>Create Polygon</p>
    </div>
    <input
      v-if="isShowPalette"
      type="color"
      id="color"
      name="palette"
      value="#ff0000"
      @input="changeColor"
    />
    <div class="label-editor" @click="ShowPalette()">
      <i class="bx bxs-palette"></i>
      <p>Palette</p>
    </div>
  </div>
</template>

<script scoped>
import ColorPalette from "@/components/ColorPalette.vue"

export default {
  components: {
    ColorPalette,
  },
  data() {
    return {
      selectedMode: "mooving",
      isShowPalette: false,
    }
  },
  methods: {
    onModeChange(event) {
      this.selectedMode = event.target.value
      this.$emit("mode-change", this.selectedMode)
      this.$emit("changeCursor", "crosshair")
    },
    ModeChange(value) {
      this.selectedMode = value
      document.getElementById(value).checked = true
      this.$emit("mode-change", this.selectedMode)
      this.$emit("changeCursor", "crosshair")
    },
    CreatePolygon() {
      this.$emit("createPolygon")
    },
    ShowPalette() {
      this.isShowPalette = !this.isShowPalette
    },
    changeColor(event) {
      this.$emit("changeColor", event.target.value)
    },
  },
}
</script>

<style scoped>
.label-editor {
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

input[type="color"] {
  width: 30px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 3px;
}
</style>
