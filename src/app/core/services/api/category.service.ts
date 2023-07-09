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

    constructor(private afs: AngularFirestore) {
    }

    createCategory(data) {
        return new Promise(resolve => this.afs.firestore.collection('category').add(data).then(() => resolve));
    }

    createSousCategorie(data) {
        return new Promise(resolve => this.afs.firestore.collection('sub-category').add(data).then(() => resolve));
    }

    getCategory(): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getAllCategory');
    }


    getSubCategory(): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getSubCategory');
    }

    getSubCategoryByID(param): Promise<any> {
        return axios.get(ApiConstant.API + '/category/getSubCategoryByID/' + param.category);
    }

}
