// src/app/core/utils/upload.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { finalize, map, shareReplay, switchMap } from 'rxjs/operators';

import { ApiConstant } from '../constants/api-constant';
import { InterceptorService } from '../services/global/interceptor.service';

export type UploadDir = 'songs' | 'background' | 'category' | 'users';

export interface UploadedFile {
  /** URL publique du fichier sur le serveur */
  url: string;
  /** Nom du fichier tel qu'enregistré sur le serveur */
  fileName: string;
}

export interface UploadResult {
  /** Progression en % (0–100) arrondie à 2 décimales */
  progress$: Observable<number>;
  /** URL de téléchargement quand c’est fini */
  downloadUrl$: Observable<string>;
  /** URL + nom du fichier enregistré quand c’est fini */
  result$: Observable<UploadedFile>;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private interceptor: InterceptorService) {}

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
   * Envoie le fichier à l'API (stockage sur le serveur), redimensionne les
   * images si demandé, et renvoie progress$ + downloadUrl$ + result$.
   * L'envoi démarre à la première souscription à downloadUrl$ ou result$.
   */
  startUpload(file: File, _fileType: string, dir: UploadDir = 'songs', options: { resizeImages?: boolean } = {}): UploadResult {
    const resize = (options.resizeImages ?? true) && file.type.startsWith('image/');
    const source$: Observable<Blob> = resize ? this.resizeImage$(file) : of(file);
    const progress = new BehaviorSubject<number>(0);

    const result$ = source$.pipe(
      switchMap((payload) => {
        const formData = new FormData();
        formData.append('file', payload, file.name);
        return from(
          this.interceptor.getAxiosInstance().post<UploadedFile>(`${ApiConstant.API}/upload/${dir}`, formData, {
            onUploadProgress: (e) => {
              if (e.total) progress.next(+((e.loaded / e.total) * 100).toFixed(2));
            },
          }),
        );
      }),
      map((res) => res.data),
      finalize(() => progress.complete()),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return {
      progress$: progress.asObservable(),
      downloadUrl$: result$.pipe(map((r) => r.url)),
      result$,
    };
  }
}
