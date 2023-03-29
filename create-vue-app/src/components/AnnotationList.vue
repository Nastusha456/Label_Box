<template>
  <li class="drop">
    <div @click="Show_subList" class="item">
      Annotation {{ `${this.isSubListShow ? "\u{025B7}" : "\u{025BD}"}` }}
    </div>
    <ul class="subList" v-if="isSubListShow">
      <li><div class="item">Download annotation</div></li>
      <li><div class="item">Unload annotation</div></li>
      <li><div class="item">Save annotation</div></li>
    </ul>
  </li>
</template>

<script>
export default {
  data() {
    return {
      isSubListShow: false,
    }
  },
  methods: {
    Show_subList() {
      this.isSubListShow = !this.isSubListShow
    },
  },
}
</script>

<style scoped>
.subList {
  position: absolute;
  left: 0;
  width: 180px;
  background: rgba(255, 255, 255, 0.05);
  display: block;
  transition: 0.5s;
}

.subList li {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
