<template>
  <nav-bar @addImages="addImages" />
  <div class="main">
    <div class="container">
      <left-panel @download="download" @showClassifier="showClassifier" />
      <classifier v-if="isShowClassifier" />
      <div class="centerBlock">
        <annotation-panel
          @slider-change="sliderChange"
          @mode-change="modeChange"
          @createPolygon="CreatePolygon"
          @changeColor="changeColor"
          @show-label-editor="ShowLabelEditor"
        />
        <p id="projectName">*** {{ projectName }} ***</p>
        <center-panel
          @getImgData="getImgData"
          @update-labels="updateLabels"
          ref="CenterPanel"
          :scale="parseFloat(scale)"
          :selectedMode="selectedMode"
          :color="color"
        />
        <image-data :imageData="imageData" />
      </div>
      <markup
        ref="Markup"
        :isShowMarkupPanel="isShowMarkupPanel" 
        :isShowLabelEditor="isShowLabelEditor"
        :labels="labels"
      />
      <right-panel @delet="delet" @beginAnnotation="beginAnnotation" @showMarkupTree="showMarkupTree" />
    </div>
  </div>
  <test-component />
</template>

<script>
import NavBar from "@/components/NavBar.vue"
import LeftPanel from "@/components/LeftPanel.vue"
import RightPanel from "@/components/RightPanel.vue"
import CenterPanel from "@/components/CenterPanel.vue"
import Classifier from "@/components/Classifier.vue"
import AnnotationPanel from "@/components/AnnotationPanel.vue"
import ImageData from "@/components/ImageData.vue"
import Markup from "@/components/Markup.vue"

export default {
  components: {
    NavBar,
    LeftPanel,
    RightPanel,
    CenterPanel,
    Classifier,
    AnnotationPanel,
    ImageData,
    Markup,
  },
  data() {
    return {
      projectName: "Project name",
      isShowClassifier: false,
      isShowMarkupPanel: false,
      isShowLabelEditor: false,
      scale: 1,
      selectedMode: "mooving",
      imageData: {},
      color: "red",
      labels : [],
    }
  },
  methods: {
    CreatePolygon() {
      this.$refs.CenterPanel.CreatePolygon()
    },
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
      this.isShowMarkupPanel = !this.isShowMarkupPanel
    },
    showMarkupTree() {
      this.$refs.Markup.showMarkupTree()
    },
    sliderChange(newScale) {
      this.scale = newScale
    },
    modeChange(newMode) {
      this.selectedMode = newMode
    },
    getImgData(value) {
      this.imageData = value
    },
    changeColor(color) {
      this.color = color
    },
    ShowLabelEditor() {
      this.isShowLabelEditor = !this.isShowLabelEditor
    },
    updateLabels(labels) {
      this.labels = labels
    }
  },
}
</script>

<style>
* {
  box-sizing: border-box;
}

.main {
  height: 100%;
  margin-top: 150px;
  padding: 10px;
  /* max-height: 100vh; */
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
  justify-content: center;
}

.centerBlock {
  position: relative;
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#projectName {
  position: relative;
  align-items: center;
  margin: 5px;
  letter-spacing: 3px;
  font-family: "Staatliches", cursive;
  color: rgba(255, 255, 255, 0.5);
}
</style>