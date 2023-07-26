// Angular
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  constructor(
    protected http: HttpClient
  ) { }

  /**
   * Get playlist data
   * @returns {object}
   */
  modifyLicence(body): Promise<any> {
    return axios.put(ApiConstant.API + '/licence/update', body);
  }

  listLicence(): Promise<any> {
    return axios.get(ApiConstant.API + '/licence/list-licence');
  }
}
