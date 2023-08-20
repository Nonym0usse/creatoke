import { Injectable } from '@angular/core';
import axios from "axios";
import {ApiConstant} from "../../constants/api-constant";
import {AuthenticationService} from "../global/authentication.service";
import {InterceptorService} from "../global/interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  firebaseToken = "";

  constructor(private authenticationService: AuthenticationService, private axiosInterceptorService: InterceptorService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
    });
  }

  createComment(data) {
    return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/comment/create', data)
  }

  listComment(id){
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/comment/list/' + id)
  }

  getAllComments(){
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/comment/list-all/')
  }

  deleteComment(id){
    return this.axiosInterceptorService.getAxiosInstance().delete(ApiConstant.API + '/comment/delete/' + id, {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }
}
