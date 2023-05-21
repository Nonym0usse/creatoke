// Angular
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  constructor(
    protected http: HttpClient
  ) {
  }

  /**
   * Base GET method for calling api.
   * @param url 
   * @param queryParams 
   * @returns {object}
   */
  get(
    url: string,
    queryParams?: HttpParams | { [param: string]: string | string[] }
  ): Observable<any> {
    return this.http.get(url, {
      observe: 'response',
      params: queryParams
    })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res.body;
        })
      );
  }


  /**
   * Base POST method for calling api.
   * @param url 
   * @param requestBody 
   * @param queryParams 
   * @returns {object}
   */
  post(
    url: string,
    requestBody: any,
    queryParams?: HttpParams | { [param: string]: string | string[] }
  ): Observable<any> {
    return this.http.post(url,
      requestBody,
      {
        observe: 'response',
        params: queryParams
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res.body;
        })
      );
  }

  /**
   * Post request with Content-Type form-data
   * @param url 
   * @param formData 
   * @param queryParams 
   * @returns {object}
   */
  postRequestWithFormData(
    url: string,
    formData: FormData,
    queryParams?: HttpParams | { [param: string]: string | string[] }
  ): Observable<any> {
    return this.http.post(url, formData, {
      headers: new HttpHeaders({'Content-type': 'multipart/form-data'}),
      observe: 'response',
      params: queryParams
    })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res.body;
        })
      );
  }
}