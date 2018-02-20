<template id='about'>
<div class='content'>
	<applayout :nothelper='false'>
		<div slot='banner'>
			<p></p>
		</div>
		</applayout>
</div>
</template>
<script>
import applayout from './applayout.vue';
export default {
  name: 'about',
	data : function() {
		return {
		}
	},
	components:{
		'applayout':applayout
		}
};
</script>
<style></style>
