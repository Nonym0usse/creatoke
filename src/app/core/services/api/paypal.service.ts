import { Injectable } from '@angular/core';
import axios from 'axios';
import {ApiConstant} from "../../constants/api-constant";
import {AuthenticationService} from "../global/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  firebaseToken = "";

  constructor(private authenticationService: AuthenticationService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
    });
  }

  createSale(data) {
    return axios.post(ApiConstant.API + '/payment/create', data);
  }

  listSales(){
    return axios.get(ApiConstant.API + '/payment/list-sell' , {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }
}
