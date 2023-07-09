// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { PlayerService } from './../../../../core/services/design/player.service';

// Constant classes
import { HttpStatus } from './../../../../core/constants/http-status';


@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html'
})
export class AlbumDetailsComponent implements OnInit {

  // Holds album data
  album: any;

  // Holds album data
  albums: any = [];

  // Holds router subscription
  routerSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getAlbums(param['id']);
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Get song data from default json.
   * @param id
   */
  getAlbums(id: string): void {
    
  }

  /**
   * Play song & playlist
   * @param event 
   */
  play(event: any): void {
    this.album.songs && this.album.songs.length ? 
    this.playerService.playSongs(event, this.album) : 
    this.playerService.songPlayPause(event, this.album);
  }

}
