<template>
  <header>
    <div @click="$router.push('/main')" class="logo">Label Box</div>
    <nav>
      <ul class="list">
        <li><div @click="$router.push('/main')" class="item">Home</div></li>
        <li>
          <div class="item">Project &bigtriangledown;</div>
          <ul class="subList">
            <li><div class="item">Open project</div></li>
            <li><div class="item">Create project</div></li>
            <li><div class="item">Add images</div></li>
          </ul>
        </li>
        <li>
          <div class="item">Annotation &bigtriangledown;</div>
          <sub-list :scripts="scripts"></sub-list>
          <!-- <ul class="subList">
            <li><div class="item">Download annotation</div></li>
            <li><div class="item">Unload annotation</div></li>
            <li><div class="item">Save annotation</div></li>
          </ul> -->
        </li>
        <li><div @click="$router.push('/')" class="item">Account</div></li>
      </ul>
    </nav>
  </header>
</template>

<script>
import SubList from "@/SubList.vue"
export default {
  components: { SubList },
  data() {
    return {
      scripts: [
        {
          id: 1,
          block: <div class="item">Download annotation</div>,
        },
      ],
    }
  },
}
</script>

<style>
/*Drop down menu*/

header {
  position: fixed;
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

.subList {
  position: absolute;
  left: 0;
  width: 180px;
  background: rgba(255, 255, 255, 0.05);
  display: none;
  transition: 0.5s;
}

.subList li {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.list li:hover > .subList {
  display: initial;
}
</style>
