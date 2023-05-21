// Angular
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { Artist } from '../../_modals/artist';


@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(
    private baseApiService: BaseApiService
  ) { }

  /**
   * Get artist data
   * @returns {object}
   */
  getArtists(): Observable<any> {
    return this.baseApiService.get(ApiConstant.ARTISTS).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
            return new Artist().toLocal(element);
          });
        }
        return response;
      })
    );
  }
}
