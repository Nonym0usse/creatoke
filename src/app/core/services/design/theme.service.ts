// Angular
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Constant classes
import { Constant } from '../../constants/constant';
import { Utils } from '../../utils/utils';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // DOM object
  doc = Utils.doc;

  // Theme observer
  private theme$ = new BehaviorSubject<boolean>(Constant.DARK_MODE);

  // Header theme observer
  private header$ = new BehaviorSubject<string>(Constant.HEADER_THEME);

  // Sidebar theme observer
  private sidebar$ = new BehaviorSubject<string>(Constant.HEADER_THEME);

  // Player theme observer
  private player$ = new BehaviorSubject<string>(Constant.HEADER_THEME);

  constructor() { }

  /**
   * Emit theme
   */
  set theme(darkMode: boolean) {
    const body = this.doc.querySelector('body');
    darkMode ? body?.setAttribute(Constant.THEME_DARK, 'dark') : body?.removeAttribute(Constant.THEME_DARK);
    
    Constant.DARK_MODE = darkMode;
    this.theme$.next(darkMode);
  }

  get themeMode() {
    return this.theme$;
  }

  /**
   * Emit header theme
   */
  set headerTheme(color: string) {
    this.header$.next(color);
  }

  get header() {
    return this.header$;
  }

  /**
   * Emit sidebar theme
   */
  set sidebarTheme(color: string) {
    this.sidebar$.next(color);
  }

  get sidebar() {
    return this.sidebar$;
  }

  /**
   * Emit player theme
   */
  set playerTheme(color: string) {
    this.player$.next(color);
  }

  get player() {
    return this.player$;
  }
  
}
