// Angular
import { Component, OnInit } from '@angular/core';

// Constant classes
import { Constant } from './../../core/constants/constant';


@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html'
})
export class ThemeComponent implements OnInit {

  // Holds header views
  headerView = Constant.HEADER_VIEW;

  // Holds footer views
  footerView = Constant.FOOTER_VIEW;

  constructor() { }

  ngOnInit(): void {
  }

}
