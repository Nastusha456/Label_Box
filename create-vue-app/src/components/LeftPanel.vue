<template>
  <div class="Tools">
    <ul>
      <li>
        <i class="bx bx-images"></i>
        <p>Images</p>
      </li>
      <li @click="Show_classifier">
        <i class="bx bx-network-chart"></i>
        <p>Classifier</p>
      </li>
      <li @click="Download_btn">
        <i class="bx bx-export"></i>
        <p>Export</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    Download_btn() {
      this.$emit("download")
    },
    Show_classifier() {
      this.$emit("showClassifier")
    },
  },
}
</script>

<style scoped>
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
</style>
