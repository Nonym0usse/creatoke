// Angular
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Services
import { BaseApiService } from './../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { Plan } from '../../_modals/plan';


@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    private baseApiService: BaseApiService
  ) { }

  /**
   * Get plan data
   * @returns {object}
   */
  getPlans(): Observable<any> {
    return this.baseApiService.get(ApiConstant.PLANS).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
            return new Plan().toLocal(element);
          });
        }
        return response;
      })
    );
  }
}
