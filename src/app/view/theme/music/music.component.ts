import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../../../core/services/api/category.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {getParams} from "swiper/angular/angular/src/utils/get-params";

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
  // Holds genre data
  subCategory: any = [];
  routerSubscription: Subscription | undefined;
  title: string = "";
  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getParams(param['category']);
      this.categoryService.getSubCategoryByID(param).then((data) => {this.subCategory = data.data; console.log(data.data)})
    });
  }


  getParams(param){
    switch (param) {
      case "a-chanter":
        this.title = "Chansons";
        break
      case "instrumentaux":
        this.title = "Instrumentaux";
        break
      case "youtubeurs":
        this.title = "Youtubeurs";
        break
      default:
        this.title = "Musiques"
        break
    }
    return this.title;
  }

  /**
   * Get genre data from default json.
   */

}
