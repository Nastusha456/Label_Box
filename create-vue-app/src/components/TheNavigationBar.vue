<template>
  <header class="header">
    <div @click="$router.push('/main')" class="logo">Label Box</div>
    <nav>
      <ul class="list">
        <li><div @click="$router.push('/main')" class="item">Home</div></li>
        <the-navigation-bar-project-list
          @addImages="Add_images"
          @openProject="openProject"
        />
        <the-navigation-bar-annotation-list
          @saveAnnotation="saveAnnotation"
          @downloadAnnotation="downloadAnnotation"
        />
        <li>
          <div @click="$router.push('/account')" class="item">Account</div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import TheNavigationBarProjectList from "@/components/TheNavigationBarProjectList.vue"
import TheNavigationBarAnnotationList from "@/components/TheNavigationBarAnnotationList.vue"

export default {
  components: {
    TheNavigationBarProjectList,
    TheNavigationBarAnnotationList,
  },
  methods: {
    Add_images() {
      this.$emit("addImages")
    },
    saveAnnotation() {
      this.$emit("saveAnnotation")
    },
    downloadAnnotation() {
      this.$emit("downloadAnnotation")
    },
    openProject() {
      this.$emit("openProject")
    },
  },
}
</script>

<style>
/*Drop down menu*/

.header {
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8%;
  box-shadow: 0 5px 10px #000;
}

.logo {
  font-size: 20px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.5);
  transition: 0.5s;
  cursor: pointer;
}

.logo:hover {
  transform: scale(1.2);
  color: #ff7043;
}

.list li {
  position: relative;
  float: left;
}

.item {
  padding: 15px;
  color: rgba(255, 255, 255, 0.5);
  display: block;
  cursor: pointer;
}

.item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ff7043;
}
</style>
