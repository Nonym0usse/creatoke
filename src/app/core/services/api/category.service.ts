import { Injectable } from '@angular/core';
import {BaseApiService} from "../global/base-api.service";
import {map, Observable} from "rxjs";
import {ApiConstant} from "../../constants/api-constant";
import {Category} from "../../_modals/category";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  //@ts-ignore

  constructor(private afs: AngularFirestore) {
  }

  createCategory(data){
    return new Promise(resolve => this.afs.firestore.collection('category').add(data).then(() => resolve));
  }

  createSousCategorie(data){
    return new Promise(resolve => this.afs.firestore.collection('sub-category').add(data).then(() => resolve));
  }

  getCategory(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.afs.collection('category').snapshotChanges().subscribe(actions => {
        const data = actions.map(a => {
          const id = a.payload.doc.id;
          const docData = a.payload.doc.data();
          // @ts-ignore
          return { id, ...docData };
        });
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getSubCategoryByID(param): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.afs.collection('sub-category', ref => ref.where('category', "==", param.category)).snapshotChanges().subscribe(actions => {
        const data = actions.map(a => {
          const id = a.payload.doc.id;
          const docData = a.payload.doc.data();
          // @ts-ignore
          return { id, ...docData };
        });
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getSubCategory(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.afs.collection('sub-category').snapshotChanges().subscribe(actions => {
        const data = actions.map(a => {
          const id = a.payload.doc.id;
          const docData = a.payload.doc.data();
          // @ts-ignore
          return { id, ...docData };
        });
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
