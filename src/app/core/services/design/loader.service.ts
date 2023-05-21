// Angular
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // Flag for loading status
  private _loading: boolean = false;

  // Subject to get loading status
  loadingStatus: BehaviorSubject<boolean> = new BehaviorSubject(this._loading);

  constructor() { }

  /**
   * Get loading value
   */
  get loading() {
    return this._loading;
  }

  /**
   * Set loading value
   */
  set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
  }

  /**
   * Start loading
   */
  startLoading() {
    this.loading = true;
  }

  /**
   * End loading
   */
  stopLoading() {
    this.loading = false;
  }
}
