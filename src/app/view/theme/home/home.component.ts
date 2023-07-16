// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { SongService } from './../../../core/services/api/song.service';
import { EventService } from './../../../core/services/api/event.service';
import { PlaylistService } from './../../../core/services/api/playlist.service';
import { RadioService } from './../../../core/services/api/radio.service';

// Constant classes
import { HttpStatus } from './../../../core/constants/http-status';
import { Utils } from './../../../core/utils/utils';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  // Holds song data
  songs: any = [];

  // Holds trending song data
  trendingSongs: any = [];

  // Holds international song data
  internationalSongs: any = [];

  // Holds event data
  events: any = [];

  // Holds album data
  albums: any = [];

  // Holds playlist data
  playlist: any = [];

  // Holds radio data
  radios: any = [];

  constructor(
    private songService: SongService,
    private eventService: EventService,
    private playlistService: PlaylistService,
    private radioService: RadioService
  ) { }

  ngOnInit(): void {
    this.getSongs();
    this.getEvents();
    this.getAlbums();
    this.getPlaylist();
    this.getRadios();
  }

  /**
   * Get song data from default json.
   */
  getSongs(): void {
    this.songService.highlightedSongs().then((data) => {this.songs = data.data;});
  }

  /**
   * Get event data from default json.
   */
  getEvents(): void {
    this.eventService.getEvents().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.events = response.data.slice(0, 3); // Remove more then 3 events
        this.events.forEach((element: any) => {
          if (element.attendee && element.attendee.length > 3) {
            element.attendee = element.attendee.slice(0, 3); // Display 3 users
          }
          element.address = Utils.removeHtml(element.address);
        });
      }
    });
  }

  /**
   * Get album data from default json.
   */
  getAlbums(): void {
   
  }

  /**
   * Get playlist data from default json.
   */
  getPlaylist(): void {
    this.playlistService.getPlaylist().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.playlist = response.data;
      }
    });
  }

  /**
   * Get radio data from default json.
   */
  getRadios(): void {
    this.radioService.getRadios().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.radios = response.data;
      }
    });
  }

}
