(function (window, document, undefined) {
	'use strict';

	/*============================== Carousel ==============================*/
	if (document.querySelector('.hero__slider')) {
		new Splide('.hero__slider', {
			type: 'loop',
			perPage: 1,
			drag: true,
			pagination: true,
			speed: 1600,
			gap: 24,
			arrows: false,
			focus: 0,
			autoplay: true,
			interval: 6000,
			autoHeight: true,
			breakpoints: {
				767: {
					gap: 20,
				}
			}
		}).mount();
	}

	if (document.querySelector('.section__carousel--content')) {
		var elms = document.getElementsByClassName('section__carousel--content');

		for ( var i = 0; i < elms.length; i++ ) {
			new Splide(elms[ i ], {
				type: 'loop',
				perPage: 3,
				drag: true,
				pagination: false,
				autoWidth: false,
				autoHeight: false,
				speed: 800,
				// gap: 24,
				gap: 24,
				arrows: false,
				focus: 0,
				breakpoints: {
					767: {
						gap: 20,
						autoHeight: true,
						pagination: true,
						arrows: false,
						perPage: 1,
					},
					991: {
						autoHeight: true,
						pagination: true,
						arrows: false,
						perPage: 2,
					},
					1199: {
						autoHeight: true,
						pagination: true,
						arrows: false,
						perPage: 2,
					},
				}
			}).mount();
		}
	}

	if (document.querySelector('.section__carousel--block')) {
		var elms = document.getElementsByClassName('section__carousel--block');

		for ( var i = 0; i < elms.length; i++ ) {
			new Splide(elms[ i ], {
				type: 'loop',
				perPage: 3,
				drag: true,
				pagination: false,
				autoWidth: false,
				autoHeight: true,
				speed: 800,
				gap: 30,
				arrows: false,
				focus: 0,
				breakpoints: {
					767: {
						gap: 20,
						pagination: true,
						arrows: false,
						perPage: 1,
					},
					991: {
						pagination: true,
						arrows: false,
						perPage: 2,
					},
					1199: {
						pagination: true,
						arrows: false,
						perPage: 3,
					},
				}
			}).mount();
		}
	}

	if (document.querySelector('.section__canvas')) {
		VANTA.CELLS({
			el: "#canvas2",
			mouseControls: false,
			touchControls: false,
			gyroControls: false,
			minHeight: 200.00,
			minWidth: 200.00,
			scale: 1.00,
			color1: 0x227f9e,
			color2: 0xaa72ce,
			size: 3.00,
			speed: 1.00
		})
	}

})(window, document);