// Angular
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { TogglerService } from './../../../core/services/design/toggler.service';
import { ThemeService } from './../../../core/services/design/theme.service';

// Constant classes
import { Constant } from './../../../core/constants/constant';
import {AuthenticationService} from "../../../core/services/global/authentication.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {


  isAuthenticated: boolean = false;

  // Holds navbar object
  navbar: any;

  // Active class name
  active = Constant.ACTIVE;

  // Flag for set attribute
  toggled: boolean = false;

  // Sidebar element reference
  @ViewChild('sidebar') sidebar: ElementRef<any> | undefined;

  // Sidebar theme subscription
  sidebarSubscription: Subscription | undefined;

  constructor(
    private togglerService: TogglerService,
    private themeService: ThemeService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.sidebarSubscription = this.themeService.sidebar.subscribe((color) => {
      this.sidebar?.nativeElement.setAttribute(Constant.SIDEBAR, color);
    });
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated
      if(!isAuthenticated){
        // @ts-ignore
        this.navbar = Constant.navbar.filter(obj => !obj.auth);
      }else{
        this.navbar = Constant.navbar;
      }
    });
  }

  ngOnDestroy(): void {
    this.sidebarSubscription?.unsubscribe();
  }

  /**
   * Sidebar toggler click event
   */
  toggler(): void {
    this.togglerService.toggler();
  }



  /**
   * Set nav link inner HTML
   * @param obj
   * @returns {string}
   */
  navLinkHTML(obj: any): string {
      return obj.icon + '<span class="ms-3">' + obj.name + '</span>';
  }
}
