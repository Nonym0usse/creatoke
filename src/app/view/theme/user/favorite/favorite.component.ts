// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { SongService } from './../../../../core/services/api/song.service';
import { AlbumService } from './../../../../core/services/api/album.service';

// Constant classes
import { HttpStatus } from './../../../../core/constants/http-status';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html'
})
export class FavoriteComponent implements OnInit {

  // Holds song data
  songs: any = [];

  // Holds album data
  albums: any = [];

  constructor(
    private songService: SongService,
    private albumService: AlbumService
  ) { }

  ngOnInit(): void {
    this.getSongs();
    this.getAlbums();
  }

  /**
   * Get song data from default json.
   */
  getSongs(): void {
    this.songService.getSongs().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.songs = response.data.filter((item: any) => item.favorite === true);
      }
    });
  }

  /**
   * Get album data from default json.
   */
   getAlbums(): void {
    this.albumService.getAlbums().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.albums = response.data.filter((item: any) => item.favorite === true);
      }
    });
  }

}
