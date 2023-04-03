<template>
  <div class="Tools">
    <ul>
      <li @click="beginAnnotation">
        <i class="bx bx-search-alt"></i>
        <p>Creating markup</p>
      </li>
      <li>
        <i class="bx bxs-droplet-half"></i>
        <p>Colour</p>
      </li>
      <li @click="Delet_btn">
        <i class="bx bxs-trash"></i>
        <p>Trash</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    Delet_btn() {
      this.$emit("delet")
    },
    beginAnnotation() {
      this.$emit("beginAnnotation")
    },
  },
}
</script>

<style>
/*Tools part*/
.Tools {
  height: 100%;
  width: 5%;
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
