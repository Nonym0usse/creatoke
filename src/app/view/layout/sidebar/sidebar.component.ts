// Angular
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { TogglerService } from './../../../core/services/design/toggler.service';
import { ThemeService } from './../../../core/services/design/theme.service';

// Constant classes
import { Constant } from './../../../core/constants/constant';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {

  // Holds navbar object
  navbar = Constant.navbar;

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
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.sidebarSubscription = this.themeService.sidebar.subscribe((color) => {
      this.sidebar?.nativeElement.setAttribute(Constant.SIDEBAR, color);
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
