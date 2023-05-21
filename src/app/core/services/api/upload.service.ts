import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {combineLatest, finalize, map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  task: AngularFireUploadTask | undefined;
  constructor(private storage: AngularFireStorage) { }

  async uploadSong(files: any[]): Promise<string[]> {
    const fileUrls: any = [];
    const id = Math.random().toString(36).substring(2);
    for (const file of files) {

      const ref = this.storage.ref(`songs/${id}/${file.name}`);
      const task = ref.put(file.file);

      await new Promise<void>((resolve, reject) => {
        task.snapshotChanges().toPromise().then((snapshot) => {
          // @ts-ignore
          if (snapshot.state === 'success') {
            ref.getDownloadURL().toPromise().then((downloadUrl) => {
              const data = {name: file.name, url: downloadUrl, firestoreID: id};
              fileUrls.push(data);
              resolve();
            }, reject);
          }
        }, reject);
      });
    }

    return fileUrls;
  }

  uploadFile(file: File): Promise<string> {
    // create a unique ID for the file
    const id = Math.random().toString(36).substring(2);
    // create a reference to the storage location for the file
    const ref = this.storage.ref(`category/${id}/${file.name}`);
    // upload the file to the storage location
    const task: AngularFireUploadTask = ref.put(file);

    // return a promise that resolves to the download URL of the uploaded file
    return new Promise<string>((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(
            url => resolve(url),
            error => reject(error)
          );
        })
      ).subscribe();
    });
  }
}
