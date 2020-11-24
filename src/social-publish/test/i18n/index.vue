<template>
	<div class="container">
		<div class="row">
			<div class="col col-12">
				<h1>Account</h1>
			</div>
			<div class="col col-12">
				{{$t('account.title.modal_create') }}
				{{$t('account.label.status') }}
				{{$t('account.social_types.facebook') }}
				{{$t('account.social_types.twitter') }}
				{{$t('account.btn.close_modal_create') }}
				{{$t('account.table.account_name') }}
				{{$t('account.table.account_type') }}
				{{$t('account.btn.reconnect') }}
				{{$t('account.state.empty.title') }}
				{{$t('account.state.empty.content') }}
				{{$t('account.dialog.delete_account.title')}}
				{{$t('account.dialog.delete_account.content')}}
				{{$t('account.dialog.delete_account.ok_text')}}
				{{$t('account.dialog.delete_account.cancel_text')}}
				{{$t('account.dialog.delete_account.checkbox_content')}}
				{{$t('account.toast.delete_account_success.title')}}
				{{$t('account.toast.delete_account_success.message')}}
				{{$t('account.toast.delete_account_error.title')}}
				{{$t('account.toast.delete_account_error.message')}}
				{{$t('account.toast.delete_account_error.title')}}
				{{$t('account.toast.delete_account_error.message')}}
				{{ $t('account.title.page_account') }}
				{{ $t('account.btn.show_modal_create_account') }}
			</div>
		</div>
		<div class="row">
			<div class="col col-12">
				<h1>Auth</h1>
			</div>
			<div class="col col-12">
				{{$t('auth.label.email')}}
				{{$t('auth.placeholder.email')}}
				{{$t('auth.form.email_require')}}
				{{$t('auth.form.email_invalid')}}
				{{$t('auth.form.email_not_found')}}
				{{$t('auth.btn.forget_password')}}
				{{$t('auth.label.password')}}
				{{$t('auth.placeholder.email')}}
				{{$t('auth.form.email_require')}}
				{{$t('auth.form.email_invalid')}}
				{{$t('auth.label.password')}}
				{{$t('auth.placeholder.password')}}
				{{$t('auth.form.password_require')}}
				{{$t('auth.link.forget_password')}}
				{{$t('auth.btn.login_with_account')}}
				{{$t('auth.heading.login_with')}}
				{{$t('auth.link.login_with_shopify')}}
				{{$t('auth.label.shop')}}
				{{$t('auth.form.shop_require')}}
				{{$t('auth.form.shop_invalid')}}
				{{$t('auth.btn.login_with_shopify')}}
				{{$t('auth.heading.merge_account')}}
			</div>
		</div>
		<div class="row">
			<div class="col col-12">
				<h1>Autopilot</h1>
			</div>
			<div class="col col-12">
				<span v-for="(item,index) in variants" :key="index">{{$t(`autopilot.form.popover.variants.${item}`)}}</span>
				{{$t('autopilot.form.label.template')}}
				{{$t('autopilot.form.content.template_content')}}
				{{$t('autopilot.form.state.empty_template')}}
				{{$t('autopilot.form.label.content')}}
				{{$t('autopilot.form.popover.content')}}
				{{$t('autopilot.form.placeholder.add_content')}}
				{{$t('autopilot.validate.require_template')}}
				{{$t('autopilot.form.label.discount')}}
				{{$t('autopilot.form.switch.enable_create_discount')}}
				{{$t('autopilot.form.popover.discount')}}
				{{$t('autopilot.form.content.discount_description')}}
				{{$t('autopilot.form.label.discount_percentage')}}
				{{$t('autopilot.form.label.valid_time')}}
				{{$t('autopilot.form.switch.enable_discount_tag')}}
				{{$t('autopilot.form.popover.discount_tag')}}
				{{$t('autopilot.form.switch.enable_discount_tag')}}
				{{$t('autopilot.form.btn.add_discount_template')}}
				{{$t('autopilot.form.btn.add_discount_template')}}
				{{$t('autopilot.validate.require_discount_template')}}
				{{$t('autopilot.form.label.discount_position')}}
				{{$t('autopilot.form.label.discount_size')}}
				{{$t('autopilot.form.label.discount_margin')}}
				{{$t('autopilot.form.label.discount_content')}}
				{{$t('autopilot.form.label.autopilot_name')}}
				{{$t('autopilot.validate.require_name')}}
				{{$t('autopilot.form.switch.enable_logo')}}
				{{$t('autopilot.form.btn.upload_file')}}
				{{$t('autopilot.validate.require_logo_image')}}
				{{$t('autopilot.form.label.logo_position')}}
				{{$t('autopilot.form.label.logo_size')}}
				{{$t('autopilot.form.label.logo_margin')}}
				{{$t('autopilot.form.label.logo_transparent')}}
				{{$t('error.file_extension.title')}}
				{{$t('error.file_extension.content' , { file_name : 'file name' })}}
				{{$t('error.file_size.title')}}
				{{$t('error.file_size.content' , { file_name : 'file name' , max_size : '3'  })}}
				{{$t('autopilot.form.label.product')}}
				{{$t('autopilot.form.content.latest_warning.title')}}
				{{$t('autopilot.form.content.latest_warning.description')}}
				{{$t('autopilot.form.option.all_product')}}
				{{$t('autopilot.form.option.collection')}}
				{{$t('autopilot.form.btn.select_collection')}}
				{{$t('autopilot.form.label.product_collection')}}
				{{$t('autopilot.form.btn.remove_collection')}}
				{{$t('autopilot.form.state.no_selected_collection')}}
				{{$t('autopilot.validate.require_collection')}}
				{{$t('autopilot.form.label.share_type')}}
				{{$t('autopilot.form.option.link')}}
				{{$t('autopilot.form.option.image')}}
				{{$t('autopilot.form.placeholder.search_collection')}}
				{{$t('autopilot.form.state.empty_collection')}}
				{{$t('autopilot.form.btn.cancel_modal_collection')}}
				{{$t('autopilot.form.btn.apply_modal_collection')}}
				{{$t('autopilot.form.label.review_setting')}}
				{{$t('autopilot.form.switch.share_edited_review.on')}}
				{{$t('autopilot.form.switch.share_edited_review.off')}}
				{{$t('autopilot.form.label.share_review_with_image')}}
				{{$t('autopilot.form.switch.share_review_with_image.on')}}
				{{$t('autopilot.form.switch.share_review_with_image.off')}}
				{{$t('autopilot.form.label.scheduled')}}
				{{$t('autopilot.form.label.schedule_time_interval')}}
				{{$t('autopilot.form.content.review_time_interval')}}
				{{$t('autopilot.form.label.scheduled')}}
				{{$t('autopilot.form.label.schedule_timezone')}}
				{{$t('autopilot.form.label.schedule_publish_time')}}
				{{$t('autopilot.form.btn.add_publish_time')}}
				{{$t('autopilot.validate.require_time')}}
				{{$t('autopilot.form.content.facebook_time_warning')}}
				{{$t('autopilot.validate.require_date')}}
				{{$t('autopilot.form.label.setting')}}
				{{$t('autopilot.form.switch.allow_repeat')}}
				{{$t('autopilot.form.switch.allow_rotate')}}
				{{$t('autopilot.btn.cancel_autopilot')}}
				{{$t('autopilot.btn.cancel_autopilot')}}
				{{$t('autopilot.btn.create_autopilot')}}
				{{$t('autopilot.btn.update_autopilot')}}
				{{$t('autopilot.title.random_autopilot')}}
				{{$t('autopilot.title.latest_autopilot')}}
				{{$t('autopilot.title.review_autopilot')}}
				{{$t('autopilot.title.update_autopilot')}}
				{{$t('autopilot.btn.cancel_autopilot')}}
				{{$t('autopilot.btn.cancel_autopilot')}}
				{{$t('autopilot.btn.create_autopilot')}}
				{{$t('autopilot.btn.update_autopilot')}}
				{{$t('autopilot.state.empty_preview.title')}}
				{{$t('autopilot.state.empty_preview.description')}}
				{{$t('autopilot.toast.require_social.title')}}
				{{$t('autopilot.toast.require_social.message')}}
				{{$t('autopilot.toast.create_autopilot_success.title')}}
				{{$t('autopilot.toast.create_autopilot_success.message')}}
				{{$t('autopilot.toast.create_autopilot_error.title')}}
				{{$t('autopilot.toast.create_autopilot_error.title')}}
				{{$t('autopilot.toast.create_autopilot_error.message')}}
				{{$t('autopilot.toast.update_autopilot_success.title')}}
				{{$t('autopilot.toast.update_autopilot_success.message')}}
				{{$t('autopilot.toast.update_autopilot_error.title')}}
				{{$t('autopilot.toast.update_autopilot_error.title')}}
				{{$t('autopilot.toast.update_autopilot_error.message')}}
				{{$t('autopilot.confirm.pause_autopilot.title')}}
				{{$t('autopilot.confirm.pause_autopilot.content')}}
				{{$t('autopilot.confirm.pause_autopilot.btn_ok')}}
				{{$t('autopilot.confirm.pause_autopilot.btn_cancel')}}
				{{$t('autopilot.toast.pause_autopilot_success.title')}}
				{{$t('autopilot.toast.pause_autopilot_success.message')}}
				{{$t('autopilot.toast.pause_autopilot_error.title')}}
				{{$t('autopilot.toast.pause_autopilot_error.message')}}
				{{$t('autopilot.toast.pause_autopilot_error.title')}}
				{{$t('autopilot.toast.pause_autopilot_error.message')}}
				{{$t('autopilot.toast.resume_autopilot_success.title')}}
				{{$t('autopilot.toast.resume_autopilot_success.message')}}
				{{$t('autopilot.toast.resume_autopilot_error.title')}}
				{{$t('autopilot.toast.resume_autopilot_error.message')}}
				{{$t('autopilot.toast.resume_autopilot_error.title')}}
				{{$t('autopilot.toast.resume_autopilot_error.message')}}
				{{$t('autopilot.confirm.delete_autopilot.title')}}
				{{$t('autopilot.confirm.delete_autopilot.content')}}
				{{$t('autopilot.confirm.delete_autopilot.btn_ok')}}
				{{$t('autopilot.confirm.delete_autopilot.btn_cancel')}}
				{{$t('autopilot.toast.delete_autopilot_success.title')}}
				{{$t('autopilot.toast.delete_autopilot_success.message')}}
				{{$t('autopilot.toast.delete_autopilot_error.title')}}
				{{$t('autopilot.toast.delete_autopilot_error.message')}}
				{{$t('autopilot.toast.delete_autopilot_error.title')}}
				{{$t('autopilot.toast.delete_autopilot_error.message')}}
				{{$t('post.title.social_accounts')}}
				{{$t('account.sidebar.view_more')}}
				{{$t('post.title.social_accounts')}}
				{{$t('post.modal.component.list_account.btn_manage_account')}}
				{{$t('setting.integration.install_app')}}
				{{$t('setting.toast.integrate_alireview_success.title')}}
				{{$t('setting.toast.integrate_alireview_success.message')}}
				{{$t('setting.toast.integrate_alireview_error.title')}}
				{{$t('setting.toast.integrate_alireview_error.message')}}
				{{$t('setting.toast.integrate_alireview_error.title')}}
				{{$t('setting.toast.integrate_alireview_error.message')}}
				{{$t('autopilot.form.label.preview_product')}}
				{{$t('autopilot.form.btn.view_other_product')}}
				{{$t('error.empty_preview.title')}}
				{{$t('error.empty_preview.content')}}
				{{$t('autopilot.form.state.empty_product_preview')}}
				{{$t('autopilot.form.label.time_picker')}}
				{{$t('autopilot.form.label.time_picker_label')}}
				{{$t('autopilot.form.btn.cancel_modal_pick_time')}}
				{{$t('autopilot.form.btn.apply_modal_pick_time')}}
				{{$t('post.title.social_accounts')}}
				{{$t('account.sidebar.all_account_collapse')}}
				{{$t('account.sidebar.all_account')}}
				{{$t('account.sidebar.view_more')}}
				{{$t('queue.table.queue_post')}}
				{{$t('queue.table.queue_published')}}
				{{$t('queue.table.queue_autopilot')}}
				{{$t('post.btn.delete')}}
				{{$t('queue.state.empty')}}
				{{$t('autopilot.table.autopilot_campaign')}}
				{{$t('autopilot.table.autopilot_status')}}
				{{$t('autopilot.table.autopilot_type')}}
				{{$t('autopilot.btn.pause_autopilot')}}
				{{$t('autopilot.btn.resume_autopilot')}}
				{{$t('autopilot.btn.delete_autopilot')}}
				{{$t('autopilot.state.not_found')}}
				{{$t('autopilot.state.empty')}}
				{{$t('autopilot.btn.create_autopilot')}}
				{{$t('autopilot.confirm.pause_autopilot.title')}}
				{{$t('autopilot.confirm.pause_autopilot.content')}}
				{{$t('autopilot.confirm.pause_autopilot.btn_ok')}}
				{{$t('autopilot.confirm.pause_autopilot.btn_cancel')}}
				{{$t('autopilot.toast.pause_autopilot_success.title')}}
				{{$t('autopilot.toast.pause_autopilot_success.message')}}
				{{$t('autopilot.toast.pause_autopilot_error.title')}}
				{{$t('autopilot.toast.pause_autopilot_error.message')}}
				{{$t('autopilot.toast.pause_autopilot_error.title')}}
				{{$t('autopilot.toast.pause_autopilot_error.message')}}
				{{$t('autopilot.confirm.resume_autopilot.title')}}
				{{$t('autopilot.confirm.resume_autopilot.content')}}
				{{$t('autopilot.confirm.resume_autopilot.btn_ok')}}
				{{$t('autopilot.confirm.resume_autopilot.btn_cancel')}}
				{{$t('autopilot.toast.resume_autopilot_success.title')}}
				{{$t('autopilot.toast.resume_autopilot_success.message')}}
				{{$t('autopilot.toast.resume_autopilot_error.title')}}
				{{$t('autopilot.toast.resume_autopilot_error.message')}}
				{{$t('autopilot.toast.resume_autopilot_error.title')}}
				{{$t('autopilot.toast.resume_autopilot_error.message')}}
				{{$t('autopilot.confirm.delete_autopilot.title')}}
				{{$t('autopilot.confirm.delete_autopilot.content')}}
				{{$t('autopilot.confirm.delete_autopilot.btn_ok')}}
				{{$t('autopilot.confirm.delete_autopilot.btn_cancel')}}
				{{$t('autopilot.toast.delete_autopilot_success.title')}}
				{{$t('autopilot.toast.delete_autopilot_success.message')}}
				{{$t('autopilot.toast.delete_autopilot_error.title')}}
				{{$t('autopilot.toast.delete_autopilot_error.message')}}
				{{$t('autopilot.toast.delete_autopilot_error.title')}}
				{{$t('autopilot.toast.delete_autopilot_error.message')}}
				{{$t('post.title.social_accounts')}}
				{{$t('post.modal.component.list_account.limit_twitter_account')}}
				{{$t('account.sidebar.view_more')}}
				{{$t('queue.placeholder.contenteditable')}}
				{{$t('queue.placeholder.timepicker')}}
				{{$t('queue.label.publish_time')}}
				{{$t('queue.label.time')}}
				{{$t('queue.btn.apply_timepicker')}}
				{{$t('error.image_or_video') }}
				{{$t('error.max_size' , { max_size : 'max size' , social_network : 'social type' }) }}
				{{$t('error.max_length' , { max_length : 'max character' , social_network : 'socialType' }) }}
				{{$t('error.min_width', { min_width : 'min_width' }) }}
				{{$t('error.max_width', { max_width : 'max_width' }) }}
				{{$t('error.min_height', { min_height : 'min_height' }) }}
				{{$t('error.max_height', { max_height : 'max_height' }) }}
				{{$t('queue.state.empty_preview.title')}}
				{{$t('queue.state.empty_preview.content')}}
				{{$t('post.modal.component.select_product.btn_delete')}}
				{{$t('post.modal.component.select_product.sub_title')}}
				{{$t('post.modal.component.select_product.btn_select')}}
				{{$t('queue.label.modal_title')}}
				<span v-for="tab in tabs" :key="tab.id">{{$t(`post.modal.tab.${tab.id}`)}}</span>
				{{$t('queue.btn.delete')}}
				{{$t('queue.btn.publish')}}
				{{$t('queue.btn.save')}}
				{{$t('queue.dialog.discard.title')}}
				{{$t('queue.dialog.discard.content')}}
				{{$t('queue.dialog.discard.ok_text')}}
				{{$t('queue.dialog.discard.cancel_text')}}
				{{$t('queue.toast.update_queue_success.title')}}
				{{$t('queue.toast.update_queue_success.message')}}
				{{$t('queue.toast.publish_queue_success.title')}}
				{{$t('queue.toast.publish_queue_success.message')}}
				{{$t('queue.toast.update_queue_success.title')}}
				{{$t('queue.toast.publish_queue_success.title')}}
				{{$t('queue.toast.update_queue_error.title')}}
				{{$t('queue.toast.update_queue_error.message')}}
				{{$t('queue.toast.publish_queue_error.title')}}
				{{$t('queue.toast.publish_queue_error.message')}}
				{{$t('queue.dialog.delete_queue.title')}}
				{{$t('queue.dialog.delete_queue.content')}}
				{{$t('queue.dialog.delete_queue.ok_text')}}
				{{$t('queue.dialog.delete_queue.cancel_text')}}
				{{$t('queue.toast.delete_queue_success.title')}}
				{{$t('queue.toast.delete_queue_success.message')}}
				{{$t('queue.toast.delete_queue_error.title')}}
				{{$t('queue.toast.delete_queue_error.message')}}
				{{$t('queue.toast.delete_queue_error.title')}}
				{{$t('queue.toast.delete_queue_error.message')}}
				{{$t('autopilot.confirm.discard.title')}}
				{{$t('autopilot.confirm.discard.content')}}
				{{$t('autopilot.confirm.discard.btn_ok')}}
				{{$t('autopilot.confirm.discard.btn_cancel')}}
				{{$t('autopilot.title.autopilot')}}
				{{$t('autopilot.btn.create_autopilot')}}
				{{$t('autopilot.tab.autopilot')}}
				{{$t('autopilot.tab.queue')}}
				{{$t('autopilot.btn.create_autopilot')}}
				{{$t('autopilot.modal.create_autopilot.title')}}
				{{$t('autopilot.modal.create_autopilot.lastest.title')}}
				{{$t('autopilot.modal.create_autopilot.lastest.description')}}
				{{$t('autopilot.modal.create_autopilot.random.title')}}
				{{$t('autopilot.modal.create_autopilot.random.description')}}
				{{$t('autopilot.modal.create_autopilot.review.title')}}
				{{$t('autopilot.modal.create_autopilot.review.description')}}
			</div>
		</div>
		<div class="row">
			<div class="col col-12">
				<h1>Dashboard</h1>
			</div>
			<div class="col col-12">
				{{$t('dashboard.title.overview')}}
				{{$t('dashboard.label.all_account_option')}}
				{{$t('dashboard.label.last_day' , { day : 14 })}}
				{{$t('dashboard.insight.scheduled_post')}}
				{{$t('dashboard.insight.draft_post')}}
				{{$t('dashboard.insight.running_autopilot')}}
				{{$t('dashboard.insight.error_post')}}
				{{$t('dashboard.insight.pause_autopilot')}}
				{{$t('dashboard.title.timeline')}}
			</div>
		</div>
		<div class="row">
			<div class="col col-12">
				<h1>Setting</h1>
			</div>
			<div class="col col-12">
				<div>{{ $t('setting.integration.ar_review.name') }}</div>
				<div>{{ $t('setting.integration.intergrated')}}</div>
				<div>{{ $t('setting.integration.unintergrate')}}</div>
				<div>{{ $t('setting.integration.integrate')}}</div>
				<div>{{ $t('setting.integration.install_app')}}</div>
				<div>{{ $t('setting.integration.ar_review.description') }}</div>
				<div>{{$t('setting.toast.integrate_alireview_success.title')}}</div>
				<div>{{$t('setting.toast.integrate_alireview_success.message')}}</div>
				<div>{{$t('setting.toast.unintegrate_alireview_success.title')}}</div>
				<div>{{$t('setting.toast.unintegrate_alireview_success.message')}}</div>
				<div>{{$t('setting.toast.integrate_alireview_error.title')}}</div>
				<div>{{$t('setting.toast.integrate_alireview_error.message')}}</div>
				<div>{{$t('setting.toast.unintegrate_alireview_error.title')}}</div>
				<div>{{$t('setting.toast.unintegrate_alireview_error.message')}}</div>
				<div>{{$t('setting.toast.integrate_alireview_error.title')}}</div>
				<div>{{$t('setting.toast.integrate_alireview_error.message')}}</div>
				<div>{{$t('setting.toast.unintegrate_alireview_error.title')}}</div>
				<div>{{$t('setting.toast.unintegrate_alireview_error.message')}}</div>
				<div>{{$t('setting.integration.bit_ly.name') }}</div>
				<div>{{$t('setting.integration.intergrated')}}</div>
				<div>{{$t('setting.integration.logout_bitly')}}</div>
				<div>{{$t('setting.integration.bit_ly.description') }}</div>
				<div>{{$t('setting.integration.login_bitly')}}</div>
				<div>{{$t('setting.toast.connect_bitly_success.title')}}</div>
				<div>{{$t('setting.toast.connect_bitly_success.message')}}</div>
				<div>{{$t('setting.toast.connect_bitly_error.title')}}</div>
				<div>{{$t('setting.toast.connect_bitly_error.message')}}</div>
				<div>{{$t('setting.toast.logout_bitly_success.title')}}</div>
				<div>{{$t('setting.toast.logout_bitly_success.message')}}</div>
				<div>{{$t('setting.toast.logout_bitly_error.title')}}</div>
				<div>{{$t('setting.toast.logout_bitly_error.message')}}</div>
				<div>{{ $t('setting.currency_setting.title') }}</div>
				<div>{{ $t('setting.currency_setting.currency_format') }}</div>
				<div v-for="item in setting_currency" :key="item.id">{{ $t(`setting.currency_setting.option.${item.text}`) }}</div>
				{{ $t('setting.shorten_link.title')}}
				{{ $t('setting.shorten_link.switch')}}
				{{ $t('setting.shorten_link.description')}}
				{{ $t('setting.shorten_link.option.social_head')}}
				{{ $t('setting.shorten_link.option.bit_ly')}}
				{{ $t('setting.shorten_link.btn_logout_biyly')}}
				{{ $t('setting.shorten_link.btn_login_bitly')}}
				{{ $t('setting.shorten_link.require_bitly')}}
				{{ $t('setting.time_setting.title') }}
				{{ $t('setting.time_setting.timezone') }}
				{{ $t('setting.time_setting.time_format') }}
				{{ $t('setting.time_setting.date_format') }}
				{{ $t('setting.utm.title') }}
				{{ $t('setting.utm.empty')}}
				{{ $t('setting.utm.modal.title')}}
				{{ $t('setting.utm.modal.btn_save')}}
				{{ $t('setting.utm.modal.utm_source.name')}}
				{{ $t('setting.utm.modal.utm_source.placeholder')}}
				{{ $t('setting.utm.modal.utm_medium.name')}}
				{{ $t('setting.utm.modal.utm_medium.placeholder')}}
				{{ $t('setting.utm.modal.utm_campaign.name')}}
				{{ $t('setting.utm.modal.utm_campaign.placeholder')}}
				{{ $t('setting.utm.modal.utm_term.name')}}
				{{ $t('setting.utm.modal.utm_term.placeholder')}}
				{{ $t('setting.utm.modal.utm_content.name')}}
				{{ $t('setting.utm.modal.utm_content.placeholder')}}
				{{ $t('setting.utm.modal.required')}}
				{{ $t('setting.btn.discard') }}
				{{ $t('setting.btn.save') }}
				{{ $t('setting.toast.require_bitly.title')}}
				{{ $t('setting.toast.require_bitly.message')}}
				{{ $t('setting.toast.update_success.title')}}
				{{ $t('setting.toast.update_success.message')}}
				{{ $t('setting.toast.update_error.title')}},
				{{ $t('setting.toast.update_error.message')}}
				{{ $t('setting.dialog.discard.title')}},
				{{ $t('setting.dialog.discard.content')}}
				{{ $t('setting.dialog.discard.ok_text')}}
				{{ $t('setting.dialog.discard.cancel_text')}}
				{{ $t('setting.dialog.discard.title')}}
				{{ $t('setting.dialog.discard.content')}}
				{{ $t('setting.dialog.discard.ok_text')}}
				{{ $t('setting.dialog.discard.cancel_text')}}
				{{ $t('setting.title.page') }}
				<div v-for="item in setting_tabs" :key="item.id">{{ $t(`setting.tab.${item.id}`) }}</div>
			</div>
		</div>
		<div class="row">
			<div class="col col-12">
				<h1>Utils</h1>
			</div>
			<div class="col col-12">
				{{ $t('account.toast.connect_twitter_success.title') }}
				{{ $t('account.toast.connect_twitter_success.message')  }}
				{{ $t('account.error.reconnect.title') }}
				{{ $t('account.error.reconnect.content') }}
				{{ $t('account.btn.close_modal_reconnect') }}
				{{ $t('account.connect_facebook.title') }}
				{{ $t('account.connect_facebook.description') }}
				{{ $t('account.label.status') }}
				{{ $t('account.error.connect_facebook') }}
				{{ $t('account.social_types.facebook') }}
				{{ $t('account.state.empty_connect_facebook') }}
				{{ $t('account.btn.connect_facebook_page') }}
			</div>
		</div>
		<div class="row">
			<div class="col col-12">
				<h1>Post</h1>
			</div>
			<div class="col col-12">
				{{ $t('post.title.social_accounts') }}
				{{ $t('account.sidebar.view_more') }}
				{{ $t('post.title.social_accounts') }}
				{{ $t('account.sidebar.all_account_collapse') }}
				{{ $t('account.sidebar.all_account') }}
				{{ $t('account.sidebar.view_more') }}
				{{ $t('post.title.post') }}
				{{ $t('post.title.day_published') }}
				{{ $t('post.title.published_by') }}
				{{ $t('post.title.post') }}
				{{ $t('post.title.day_scheduled') }}
				{{ $t('post.title.day_created') }}
				{{ $t('post.title.post') }}
				{{ $t('post.title.post') }}
				{{ $t('post.title.day_published') }}
				{{ $t('post.title.post_error') }}
				{{ $t('post.state.empty_published') }}
				{{ $t('post.btn.create_post') }}
				{{ $t('post.state.empty_scheduled') }}
				{{ $t('post.btn.create_post') }}
				{{ $t('post.state.empty_draft') }}
				{{ $t('post.btn.create_post') }}
				{{ $t('post.state.empty_error') }}
				{{ $t('post.btn.delete') }}
				{{ $t('post.btn.delete') }}
				{{ $t('post.btn.delete') }}
				{{ $t('post.btn.delete') }}
				{{ $t('post.state.notfound') }}
				{{ $t('post.dialog.delete_post.title') }}
				{{ $t('post.dialog.delete_post.content') }}
				{{ $t('post.dialog.delete_post.ok_text') }}
				{{ $t('post.dialog.delete_post.cancel_text') }}
				{{ $t('post.toast.delete_post_success.title') }}
				{{ $t('post.toast.delete_post_success.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.dialog.delete_post.title') }}
				{{ $t('post.dialog.delete_post.content') }}
				{{ $t('post.dialog.delete_post.ok_text') }}
				{{ $t('post.dialog.delete_post.cancel_text') }}
				{{ $t('post.toast.delete_post_success.title') }}
				{{ $t('post.toast.delete_post_success.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.toast.create_post_success.title') }}
				{{ $t('post.toast.create_post_success.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.toast.update_post_success.title') }}
				{{ $t('post.toast.update_post_success.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.toast.create_post_success.title') }}
				{{ $t('post.toast.create_post_success.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.toast.update_draft_post_success.title') }}
				{{ $t('post.toast.update_draft_post_success.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.dialog.delete_post.title') }}
				{{ $t('post.dialog.delete_post.content') }}
				{{ $t('post.dialog.delete_post.ok_text') }}
				{{ $t('post.dialog.delete_post.cancel_text') }}
				{{ $t('post.toast.delete_post_success.title') }}
				{{ $t('post.toast.delete_post_success.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.dialog.delete_post.title') }}
				{{ $t('post.dialog.delete_post.content') }}
				{{ $t('post.dialog.delete_post.ok_text') }}
				{{ $t('post.dialog.delete_post.cancel_text') }}
				{{ $t('post.toast.delete_post_success.title') }}
				{{ $t('post.toast.delete_post_success.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.toast.error.title') }}
				{{ $t('post.toast.error.content') }}
				{{ $t('post.dialog.duplicate.title') }}
				{{ $t('post.dialog.duplicate.content') }}
				{{ $t('post.dialog.duplicate.ok_text') }}
				{{ $t('post.dialog.duplicate.cancel_text') }}
				{{ $t('post.toast.require_social.title') }}
				{{ $t('post.toast.require_social.content') }}
				{{ $t('post.toast.require_message.title') }}
				{{ $t('post.toast.require_message.content') }}
				{{ $t('post.toast.message_invalid.title') }}
				{{ $t('post.toast.message_invalid.content') }}
				{{ $t('post.toast.date_invalid.title') }}
				{{ $t('post.toast.date_invalid.content') }}
				{{ $t('post.dialog.discard.title') }}
				{{ $t('post.dialog.discard.content') }}
				{{ $t('post.dialog.discard.ok_text') }}
				{{ $t('post.dialog.discard.cancel_text') }}
				{{ $t('post.calendar.label.today') }}
				{{ $t('post.calendar.option.month') }}
				{{ $t('post.calendar.option.week') }}
				{{ $t('post.calendar.option.all_post') }}
				{{ $t('post.calendar.option.published') }}
				{{ $t('post.calendar.option.scheduled') }}
				{{ $t('post.btn.create_post') }}
				{{ $t('post.calendar.content.link') }}
				{{ $t('post.title.post_center')}}
				{{ $t('post.btn.create_post') }}
				<span v-for="item in status" :key="item">{{ $t(`post.tab.${item}`) }}</span>
				{{ $t('post.btn.create_post') }}
			</div>
		</div>
	</div>
</template>
<script>
import config from '@publish/modules/autopilot/config'
var variants = [...config.product_variants ,...config.rate_tags ,...config.discount_tags]
export default {
	name : 'Test',
	data(){
		return {
			status: ['published', 'scheduled', 'draft' , 'error'],
			tabs : [
				{
					id : 'product',
					icon : 'tag'
				},
				{
					id : 'link',
					icon : 'link'
				},
				{
					id : 'image',
					icon : 'image'
				},
			],
			variants : variants,
			setting_tabs : [
					{
						id : 'setting',
						router : 'Setting'
					},
					{
						id : 'integrate',
						router : 'Integrate'
					}
			],
			setting_currency : [
				{
					id : 0,
					text : "default"
				},
				{
					id : 1,
					text : "symbol"
				},
				{
					id : 2,
					text : "code"
				},
				{
					id : 3,
					text : 'mix_1'
				},
				{
					id : 4,
					text : 'mix_2'
				}
			]
		}
	}
}
</script>