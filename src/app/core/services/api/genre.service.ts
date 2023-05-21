// Angular
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { Genre } from '../../_modals/genre';


@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(
    private baseApiService: BaseApiService
  ) { }

  /**
   * Get genre data
   * @returns {object}
   */
   getGenres(): Observable<any> {
    return this.baseApiService.get(ApiConstant.GENRES).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
            return new Genre().toLocal(element);
          });
        }
        return response;
      })
    );
  }
}
