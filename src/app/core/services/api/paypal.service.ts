import { Injectable } from '@angular/core';
import axios from 'axios';
import {ApiConstant} from "../../constants/api-constant";
import {AuthenticationService} from "../global/authentication.service";
import {InterceptorService} from "../global/interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  firebaseToken = "";

  constructor(private authenticationService: AuthenticationService, private axiosInterceptorService: InterceptorService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
    });
  }

  createSale(data) {
    return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/payment/create', data);
  }

  listSales(){
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/payment/list-sell' , {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }
}
