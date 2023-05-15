<template>
  <div class="classifier" v-if="classifier">
    <span @click="showGroup"
      ><strong>Classifier</strong>
      {{ `${this.isShowGroups ? "\u{025B7}" : "\u{025BD}"}` }}</span
    >
    <ul v-if="isShowGroups">
      <li v-for="group in groups" style="padding-left: 30px" :key="group.id">
        <div @click="showClass(group.id)">
          {{
            `${group.title} ${
              this.isShowClasses[group.id - 1] ? "\u{025B7}" : "\u{025BD}"
            }`
          }}
        </div>
        <ul v-if="isShowClasses[group.id - 1]">
          <li
            v-for="element in classes"
            style="padding-left: 30px"
            :key="element.id"
          >
            <div
              v-if="element.groups.includes(group.id)"
              @click="showLabel(element.id, group.id)"
            >
              {{
                `${element.title} ${
                  element.lables
                    ? element.lables.length != 0
                      ? this.isShowLables[group.id - 1][element.id - 1]
                        ? "\u{025B7}"
                        : "\u{025BD}"
                      : ""
                    : ""
                }`
              }}
            </div>
            <ul v-if="isShowLables[group.id - 1][element.id - 1]">
              <li
                v-for="label in lables"
                style="padding-left: 30px"
                :key="label.id"
              >
                <div
                  v-if="
                    element.lables != undefined &&
                    element.lables.includes(label.id)
                  "
                >
                  {{ label.title }}
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="classifier" style="overflow-y: auto" v-else>
    Classifier not found
  </div>
</template>

<script>
import axios from "axios"
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      classifier: null,
      classifierData: {},
      groups: {},
      classes: {},
      lables: {},
      isShowGroups: false,
      isShowClasses: [],
      isShowLables: [],
    }
  },
  mounted() {
    const classifierPath = this.getClassifierPath()
    this.fetchClassifier(classifierPath)
  },
  methods: {
    showGroup() {
      this.isShowGroups = !this.isShowGroups
      this.isShowClasses = Array.from(
        Object.keys(this.classifierData.groups).length
      ).fill(false)
    },
    showClass(groupId) {
      this.isShowClasses[groupId - 1] = !this.isShowClasses[groupId - 1]
      if (this.isShowLables.length === 0) {
        this.isShowLables = Array.from(
          { length: Object.keys(this.classifierData.groups).length },
          () => []
        )
        for (let i = 0; i < this.isShowLables.length; i++) {
          this.isShowLables[i] = Array.from(
            Object.keys(this.classifierData.classes).length
          ).fill(false)
        }
      }
    },
    showLabel(classId, groupId) {
      this.isShowLables[groupId - 1][classId - 1] =
        !this.isShowLables[groupId - 1][classId - 1]
    },

    ...mapGetters(["getClassifierPath"]),
    async fetchClassifier(path) {
      try {
        const response = await axios.get(path)
        this.classifierData = response.data
        this.groups = this.classifierData.groups
        this.classes = this.classifierData.classes
        this.lables = this.classifierData.lables
        this.classifier = true
      } catch (error) {
        alert(error.message)
      }
    },
  },
}
</script>

<style scoped>
.classifier {
  display: block;
  height: 300px;
  width: 100%;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
  overflow-y: scroll;
}
.classifier li {
  margin-top: 10px;
}
</style>
