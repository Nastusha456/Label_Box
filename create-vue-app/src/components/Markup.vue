<template>
  <div class="markup">
    <div class="create_markup" v-if="isShowLabelEditor">
      <label for="class">Class</label>
      <input
        type="radio"
        id="class"
        name="markupSettings"
        value="class"
        @input="markupModeChange"
      />
      <label for="markup">Label</label>
      <input
        type="radio"
        id="label"
        name="markupSettings"
        value="label"
        @input="markupModeChange"
        checked
      />
      <div class="search_class">
        <label for="search_class">Class</label>
        <input
          type="text"
          id="search_class"
          v-model="searchClass"
          @input="filterGroups"
          class="search_input"
          placeholder="Search..."
        />
        <ul v-if="showGroups" class="options_list">
          <li
            v-for="option in filteredGroups"
            @click="selectGroup(option)"
            class="option_item"
            :key="option.id"
          >
            {{ option.title }}
          </li>
        </ul>
      </div>
      <div class="search_page">
        <label for="search_page">Page</label>
        <input
          type="text"
          id="search_page"
          v-model="searchPage"
          @input="filterClasses"
          class="search_input"
          placeholder="Search..."
        />
        <ul v-if="showClasses" class="options_list">
          <li
            v-for="option in filteredClasses"
            @click="selectClass(option)"
            class="option_item"
            :key="option.id"
          >
            {{ option.title }}
          </li>
        </ul>
      </div>
      <div class="search_label" v-if="this.selectedMarkupMode === 'label'">
        <label for="search_label">Label</label>
        <input
          type="text"
          id="search_label"
          v-model="searchLabel"
          @input="filterLables"
          class="search_input"
          placeholder="Search..."
        />
        <ul v-if="showLables" class="options_list">
          <li
            v-for="option in filteredLables"
            @click="selectLabel(option)"
            class="option_item"
            :key="option.id"
          >
            {{ option.title }}
          </li>
        </ul>
      </div>
      <button @click="saveLabel()">Save</button>
    </div>
    <div class="markup_tree" v-if="isShowMarkupTree">
      <ul>
        <li
          v-for="group in labelGroups"
          style="padding-left: 10px"
          :key="group.id"
        >
          <div>{{ group.groupName }}</div>
          <ul>
            <li
              v-for="label in labelNames"
              style="padding-left: 10px"
              :key="label.labelId"
            >
              <div v-if="label.ClassName === group.groupName">
                {{ label.PageName }}
              </div>
              <ul>
                <li
                  v-for="cls in labelClasses"
                  style="padding-left: 10px"
                  :key="cls.id"
                >
                  <div v-if="cls.className === label.PageName">
                    {{ label.LabelName }}
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Для аннотации ***************************************** -->
    <button @click="showAnnotation">Show Annotation</button>
    <div class="Annotation" v-if="isAnnotationShow">
      <span @click="showGroup"
        ><strong>Annotation</strong>
        {{ `${this.isShowGroups ? "\u{025B7}" : "\u{025BD}"}` }}</span
      >
      <ul v-if="isShowGroups">
        <li
          v-for="group in annotationGroups"
          style="padding-left: 30px"
          :key="group.id"
        >
          <div @click="showClass(group.id)">
            {{
              `${group.title} ${
                this.isShowClasses[group.id - 1] ? "\u{025B7}" : "\u{025BD}"
              }`
            }}
          </div>
          <ul v-if="isShowClasses[group.id - 1]">
            <li
              v-for="element in annotationClasses"
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
                  v-for="label in annotationLables"
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
  </div>
</template>

<script>
import axios from "axios"
const path = "/try_classifier.json"

// Для аннотации ************************************************
const annotationPath = "/try_annotation.json"

export default {
  data() {
    return {
      classifierData: {},
      groups: {},
      classes: {},
      labelNames: [],
      labelGroups: [],
      labelClasses: [],
      searchClass: "",
      searchPage: "",
      searchLabel: "",
      isShowMarkupTree: false,
      showGroups: false,
      showClasses: false,
      showLables: false,
      selectedMarkupMode: "label",
      labelId: NaN,
      labelOnWork: false,

      // Для аннотации ************************************************
      isAnnotationShow: false,
      annotationData: {},
      annotationGroups: {},
      annotationClasses: {},
      annotationLables: {},
      isShowGroups: false,
      isShowClasses: [],
      isShowLables: [],
    }
  },
  props: {
    isShowMarkupPanel: String,
    isShowLabelEditor: String,
    labels: Array,
  },
  watch: {
    labels: {
      handler(newVal, oldVal) {
        // Обработка изменений в массиве
        // oldLen = this.labels.length
        this.labelOnWork = true
        this.labelId = newVal[newVal.length - 1].labelId
      },
      deep: true,
    },
  },
  computed: {
    filteredGroups() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.groups.filter((option) =>
        option.title.toLowerCase().includes(this.searchClass.toLowerCase())
      )
    },
    filteredClasses() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.classes.filter(
        (option) =>
          option.title.toLowerCase().includes(this.searchPage.toLowerCase()) &&
          option.lables &&
          option.lables.includes(this.labelId)
      )
    },
    filteredLables() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.lables.filter((option) =>
        option.title.toLowerCase().includes(this.searchLabel.toLowerCase())
      )
    },
  },
  methods: {
    showMarkupTree() {
      this.isShowMarkupTree = !this.isShowMarkupTree
    },
    filterGroups() {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showGroups = this.filteredGroups.length > 0
    },
    filterClasses() {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showClasses = this.filteredClasses.length > 0
    },
    filterLables() {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showLables = this.filteredLables.length > 0
    },
    selectGroup(option) {
      // Обработка выбора опции
      this.searchClass = option.title
      this.showGroups = false // Скрытие выпадающего списка
    },
    selectClass(option) {
      // Обработка выбора опции
      this.searchPage = option.title
      this.showClasses = false // Скрытие выпадающего списка
    },
    selectLabel(option) {
      // Обработка выбора опции
      this.searchLabel = option.title
      this.labelId = option.id
      for (const page of this.classes) {
        if (page.lables && page.lables.includes(this.labelId)) {
          this.searchPage = page.title
          for (const group of this.groups) {
            if (page.groups && page.groups.includes(group.id)) {
              this.searchClass = group.title
              break
            }
          }
          break
        }
      }
      this.showLables = false // Скрытие выпадающего списка
    },
    markupModeChange(event) {
      this.selectedMarkupMode = event.target.value
      this.searchClass = ""
      this.searchPage = ""
      this.searchLabel = ""
    },
    saveLabel() {
      if (this.labelOnWork) {
        let newLabel = {
          LabelName: this.searchLabel,
          PageName: this.searchPage,
          ClassName: this.searchClass,
          labelId: this.labelId,
        }
        if (
          !this.labelGroups.some(
            (group) => group.groupName === this.searchClass
          )
        ) {
          this.labelGroups.push({
            groupName: this.searchClass,
            id: this.labelId,
          })
        }
        if (
          !this.labelClasses.some((cls) => cls.className === this.searchPage)
        ) {
          this.labelClasses.push({
            className: this.searchPage,
            id: this.labelId,
          })
        }
        this.labelNames.push(newLabel)
        this.labelOnWork = false
      }
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

    // Для аннотации ************************************************
    showAnnotation() {
      this.isAnnotationShow = !this.isAnnotationShow
    },
    async fetchAnnotation() {
      try {
        const response = await axios.get(annotationPath)
        this.annotationData = response.data
        this.annotationGroups = this.annotationData.groups
        this.annotationClasses = this.annotationData.classes
        this.annotationLables = this.annotationData.lables
      } catch (error) {
        alert(error.message)
      }
    },
    showGroup() {
      this.isShowGroups = !this.isShowGroups
      this.isShowClasses = Array.from(
        Object.keys(this.annotationData.groups).length
      ).fill(false)
    },
    showClass(groupId) {
      this.isShowClasses[groupId - 1] = !this.isShowClasses[groupId - 1]
      if (this.isShowLables.length === 0) {
        this.isShowLables = Array.from(
          { length: Object.keys(this.annotationData.groups).length },
          () => []
        )
        for (let i = 0; i < this.isShowLables.length; i++) {
          this.isShowLables[i] = Array.from(
            Object.keys(this.annotationData.classes).length
          ).fill(false)
        }
      }
    },
    showLabel(classId, groupId) {
      this.isShowLables[groupId - 1][classId - 1] =
        !this.isShowLables[groupId - 1][classId - 1]
    },
  },
  mounted() {
    this.fetchClassifier()

    // Для аннотации ************************************************
    this.fetchAnnotation()
  },
}
</script>

<style scoped>
* {
  margin-right: 3px;
  margin-bottom: 3px;
}
.markup {
  display: block;
  max-height: 50vh;
  width: 15%;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
}
.search_input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.options_list {
  position: absolute;
  color: rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style-type: none;
}

.option_item {
  padding: 8px;
  cursor: pointer;
}

.option_item:hover {
  background-color: #f0f0f0;
}

.markup_tree {
  margin-top: 30px;
  overflow-y: scroll;
}

button {
  font-weight: 700;
  background: none;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 3px 10px;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  transition: 0.25s;
  cursor: pointer;
}

button:hover {
  background: #2ecc71;
  border: 2px solid #17202a;
  color: #17202a;
}

/* Для аннотации ************************************************ */
.Annotation {
  display: block;
  max-height: 300px;
  width: 200px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
  overflow-y: scroll;
}

.Annotation li {
  margin-top: 10px;
}
</style>
