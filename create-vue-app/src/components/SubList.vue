<template>
  <ul class="subList" v-for="script in scripts" :key="script.id">
    <!-- <li><div class="item">Download annotation</div></li>
    <li><div class="item">Unload annotation</div></li>
    <li><div class="item">Save annotation</div></li> -->
    <li>{{ script.block }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    scripts: {
      type: any,
    },
  },
}
</script>

<style></style>
