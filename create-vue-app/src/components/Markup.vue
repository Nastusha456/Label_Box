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
            {{ option.groupName }}
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
            {{ option.className }}
          </li>
        </ul>
      </div>
      <div class="search_label" v-if="this.selectedMarkupMode === 'label'">
        <label for="search_label">Label</label>
        <input
          type="text"
          id="search_label"
          v-model="searchLabel"
          @input="filterLabels"
          class="search_input"
          placeholder="Search..."
        />
        <ul v-if="showLabels" class="options_list">
          <li
            v-for="option in filteredLabels"
            @click="selectLabel(option)"
            class="option_item"
            :key="option.id"
          >
            {{ option.labelName }}
          </li>
        </ul>
      </div>
      <button @click="saveLabel()">Save</button>
    </div>
    <div class="markup_tree" v-if="isShowMarkupTree">
      <span @click="showGroup"
        ><strong>Markup</strong>
        {{ `${this.isShowGroups ? "\u{025B7}" : "\u{025BD}"}` }}</span
      >
      <ul v-if="isShowGroups">
        <li
          v-for="group in labelGroups"
          style="padding-left: 30px"
          :key="group.id"
        >
          <div @click="showClass(labelGroups.indexOf(group))">
            {{
              `${group.groupName} ${
                this.isShowClasses[labelGroups.indexOf(group)] ? "\u{025B7}" : "\u{025BD}"
              }`
            }}
          </div>
          <ul v-if="isShowClasses[labelGroups.indexOf(group)]">
            <li
              v-for="element in labelClasses"
              style="padding-left: 30px"
              :key="element.id"
            >
              <div v-if="element.groups.includes(group.groupName)" class="label_tools">
                <div
                    @click="showLabel(labelClasses.indexOf(element), labelGroups.indexOf(group))"
                >
                    {{
                    `${element.className} ${
                        element.labels
                        ? element.labels.length != 0
                            ? this.isShowLabels[labelGroups.indexOf(group)][labelClasses.indexOf(element)]
                            ? "\u{025B7}"
                            : "\u{025BD}"
                            : ""
                        : ""
                    }`
                    }}
                </div>
              <div @click="toShowLabel()" class="label_tools"><i class='bx bx-show'></i></div>
              <div @click="toColorLabel()" class="label_tools"><i class="bx bxs-droplet-half"></i></div>
              <div @click="toDeleteLabel()" class="label_tools"><i class="bx bxs-trash"></i></div>
              </div>
              <ul v-if="isShowLabels[labelGroups.indexOf(group)][labelClasses.indexOf(element)]">
                <li
                  v-for="label in labelLabels"
                  style="padding-left: 30px"
                  :key="label.id"
                >  
                  <div v-if="
                        element.labels != undefined &&
                        element.labels.includes(label.labelName)
                        "
                        class="label_tools">
                    <div>
                        {{ label.labelName }}
                    </div>
                    <div @click="toShowLabel()"><i class='bx bx-show'></i></div>
                    <div @click="toColorLabel()"><i class="bx bxs-droplet-half"></i></div>
                    <div @click="toDeleteLabel()"><i class="bx bxs-trash"></i></div>
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
// const path = "/try_classifier.json"

const annotationPath = "/try_annotation.json"

export default {
  data() {
    return {
      classifierData: {},
      labelNames: [],
      labelGroups: [],
      labelClasses: [],
      labelLabels: [],
      searchClass: "",
      searchPage: "",
      searchLabel: "",
      isShowMarkupTree: false,
      showGroups: false,
      showClasses: false,
      showLabels: false,
      selectedMarkupMode: "label",
      labelId: NaN,
      labelOnWork: false,
      isShowGroups: false,
      isShowClasses: [],
      isShowLabels: [],

      annotationData: {},
      annotationGroups: {},
      annotationClasses: {},
      annotationLabels: {},
      
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
        this.labelOnWork = true
        if (newVal[newVal.length - 1]) {
            this.labelId = newVal[newVal.length - 1].labelId
        }
      },
      deep: true,
    },
    labelNames: {
        handler() {
            this.isShowClasses = Array.from(
                Object.keys(this.labelGroups).length
            ).fill(false)
            this.isShowLabels = Array.from(
                { length: Object.keys(this.labelGroups).length },
                () => Array.from(
                    Object.keys(this.labelClasses).length
                    ).fill(false)
            )
        },
        deep: true,
    }
  },
  computed: {
    filteredGroups() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.labelGroups.filter((option) =>
        option.groupName.toLowerCase().includes(this.searchClass.toLowerCase())
      )
    },
    filteredClasses() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.labelClasses.filter(
        (option) =>
          option.className.toLowerCase().includes(this.searchPage.toLowerCase()) //&&
        //   option.labels &&
        //   option.groups
        //   option.labels.includes(this.searchLabel)
      )
    },
    filteredLabels() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.labelLabels.filter((option) =>
        option.labelName.toLowerCase().includes(this.searchLabel.toLowerCase())
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
    filterLabels() {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showLabels = this.filteredLabels.length > 0
    },
    selectGroup(option) {
      // Обработка выбора опции
      this.searchClass = option.groupName
      this.showGroups = false // Скрытие выпадающего списка
    },
    selectClass(option) {
      // Обработка выбора опции
      this.searchPage = option.className
      this.showClasses = false // Скрытие выпадающего списка
    },
    selectLabel(option) {
      // Обработка выбора опции
      this.searchLabel = option.labelName
      this.labelId = option.id
      for (const page of this.labelClasses) {
        if (page.labels && page.labels.includes(option.labelName)) {
          this.searchPage = page.className
          for (const group of this.labelGroups) {
            if (page.groups && page.groups.includes(group.groupName)) {
              this.searchClass = group.groupName
              break
            }
          }
          break
        }
      }
      this.showLabels = false // Скрытие выпадающего списка
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
        let foundClass = this.labelClasses.find((cls) => cls.className === this.searchPage)
        if (
          !foundClass
        ) {
            let newLabelClass = {
                className: this.searchPage,
                id: this.labelId,
                groups: [this.searchClass],
                labels: [this.searchLabel],
            }
          this.labelClasses.push(newLabelClass)
        } else {
            if (!foundClass.groups.includes(this.searchClass)) {
                foundClass.groups.push(this.searchClass)
            }
            if (!foundClass.labels.includes(this.searchLabel)) {
                foundClass.labels.push(this.searchLabel)  
            } 
        }
        if (
          !this.labelLabels.some((label) => label.labelName === this.searchLabel)
        ) {
          this.labelLabels.push({
            labelName: this.searchLabel,
            id: this.labelId,
          })
        }
        this.labelNames.push(newLabel)
        this.labelOnWork = false
      }
    },
    // async fetchClassifier() {
    //   try {
    //     const response = await axios.get(path)
    //     this.classifierData = response.data
    //     this.groups = this.classifierData.groups
    //     this.classes = this.classifierData.classes
    //     this.lables = this.classifierData.lables
    //   } catch (error) {
    //     alert(error.message)
    //   }
    // },

    async fetchAnnotation() {
      try {
        const response = await axios.get(annotationPath)
        this.annotationData = response.data
        this.annotationGroups = this.annotationData.groups
        this.annotationClasses = this.annotationData.classes
        this.annotationLabels = this.annotationData.labels

        for (const annotationGroup of this.annotationGroups) {
            this.labelGroups.push({
            groupName: annotationGroup.title,
            id: annotationGroup.id,
          })
        }
        for (const annotationClass of this.annotationClasses) {
            let newLabelClass = {
                className: annotationClass.title,
                id: annotationClass.id,
                groups: [],
                labels: [],
            }
            for (const group of this.annotationGroups) { 
                if (annotationClass.groups && annotationClass.groups.includes(group.id)) {
                    newLabelClass.groups.push(group.title)
                }
            }
            for (const label of this.annotationLabels) { 
                if (annotationClass.labels && annotationClass.labels.includes(label.id)) {
                    newLabelClass.labels.push(label.title)
                }
            }
            this.labelClasses.push(newLabelClass)
        }
        for (const annotationLabel of this.annotationLabels) {
            this.labelLabels.push({
                labelName: annotationLabel.title,
                id: annotationLabel.id,
            })
            let newLabel = {
                LabelName: annotationLabel.title,
                PageName: '',
                ClassName: '',
                labelId: annotationLabel.id,
            }
            for (const annotationClass of this.annotationClasses) {
                if (annotationClass.labels && annotationClass.labels.includes(annotationLabel.id)) {
                    newLabel.PageName = annotationClass.title
                    for (const group of this.annotationGroups) {
                        newLabel.ClassName = group.title
                        this.labelNames.push(newLabel)
                    }
                }
            }

        }
      } catch (error) {
        alert(error.message)
      }
    },
    showGroup() {
      this.isShowGroups = !this.isShowGroups
    },
    showClass(groupId) {
      this.isShowClasses[groupId] = !this.isShowClasses[groupId]
    },
    showLabel(classId, groupId) {
      this.isShowLabels[groupId][classId] =
        !this.isShowLabels[groupId][classId]
    },
    toShowLabel() {

    },
    toColorLabel() {

    },
    toDeleteLabel() {
        
    }
  },
  mounted() {
    // this.fetchClassifier()

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
  display: block;
  max-height: 300px;
  width: 200px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
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

.label_tools {
  display: flex;
  flex-direction: row;
}


</style>
