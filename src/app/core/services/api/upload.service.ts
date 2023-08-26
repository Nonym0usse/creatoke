import {Injectable} from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
    //      const ref = this.storage.ref(`songs/${id}/${file.name}`);
  constructor(private http: HttpClient) { }

    uploadFile(file: File): Observable<{ downloadUrl: string, percentage: number }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post('/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.trackProgress(event))
    );
  }

  private trackProgress(event: HttpEvent<any>): { downloadUrl: string, percentage: number } {
    if (event.type === HttpEventType.UploadProgress) {
        //@ts-ignore
      const percentage = Math.round((100 * event.loaded) / event.total);
        //@ts-ignore
      return { percentage, downloadUrl: null };
    } else if (event.type === HttpEventType.Response) {
      const downloadUrl = event.body.downloadUrl;
      return { percentage: 100, downloadUrl };
    }
        //@ts-ignore
    return { percentage: 0, downloadUrl: null };
  }
}
