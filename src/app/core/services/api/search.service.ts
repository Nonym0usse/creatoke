// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from 'rxjs';


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

    previewSongs(): Promise<any> {
        return this.af.collection('musics', ref => ref.limit(6)).get().toPromise()
            // @ts-ignore
            .then((querySnapshot: QuerySnapshot<any>) => {
                if (querySnapshot.empty) {
                    return null;
                } else {
                    return querySnapshot.docs.map(doc => {
                        const id = doc.id;
                        const data = doc.data();
                        return { id, data };
                    });
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error);
                return null;
            });
    }
}
