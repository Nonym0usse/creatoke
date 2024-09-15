import { Injectable } from '@angular/core';
import { ApiConstant } from "../../constants/api-constant";
import axios from 'axios';
import {AuthenticationService} from "../global/authentication.service";
import {InterceptorService} from "../global/interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  //@ts-ignore
  firebaseToken = "";
  constructor(private authenticationService: AuthenticationService, private axiosInterceptorService: InterceptorService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
    });
  }

  createCategory(data) {
    return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/category/create-category', data,  {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    }).then(() => alert('Sous catégorie créée avec succès')).catch((e) => alert('Erreur.'));
  }

  createBackground(data){
    return this.axiosInterceptorService.getAxiosInstance().put(ApiConstant.API + '/category/create-background', data, {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }

  getBackgroundImg(): Promise<any> {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/category/getBackgroundImg/');
  }

  getCategory(): Promise<any> {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/category/getAllCategory');
  }

  deleteCategory(id, imagePath): Promise<any>{
    return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/category/delete/', {id: id, picture: imagePath}, {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }

  getSubCategory(): Promise<any> {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/category/getSubCategory');
  }

  getSubCategoryByID(param): Promise<any> {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/category/getSubCategoryByID/' + param.category);
  }

  getLastText(){
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/category/getlastText/');
  }

  modifyText(data){
    return this.axiosInterceptorService.getAxiosInstance().put(ApiConstant.API + '/category/modify-text', data, {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }
}
