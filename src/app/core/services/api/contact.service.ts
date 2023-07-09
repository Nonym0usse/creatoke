// Angular
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

 constructor(
    protected http: HttpClient
  ) { }

  /**
   * Get playlist data
   * @returns {object}
   */
  sendEmail(body): Observable<any> {
    return this.http.post('http://localhost:3000/contact/send-email', body).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
            return element;
          });
        }
        return response;
      })
    );
  }
}
