import { Injectable } from '@angular/core';
import {ApiConstant} from "../../constants/api-constant";
import {InterceptorService} from "../global/interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  firebaseToken = "";

  constructor(private axiosInterceptorService: InterceptorService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
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
