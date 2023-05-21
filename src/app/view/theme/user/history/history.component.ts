// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { SongService } from './../../../../core/services/api/song.service';

// Constant classes
import { HttpStatus } from './../../../../core/constants/http-status';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {

  // Holds song data
  songs: any = [];

  constructor(
    private songService: SongService
  ) { }

  ngOnInit(): void {
    this.getSongs();
  }

  /**
   * Get song data from default json.
   */
  getSongs(): void {
    this.songService.getSongs().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.songs = response.data;
      }
    });
  }

}
