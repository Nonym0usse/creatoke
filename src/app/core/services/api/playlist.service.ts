// Angular
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(
    private baseApiService: BaseApiService
  ) { }

  /**
   * Get playlist data
   * @returns {object}
   */
  getPlaylist(): Observable<any> {
    return this.baseApiService.get(ApiConstant.PLAYLISTS).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
          });
        }
        return response;
      })
    );
  }
}
