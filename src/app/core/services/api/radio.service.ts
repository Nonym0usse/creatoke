// Angular
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { Radio } from '../../_modals/radio';


@Injectable({
  providedIn: 'root'
})
export class RadioService {

  constructor(
    private baseApiService: BaseApiService
  ) { }

  /**
   * Get radio data
   * @returns {object}
   */
  getRadios(): Observable<any> {
    return this.baseApiService.get(ApiConstant.RADIO).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
            return new Radio().toLocal(element);
          });
        }
        return response;
      })
    );
  }
}
