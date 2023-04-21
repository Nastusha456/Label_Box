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
          <div class="label_tools">
            <div @click="showClass(labelGroups.indexOf(group))">
                {{
                `${group.groupName} ${
                    this.isShowClasses[labelGroups.indexOf(group)]
                    ? "\u{025B7}"
                    : "\u{025BD}"
                }`
                }}
            </div>
            <div v-if="group.key !== ''" @click="toShowLabel(group.key)" class="label-editor">
                <i class="bx bx-low-vision bx-xs bx-flashing-hover"></i>
                <p>Vision</p>
            </div>
            <div v-if="group.key !== ''" @click="toColorClass(group.key)" class="label-editor">
                <i
                class="bx bxs-droplet-half bx-xs bx-burst-hover"
                :style="{ color: group.color }"
                ></i>
                <p>Color</p>
            </div>
            <div v-if="group.key !== ''" @click="toDeleteLabel(group.key)" class="label-editor">
                <i class="bx bxs-trash bx-xs bx-tada-hover"></i>
                <p>Trash</p>
            </div>
          </div>
          
          <ul v-if="isShowClasses[labelGroups.indexOf(group)]">
            <li
              v-for="element in labelClasses"
              style="padding-left: 30px"
              :key="element.id"
            >
              <div
                v-if="element.groups.includes(group.groupName)"
                class="label_tools"
              >
                <div
                  @click="
                    showLabel(
                      labelClasses.indexOf(element),
                      labelGroups.indexOf(group)
                    )
                  "
                >
                  {{
                    `${element.className} ${
                      element.labels
                        ? element.labels.length != 0
                          ? this.isShowLabels[labelGroups.indexOf(group)][
                              labelClasses.indexOf(element)
                            ]
                            ? "\u{025B7}"
                            : "\u{025BD}"
                          : ""
                        : ""
                    }`
                  }}
                </div>
                <div v-if="element.key !== ''" @click="toShowLabel(element.key)" class="label-editor">
                  <i class="bx bx-low-vision bx-xs bx-flashing-hover"></i>
                  <p>Vision</p>
                </div>
                <div v-if="element.key !== ''" @click="toColorPage(element.key)" class="label-editor">
                  <i
                    class="bx bxs-droplet-half bx-xs bx-burst-hover"
                    :style="{ color: element.color }"
                  ></i>
                  <p>Color</p>
                </div>
                <div v-if="element.key !== ''" @click="toDeleteLabel(element.key)" class="label-editor">
                  <i class="bx bxs-trash bx-xs bx-tada-hover"></i>
                  <p>Trash</p>
                </div>
              </div>
              <ul
                v-if="
                  isShowLabels[labelGroups.indexOf(group)][
                    labelClasses.indexOf(element)
                  ]
                "
              >
                <li
                  v-for="label in labelLabels"
                  style="padding-left: 30px"
                  :key="label.id"
                >
                  <div
                    v-if="
                      element.labels != undefined &&
                      element.labels.includes(label.labelName)
                    "
                    class="label_tools"
                  >
                    <div>
                      {{ label.labelName }}
                    </div>
                    <div>
                        
                    </div>
                    <div @click="toShowLabel(label.key)" class="label-editor">
                      <i class="bx bx-low-vision bx-xs bx-flashing-hover"></i>
                      <p>Vision</p>
                    </div>
                    <div @click="toColorLabel(label.key)" class="label-editor">
                      <i
                        class="bx bxs-droplet-half bx-xs bx-burst-hover"
                        :style="{ color: label.color }"
                      ></i>
                      <p>Color</p>
                    </div>
                    <div @click="toDeleteLabel(label.key)" class="label-editor">
                      <i class="bx bxs-trash bx-xs bx-tada-hover"></i>
                      <p>Trash</p>
                    </div>
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
    color: String,
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
          () => Array.from(Object.keys(this.labelClasses).length).fill(false)
        )
      },
      deep: true,
    },
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
    remove_img_btn() {
        this.labelNames = []
        this.labelGroups = []
        this.labelClasses = []
        this.labelLabels = []
        this.searchClass = ""
        this.searchPage = ""
        this.searchLabel = ""
        this.isShowMarkupTree = false
        this.showGroups = false
        this.showClasses = false
        this.showLabels = false
        this.selectedMarkupMode = "label"
        this.labelId = NaN
        this.labelOnWork = false
        this.isShowGroups = false
        this.isShowClasses = []
        this.isShowLabels = []
    },
    filterGroups(event) {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showGroups = this.filteredGroups.length > 0
      if (event.target.value === '') {
        this.showGroups = false
      }
    },
    filterClasses(event) {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showClasses = this.filteredClasses.length > 0
      if (event.target.value === '') {
        this.showClasses = false
      }
    },
    filterLabels(event) {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showLabels = this.filteredLabels.length > 0
      if (event.target.value === '') {
        this.showLabels = false
      }
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
    //   this.searchClass = ""
      this.searchPage = ""
      this.searchLabel = ""
    },
    saveLabel() {
      if (this.labelOnWork) {
        if (this.selectedMarkupMode === 'label') {
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
            let Id = 1
            while (this.labelGroups.some((group) => group.id === Id)) {
                Id = Id + 1
            }
            this.labelGroups.push({
                groupName: this.searchClass,
                id: Id,
                key: this.labelId
            })
            }
            let foundClass = this.labelClasses.find(
            (cls) => cls.className === this.searchPage
            )
            if (!foundClass) {
            let Id = 1
            while (this.labelClasses.some((cls) => cls.id === Id)) {
                Id = Id + 1
            }
            let newLabelClass = {
                className: this.searchPage,
                id: Id,
                key: this.labelId,
                groups: [this.searchClass],
                labels: [this.searchLabel],
            }
            this.labelClasses.push(newLabelClass)
            } else {
            if (!foundClass.groups.includes(this.searchClass)) {
                foundClass.groups.push(this.searchClass)
            }
            if (!foundClass.labels || !foundClass.labels.includes(this.searchLabel)) {
                foundClass.labels.push(this.searchLabel)
            }
            }
            if (
            !this.labelLabels.some(
                (label) => label.labelName === this.searchLabel
            )
            ) {
                let Id = 1
                while (this.labelLabels.some((label) => label.id === Id)) {
                    Id = Id + 1
                }
                this.labelLabels.push({
                    labelName: this.searchLabel,
                    id: Id,
                    color: this.color,
                    key: this.labelId
                })
            }
            this.labelNames.push(newLabel)
            this.labelOnWork = false
        }  else {      // Если выбран режим class
            let newLabel = {
                LabelName: '',
                PageName: '',
                ClassName: this.searchClass,
                labelId: this.labelId,
            }
            if (this.searchPage !== '') {
                newLabel.PageName = this.searchPage

                let foundClass = this.labelClasses.find(
                    (cls) => cls.className === this.searchPage
                )
                if (!foundClass) {
                    let Id = 1
                    while (this.labelClasses.some((cls) => cls.id === Id)) {
                        Id = Id + 1
                    }
                    let newLabelClass = {
                        className: this.searchPage,
                        id: Id,
                        key: this.labelId,
                        groups: [this.searchClass],
                        labels: [],
                        color: this.color,
                    }
                    this.labelClasses.push(newLabelClass)
                } else {
                    if (!foundClass.groups.includes(this.searchClass)) {
                        foundClass.groups.push(this.searchClass)
                    }
                }
                if (
                    !this.labelGroups.some(
                        (group) => group.groupName === this.searchClass
                    )
                    ) {
                        let Id = 1
                        while (this.labelGroups.some((group) => group.id === Id)) {
                            Id = Id + 1
                        }
                        let newGroup = {
                            groupName: this.searchClass,
                            id: Id,
                            key: '',
                            color: this.color,
                        }
                        this.labelGroups.push(newGroup)
                    } 
            } else {
                if (
                    !this.labelGroups.some(
                        (group) => group.groupName === this.searchClass
                    )
                    ){
                    let Id = 1
                    while (this.labelGroups.some((group) => group.id === Id)) {
                        Id = Id + 1
                    }
                    let newGroup = {
                        groupName: this.searchClass,
                        id: Id,
                        key: this.labelId,
                        color: this.color,
                    }
                    this.labelGroups.push(newGroup)
                } else {
                    if (this.labelGroups.find((group) => group.groupName === this.searchClass).key = '') {
                        this.labelGroups.find((group) => group.groupName === this.searchClass).key = this.labelId 
                    }
                    
                }
                
            }
            this.labelNames.push(newLabel)
            this.labelOnWork = false
        }
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
          let Id = 1
          while(this.labelNames.some((name) => name.labelId === Id)) {
            Id = Id + 1
          }  
          let newGroup = {
            groupName: annotationGroup.title,
            id: annotationGroup.id,
            key: '',
            color: ''
          }  
          if ('coordinates' in annotationGroup) {
            newGroup.key = Id  
          }
          
          if (annotationGroup.color) {
            newGroup.color = annotationGroup.color
          }
          this.labelGroups.push(newGroup)
          
          let newLabel = {
            LabelName: '',
            PageName: '',
            ClassName: annotationGroup.title,
            labelId: Id,
          }
          this.labelNames.push(newLabel)
        }
        for (const annotationClass of this.annotationClasses) {
          let Id = 1
          while(this.labelNames.some((name) => name.labelId === Id)) {
            Id = Id + 1
          }    
          let newLabelClass = {
            className: annotationClass.title,
            id: annotationClass.id,
            key: '',
            groups: [],
            labels: [],
            color: '', // *****************************************
          }
          if ('coordinates' in annotationClass) {  
            newLabelClass.key = Id
          }
          
          if (annotationClass.color) {
            newLabelClass.color = annotationClass.color
          }
          let newLabel = {
            LabelName: '',
            PageName: annotationClass.title,
            ClassName: '',
            labelId: Id,
          }
          for (const group of this.annotationGroups) {
            if (
              annotationClass.groups &&
              annotationClass.groups.includes(group.id)
            ) {
              newLabelClass.groups.push(group.title)
              newLabel.ClassName = group.title
            }
          }
          for (const label of this.annotationLabels) {
            if (
              annotationClass.labels &&
              annotationClass.labels.includes(label.id)
            ) {
              newLabelClass.labels.push(label.title)
            }
          }
          this.labelClasses.push(newLabelClass)
          this.labelNames.push(newLabel)
        }
        for (const annotationLabel of this.annotationLabels) {
          let Id = 1
          while(this.labelNames.some((name) => name.labelId === Id)) {
            Id = Id + 1
          }  
          this.labelLabels.push({
            labelName: annotationLabel.title,
            id: annotationLabel.id,
            key: Id,
            color: annotationLabel.color, // *****************************************
          })
          
          let newLabel = {
            LabelName: annotationLabel.title,
            PageName: "",
            ClassName: "",
            labelId: Id,
          }
          for (const annotationClass of this.annotationClasses) {
            if (
              annotationClass.labels &&
              annotationClass.labels.includes(annotationLabel.id) &&
              !this.labelNames.some((name) => name.labelId === Id)
            ) {
              newLabel.PageName = annotationClass.title
              for (const group of this.annotationGroups) {
                if (annotationClass.groups.includes(group.id)) {
                    newLabel.ClassName = group.title
                    this.labelNames.push(newLabel)
                }
                
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
      this.isShowLabels[groupId][classId] = !this.isShowLabels[groupId][classId]
    },
    toShowLabel(id) {
      this.$emit("visibleLabelBtn", id)
    },
    toColorLabel(id) {
      this.$emit("changeLabelColorBtn", id)
        const coloringLabel = this.findLabelById(id, this.labelLabels)
        if (coloringLabel) {
            const label_index = this.labelLabels.indexOf(coloringLabel)
            if (label_index !== -1) {
                this.labelLabels[label_index].color = this.color
            }
        }
    },
    toColorPage(id) {
      this.$emit("changeLabelColorBtn", id)
        const coloringPage = this.findLabelById(id, this.labelClasses)
        if (coloringPage) {
            const page_index = this.labelClasses.indexOf(coloringPage)
            if (page_index !== -1) {
                this.labelClasses[page_index].color = this.color
            }
        }
    },
    toColorClass(id) {
      this.$emit("changeLabelColorBtn", id)
        const coloringClass = this.findLabelById(id, this.labelGroups)
        if (coloringClass) {
            const class_index = this.labelGroups.indexOf(coloringClass)
            if (class_index !== -1) {
                this.labelGroups[class_index].color = this.color
            }
        }
    },
    toDeleteLabel(id) {
      this.$emit("deleteLabelBtn", id)
      this.labelLabels = this.labelLabels.filter(label => label.key !== id)
      this.labelNames = this.labelNames.filter(name => name.labelId !== id)
      if (this.labelGroups.find(group => group.key === id)) {
        this.labelGroups.find(group => group.key === id).key = ''
      }
      if (this.labelClasses.find(cls => cls.key === id)) {
        this.labelClasses.find(cls => cls.key === id).key = ''
      }
    },
    findLabelById(id, labels) {
      for (const label of labels) {
        if (label.key == id) {
          return label
        }
      }
      return null
    },
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
/* ********************************************************** */
.label-editor {
  width: 15px;
  height: 30px;
  margin-left: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: 0.5s;
}

.label-editor i {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 3px;
  font-size: 1.7em;
}

.label-editor:hover i {
  color: #ff7043;
}

.label-editor:hover p {
  opacity: 1;
  margin: 3px;
  color: #ff7043;
  font-size: 12px;
}

.label-editor p {
  opacity: 0;
}

input[type="color"] {
  width: 30px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 3px;
}
</style>
