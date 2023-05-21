// Constant classes
import { Component, HostBinding, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

// NPM modules
import SwiperCore, { SwiperOptions, Navigation, Pagination, Scrollbar, A11y, Virtual, Autoplay } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// install Swiper modules
SwiperCore.use([A11y, Virtual, Autoplay, Navigation, Pagination, Scrollbar]);


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html'
})
export class CarouselComponent implements OnInit {

  // Element class
  @HostBinding('class') @Input() classes = '';

  // Swiper component reference
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  // Slide template from parent
  @Input() slideTemplate: TemplateRef<any> | undefined;

  // Slide data from parent
  @Input() slideData: any;

  // Inputs to configure swiper options
  @Input() slides: number = 1;
  @Input() speed: number = 500;
  @Input() autoplay: boolean = true;
  @Input() pagination: boolean = false;
  @Input() navigation: boolean = false;
  @Input() scrollbar: boolean = false;

  options: SwiperOptions = {};

  constructor() { }

  ngOnInit(): void {
    this.classes = 'swiper-carousel ' + this.classes;
    this.carouselOptions();
  }

  /**
   * Configure carousel options
   */
  carouselOptions(): void {
    const desktopSpace = 24;
    const mobileSpace = 16;

    // Set responsive slide
    let tablet = 1;
    let mobile = 2;

    if (this.slides === 1) {
      tablet = mobile = 1;

    } else {
      if (this.slides > 1 && this.slides < 5) {
        tablet = 2;
        mobile = 1;
      } else if (this.slides >= 5) {
        tablet = 3;
        mobile = 2;
      }
    }

    // Swiper options
    this.options = {
      speed: this.speed,
      slidesPerView: mobile,
      slidesPerGroup: mobile,
      spaceBetween: mobileSpace,

      breakpoints: {
        576: {
          slidesPerView: tablet,
          slidesPerGroup: tablet
        },
        1200: {
          slidesPerView: this.slides,
          slidesPerGroup: this.slides,
          spaceBetween: desktopSpace
        }
      }
    }

    if (this.autoplay) {
      this.options.autoplay = {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }
    }

    if (this.pagination) {
      this.options.pagination = { clickable: true }
    }

    if (this.scrollbar) {
      this.options.scrollbar = { draggable: true }
    }

  }

  /**
   * Carousel button events
   */
  slideNext(): void {
    this.swiper?.swiperRef.slideNext(this.speed);
  }

  slidePrev(): void {
    this.swiper?.swiperRef.slidePrev(this.speed);
  }

}
