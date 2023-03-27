<template>
  <nav-bar @addImages="addImages" />
  <div class="main">
    <div class="container">
      <left-panel @download="download" />
      <center-panel ref="CenterPanel" />
      <right-panel />
    </div>
    <classifier />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue"
import LeftPanel from "@/components/LeftPanel.vue"
import RightPanel from "@/components/RightPanel.vue"
import CenterPanel from "@/components/CenterPanel.vue"
import Classifier from "@/components/Classifier.vue"
export default {
  components: { NavBar, LeftPanel, RightPanel, CenterPanel, Classifier },
  data() {
    return {}
  },
  methods: {
    download() {
      this.$refs.CenterPanel.Download_btn()
    },
    addImages() {
      this.$refs.CenterPanel.SelectFile()
    },
  },
}
</script>

<style>
* {
  box-sizing: border-box;
}

.main {
  padding: 10px;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17202a;
  flex-direction: column; /* Временно для классификатора!!! */
}

.container {
  margin-top: 45px;
  height: 100%;
  width: 98%;
  display: flex;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  box-shadow: 0.1px 4px 8px 5px rgba(0, 0, 0, 0.1);
}
</style>
