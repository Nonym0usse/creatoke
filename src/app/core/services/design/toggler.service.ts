// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { Constant } from '../../constants/constant';


@Injectable({
  providedIn: 'root'
})
export class TogglerService {

  // Flag for set attribute
  toggled: boolean = false;

  constructor() { }

  /**
   * Sidebar toggler click event
   */
   toggler(): void {
    const _toggler = document.getElementsByClassName('sidebar-toggler');
    const _body = document.body;

    this.toggled = !this.toggled;

    Array.from(_toggler).forEach(el => {
      el.classList.toggle(Constant.ACTIVE);
    });
    this.toggled ? _body.setAttribute(Constant.SIDEBAR_TOGGLE, 'true') : _body.removeAttribute(Constant.SIDEBAR_TOGGLE);
  }

  /**
   * Ferme le menu ouvert sur mobile (après un changement de page).
   * Sur ordinateur, « toggled » veut dire menu réduit : on n'y touche pas.
   */
  closeOnMobile(): void {
    if (this.toggled && window.innerWidth < 992) this.toggler();
  }
}
