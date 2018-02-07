<template id="layout">
		<div class="kgl-content">
			<slot name="banner"></slot>
			<slot name="main"></slot>
		</div>
	</template>
<script>
export default {
  name: 'applayout'
};
</script>
<style>
.kgl-content{
	margin-top:20px;
}
</style>
