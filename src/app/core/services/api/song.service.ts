// Angular
import { Injectable } from '@angular/core';
import { combineLatest, finalize, from, map, Observable, Subject, switchMap, tap } from 'rxjs';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { where } from "@angular/fire/firestore";
import firebase from "firebase/compat";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import axios from 'axios';
import {AuthenticationService} from "../global/authentication.service";
import {InterceptorService} from "../global/interceptor.service";


@Injectable({
    providedIn: 'root'
})
export class SongService {
  firebaseToken = "";
  constructor(private authenticationService: AuthenticationService, private axiosInterceptorService: InterceptorService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
    });
  }

    getSongByCategory(data): Promise<any> {
        return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/admin/getSongByCategory/', data);
    }

    getSongByID(id): Promise<any> {
        return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/admin/single-music/' + id);
    }

    getAllSongs(): Promise<any> {
        return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/admin/list-music');
    }

    createSong(data: any) {
        return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/admin/create-music', data,  {
          headers: {
            Authorization: `Bearer ${this.firebaseToken}`
          }
        }).then(() => {alert('Chanson créée avec succès.'); console.log(this.firebaseToken)}).catch((e) => alert("Erreur."))
    }

    deleteSong(id: string, name: string) {
        return this.axiosInterceptorService.getAxiosInstance().delete(ApiConstant.API + '/admin/delete-music/' + id,  {
          headers: {
            Authorization: `Bearer ${this.firebaseToken}`
          }
        }).then(() => {alert('Chanson ' + name + " supprimée avec succès"); console.log(this.firebaseToken)}).catch((e) => alert("Erreur."))
      }

    modifySong(data: any) {
        return this.axiosInterceptorService.getAxiosInstance().put(ApiConstant.API + '/admin/update-music', data, {
          headers: {
            Authorization: `Bearer ${this.firebaseToken}`
          }
        });
    }

    highlightedSongs(): Promise<any> {
        return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/admin/highlight-music');
    }
}
