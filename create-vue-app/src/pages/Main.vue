<template>
  <nav-bar @addImages="addImages" />
  <div class="main">
    <div class="container">
      <left-panel @download="download" @showClassifier="showClassifier" />
      <classifier v-if="isShowClassifier" />
      <div class="centerBlock" >
        <annotation-panel v-if="isShowAnnotationPanel" />
        <center-panel ref="CenterPanel" />
      </div>
      <right-panel @delet="delet" @beginAnnotation="beginAnnotation" />
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue"
import LeftPanel from "@/components/LeftPanel.vue"
import RightPanel from "@/components/RightPanel.vue"
import CenterPanel from "@/components/CenterPanel.vue"
import Classifier from "@/components/Classifier.vue"
import AnnotationPanel from "@/components/AnnotationPanel.vue"

export default {
  components: { NavBar, LeftPanel, RightPanel, CenterPanel, Classifier, AnnotationPanel },
  data() {
    return {
      isShowClassifier: false,
      isShowAnnotationPanel: false,
    }
  },
  methods: {
    download() {
      this.$refs.CenterPanel.Download_btn()
    },
    addImages() {
      this.$refs.CenterPanel.SelectFile()
    },
    showClassifier() {
      this.isShowClassifier = !this.isShowClassifier
    },
    delet() {
      this.$refs.CenterPanel.remove_img_btn()
    },
    beginAnnotation() {
      this.isShowAnnotationPanel = !this.isShowAnnotationPanel
    },
  },
}
</script>

<style>
* {
  box-sizing: border-box;
}

.main {
  border: 3px solid red; /* ********** */
  height: 100%;
  margin-top: 150px;

  padding: 10px;
  /* min-height: 100vh; */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17202a;
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

.centerBlock {
  border: 3px solid rgb(43, 18, 185); /* **************** */

  position: relative;
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
