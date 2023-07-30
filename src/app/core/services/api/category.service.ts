import { Injectable } from '@angular/core';
import { ApiConstant } from "../../constants/api-constant";
import axios from 'axios';
import {AuthenticationService} from "../global/authentication.service";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    //@ts-ignore
    firebaseToken = "";
    constructor(private authenticationService: AuthenticationService) {
      // @ts-ignore
      this.firebaseToken = localStorage.getItem('firebaseToken');
      this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
      });
    }

    createCategory(data) {
      return axios.post(ApiConstant.API + '/category/create-category', data,  {
        headers: {
          Authorization: `Bearer ${this.firebaseToken}`
        }
      });
    }

    createBackground(data){
      return axios.post(ApiConstant.API + '/category/create-background', data, {
        headers: {
          Authorization: `Bearer ${this.firebaseToken}`
        }
      });
    }

    getBackgroundImg(): Promise<any> {
      return axios.get(ApiConstant.API + '/category/getBackgroundImg/');
    }

    getCategory(): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getAllCategory');
    }

    deleteCategory(id): Promise<any>{
      return axios.delete(ApiConstant.API + '/category/delete/' + id, {
        headers: {
          Authorization: `Bearer ${this.firebaseToken}`
        }
      });
    }

    getSubCategory(): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getSubCategory');
    }

    getSubCategoryByID(param): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getSubCategoryByID/' + param.category);
    }

}
