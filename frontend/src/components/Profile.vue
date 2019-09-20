<template>
    <el-container style="width: 100%">
        <el-col :span="24">
            <el-row class="content">
                <h1>Info</h1>
            </el-row>
            <el-row class="content">
                <h3>Name: </h3>
                <h4 style="color: green">{{ username }}</h4>
            </el-row>
            <el-row class="content">
                <h3>Skills: </h3>
                <el-tag v-for="skill in userskills" :key="skill.id" type="success" style="margin-right: 5px">{{ skill }}</el-tag>
            </el-row>
        </el-col>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'isLoggedIn',
            'username',
            'userskills',
        ]),
    },
};
</script>

<style scoped>
.content {
    width: 100%;
}
</style>