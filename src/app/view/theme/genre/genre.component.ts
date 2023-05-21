// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { GenreService } from './../../../core/services/api/genre.service';

// Constant classes
import { HttpStatus } from 'src/app/core/constants/http-status';
import {CategoryService} from "../../../core/services/api/category.service";


@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html'
})
export class GenreComponent implements OnInit {

  // Holds genre data
  category: any = [];

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getCategory();
  }

  /**
   * Get genre data from default json.
   */
  getCategory() {
    console.log('okokokokk')

  }


}
