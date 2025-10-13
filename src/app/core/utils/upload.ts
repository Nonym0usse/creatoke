// src/app/core/services/upload.service.ts
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { map, last, switchMap, shareReplay } from 'rxjs/operators';

export interface UploadResult {
  task: AngularFireUploadTask;
  /** Progression en % (0–100) arrondie à 2 décimales */
  progress$: Observable<number>;
  /** URL de téléchargement quand c’est fini */
  downloadUrl$: Observable<string>;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private storage: AngularFireStorage) {}

  /** Redimensionne une image côté client et renvoie un Blob */
  private resizeImage$(file: File, maxW = 800, maxH = 600): Observable<Blob> {
    return new Observable<Blob>((observer) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
          canvas.width = Math.round(img.width * ratio);
          canvas.height = Math.round(img.height * ratio);
          const ctx = canvas.getContext('2d');
          if (!ctx) return observer.error('Canvas context not available');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) { observer.next(blob); observer.complete(); }
            else observer.error('Impossible de créer le blob');
          }, file.type || 'image/jpeg', 0.9);
        };
        img.src = reader.result as string;
      };
      reader.onerror = (e) => observer.error(e);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Démarre l’upload vers Firebase Storage, gère le resize si image,
   * et renvoie progress$ + downloadUrl$ + la tâche.
   */
  startUpload(file: File, fileType: string, dir = 'songs'): UploadResult {
    const safeName = file.name.replace(/\s+/g, '_');
    const filePath = `${dir}/${Date.now()}_${safeName}`;
    const fileRef = this.storage.ref(filePath);

    // Détermine la source d’upload (image redimensionnée ou fichier brut)
    const source$ = file.type.startsWith('image/')
      ? this.resizeImage$(file)
      : of(file);

    // On instancie la tâche une seule fois et on partage les streams
    let task!: AngularFireUploadTask;

    const progress$ = new Observable<number>((subscriber) => {
      const sub = source$.subscribe({
        next: (payload) => {
          task = this.storage.upload(filePath, payload);
          task.percentageChanges()
            ?.pipe(map(p => +(Number(p ?? 0).toFixed(2))))
            .subscribe(subscriber);
        },
        error: (e) => subscriber.error(e),
      });
      return () => sub.unsubscribe();
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

    const downloadUrl$ = new Observable<string>((subscriber) => {
      const sub = source$.subscribe({
        next: (payload) => {
          task = this.storage.upload(filePath, payload);
          task.snapshotChanges().pipe(
            last(),
            switchMap(() => fileRef.getDownloadURL()),
          ).subscribe(subscriber);
        },
        error: (e) => subscriber.error(e),
      });
      return () => sub.unsubscribe();
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

    return { task, progress$, downloadUrl$ };
  }
}