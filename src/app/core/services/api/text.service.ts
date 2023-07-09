import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
    providedIn: 'root'
})
export class TextService {

    constructor(private af: AngularFirestore) { }

    mainDiapo(data: any) {
        return new Promise((resolve, reject) => {
            this.af.firestore.collection('texts').doc(data.firestoreID).update(data).then(() => resolve('OK')).catch((e) => reject(e))
        })
    }
}
