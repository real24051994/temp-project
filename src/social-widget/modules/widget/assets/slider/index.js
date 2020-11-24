class SocialWidgetSlider {
	constructor(options) {
		this.config = Object.assign(
			{
				duration: 500,
				easing: "ease-out",
				perPage: 1,
				startIndex: 0,
				draggable: true,
				multipleDrag: true,
				threshold: 20,
				loop: true,
				rtl: false,
				auto_play_slider: false,
				auto_play_duration: 1000,
				onInit: () => { },
				onChange: () => { }
			},
			options
		);

		this.selector =
			typeof this.config.selector === "string"
				? document.querySelector(this.config.selector)
				: this.config.selector;

		if (this.selector === null) {
			throw new Error("Something wrong with your selector 😭");
		}
		this.timeout = null;

		this.resolveSlidesNumber();

		this.selectorWidth = this.selector.offsetWidth;
		this.innerElements = [].slice.call(this.selector.children);
		this.currentSlide = this.config.loop
			? this.config.startIndex % this.innerElements.length
			: Math.max(
				0,
				Math.min(
					this.config.startIndex,
					this.innerElements.length - this.perPage
				)
			);
		this.transformProperty = this.webkitOrNot();

		[
			"resizeHandler",
			"touchstartHandler",
			"touchendHandler",
			"touchmoveHandler",
			"mousedownHandler",
			"mouseupHandler",
			"mouseenterHandler",
			"mouseleaveHandler",
			"mousemoveHandler",
			"clickHandler"
		].forEach(method => {
			this[method] = this[method].bind(this);
		});

		this.init();
	}

	startAutoplay(e) {
		if (this.config.auto_play_slider) {
			this.pauseAutoplay();
			this.timeout = setInterval(() => {
				this.next();
			}, this.config.auto_play_duration);
		}
	}
	pauseAutoplay(e) {
		if (this.config.auto_play_slider) {
			clearInterval(this.timeout);
			this.timeout = null;
		}
	}

	restartAutoplay(e) {
		this.pauseAutoplay();
		this.startAutoplay();
	}

	webkitOrNot() {
		const style = document.documentElement.style;
		if (typeof style.transform === "string") {
			return "transform";
		}
		return "WebkitTransform";
	}

	attachEvents() {
		// Resize element on window resize
		window.addEventListener("resize", this.resizeHandler);
		this.selector.addEventListener("mouseenter", this.mouseenterHandler);
		this.selector.addEventListener("mouseleave", this.mouseleaveHandler);
		// If element is draggable / swipable, add event handlers
		if (this.config.draggable) {
			// Keep track pointer hold and dragging distance
			this.pointerDown = false;
			this.drag = {
				startX: 0,
				endX: 0,
				startY: 0,
				letItGo: null,
				preventClick: false
			};

			// Touch events
			this.selector.addEventListener("touchstart", this.touchstartHandler);
			this.selector.addEventListener("touchend", this.touchendHandler);
			this.selector.addEventListener("touchmove", this.touchmoveHandler);

			// Mouse events
			this.selector.addEventListener("mousedown", this.mousedownHandler);
			this.selector.addEventListener("mouseup", this.mouseupHandler);
			this.selector.addEventListener("mousemove", this.mousemoveHandler);

			// Click
			this.selector.addEventListener("click", this.clickHandler);
		}
	}

	detachEvents() {
		window.removeEventListener("resize", this.resizeHandler);
		this.selector.removeEventListener("touchstart", this.touchstartHandler);
		this.selector.removeEventListener("touchend", this.touchendHandler);
		this.selector.removeEventListener("touchmove", this.touchmoveHandler);
		this.selector.removeEventListener("mousedown", this.mousedownHandler);
		this.selector.removeEventListener("mouseup", this.mouseupHandler);
		this.selector.removeEventListener("mousemove", this.mousemoveHandler);
		this.selector.removeEventListener("mouseenter", this.mouseenterHandler);
		this.selector.removeEventListener("mouseleave", this.mouseleaveHandler);
		this.selector.removeEventListener("click", this.clickHandler);
	}

	init() {
		this.attachEvents();

		// hide everything out of selector's boundaries
		this.selector.style.overflow = "hidden";

		// rtl or ltr
		this.selector.style.direction = this.config.rtl ? "rtl" : "ltr";

		// build a frame and slide to a currentSlide
		this.buildSliderFrame();

		this.config.onInit.call(this);
		if (this.config.auto_play_slider) {
			this.restartAutoplay();
		}
	}

	buildSliderFrame() {
		const widthItem = this.selectorWidth / this.perPage;
		const itemsToBuild = this.config.loop
			? this.innerElements.length + 2 * this.perPage
			: this.innerElements.length;

		// Create frame and apply styling
		this.sliderFrame = document.createElement("div");
		this.sliderFrame.style.width = `${widthItem * itemsToBuild}px`;
		this.enableTransition();

		if (this.config.draggable) {
			this.selector.style.cursor = "-webkit-grab";
		}

		// Create a document fragment to put slides into it
		const docFragment = document.createDocumentFragment();

		// Loop through the slides, add styling and add them to document fragment
		if (this.config.loop) {
			for (
				let i = this.innerElements.length - this.perPage;
				i < this.innerElements.length;
				i++
			) {
				const element = this.buildSliderFrameItem(
					this.innerElements[i].cloneNode(true)
				);
				docFragment.appendChild(element);
			}
		}
		for (let i = 0; i < this.innerElements.length; i++) {
			const element = this.buildSliderFrameItem(this.innerElements[i]);
			docFragment.appendChild(element);
		}
		if (this.config.loop) {
			for (let i = 0; i < this.perPage; i++) {
				const element = this.buildSliderFrameItem(
					this.innerElements[i].cloneNode(true)
				);
				docFragment.appendChild(element);
			}
		}

		// Add fragment to the frame
		this.sliderFrame.appendChild(docFragment);

		// Clear selector (just in case something is there) and insert a frame
		this.selector.innerHTML = "";
		this.selector.appendChild(this.sliderFrame);

		// Go to currently active slide after initial build
		this.slideToCurrent();
	}

	buildSliderFrameItem(elm) {
		const elementContainer = document.createElement("div");
		elementContainer.style.cssFloat = this.config.rtl ? "right" : "left";
		elementContainer.style.float = this.config.rtl ? "right" : "left";
		elementContainer.style.width = `${
			this.config.loop
				? 100 / (this.innerElements.length + this.perPage * 2)
				: 100 / this.innerElements.length
			}%`;
		elementContainer.appendChild(elm);
		return elementContainer;
	}

	resolveSlidesNumber() {
		if (typeof this.config.perPage === "number") {
			this.perPage = this.config.perPage;
		} else if (typeof this.config.perPage === "object") {
			this.perPage = 1;
			for (const viewport in this.config.perPage) {
				if (window.innerWidth >= viewport) {
					this.perPage = this.config.perPage[viewport];
				}
			}
		}
	}

	prev(howManySlides = 1, callback) {
		// early return when there is nothing to slide
		if (this.innerElements.length <= this.perPage) {
			return;
		}

		const beforeChange = this.currentSlide;

		if (this.config.loop) {
			const isNewIndexClone = this.currentSlide - howManySlides < 0;
			if (isNewIndexClone) {
				this.disableTransition();

				const mirrorSlideIndex = this.currentSlide + this.innerElements.length;
				const mirrorSlideIndexOffset = this.perPage;
				const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
				const offset =
					(this.config.rtl ? 1 : -1) *
					moveTo *
					(this.selectorWidth / this.perPage);
				const dragDistance = this.config.draggable
					? this.drag.endX - this.drag.startX
					: 0;

				this.sliderFrame.style[this.transformProperty] = `translate3d(${offset +
					dragDistance}px, 0, 0)`;
				this.currentSlide = mirrorSlideIndex - howManySlides;
			} else {
				this.currentSlide = this.currentSlide - howManySlides;
			}
		} else {
			this.currentSlide = Math.max(this.currentSlide - howManySlides, 0);
		}

		if (beforeChange !== this.currentSlide) {
			this.slideToCurrent(this.config.loop);
			this.config.onChange.call(this);
			if (this.config.auto_play_slider) {
				this.restartAutoplay();
			}
			if (callback) {
				callback.call(this);
			}
		}
	}

	next(howManySlides = 1, callback) {
		// early return when there is nothing to slide
		if (this.innerElements.length <= this.perPage) {
			return;
		}

		const beforeChange = this.currentSlide;

		if (this.config.loop) {
			const isNewIndexClone =
				this.currentSlide + howManySlides >
				this.innerElements.length - this.perPage;
			if (isNewIndexClone) {
				this.disableTransition();

				const mirrorSlideIndex = this.currentSlide - this.innerElements.length;
				const mirrorSlideIndexOffset = this.perPage;
				const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
				const offset =
					(this.config.rtl ? 1 : -1) *
					moveTo *
					(this.selectorWidth / this.perPage);
				const dragDistance = this.config.draggable
					? this.drag.endX - this.drag.startX
					: 0;

				this.sliderFrame.style[this.transformProperty] = `translate3d(${offset +
					dragDistance}px, 0, 0)`;
				this.currentSlide = mirrorSlideIndex + howManySlides;
			} else {
				this.currentSlide = this.currentSlide + howManySlides;
			}
		} else {
			this.currentSlide = Math.min(
				this.currentSlide + howManySlides,
				this.innerElements.length - this.perPage
			);
		}
		if (beforeChange !== this.currentSlide) {
			this.slideToCurrent(this.config.loop);
			this.config.onChange.call(this);
			if (this.config.auto_play_slider) {
				this.restartAutoplay();
			}
			if (callback) {
				callback.call(this);
			}
		}
	}

	disableTransition() {
		this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
		this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
	}

	enableTransition() {
		this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
		this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
	}

	goTo(index, callback) {
		if (this.innerElements.length <= this.perPage) {
			return;
		}
		const beforeChange = this.currentSlide;
		this.currentSlide = this.config.loop
			? index % this.innerElements.length
			: Math.min(Math.max(index, 0), this.innerElements.length - this.perPage);
		if (beforeChange !== this.currentSlide) {
			this.slideToCurrent();
			this.config.onChange.call(this);
			if (this.config.auto_play_slider) {
				this.restartAutoplay();
			}
			if (callback) {
				callback.call(this);
			}
		}
	}

	slideToCurrent(enableTransition) {
		const currentSlide = this.config.loop
			? this.currentSlide + this.perPage
			: this.currentSlide;
		const offset =
			(this.config.rtl ? 1 : -1) *
			currentSlide *
			(this.selectorWidth / this.perPage);

		if (enableTransition) {
			// This one is tricky, I know but this is a perfect explanation:
			// https://youtu.be/cCOL7MC4Pl0
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					this.enableTransition();
					this.sliderFrame.style[
						this.transformProperty
					] = `translate3d(${offset}px, 0, 0)`;
				});
			});
		} else {
			this.sliderFrame.style[
				this.transformProperty
			] = `translate3d(${offset}px, 0, 0)`;
		}
	}

	updateAfterDrag() {
		const movement =
			(this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX);
		const movementDistance = Math.abs(movement);
		const howManySliderToSlide = this.config.multipleDrag
			? Math.ceil(movementDistance / (this.selectorWidth / this.perPage))
			: 1;

		const slideToNegativeClone =
			movement > 0 && this.currentSlide - howManySliderToSlide < 0;
		const slideToPositiveClone =
			movement < 0 &&
			this.currentSlide + howManySliderToSlide >
			this.innerElements.length - this.perPage;

		if (
			movement > 0 &&
			movementDistance > this.config.threshold &&
			this.innerElements.length > this.perPage
		) {
			this.prev(howManySliderToSlide);
		} else if (
			movement < 0 &&
			movementDistance > this.config.threshold &&
			this.innerElements.length > this.perPage
		) {
			this.next(howManySliderToSlide);
		}
		this.slideToCurrent(slideToNegativeClone || slideToPositiveClone);
	}

	resizeHandler() {
		// update perPage number dependable of user value
		this.resolveSlidesNumber();

		// relcalculate currentSlide
		// prevent hiding items when browser width increases
		if (this.currentSlide + this.perPage > this.innerElements.length) {
			this.currentSlide =
				this.innerElements.length <= this.perPage
					? 0
					: this.innerElements.length - this.perPage;
		}

		this.selectorWidth = this.selector.offsetWidth;

		this.buildSliderFrame();
	}

	clearDrag() {
		this.drag = {
			startX: 0,
			endX: 0,
			startY: 0,
			letItGo: null,
			preventClick: this.drag.preventClick
		};
	}

	touchstartHandler(e) {
		// Prevent dragging / swiping on inputs, selects and textareas
		const ignoreSiema =
			["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(e.target.nodeName) !==
			-1;
		if (ignoreSiema) {
			return;
		}

		e.stopPropagation();
		this.pointerDown = true;
		this.drag.startX = e.touches[0].pageX;
		this.drag.startY = e.touches[0].pageY;
		this.pauseAutoplay();
	}

	touchendHandler(e) {
		e.stopPropagation();
		this.pointerDown = false;
		this.enableTransition();
		if (this.drag.endX) {
			this.updateAfterDrag();
		}
		this.clearDrag();
		this.startAutoplay();
	}

	touchmoveHandler(e) {
		e.stopPropagation();

		if (this.drag.letItGo === null) {
			this.drag.letItGo =
				Math.abs(this.drag.startY - e.touches[0].pageY) <
				Math.abs(this.drag.startX - e.touches[0].pageX);
		}

		if (this.pointerDown && this.drag.letItGo) {
			e.preventDefault();
			this.drag.endX = e.touches[0].pageX;
			this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
			this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

			const currentSlide = this.config.loop
				? this.currentSlide + this.perPage
				: this.currentSlide;
			const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
			const dragOffset = this.drag.endX - this.drag.startX;
			const offset = this.config.rtl
				? currentOffset + dragOffset
				: currentOffset - dragOffset;
			this.sliderFrame.style[this.transformProperty] = `translate3d(${(this
				.config.rtl
				? 1
				: -1) * offset}px, 0, 0)`;
		}
	}

	mousedownHandler(e) {
		// Prevent dragging / swiping on inputs, selects and textareas
		const ignoreSiema =
			["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(e.target.nodeName) !==
			-1;
		if (ignoreSiema) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		this.pointerDown = true;
		this.drag.startX = e.pageX;
	}

	mouseupHandler(e) {
		e.stopPropagation();
		this.pointerDown = false;
		this.selector.style.cursor = "-webkit-grab";
		this.enableTransition();
		if (this.drag.endX) {
			this.updateAfterDrag();
		}
		this.clearDrag();
	}

	mousemoveHandler(e) {
		e.preventDefault();
		if (this.pointerDown) {
			// if dragged element is a link
			// mark preventClick prop as a true
			// to detemine about browser redirection later on
			if (e.target.nodeName === "A") {
				this.drag.preventClick = true;
			}

			this.drag.endX = e.pageX;
			this.selector.style.cursor = "-webkit-grabbing";
			this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
			this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

			const currentSlide = this.config.loop
				? this.currentSlide + this.perPage
				: this.currentSlide;
			const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
			const dragOffset = this.drag.endX - this.drag.startX;
			const offset = this.config.rtl
				? currentOffset + dragOffset
				: currentOffset - dragOffset;
			this.sliderFrame.style[this.transformProperty] = `translate3d(${(this
				.config.rtl
				? 1
				: -1) * offset}px, 0, 0)`;
		}
	}

	mouseenterHandler(e) {
		this.pauseAutoplay();
	}

	mouseleaveHandler(e) {
		if (this.pointerDown) {
			this.pointerDown = false;
			this.selector.style.cursor = "-webkit-grab";
			this.drag.endX = e.pageX;
			this.drag.preventClick = false;
			this.enableTransition();
			this.updateAfterDrag();
			this.clearDrag();
		}
		this.startAutoplay();
	}

	clickHandler(e) {
		if (this.drag.preventClick) {
			e.preventDefault();
		}
		this.drag.preventClick = false;
	}

	remove(index, callback) {
		if (index < 0 || index >= this.innerElements.length) {
			throw new Error("Item to remove doesn't exist 😭");
		}

		const lowerIndex = index < this.currentSlide;
		const lastItem = this.currentSlide + this.perPage - 1 === index;

		if (lowerIndex || lastItem) {
			this.currentSlide--;
		}

		this.innerElements.splice(index, 1);

		// build a frame and slide to a currentSlide
		this.buildSliderFrame();

		if (callback) {
			callback.call(this);
		}
	}

	insert(item, index, callback) {
		if (index < 0 || index > this.innerElements.length + 1) {
			throw new Error("Unable to inset it at this index 😭");
		}
		if (this.innerElements.indexOf(item) !== -1) {
			throw new Error("The same item in a carousel? Really? Nope 😭");
		}

		// Avoid shifting content
		const shouldItShift =
			index <= this.currentSlide > 0 && this.innerElements.length;
		this.currentSlide = shouldItShift
			? this.currentSlide + 1
			: this.currentSlide;

		this.innerElements.splice(index, 0, item);

		// build a frame and slide to a currentSlide
		this.buildSliderFrame();

		if (callback) {
			callback.call(this);
		}
	}

	prepend(item, callback) {
		this.insert(item, 0);
		if (callback) {
			callback.call(this);
		}
	}

	append(item, callback) {
		this.insert(item, this.innerElements.length + 1);
		if (callback) {
			callback.call(this);
		}
	}

	destroy(restoreMarkup = false, callback) {
		this.detachEvents();

		this.selector.style.cursor = "auto";

		if (restoreMarkup) {
			const slides = document.createDocumentFragment();
			for (let i = 0; i < this.innerElements.length; i++) {
				slides.appendChild(this.innerElements[i]);
			}
			this.selector.innerHTML = "";
			this.selector.appendChild(slides);
			this.selector.removeAttribute("style");
		}

		if (callback) {
			callback.call(this);
		}
	}
}

export default SocialWidgetSlider