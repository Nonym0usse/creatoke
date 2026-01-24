// Angular
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import axios from "axios";
import { Title } from '@angular/platform-browser';

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
  sendEmail(body): Promise<any> {
    return axios.post(ApiConstant.API + '/contact/send-email', body);
  }
}
