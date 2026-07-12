import { Injectable } from '@angular/core';
import { ApiConstant } from "../../constants/api-constant";
import { InterceptorService } from "../global/interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  constructor(private axiosInterceptorService: InterceptorService) { }

  private headers() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('firebaseToken') ?? ''}`
      }
    };
  }

  listProspects() {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/prospect/list', this.headers());
  }

  createProspect(data: any) {
    return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/prospect/create', data, this.headers());
  }

  updateProspect(data: any) {
    return this.axiosInterceptorService.getAxiosInstance().put(ApiConstant.API + '/prospect/update', data, this.headers());
  }

  deleteProspect(id: string) {
    return this.axiosInterceptorService.getAxiosInstance().delete(ApiConstant.API + '/prospect/delete/' + id, this.headers());
  }

  sendPresentation(id: string) {
    return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/prospect/send-presentation/' + id, {}, this.headers());
  }

  markReplied(id: string) {
    return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/prospect/mark-replied/' + id, {}, this.headers());
  }

  runSequence() {
    return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/prospect/run-sequence', {}, this.headers());
  }

  listTemplates() {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/prospect/templates', this.headers());
  }

  updateTemplate(key: string, data: { subject: string; body: string }) {
    return this.axiosInterceptorService.getAxiosInstance().put(ApiConstant.API + '/prospect/templates/' + key, data, this.headers());
  }

  resetTemplate(key: string) {
    return this.axiosInterceptorService.getAxiosInstance().delete(ApiConstant.API + '/prospect/templates/' + key, this.headers());
  }
}
