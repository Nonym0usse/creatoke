import { Component, OnInit } from '@angular/core';
import {HttpStatus} from "../../../../core/constants/http-status";
import {ActivatedRoute} from "@angular/router";
import {GenreService} from "../../../../core/services/api/genre.service";
import {Subscription} from "rxjs";
import {SongService} from "../../../../core/services/api/song.service";
import {CategoryService} from "../../../../core/services/api/category.service";

@Component({
  selector: 'app-music-details',
  templateUrl: './music-details.component.html',
  styleUrls: ['./music-details.component.scss']
})
export class MusicDetailsComponent implements OnInit {

  // Holds genre data
  genre: any;

  // Holds genre data
  songs: any = [];

  // Holds router subscription
  routerSubscription: Subscription | undefined;
  picturebackground: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['category'], param['id']);
    });
    this.getBackground();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

  /**
   * Get genre data from default json.
   * @param category
   * @param subcategory
   */
  getSongs(category: string, subcategory: string): void {
    this.songService.getSongByCategory({category: category, subcategory: subcategory}).then((data) => {this.songs = data.data;});
  }
}
