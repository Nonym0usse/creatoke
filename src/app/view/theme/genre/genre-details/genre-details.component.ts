// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { GenreService } from './../../../../core/services/api/genre.service';

// Constant classes
import { HttpStatus } from './../../../../core/constants/http-status';


@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html'
})
export class GenreDetailsComponent implements OnInit, OnDestroy {

  // Holds genre data
  genre: any;

  // Holds genre data
  genres: any = [];

  // Holds router subscription
  routerSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private genreService: GenreService
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getGenres(param['id']);
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Get genre data from default json.
   * @param id 
   */
  getGenres(id: string): void {
    this.genreService.getGenres().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.genres = response.data;
        this.genre = this.genres.find((item: any) => item.id === parseInt(id)); // find genre by id
      }
    });
  }

}
