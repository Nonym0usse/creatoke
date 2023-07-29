import { Injectable } from '@angular/core';
import { BaseApiService } from "../global/base-api.service";
import { map, Observable } from "rxjs";
import { ApiConstant } from "../../constants/api-constant";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    //@ts-ignore

    constructor() {
    }

    createCategory(data) {
      return axios.post(ApiConstant.API + '/category/create-category', data);
    }

    createBackground(data){
      return axios.post(ApiConstant.API + '/category/create-background', data);
    }

    getBackgroundImg(): Promise<any> {
      return axios.get(ApiConstant.API + '/category/getBackgroundImg/');
    }

    getCategory(): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getAllCategory');
    }

    deleteCategory(id): Promise<any>{
      return axios.delete(ApiConstant.API + '/category/delete/' + id);
    }

    getSubCategory(): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getSubCategory');
    }

    getSubCategoryByID(param): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getSubCategoryByID/' + param.category);
    }

}
