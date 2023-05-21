// Angular
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { Event } from '../../_modals/event';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private baseApiService: BaseApiService
  ) { }

  /**
   * Get event data
   * @returns {object}
   */
  getEvents(): Observable<any> {
    return this.baseApiService.get(ApiConstant.EVENTS).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
            return new Event().toLocal(element);
          });
        }
        return response;
      })
    );
  }
  
}
