import { Injectable } from '@angular/core';
import axios from 'axios';
import {ApiConstant} from "../../constants/api-constant";

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor() { }

  createSale(data) {
    return axios.post(ApiConstant.API + '/payment/create', data);
  }

}
