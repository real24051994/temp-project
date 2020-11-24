<template>
	<div>
		<h3>Default</h3>
		<div class="list-buttons">
			<a-button>
				Button Default
			</a-button>
			<a-button class="active">
				Button Default
			</a-button>
			<a-button :disabled="true">
				Button Default
			</a-button>
			<a-button :loading="true">
				Button Default
			</a-button>
		</div>
		<hr>
		<h3>Button Primary</h3>
		<div class="list-buttons">
			<a-button type="primary">
				Button Primary
			</a-button>
			<a-button type="primary" class="active">
				Button Primary
			</a-button>
			<a-button type="primary" :disabled="true">
				Button Primary
			</a-button>
			<a-button type="primary" :loading="true">
				Button Primary
			</a-button>
		</div>
		<hr>
		<h3>Button success</h3>
		<div class="list-buttons">
			<a-button type="success">
				Button success
			</a-button>
			<a-button type="success" class="active">
				Button success
			</a-button>
			<a-button type="success" :disabled="true">
				Button success
			</a-button>
			<a-button type="success" :loading="true">
				Button success
			</a-button>
		</div>
		<hr>
		<hr>
		<h3>Button Danger</h3>
		<div class="list-buttons">
			<a-button type="danger">
				Button danger
			</a-button>
			<a-button type="danger" class="active">
				Button danger
			</a-button>
			<a-button type="danger" :disabled="true">
				Button danger
			</a-button>
			<a-button type="danger" :loading="true">
				Button danger
			</a-button>
		</div>
		<hr>
		<h3>Button Warning</h3>
		<div class="list-buttons">
			<a-button type="warning">
				Button Warning
			</a-button>
			<a-button type="warning" class="active">
				Button Warning
			</a-button>
			<a-button type="warning" :disabled="true">
				Button Warning
			</a-button>
			<a-button type="warning" :loading="true">
				Button Warning
			</a-button>
		</div>
		<hr>
	</div>
</template>
<style lang="scss">
	.list-buttons{
		button ~ button{
			margin-left: 15px;
		}
	}
</style>