<template>
  <li class="drop">
    <div class="item">Annotation &bigtriangledown;</div>
    <ul class="subList">
      <li><div class="item">Download annotation</div></li>
      <li><div class="item">Unload annotation</div></li>
      <li><div class="item">Save annotation</div></li>
    </ul>
  </li>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped>
.subList {
  position: absolute;
  left: 0;
  width: 180px;
  background: rgba(255, 255, 255, 0.05);
  display: none;
  transition: 0.5s;
}

.subList li {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.drop:hover > .subList {
  display: initial;
}
</style>
