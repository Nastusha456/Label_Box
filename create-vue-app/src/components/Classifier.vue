<template>
    <div class="classifier">
        <span @click="showGroup"><strong>Classifier</strong> &bigtriangledown;</span>
        <ul v-if="isShowGroups">
            <li v-for="group in groups" style="padding-left: 10px;" >
                <div @click="showClass(group.id)">{{group.title}} &bigtriangledown;</div>
                <ul v-if="isShowClasses[group.id-1]">
                    <li v-for="cls in classes" style="padding-left: 10px;" >
                        <div v-if="cls.groups.includes(group.id)" @click="showLabel(cls.id, group.id)">{{ cls.title }} &bigtriangledown;</div>
                        <ul v-if="isShowLables[group.id-1][cls.id-1]">
                            <li v-for="label in lables" style="padding-left: 10px;">
                                <div v-if="cls.lables != undefined && cls.lables.includes(label.id)">{{ label.title }}</div>
                            </li>
                        </ul>
                        
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            classifierData : {},
            groups : {},
            classes : {},
            lables : {},
            isShowGroups : false,
            isShowClasses : [],
            isShowLables: []
        }
    },
    methods: {
        showGroup() {
            this.isShowGroups = !this.isShowGroups
            this.groups = this.classifierData.groups
            this.isShowClasses = Array.from(Object.keys(this.classifierData.groups).length).fill(false)
        },
        showClass(groupId) {
            this.isShowClasses[groupId-1] = !this.isShowClasses[groupId-1]
            this.classes = this.classifierData.classes
            console.log(this.isShowLables.length)
            if (this.isShowLables.length === 0) {
                this.isShowLables = Array.from({ length: Object.keys(this.classifierData.groups).length }, () => []);
                for (let i = 0; i < this.isShowLables.length; i++) {
                    this.isShowLables[i] = Array.from(Object.keys(this.classifierData.classes).length).fill(false)
                }
            }
        },
        showLabel(classId, groupId) {
            this.isShowLables[groupId-1][classId-1] = !this.isShowLables[groupId-1][classId-1]
            this.lables = this.classifierData.lables
            console.log(this.isShowLables)
        }
    },
    mounted() {
        fetch('/try_classifier.json')
            .then(response => response.json())
            .then(data => {
                this.classifierData = data;
            })
            .catch(error => {
                console.log(error);
            });
    }
}
</script>

<style>
.classifier {
    display: block;
    width: 50%;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 10px;
}
li {
    margin-top: 10px;
}
</style>
