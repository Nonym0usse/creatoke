// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { AlbumService } from './../../../core/services/api/album.service';

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
    private albumService: AlbumService
  ) { }

  ngOnInit(): void {
    this.getAlbums();
  }

  /**
   * Get album data from default json.
   */
  getAlbums(): void {
    this.albumService.getAlbums().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.albums = response.data;
      }
    });
  }

}
