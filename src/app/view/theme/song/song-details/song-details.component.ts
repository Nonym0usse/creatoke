// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { SongService } from './../../../../core/services/api/song.service';
import { PlayerService } from './../../../../core/services/design/player.service';

// Constant classes
import { HttpStatus } from './../../../../core/constants/http-status';


@Component({
  selector: 'app-song-details',
  templateUrl: './song-details.component.html'
})
export class SongDetailsComponent implements OnInit, OnDestroy {

  // Holds song data
  song: any;

  // Holds song data
  songs: any = [];

  // Holds router subscription
  routerSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songService: SongService,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['id']);
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
    this.songService.getSongs().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.songs = response.data;
        this.song = this.songs.find((item: any) => item.id === parseInt(id)); // find song by id
      }
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
