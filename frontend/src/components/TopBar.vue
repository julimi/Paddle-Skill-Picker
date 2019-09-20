<template>
    <el-row class="top-bar">
        <el-col :span="8">
            <div class="grid-content">
                <h1 v-if="isLoggedIn" style="margin-top: 30px">Hi, 
                  	<router-link :to="{ name: 'Profile' }">{{ username }}</router-link>
                </h1>
            </div>
        </el-col>
        <el-col :span="8">
            <router-link :to="{ name: 'SkillPicker' }">
              	<img style="width: 200px; height: 100px" :src="logo">
            </router-link>
        </el-col>
        <el-col :span="8">
            <div class="grid-content">
                <el-button 
					v-if="isLoggedIn" 
					@click="logout" 
					style="margin-top: 30px">
					Log Out
				</el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import logo from '@/assets/logo-blue.png';

export default {
	name: "TopBar",
	template: "#top-bar",
	data() {
		return {
			logo: logo,
		}
	},
	computed: {
		...mapGetters([
			'isLoggedIn',
			'username',
			'userid',
		]),
	},
  	methods: {
    	logout() {
      		this.$store.dispatch('logout');
    	}
  	},
}
</script>

<style>
.top-bar {
    width: 100%;
    height: 100px;
    border-bottom: 1px solid grey;
    text-align: center;
}
.grid-content {
    border-radius: 4px;
    min-height: 100px;
}
</style>
