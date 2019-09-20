<template>
    <div id="app">
        <top-bar></top-bar>
        <router-view/>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar';

export default {
    name: 'App',
  	components: {
    	TopBar
  	}
};
</script>

<style>
#app {
  	font-family: 'Avenir', Helvetica, Arial, sans-serif;
  	color: #2c3e50;
  	position: relative;
  	width: 100%;
  	height: 100%;
}
</style>
