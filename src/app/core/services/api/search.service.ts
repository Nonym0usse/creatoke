// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from 'rxjs';
import axios from 'axios';
import { ApiConstant } from '../../constants/api-constant';


@Injectable({
    providedIn: 'root'
})
export class SearchService {
  searchResults: any[] = [];
    constructor(
        private af: AngularFirestore,
    ) { }


    searchSong(title: string) {
        this.af.collection('musics', ref => ref.where('title', '==', title)).valueChanges().subscribe((results: any[]) => {
        this.searchResults = results;
      });
    }

    previewSongs(limit): Promise<any> {
        return axios.get(ApiConstant.API + '/admin/preview-searching/' + limit);
    }
}
