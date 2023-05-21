// Angular
import { Injectable } from '@angular/core';
import {combineLatest, finalize, from, map, Observable, Subject, switchMap, tap} from 'rxjs';

// Services
import { BaseApiService } from '../global/base-api.service';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { Song } from '../../_modals/song';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {where} from "@angular/fire/firestore";
import firebase from "firebase/compat";
import QuerySnapshot = firebase.firestore.QuerySnapshot;


@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(
    private baseApiService: BaseApiService,
    private af: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  /**
   * Get song data
   * @returns {object}
   */
  getSongs(){

    return  this.baseApiService.get(ApiConstant.SONGS).pipe(
      map((response: any) => {
        if (response.data) {
          // Covert api response data into local data
          response.data = response.data.map((element: any) => {
            return new Song().toLocal(element);
          });
        }
        return response;
      })
    );
  }


  getSongByCategory(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log(id)
      this.af.collection("musics").ref.where("category", "==", id)
        .get()
        .then((querySnapshot: QuerySnapshot<any>) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            // @ts-ignore
            data.push({...doc.data() });
          });
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getSongByID(id): Promise<any> {
    return this.af.collection('musics', ref => ref.where('id', "==", Number(id))).get().toPromise()
      // @ts-ignore
      .then((querySnapshot: QuerySnapshot<any>) => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const docData = querySnapshot.docs[0].data();
          const docId = querySnapshot.docs[0].id;
          return { id: docId, ...docData };
        }
      })
      .catch((error) => {
        console.error('Error getting document:', error);
        return null;
      });
  }


  createSong(data: any){
    return new Promise((resolve, reject) => {
      this.af.firestore.collection('musics').doc(data.firestoreID).set(data).then(() => resolve('OK')).catch((e) => reject(e))
    })
  }
}
