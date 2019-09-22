<template>
    <el-container style="width: 100%">
        <el-row style="width: 100%">
            <el-col :span="8">
                <div class="grid-content"></div>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <h1 style="text-align: center">Select Your Skills</h1>
                </el-row>
                <el-row>
                    <span>Add any skills you would like, and select all that apply</span>
                </el-row>
                <el-row class="after-description">
                    <el-input 
                        placeholder="Search for a skill..." 
                        v-model="query" 
                        class="input-with-select" 
                        clearable
                        @clear="clear">
                        <el-button 
                            slot="append" 
                            icon="el-icon-search" 
                            :loading="pending" 
                            @click="search">
                        </el-button>
                    </el-input>
                </el-row>
                <el-row class="after-description">
                    <el-scrollbar 
                        wrap-style="height: 300px; text-align: left;" 
                        view-class="view-box" 
                        :native="false">
                        <el-card v-if="skills && skills.length > 0">
                            <el-checkbox-group v-model="checkboxGroup">
                                <el-row 
                                    v-for="skill in skills" 
                                    :key="skill.id" 
                                    style="margin-top: 10px">
                                    <el-checkbox 
                                        v-if="userskills.includes(skill.title)" 
                                        :label="skill.title" 
                                        border 
                                        disabled>
                                    </el-checkbox>
                                    <el-checkbox v-else :label="skill.title" border></el-checkbox>
                                </el-row>
                            </el-checkbox-group>
                        </el-card>
                        <el-card v-else>
                            <el-row class="after-description">
                                <h2>Skills Not Found</h2>
                            </el-row>
                            <el-row>
                                <span>Add your custom skill here</span>
                            </el-row>
                            <el-row class="after-description">
                                <el-input 
                                    placeholder="Input the skill you want to add..." 
                                    v-model="beCreated" 
                                    class="input-with-add" 
                                    clearable>
                                    <el-button 
                                        slot="append" 
                                        icon="el-icon-plus" 
                                        :loading="pendingCreate" 
                                        @click="create">
                                    </el-button>
                                </el-input>
                            </el-row>
                        </el-card>
                    </el-scrollbar>
                </el-row>
                <el-row class="after-description" style="text-align: right">
                    <el-button 
                        type="primary" 
                        @click="submit(checkboxGroup)"
                        :loading="pendingAddSkill">
                        Submit
                    </el-button>
                </el-row>
            </el-col>
            <el-col :span="8"><div class="grid-content"></div></el-col>
        </el-row>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'SkillPicker',
    data() {
        return {
            checkboxGroup: [],
            query: '',
            beCreated: '',
        };
    },
    computed: {
        ...mapGetters([
            'isLoggedIn',
            'skills',
            'pending',
            'userid',
            'userskills',
            'pendingAddSkill',
            'pendingCreate',
        ])
    },
    methods: {
        search() {
            this.$store.dispatch('getSkillWithQuery', this.query);
            this.checkboxGroup = [];
            this.beCreated = this.query;
        },
        submit(checkboxGroup) {
            this.$store.dispatch('addSkill', { 
                skills: checkboxGroup,
                id: this.userid,
            });
            this.checkboxGroup = [];
        },
        clear() {
            this.$store.dispatch('getSkill');
        },
        create() {
            this.$store.dispatch('createSkill', this.beCreated);
            this.query = this.beCreated;
            this.search();
        }
    },
    mounted() {
        this.$store.dispatch('getSkill');
    },
};
</script>

<style scoped>
.after-description {
    margin-top: 10px;
}
.grid-content {
    border-radius: 4px;
    min-height: 500px;
}
.el-checkbox {
    width: 100%;
}
</style>