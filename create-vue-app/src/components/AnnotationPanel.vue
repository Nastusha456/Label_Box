<template>
    <div class="annotationPanel">
        <input type="range" min="0.3" max="4" value="1" step="0.1" v-model="scale" @input="onSliderChange">
        <input type="number" min="0.3" max="4" value="1" step="0.1" v-model="scale" @input="onSliderChange">
        <label for="mooving">Mooving</label>
        <input type="radio" id="mooving" name="workSettings" value="mooving" @input="onModeChange" checked>
        <label for="markup">Markup</label>
        <input type="radio" id="markup" name="workSettings" value="markup" @input="onModeChange">
    </div>
</template>

<script>
export default {
  data() {
    return {
      scale : 1,
      selectedMode: 'mooving'
    }
  },
  methods: {
    onSliderChange(event) {
      this.scale = event.target.value
      this.$emit('slider-change', this.scale);
    },
    onModeChange(event) {
      this.selectedMode = event.target.value
      this.$emit('mode-change', this.selectedMode);
    }
  },
}    
</script>

<style>
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
    
</style>