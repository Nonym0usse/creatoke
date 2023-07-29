import { Injectable } from '@angular/core';
import axios from "axios";
import {ApiConstant} from "../../constants/api-constant";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor() { }

  createComment(data) {
    return axios.post(ApiConstant.API + '/comment/create', data);
  }

  listComment(id){
    return axios.get(ApiConstant.API + '/comment/list/' + id)
  }

  getAllComments(){
    return axios.get(ApiConstant.API + '/comment/list-all/')
  }

  deleteComment(id){
    return axios.delete(ApiConstant.API + '/comment/delete/' + id);
  }
}
