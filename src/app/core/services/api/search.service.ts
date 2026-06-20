// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import {InterceptorService} from "../global/interceptor.service";


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private axiosInterceptorService: InterceptorService
  ) { }

  searchSong(term: string): Promise<any> {
    if (term !== "") {
      return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + `/admin/searching/${term}`);
    }
    return Promise.resolve({ data: [] });
  }

  previewSongs(limit: number): Promise<any> {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/admin/preview-searching/' + limit);
  }
}
