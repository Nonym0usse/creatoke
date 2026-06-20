// Angular
import { Component } from '@angular/core';

// Constant classes
import { Constant } from './../../../core/constants/constant';


@Component({
  selector: 'app-brand',
  template: `<a [routerLink]="brand.link" class="brand">
    <img [src]="brand.logo" [alt]="brand.name">
  </a>`
})
export class BrandComponent {

  // Holds brand object
  brand = Constant.BRAND;

  constructor() { }

}
