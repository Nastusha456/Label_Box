<template>
  <nav-bar></nav-bar>
  <div class="main">
    <div class="container">
      <div class="Tools">
        <ul>
          <li>
            <i class="bx bx-images"></i>
            <p>Images</p>
          </li>
          <li>
            <i class="bx bx-network-chart"></i>
            <p>Classifier</p>
          </li>
          <li onclick="Download_btn()">
            <i class="bx bx-export"></i>
            <p>Export</p>
          </li>
        </ul>
      </div>
      <div class="content">
        <p id="projectName">***Project name***</p>
        <div class="choose_image">
          <div v-if="!imageUrl" class="upload_img_box" @click="SelectFile">
            <i class="bx bxs-image-add"></i><br />
            <input
              ref="fileInput"
              type="file"
              @change="onFileSelected"
              id="selectedImage"
              accept="image/jpeg, image/png"
            />
            <p>choose Image from folder</p>
          </div>
        </div>
        <canvas id="image_canvas"></canvas>
        <div class="image_holder" v-if="imageUrl">
          <button id="remove_img_btn" @click="remove_img_btn">
            <i class="bx bxs-message-square-x"></i>
          </button>
          <img :src="imageUrl" alt="img" id="image" />
        </div>
        <button id="clearAll">
          <span>Reset</span><i class="bx bx-reset"></i>
        </button>
      </div>
      <div class="Tools">
        <ul>
          <li>
            <i class="bx bx-search-alt"></i>
            <p>Search</p>
          </li>
          <li>
            <i class="bx bxs-droplet-half"></i>
            <p>Colour</p>
          </li>
          <li>
            <i class="bx bxs-trash"></i>
            <p>Trash</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue"
export default {
  components: {
    NavBar,
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

/*Tools part*/
.Tools {
  height: 100%;
  width: 10%;
  box-shadow: 0.1px 4px 8px 5px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.Tools ul {
  list-style: none;
}

.Tools ul li {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  transition: 0.5s;
}

.Tools ul .active_option {
  background: rgba(255, 255, 255, 0.1);
}

.Tools ul .active_option p {
  opacity: 1;
  margin-top: 8px;
}

.Tools ul .active_option i {
  color: #ff7043;
}

.Tools ul li i {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
  font-size: 2em;
}

.Tools ul li:hover i {
  color: #ff7043;
}

.Tools ul li:hover {
  background: rgba(255, 255, 255, 0.1);
}

.Tools ul li:hover p {
  opacity: 1;
  margin-top: 8px;
  color: #ff7043;
}

.Tools ul li p {
  opacity: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

/*content part */
.content {
  position: relative;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.content #projectName {
  position: absolute;
  align-items: center;
  top: 10px;
  letter-spacing: 3px;
  font-family: "Staatliches", cursive;
  color: rgba(255, 255, 255, 0.5);
}

.choose_image {
  width: 70%;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.upload_img_box {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  cursor: pointer;
  border: 1px dashed rgba(255, 255, 255, 0.5);
}

.upload_img_box:hover {
  background: rgba(255, 255, 255, 0.1);
}

.upload_img_box:hover i {
  color: #ff7043;
}

.upload_img_box p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2em;
}

.upload_img_box:hover p {
  color: #ff7043;
}

.upload_img_box i {
  font-size: 2.2em;
  color: rgba(255, 255, 255, 0.5);
}

#selectedImage {
  display: none;
}

/*canvas */
#image_canvas {
  display: none;
}

/*image holder part*/
.image_holder {
  position: relative;
  display: block;
  width: 100%;
  height: 80%;
}

.image_holder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.image_holder button {
  position: absolute;
  display: block;
  top: -30px;
  left: 0px;
  outline: none;
  border: none;
  cursor: pointer;
  color: #ff7043;
  font-size: 1.8em;
  background: none;
  transform: rotate(270deg);
}

/*clear or reset btn */
#clearAll {
  position: absolute;
  bottom: 10px;
  right: 20px;
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  padding: 10px;
  color: #17202a;
  background: #ff7043;
  transform: translateX(150px);
  box-shadow: 0.1px 4px 8px 5px rgba(0, 0, 0, 0.1);
}

#clearAll span {
  margin-right: 10px;
}
</style>
