<template>
    <div class="markup" >
        <div class="create_markup" v-if="isShowMarkupPanel">
            <label for="class">Class</label>
            <input type="radio" id="class" name="workSettings" value="class" @input="modeChange">
            <label for="markup">Label</label>
            <input type="radio" id="label" name="workSettings" value="label" @input="modeChange" checked>
            <div class="search_class">
                <label for="search_class">Class</label>
                <input type="text" id="search_class" v-model="searchClass" @input="filterGroups" class="search_input" placeholder="Search...">
                <ul v-if="showGroups" class="options_list">
                    <li v-for="option in filteredGroups" @click="selectGroup(option)" class="option_item" :key="option.id">{{ option.title }}</li>
                </ul>
            </div>
            <div class="search_page">
                <label for="search_page">Page</label>
                <input type="text" id="search_page" v-model="searchPage" @input="filterClasses" class="search_input" placeholder="Search...">
                <ul v-if="showClasses" class="options_list">
                    <li v-for="option in filteredClasses" @click="selectClass(option)" class="option_item" :key="option.id">{{ option.title }}</li>
                </ul>
            </div>
            <div class="search_label" v-if="this.selectedMode === 'label'">
                <label for="search_label">Label</label>
                <input type="text" id="search_label" v-model="searchLabel" @input="filterLables" class="search_input" placeholder="Search...">
                <ul v-if="showLables" class="options_list">
                    <li v-for="option in filteredLables" @click="selectLabel(option)" class="option_item" :key="option.id">{{ option.title }}</li>
                </ul>
            </div>
            <button>Save</button>
        </div>
        <div class="markup_tree" v-if="isShowMarkupTree">

        </div>
    </div>
</template>

<script>
import axios from "axios"
const path = "/try_classifier.json"

export default {
  data() {
    return {
        classifierData: {},
        groups: {},
        classes: {},
        lables: {},
        searchClass: '',
        searchPage: '',
        searchLabel: '',
        isShowMarkupTree : false,
        showGroups: false,
        showClasses: false,
        showLables: false,
        selectedMode: 'label',
        labelId : NaN,
    }
  },
  props: {
    isShowMarkupPanel: String,
  },
  computed: {
    filteredGroups() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.groups.filter(option => option.title.toLowerCase().includes(this.searchClass.toLowerCase()));
    },
    filteredClasses() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.classes.filter(option => option.title.toLowerCase().includes(this.searchPage.toLowerCase()) && option.lables && option.lables.includes(this.labelId));
    },
    filteredLables() {
      // Фильтрация вариантов на основе текущего ввода поиска
      return this.lables.filter(option => option.title.toLowerCase().includes(this.searchLabel.toLowerCase()));
    }
  },
  methods: {
    showMarkupTree() {
        this.isShowMarkupTree = !this.isShowMarkupTree
    },
    filterGroups() {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showGroups = this.filteredGroups.length > 0;
    },
    filterClasses() {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showClasses = this.filteredClasses.length > 0;
    },
    filterLables() {
      // Показать или скрыть выпадающий список на основе наличия вариантов после фильтрации
      this.showLables = this.filteredLables.length > 0;
    },
    selectGroup(option) {
      // Обработка выбора опции
      this.searchClass = option.title;
      this.showGroups = false; // Скрытие выпадающего списка
    },
    selectClass(option) {
      // Обработка выбора опции
      this.searchPage = option.title;
      this.showClasses = false; // Скрытие выпадающего списка
    },
    selectLabel(option) {
      // Обработка выбора опции
      this.searchLabel = option.title;
      this.labelId = option.id
      for (const page of this.classes) {
        if (page.lables && page.lables.includes(this.labelId)) {
            this.searchPage = page.title;
            for (const group of this.groups) {
                if(page.groups && page.groups.includes(group.id)) {
                    this.searchClass = group.title;
                    break
                }
            }
            break
        }
      }
      this.showLables = false; // Скрытие выпадающего списка
    },
    modeChange(event){
        this.selectedMode = event.target.value
        this.searchClass = ''
        this.searchPage = ''
        this.searchLabel = ''
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

<style>

.markup{
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
</style>