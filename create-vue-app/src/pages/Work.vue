<template>
  <div>
    <the-navigation-bar
      @addImages="addImages"
      @saveAnnotation="saveAnnotation"
      @downloadAnnotation="downloadAnnotation"
      @openProject="openProject"
    />

    <div class="main">
      <div class="container">
        <the-left-panel
          @download="download"
          @showClassifier="showClassifier"
          @showImagesPanel="showImagesPanel"
        />
        <div class="leftBlock">
          <the-images-panel
            ref="imagesPanel"
            v-show="isShowImagesPanel"
            @chooseThisImage="chooseThisImage"
          />
          <classifier-panel v-if="isShowClassifier" />
        </div>
        <div class="centerBlock">
          <the-annotation-panel
            ref="AnnotationPanel"
            @slider-change="sliderChange"
            @mode-change="modeChange"
            @connectInSeries="ConnectDots"
            @createPolygon="CreatePolygon"
            @changeColor="changeColor"
            @show-label-editor="ShowLabelEditor"
            @changeCursor="changeCursor"
          />
          <p id="projectName">*** {{ projectName }} ***</p>
          <center-panel
            @getImgData="getImgData"
            @update-labels="updateLabels"
            @update-labelOnWork="updateLabelOnWork"
            @find-markup-over-label="findMarkupOverLabel"
            @selectedLabelInsideTree="selectedLabel"
            @addNewImg="addNewImg"
            ref="CenterPanel"
            :scale="parseFloat(scale)"
            :selectedMode="selectedMode"
            :color="color"
            :selectedCursor="selectedCursor"
          />
          <image-data :imageData="imageData" />
        </div>
        <div class="rightBlock">
          <markup-panel
            ref="MarkupPanel"
            :isShowLabelEditor="isShowLabelEditor"
            :labels="labels"
            :color="color"
            :labelOnWork="labelOnWork"
            @visibleLabelBtn="visibleLabelBtn"
            @changeLabelColorBtn="changeLabelColorBtn"
            @deleteLabelBtn="deleteLabelBtn"
            @selectLabelById="selectLabelById"
            @plusNewLabel="plusNewLabel"
            @update-labelOnWork="updateLabelOnWork"
            @fetch-annotation="fetchAnnotation"
          />
        </div>
        <the-right-panel
          @delet="delet"
          @beginAnnotation="beginAnnotation"
          @showMarkupTree="showMarkupTree"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TheNavigationBar from "@/components/TheNavigationBar.vue"
import TheLeftPanel from "@/components/TheLeftPanel.vue"
import TheRightPanel from "@/components/TheRightPanel.vue"
import CenterPanel from "@/components/CenterPanel.vue"
import ClassifierPanel from "@/components/ClassifierPanel.vue"
import TheAnnotationPanel from "@/components/TheAnnotationPanel.vue"
import ImageData from "@/components/ImageData.vue"
import MarkupPanel from "@/components/MarkupPanel.vue"

import TheImagesPanel from "@/components/TheImagesPanel.vue"

export default {
  components: {
    TheNavigationBar,
    TheLeftPanel,
    TheRightPanel,
    CenterPanel,
    ClassifierPanel,
    TheAnnotationPanel,
    ImageData,
    MarkupPanel,
    TheImagesPanel,
  },
  data() {
    return {
      projectName: "Project name",
      isShowImagesPanel: false,
      isShowClassifier: false,
      isShowLabelEditor: false,
      labelOnWork: false,
      scale: 1,
      selectedMode: "moving",
      imageData: {},
      color: "#ff0000",
      selectedCursor: "move",
      labels: [],
    }
  },
  methods: {
    ConnectDots() {
      this.$refs.CenterPanel.ConnectInSeries()
    },
    CreatePolygon() {
      this.$refs.CenterPanel.CreatePolygon()
    },
    download() {
      this.$refs.CenterPanel.Download_btn()
    },
    addImages() {
      this.$refs.CenterPanel.SelectFile()
    },
    showImagesPanel() {
      this.isShowImagesPanel = !this.isShowImagesPanel
    },
    showClassifier() {
      this.isShowClassifier = !this.isShowClassifier
    },
    delet() {
      this.$refs.CenterPanel.remove_img_btn()
      this.$refs.MarkupPanel.remove_img_btn()
    },
    beginAnnotation() {
      this.$refs.AnnotationPanel.ShowLabelEditor()
    },
    showMarkupTree() {
      this.$refs.MarkupPanel.showMarkupTree()
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
    },
    changeCursor(cursor) {
      this.selectedCursor = cursor
    },
    visibleLabelBtn(id) {
      this.$refs.CenterPanel.visibleLabelBtn(id)
    },
    changeLabelColorBtn(id) {
      this.$refs.CenterPanel.changeLabelColorBtn(id)
    },
    deleteLabelBtn(id) {
      this.$refs.CenterPanel.deleteLabelBtn(id)
    },
    selectedLabel(id) {
      this.$refs.MarkupPanel.selectedLabelInsideTree(id)
    },
    selectLabelById(id) {
      this.$refs.CenterPanel.selectLabelById(id)
    },
    plusNewLabel() {
      this.$refs.AnnotationPanel.plusNewLabel()
      this.isShowLabelEditor = true
    },
    updateLabelOnWork(labelOnWork) {
      this.labelOnWork = labelOnWork
    },
    findMarkupOverLabel(labelsOverLabel) {
      this.$refs.MarkupPanel.findMarkupOverLabel(labelsOverLabel)
    },
    fetchAnnotation() {
      this.$refs.CenterPanel.fetchAnnotation()
    },
    chooseThisImage(image) {
      this.$refs.CenterPanel.chooseThisImage(image)
    },
    saveAnnotation() {
      this.$refs.MarkupPanel.saveAnnotation()
    },
    downloadAnnotation() {
      this.$refs.MarkupPanel.fetchAnnotation()
    },
    openProject() {
      // this.showImagesPanel()
      this.$refs.imagesPanel.openProject()
    },
    addNewImg(newImg) {
      this.$refs.imagesPanel.addImg(newImg)
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.main {
  height: 100%;
  margin-top: 145px;
  padding: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17202a;
}

.container {
  height: 100vh;
  width: 97%;
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

.leftBlock {
  display: block;
  max-height: 50vh;
  width: 15%;
  margin-top: 10px;
}

.rightBlock {
  display: flex;
  max-height: 50vh;
  width: 15%;
  margin-top: 10px;
  /* overflow-x: auto; */
}
</style>
