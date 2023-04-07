<template>
    <div class="annotationPanel">
        <!-- <button>Приблизить</button> 
        Здесь должны быть нормальные кнопки и иконки 
        <button>Отдалить</button> -->
        <input type="range" min="0.3" max="4" value="1" step="0.1" @input="onSliderChange">
        <label for="mooving">Mooving</label>
        <input type="radio" id="mooving" name="workSettings" value="mooving">
        <label for="markup">Markup</label>
        <input type="radio" id="markup" name="workSettings" value="markup">
    </div>
</template>

<script>
export default {
  data() {
    return {
      scale : 1
    }
  },
  methods: {
    onSliderChange(event) {
      this.scale = event.target.value
      this.$emit('slider-change', this.scale);
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