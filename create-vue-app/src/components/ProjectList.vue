<template>
  <li class="drop">
    <div @click="Show_subList" class="item">
      Project {{ `${this.isSubListShow ? "\u{025B7}" : "\u{025BD}"}` }}
    </div>
    <ul class="subList" v-if="isSubListShow">
      <li><div class="item">Open project</div></li>
      <li><div class="item">Create project</div></li>
      <li><div @click="Add_images" class="item">Add images</div></li>
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
    Add_images() {
      this.$emit("addImages")
    },
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
