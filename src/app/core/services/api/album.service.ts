// Angular
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// Service
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { Album } from '../../_modals/album';


@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(
    private baseApiService: BaseApiService
  ) { }

  /**
   * Get album data
   * @returns {object}
   */
  getAlbums(): Observable<any> {
    return this.baseApiService.get(ApiConstant.ALBUMS).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
            return new Album().toLocal(element);
          });
        }
        return response;
      })
    );
  }
}
