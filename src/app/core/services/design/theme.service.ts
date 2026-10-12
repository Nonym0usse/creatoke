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

  // Mode clair (feuille theme-light.css chargée par-dessus la feuille sombre)
  private light$ = new BehaviorSubject<boolean>(
    document.documentElement.getAttribute('data-mode') === 'light'
  );

  constructor() { }

  /**
   * L'hébergeur met les CSS en cache un an : on reprend le code de version de la
   * feuille principale (styles.<code>.css), qui change à chaque mise à jour.
   */
  private cacheBuster(): string {
    const main = document.querySelector('link[href^="styles."]')?.getAttribute('href') ?? '';
    const code = main.match(/^styles\.([^.]+)\.css/)?.[1];
    return code ? `?v=${code}` : '';
  }

  get lightMode() {
    return this.light$;
  }

  /** Passe en mode clair ou sombre, et retient le choix sur cet appareil. */
  setLightMode(light: boolean): void {
    const root = document.documentElement;
    let link = document.getElementById('theme-light') as HTMLLinkElement | null;
    if (light) {
      root.setAttribute('data-mode', 'light');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'theme-light';
        link.href = Constant.LIGHT_STYLESHEET + this.cacheBuster();
        document.head.appendChild(link);
      }
    } else {
      root.removeAttribute('data-mode');
      link?.remove();
    }
    try {
      localStorage.setItem(Constant.COLOR_MODE_KEY, light ? 'light' : 'dark');
    } catch {
      // stockage indisponible : le choix vaut pour cette visite seulement
    }
    this.light$.next(light);
  }

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
