// Angular
import { Component, OnInit } from '@angular/core';

// Services

// Constant classes
import { HttpStatus } from 'src/app/core/constants/http-status';



@Component({
  selector: 'app-album',
  templateUrl: './album.component.html'
})
export class AlbumComponent implements OnInit {

  // Holds album data
  albums: any = [];

  constructor(
  ) { }

  ngOnInit(): void {
    this.getAlbums();
  }

  /**
   * Get album data from default json.
   */
  getAlbums(): void {

  }

}
