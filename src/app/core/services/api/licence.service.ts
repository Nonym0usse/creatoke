// Angular
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import axios from "axios";
import {AuthenticationService} from "../global/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  firebaseToken = "";

  constructor(private authenticationService: AuthenticationService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
    });
  }
  /**
   * Get playlist data
   * @returns {object}
   */
  modifyLicence(body): Promise<any> {
    return axios.put(ApiConstant.API + '/licence/update', body, {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }

  listLicence(): Promise<any> {
    return axios.get(ApiConstant.API + '/licence/list-licence');
  }
}
