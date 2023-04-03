<template>
    <div class="annotationPanel">
        <button>Приблизить</button> 
        <!-- Здесь должны быть нормальные кнопки и иконки -->
        <button>Отдалить</button>
        <label for="mooving">Mooving</label>
        <input type="radio" id="mooving" name="workSettings" value="mooving">
        <label for="markup">Markup</label>
        <input type="radio" id="markup" name="workSettings" value="markup">
    </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    
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