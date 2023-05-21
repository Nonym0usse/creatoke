// Angular
import { Component, OnInit } from '@angular/core';

// Constant classes
import { Constant } from './../../../core/constants/constant';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  // Holds header views
  headerView = Constant.HEADER_VIEW;

  // Holds footer views
  footerView = Constant.FOOTER_VIEW;

  constructor() { }

  ngOnInit(): void {
  }

}
