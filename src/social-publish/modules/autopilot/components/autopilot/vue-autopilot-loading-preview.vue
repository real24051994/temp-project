<template>
	<div>
		<div class="social-post-preview-header text-center">
			<div class="text-center p-t-16 ">
				<div class="d-inline-block">
					<a-skeleton active :avatar="{ size : 28 , shape : 'square'}"   :title="false" :paragraph="false" />
				</div>
			</div>
		</div>
		<div class="social-post-preview-body">
			<div class="tab-pane">
				<div>
					<div class="box-preview box-preview-facebook">
						<div class="box-preview-header">
							<div class="item-social-account m-t-16">
								<a-skeleton active :avatar="{ size : 38 , shape : 'circle'}"   :paragraph="false" />
							</div>
						</div>
						<div class="box-preview-body">
							<div class="box-preview-content m-t-16">
								<a-skeleton active :avatar="false"  :title="false" :paragraph="{ rows: 5 , width : '100%' }" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>