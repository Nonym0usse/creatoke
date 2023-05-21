// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { ArtistService } from './../../../core/services/api/artist.service';

// Constant classes
import { HttpStatus } from './../../../core/constants/http-status';


@Component({
  selector: 'app-artist-carousel',
  templateUrl: './artist-carousel.component.html'
})
export class ArtistCarouselComponent implements OnInit {

  // Holds artist data
  artists: any = [];

  constructor(
    private artistService: ArtistService
  ) { }

  ngOnInit(): void {
    this.getArtists();
  }

  /**
   * Get artist data from default json.
   */
  getArtists(): void {
    this.artistService.getArtists().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.artists = response.data;
      }
    });
  }

}
