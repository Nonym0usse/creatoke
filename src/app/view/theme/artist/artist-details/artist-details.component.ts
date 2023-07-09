// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { ArtistService } from './../../../../core/services/api/artist.service';
import { PlayerService } from './../../../../core/services/design/player.service';

// Constant classes
import { HttpStatus } from './../../../../core/constants/http-status';


@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html'
})
export class ArtistDetailsComponent implements OnInit {

  // Holds artist data
  artist: any;

  // Holds artist data
  artists: any = [];

  // Holds album data
  albums: any = [];

  // Holds router subscription
  routerSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private artistService: ArtistService,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getArtists(param['id']);
    });
    this.getAlbums();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }  

  /**
   * Get artist data from default json.
   * @param id
   */
  getArtists(id: string): void {
    this.artistService.getArtists().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.artists = response.data;
        this.artist = this.artists.find((item: any) => item.id === parseInt(id)); // find artist by id
      }
    });
  }

  /**
   * Get album data from default json.
   */
  getAlbums(): void {
   
  }

  /**
   * Play song & playlist
   * @param event 
   */
  play(event: any): void {
    this.artist.songs && this.artist.songs.length ? 
    this.playerService.playSongs(event, this.artist) : 
    this.playerService.songPlayPause(event, this.artist);
  }

}
