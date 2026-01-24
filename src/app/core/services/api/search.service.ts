// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { Observable } from 'rxjs';
import { ApiConstant } from '../../constants/api-constant';
import {InterceptorService} from "../global/interceptor.service";


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private axiosInterceptorService: InterceptorService
  ) { }

  //@ts-ignore
  searchSong(term: string): Observable<any> {
    if(term !== ""){
      //@ts-ignore
      return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + `/admin/searching/${term}`);
    }
  }

  previewSongs(limit): Promise<any> {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/admin/preview-searching/' + limit);
  }
}
