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


@Injectable({
    providedIn: 'root'
})
export class SongService {
    constructor(
        private af: AngularFirestore,
        private storage: AngularFireStorage,
    ) { }

    getSongByCategory(id): Promise<any> {
        console.log(id)
        return axios.get(ApiConstant.API + '/admin/getSongByCategory/' + id);
    }

    getSongByID(id): Promise<any> {
        return axios.get(ApiConstant.API + '/admin/single-music');
    }

    getAllSongs(): Promise<any> {
        return axios.get(ApiConstant.API + '/admin/list-music');
    }

    createSong(data: any) {
        return axios.post(ApiConstant.API + '/admin/create-music', data);
    }

    deleteSong(id: string) {
        return axios.delete(ApiConstant.API + '/admin/delete-music' + id);
    }

    modifySong(data: any) {
        return axios.delete(ApiConstant.API + '/admin/update-music', data);
    }
}


/*
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

*/