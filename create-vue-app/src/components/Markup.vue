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
      <div>
        <strong style="color: red" v-if="!formIsValid"
          >Please fill in all fields</strong
        >
      </div>
      <button @click="saveLabel()">Save</button>
    </div>
    <button @click="collectData()">Test Collection Annotation</button>
    <!-- ВРЕМЕННО!!! ПОТОМ УБРАТЬ!!!  -->
    <button @click="fetchAnnotation()">Test Download Annotation</button>
    <!-- ВРЕМЕННО!!! ПОТОМ УБРАТЬ!!!  -->
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
          <div
            class="label_tools"
            @dblclick="showGroupOnCanvas(group)"
            :style="{
              backgroundColor: group.isSelected
                ? 'rgba(255, 255, 255, 0.25)'
                : 'transparent',
            }"
          >
            <div @click="showClass(group)">
              {{
                `${group.groupName} ${
                  this.isShowClasses[labelGroups.indexOf(group)]
                    ? "\u{025B7}"
                    : "\u{025BD}"
                }`
              }}
            </div>
            <div
              style="font-size: 14px"
              class="label-editor"
              @click="plusNewLabelinGroup(group.groupName)"
            >
              <i class="bx bx-plus-circle bx-xs bx-tada-hover"></i>
              <p>Add</p>
            </div>
            <div
              v-if="group.key !== ''"
              @click="toShowLabel(group.key)"
              class="label-editor"
            >
              <i class="bx bx-low-vision bx-xs bx-flashing-hover"></i>
              <p>Vision</p>
            </div>
            <div
              v-if="group.key !== ''"
              @click="toColorClass(group.key)"
              class="label-editor"
            >
              <i
                class="bx bxs-droplet-half bx-xs bx-burst-hover"
                :style="{ color: group.color }"
              ></i>
              <p>Color</p>
            </div>
            <div
              v-if="group.key !== ''"
              @click="toDeleteLabel(group.key)"
              class="label-editor"
            >
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
                v-if="element.groups.includes(group.id)"
                class="label_tools"
                @dblclick="showClassOnCanvas(element)"
                :style="{
                  backgroundColor: element.isSelected
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'transparent',
                }"
              >
                <div @click="showLabel(element, group)">
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
                <div
                  style="font-size: 14px"
                  class="label-editor"
                  @click="
                    plusNewLabelinClass(group.groupName, element.className)
                  "
                >
                  <i class="bx bx-plus-circle bx-xs bx-tada-hover"></i>
                  <p>Add</p>
                </div>
                <div
                  v-if="element.key !== ''"
                  @click="toShowLabel(element.key)"
                  class="label-editor"
                >
                  <i class="bx bx-low-vision bx-xs bx-flashing-hover"></i>
                  <p>Vision</p>
                </div>
                <div
                  v-if="element.key !== ''"
                  @click="toColorPage(element.key)"
                  class="label-editor"
                >
                  <i
                    class="bx bxs-droplet-half bx-xs bx-burst-hover"
                    :style="{ color: element.color }"
                  ></i>
                  <p>Color</p>
                </div>
                <div
                  v-if="element.key !== ''"
                  @click="toDeleteLabel(element.key)"
                  class="label-editor"
                >
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
                      element.labels.includes(label.id)
                    "
                    class="label_tools"
                    @dblclick="showLabelOnCanvas(label)"
                    :style="{
                      backgroundColor: label.isSelected
                        ? 'rgba(255, 255, 255, 0.25)'
                        : 'transparent',
                    }"
                  >
                    <div>
                      {{ label.labelName }}
                    </div>
                    <div></div>
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
import { mapGetters } from "vuex"

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
      isShowGroups: false,
      formIsValid: true,
      isShowClasses: [],
      isShowLabels: [],

      annotationData: {},
      annotationGroups: {},
      annotationClasses: {},
      annotationLabels: {},

      allData: {
        groups: [],
        classes: [],
        labels: [],
      },
    }
  },
  props: {
    isShowMarkupPanel: String,
    isShowLabelEditor: String,
    labels: Array,
    color: String,
    labelOnWork: Boolean,
  },
  watch: {
    labels: {
      handler(newVal, oldVal) {
        // Обработка изменений в массиве
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
      this.isShowGroups = false
      this.isShowClasses = []
      this.isShowLabels = []
    },
    filterGroups(event) {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showGroups = this.filteredGroups.length > 0
      if (event.target.value === "") {
        this.showGroups = false
      }
    },
    filterClasses(event) {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showClasses = this.filteredClasses.length > 0
      if (event.target.value === "") {
        this.showClasses = false
      }
    },
    filterLabels(event) {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showLabels = this.filteredLabels.length > 0
      if (event.target.value === "") {
        this.showLabels = false
      }
    },
    clearIsSelected() {
      this.labelGroups.forEach((grp) => {
        grp.isSelected = false
      })
      this.labelClasses.forEach((cls) => {
        cls.isSelected = false
      })
      this.labelLabels.forEach((lbl) => {
        lbl.isSelected = false
      })
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
        if (this.selectedMarkupMode === "label") {
          if (
            this.searchLabel !== "" &&
            this.searchPage !== "" &&
            this.searchClass !== ""
          ) {
            this.formIsValid = true
            let newLabel = {
              LabelName: this.searchLabel,
              PageName: this.searchPage,
              ClassName: this.searchClass,
              labelId: this.labelId,
            }
            let thisGroupId = 1
            while (this.labelGroups.some((group) => group.id === thisGroupId)) {
              thisGroupId = thisGroupId + 1
            }
            if (
              !this.labelGroups.some(
                (group) => group.groupName === this.searchClass
              )
            ) {
              this.labelGroups.push({
                groupName: this.searchClass,
                id: thisGroupId,
                key: "",
                color: "",
                isSelected: false,
              })
            } else {
              thisGroupId = this.labelGroups.find(
                (group) => group.groupName === this.searchClass
              ).id
            }
            let thisLabelId = 1
            while (this.labelLabels.some((label) => label.id === thisLabelId)) {
              thisLabelId = thisLabelId + 1
            }
            if (
              !this.labelLabels.some(
                (label) => label.labelName === this.searchLabel
              )
            ) {
              this.labelLabels.push({
                labelName: this.searchLabel,
                id: thisLabelId,
                color: this.color,
                key: this.labelId,
                isSelected: false,
              })
            } else {
              if (
                this.labelClasses.find(
                  (cls) =>
                    cls.labels.includes(
                      this.labelLabels.find(
                        (lbl) => lbl.labelName === this.searchLabel
                      ).id
                    ) && cls.className === this.searchPage
                )
              ) {
                if (
                  this.labelClasses.find(
                    (cls) =>
                      cls.labels.includes(
                        this.labelLabels.find(
                          (lbl) => lbl.labelName === this.searchLabel
                        ).id
                      ) &&
                      cls.className === this.searchPage &&
                      !cls.groups.includes(
                        this.labelGroups.find(
                          (grp) => grp.groupName === this.searchClass
                        ).id
                      )
                  )
                ) {
                  this.labelLabels.push({
                    labelName: this.searchLabel,
                    id: thisLabelId,
                    color: this.color,
                    key: this.labelId,
                    isSelected: false,
                  })
                }
              } else {
                this.labelLabels.push({
                  labelName: this.searchLabel,
                  id: thisLabelId,
                  color: this.color,
                  key: this.labelId,
                  isSelected: false,
                })
              }
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
                key: "",
                groups: [thisGroupId],
                labels: [thisLabelId],
                isSelected: false,
              }
              this.labelClasses.push(newLabelClass)
            } else {
              if (
                this.labelClasses.find(
                  (cls) =>
                    cls.groups.includes(
                      this.labelGroups.find(
                        (grp) => grp.groupName === this.searchClass
                      ).id
                    ) && cls.className === this.searchPage
                )
              ) {
                if (!foundClass.groups.includes(thisGroupId)) {
                  foundClass.groups.push(thisGroupId)
                }
                if (
                  !foundClass.labels ||
                  !foundClass.labels.includes(thisLabelId)
                ) {
                  foundClass.labels.push(thisLabelId)
                }
              } else {
                let Id = 1
                while (this.labelClasses.some((cls) => cls.id === Id)) {
                  Id = Id + 1
                }
                let newLabelClass = {
                  className: this.searchPage,
                  id: Id,
                  key: "",
                  groups: [thisGroupId],
                  labels: [thisLabelId],
                  isSelected: false,
                }
                this.labelClasses.push(newLabelClass)
              }
            }
            this.labelNames.push(newLabel)
            this.$emit("update-labelOnWork", false)
          } else {
            this.formIsValid = false
          }
        } else {
          // Если выбран режим class
          if (this.searchClass !== "") {
            this.formIsValid = true
            let newLabel = {
              LabelName: "",
              PageName: "",
              ClassName: this.searchClass,
              labelId: this.labelId,
            }
            let thisGroupId = 1
            while (this.labelGroups.some((group) => group.id === thisGroupId)) {
              thisGroupId = thisGroupId + 1
            }
            if (
              !this.labelGroups.some(
                (group) => group.groupName === this.searchClass
              )
            ) {
              let newGroup = {
                groupName: this.searchClass,
                id: thisGroupId,
                key: "",
                color: this.color,
                isSelected: false,
              }
              this.labelGroups.push(newGroup)
            } else {
              thisGroupId = this.labelGroups.find(
                (group) => group.groupName === this.searchClass
              ).id
            }
            if (this.searchPage !== "") {
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
                  groups: [thisGroupId],
                  labels: [],
                  color: this.color,
                  isSelected: false,
                }
                this.labelClasses.push(newLabelClass)
              } else {
                if (
                  this.labelClasses.find(
                    (cls) =>
                      cls.groups.includes(
                        this.labelGroups.find(
                          (grp) => grp.groupName === this.searchClass
                        ).id
                      ) && cls.className === this.searchPage
                  )
                ) {
                  if (!foundClass.groups.includes(thisGroupId)) {
                    foundClass.groups.push(thisGroupId)
                  }
                  if (
                    this.labelClasses.find(
                      (cls) => cls.className === this.searchClass
                    ).key === ""
                  ) {
                    this.labelClasses.find(
                      (cls) => cls.className === this.searchPage
                    ).key = this.labelId
                  }
                } else {
                  let Id = 1
                  while (this.labelClasses.some((cls) => cls.id === Id)) {
                    Id = Id + 1
                  }
                  let newLabelClass = {
                    className: this.searchPage,
                    id: Id,
                    key: this.labelId,
                    groups: [thisGroupId],
                    labels: [],
                    color: this.color,
                    isSelected: false,
                  }
                  this.labelClasses.push(newLabelClass)
                }
              }
            } else {
              if (
                !this.labelGroups.some(
                  (group) => group.groupName === this.searchClass
                )
              ) {
                let newGroup = {
                  groupName: this.searchClass,
                  id: thisGroupId,
                  key: this.labelId,
                  color: this.color,
                  isSelected: false,
                }
                this.labelGroups.push(newGroup)
              } else {
                if (
                  this.labelGroups.find(
                    (group) => group.groupName === this.searchClass
                  ).key === ""
                ) {
                  this.labelGroups.find(
                    (group) => group.groupName === this.searchClass
                  ).key = this.labelId
                }
              }
            }
            this.labelNames.push(newLabel)
            this.$emit("update-labelOnWork", false)
          } else {
            this.formIsValid = false
          }
        }
      }
    },

    ...mapGetters(["getAnnotationPath"]),

    async fetchAnnotation() {
      const annotationPath = this.getAnnotationPath()
      try {
        this.$emit("fetch-annotation")
        const response = await axios.get(annotationPath)
        this.annotationData = response.data
        this.annotationGroups = this.annotationData.groups
        this.annotationClasses = this.annotationData.classes
        this.annotationLabels = this.annotationData.labels

        for (const annotationGroup of this.annotationGroups) {
          let Id = 1
          while (this.labelNames.some((name) => name.labelId === Id)) {
            Id = Id + 1
          }
          let thisGroupId = 1
          while (this.labelGroups.some((group) => group.id === thisGroupId)) {
            thisGroupId = thisGroupId + 1
          }
          let newGroup = {
            groupName: annotationGroup.title,
            id: thisGroupId,
            key: "",
            color: "",
            isSelected: false,
          }
          if ("coordinates" in annotationGroup) {
            newGroup.key = Id
          }

          if (annotationGroup.color) {
            newGroup.color = annotationGroup.color
          }
          this.labelGroups.push(newGroup)

          let newLabel = {
            LabelName: "",
            PageName: "",
            ClassName: annotationGroup.title,
            labelId: Id,
          }
          this.labelNames.push(newLabel)
        }
        for (const annotationLabel of this.annotationLabels) {
          let Id = 1
          while (this.labelNames.some((name) => name.labelId === Id)) {
            Id = Id + 1
          }
          let thisLabelId = 1
          while (this.labelLabels.some((label) => label.id === thisLabelId)) {
            thisLabelId = thisLabelId + 1
          }
          this.labelLabels.push({
            labelName: annotationLabel.title,
            id: thisLabelId,
            key: Id,
            color: annotationLabel.color,
            isSelected: false,
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
        for (const annotationClass of this.annotationClasses) {
          let Id = 1
          while (this.labelNames.some((name) => name.labelId === Id)) {
            Id = Id + 1
          }
          let thisClassId = 1
          while (this.labelClasses.some((cls) => cls.id === thisClassId)) {
            thisClassId = thisClassId + 1
          }
          let newLabelClass = {
            className: annotationClass.title,
            id: thisClassId,
            key: "",
            groups: [],
            labels: [],
            color: "",
            isSelected: false,
          }
          if ("coordinates" in annotationClass) {
            newLabelClass.key = Id
          }

          if (annotationClass.color) {
            newLabelClass.color = annotationClass.color
          }
          let newLabel = {
            LabelName: "",
            PageName: annotationClass.title,
            ClassName: "",
            labelId: Id,
          }
          for (const group of this.annotationGroups) {
            if (
              annotationClass.groups &&
              annotationClass.groups.includes(group.id)
            ) {
              let foundAnnGroup = this.labelGroups.find(
                (grp) => grp.groupName === group.title
              )
              newLabelClass.groups.push(foundAnnGroup.id)
              newLabel.ClassName = group.title
            }
          }
          for (const label of this.annotationLabels) {
            if (
              annotationClass.labels &&
              annotationClass.labels.includes(label.id)
            ) {
              let foundAnnLabel = this.labelLabels.find(
                (lbl) => lbl.labelName === label.title
              )
              newLabelClass.labels.push(foundAnnLabel.id)
            }
          }
          this.labelClasses.push(newLabelClass)
          this.labelNames.push(newLabel)
        }
      } catch (error) {
        alert(error.message)
      }
    },
    showGroup() {
      this.isShowGroups = !this.isShowGroups
    },
    showClass(group) {
      let groupIdx = this.labelGroups.indexOf(group)
      this.isShowClasses[groupIdx] = !this.isShowClasses[groupIdx]
    },
    showLabel(element, group) {
      let classId = this.labelClasses.indexOf(element)
      let groupId = this.labelGroups.indexOf(group)
      this.isShowLabels[groupId][classId] = !this.isShowLabels[groupId][classId]
    },
    showGroupOnCanvas(group) {
      this.clearIsSelected()
      group.isSelected = true
      let key = group.key
      if (key !== "") {
        this.$emit("selectLabelById", key)
      }
    },
    showClassOnCanvas(element) {
      this.clearIsSelected()
      element.isSelected = true
      let key = element.key
      if (key !== "") {
        this.$emit("selectLabelById", key)
      }
    },
    showLabelOnCanvas(label) {
      this.clearIsSelected()
      label.isSelected = true
      let key = label.key
      if (key !== "") {
        this.$emit("selectLabelById", key)
      }
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
      this.labelLabels = this.labelLabels.filter((label) => label.key !== id)
      this.labelNames = this.labelNames.filter((name) => name.labelId !== id)
      if (this.labelGroups.find((group) => group.key === id)) {
        this.labelGroups.find((group) => group.key === id).key = ""
      }
      if (this.labelClasses.find((cls) => cls.key === id)) {
        this.labelClasses.find((cls) => cls.key === id).key = ""
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
    plusNewLabelinGroup(groupName) {
      this.$emit("plusNewLabel")
      this.selectedMarkupMode = "label"
      document.getElementById("label").checked = true
      this.searchClass = groupName
      this.searchPage = ""
      this.searchLabel = ""
    },
    plusNewLabelinClass(groupName, className) {
      this.$emit("plusNewLabel")
      this.selectedMarkupMode = "label"
      document.getElementById("label").checked = true
      this.searchClass = groupName
      this.searchPage = className
      this.searchLabel = ""
    },
    findMarkupOverLabel(labelsOverLabel) {
      if (labelsOverLabel.length === 1) {
        let foundClassMarkup = this.labelGroups.find(
          (group) => group.key === labelsOverLabel[0].labelId
        )
        if (foundClassMarkup) {
          this.searchClass = foundClassMarkup.groupName
        } else {
          let foundPageMarkup = this.labelClasses.find(
            (cls) => cls.key === labelsOverLabel[0].labelId
          )
          if (foundPageMarkup) {
            this.searchPage = foundPageMarkup.className
          }
        }
      } else {
        if (labelsOverLabel.length >= 2) {
          let foundClassMarkup = this.labelGroups.find(
            (group) => group.key === labelsOverLabel[0].labelId
          )
          if (foundClassMarkup) {
            this.searchClass = foundClassMarkup.groupName
            let foundPageMarkup = this.labelClasses.find(
              (cls) => cls.key === labelsOverLabel[1].labelId
            )
            if (foundPageMarkup) {
              this.searchPage = foundPageMarkup.className
            }
          } else {
            let foundPageMarkup = this.labelClasses.find(
              (cls) => cls.key === labelsOverLabel[0].labelId
            )
            if (foundPageMarkup) {
              this.searchPage = foundPageMarkup.className
            }
          }
        }
      }
    },

    // Функция для подсветки выбранной метки в дереве
    selectedLabelInsideTree(id) {
      if (id) {
        this.isShowMarkupTree = true
        let foundName = this.labelNames.find((name) => name.labelId === id)
        if (foundName) {
          this.isShowGroups = true
          if (foundName.PageName) {
            let foundGroup = this.labelGroups.find(
              (group) => group.groupName === foundName.ClassName
            )
            this.isShowClasses[this.labelGroups.indexOf(foundGroup)] = true
            if (foundName.LabelName) {
              let foundClass = this.labelClasses.find(
                (cls) => cls.className === foundName.PageName
              )
              this.isShowLabels[this.labelGroups.indexOf(foundGroup)][
                this.labelClasses.indexOf(foundClass)
              ] = true
              let foundLabel = this.labelLabels.find(
                (label) => label.labelName === foundName.LabelName
              )
              this.clearIsSelected
              foundLabel.isSelected = true
            } else {
              if (foundName.PageName) {
                let foundClass = this.labelClasses.find(
                  (cls) => cls.className === foundName.PageName
                )
                this.clearIsSelected()
                foundClass.isSelected = true
              } else {
                let foundGroup = this.labelGroups.find(
                  (group) => group.groupName === foundName.ClassName
                )
                this.clearIsSelected()
                foundGroup.isSelected = true
              }
            }
          }
        }
      } else {
        this.clearIsSelected()
      }
    },

    //************************************************
    collectData() {
      this.allData.groups = this.labelGroups
      for (const group of this.allData.groups) {
        delete group.isSelected
        if (group.key !== "") {
          let thisLabel = this.labels.find(
            (label) => label.labelId === group.key
          )
          group.color = thisLabel.color
          group.coordinates = thisLabel.coordinates
        }
      }
      this.allData.classes = this.labelClasses
      for (const cls of this.allData.classes) {
        delete cls.isSelected
        if (cls.key !== "") {
          let thisLabel = this.labels.find((label) => label.labelId === cls.key)
          cls.color = thisLabel.color
          cls.coordinates = thisLabel.coordinates
        }
      }
      this.allData.labels = this.labelLabels
      for (const lbl of this.allData.labels) {
        delete lbl.isSelected
        if (lbl.key !== "") {
          let thisLabel = this.labels.find((label) => label.labelId === lbl.key)
          lbl.color = thisLabel.color
          lbl.coordinates = thisLabel.coordinates
        }
      }
      console.log(this.allData)
    },
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
