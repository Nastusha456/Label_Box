<template>
  <div class="classifier">
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
</template>

<script>
import axios from "axios"

const path = "http://10.17.17.112:5000/api/v1/classificator?format=json"
// const path = "/try_classifier.json"

export default {
  data() {
    return {
      classifierData: {},
      groups: {},
      classes: {},
      lables: {},
      isShowGroups: false,
      isShowClasses: [],
      isShowLables: [],
    }
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
    async fetchClassifier() {
      try {
        const response = await axios.get(path)
        this.classifierData = response.data
        this.groups = this.classifierData.groups
        this.classes = this.classifierData.classes
        this.lables = this.classifierData.lables
      } catch (error) {
        alert(error.message)
      }
    },
  },
  mounted() {
    this.fetchClassifier()
  },
}
</script>

<style scoped>
.classifier {
  display: block;
  max-height: 50vh;
  width: 15%;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
  overflow-y: scroll;
}
li {
  margin-top: 10px;
}
</style>
