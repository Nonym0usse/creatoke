import { Component, OnInit } from '@angular/core';
import {SongService} from "../../../../core/services/api/song.service";
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../../../core/services/design/player.service";
import {Subscription} from "rxjs";
import {HttpStatus} from "../../../../core/constants/http-status";
import {PlanService} from "../../../../core/services/api/plan.service";

@Component({
  selector: 'app-music-view',
  templateUrl: './music-view.component.html',
  styleUrls: ['./music-view.component.scss']
})
export class MusicViewComponent implements OnInit {

  // Holds song data
  song: any;
  plans: any = [];

  // Holds song data
  songs: any = [];

  // Holds router subscription
  routerSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private playerService: PlayerService,
    private planService: PlanService,
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['detail']);
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Get song data from default json.
   * @param id
   */
  getSongs(id: string): void {
    this.songService.getSongByID(id).then(response => {
        console.log('ok')

      this.song = response.data;
    });
  }

  /**
   * Play song
   * @param event
   */
  play(event: any): void {
    this.playerService.songPlayPause(event, this.song);
  }

}
