<template>
  <div style="display: flex; flex-direction: row; margin: 3px">
    <label for="markup" style="color: rgba(255, 255, 255, 0.5); margin-top: 5px"
      >Markup</label
    >
    <input
      type="radio"
      id="markup"
      name="workSettings"
      value="markup"
      @input="onModeChange"
    />
    <label for="point" style="color: rgba(255, 255, 255, 0.5); margin-top: 5px"
      >Point</label
    >
    <input
      type="radio"
      id="point"
      name="workSettings"
      value="point"
      @input="onModeChange"
    />
    <div class="label-editor">
      <i class="bx bxs-eraser"></i>
      <p>Eraser</p>
    </div>
    <div class="label-editor" @click="CreatePolygon">
      <i class="bx bx-shape-polygon"></i>
      <p>Create Polygon</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedMode: "mooving",
    }
  },
  methods: {
    onModeChange(event) {
      this.selectedMode = event.target.value
      this.$emit("mode-change", this.selectedMode)
    },
    CreatePolygon() {
      this.$emit("createPolygon")
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
</style>
