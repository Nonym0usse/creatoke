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
  picturebackground: any;

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getParams(param['category']);
      this.categoryService.getSubCategoryByID(param).then((data) => {this.subCategory = data.data; console.log(data.data)})
    });
    this.getBackground();
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

  getParams(param){
    switch (param) {
      case "chansons":
        this.title = "Chansons à chanter";
        break
      case "instrumentaux":
        this.title = "Instrumentaux";
        break
      case "youtubeurs":
        this.title = "Youtubeurs";
        break
      case "chansons-cherche-auteur":
        this.title = "Chansons cherche auteur";
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
