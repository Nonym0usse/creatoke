import { Component, OnInit } from '@angular/core';
import {HttpStatus} from "../../../../core/constants/http-status";
import {ActivatedRoute} from "@angular/router";
import {GenreService} from "../../../../core/services/api/genre.service";
import {Subscription} from "rxjs";
import {SongService} from "../../../../core/services/api/song.service";

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['category']);
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Get genre data from default json.
   * @param id
   */
  getSongs(id: string): void {
    this.songService.getSongByCategory(id).then((data) => {this.songs = data; console.log(data)});
  }


}
