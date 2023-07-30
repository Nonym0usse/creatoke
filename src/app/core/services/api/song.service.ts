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


@Injectable({
    providedIn: 'root'
})
export class SongService {
  firebaseToken = "";

  constructor(private authenticationService: AuthenticationService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
    });
  }

    getSongByCategory(id): Promise<any> {
        console.log(id)
        return axios.get(ApiConstant.API + '/admin/getSongByCategory/' + id);
    }

    getSongByID(id): Promise<any> {
        return axios.get(ApiConstant.API + '/admin/single-music/' + id);
    }

    getAllSongs(): Promise<any> {
        return axios.get(ApiConstant.API + '/admin/list-music');
    }

    createSong(data: any) {
        return axios.post(ApiConstant.API + '/admin/create-music', data,  {
          headers: {
            Authorization: `Bearer ${this.firebaseToken}`
          }
        });
    }

    deleteSong(id: string) {
        return axios.delete(ApiConstant.API + '/admin/delete-music/' + id,  {
          headers: {
            Authorization: `Bearer ${this.firebaseToken}`
          }
        });
    }

    modifySong(data: any) {
        return axios.put(ApiConstant.API + '/admin/update-music', data, {
          headers: {
            Authorization: `Bearer ${this.firebaseToken}`
          }
        });
    }

    highlightedSongs(): Promise<any> {
        return axios.get(ApiConstant.API + '/admin/highlight-music');
    }
}
