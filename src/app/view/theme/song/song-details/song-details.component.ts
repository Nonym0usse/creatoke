// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { PlayerService } from './../../../../core/services/design/player.service';

// Constant classes
import { Song } from 'src/app/core/models/song.model';

@Component({
  selector: 'app-song-details',
  templateUrl: './song-details.component.html'
})
export class SongDetailsComponent implements OnInit, OnDestroy {

  // Holds song data
  song: any;

  // Holds song data
  songs: Song[] = [];

  // Holds router subscription
  routerSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    console.log("SongDetailsComponent initialized");
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Play song
   * @param event 
   */
  play(event: any): void {
    this.playerService.songPlayPause(event, this.song);
  }

}
