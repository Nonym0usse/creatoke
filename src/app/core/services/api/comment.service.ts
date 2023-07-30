import { Injectable } from '@angular/core';
import axios from "axios";
import {ApiConstant} from "../../constants/api-constant";
import {AuthenticationService} from "../global/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  firebaseToken = "";

  constructor(private authenticationService: AuthenticationService) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
    });
  }

  createComment(data) {
    return axios.post(ApiConstant.API + '/comment/create', data)
  }

  listComment(id){
    return axios.get(ApiConstant.API + '/comment/list/' + id)
  }

  getAllComments(){
    return axios.get(ApiConstant.API + '/comment/list-all/')
  }

  deleteComment(id){
    return axios.delete(ApiConstant.API + '/comment/delete/' + id, {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }
}
