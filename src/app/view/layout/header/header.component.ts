// Angular
import { AfterViewInit, Component, Input, OnInit, ElementRef, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { LoginService } from './../../../core/services/api/login.service';
import { TogglerService } from './../../../core/services/design/toggler.service';
import { AuthenticationService } from './../../../core/services/global/authentication.service';
import { ThemeService } from './../../../core/services/design/theme.service';

// Constant classes
import { Constant } from './../../../core/constants/constant';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  // Input for header views
  @Input() headerView: any;

  // Header template views
  @ViewChild('landingHeader') landingHeader: TemplateRef<any> | undefined;
  @ViewChild('appHeader') appHeader: TemplateRef<any> | undefined;

  headerTemplate: TemplateRef<any> | undefined;

  // Header element reference
  @ViewChild('header') header: ElementRef<any> | undefined;

  // Holds login user object
  user: any;

  // Holds brand object
  brand = Constant.BRAND;

  // Holds header menu
  menu = Constant.menu;

  // Holds user options data
  options = Constant.options;

  // Holds languages data
  languages = Constant.languages;

  // Active class name
  active = Constant.ACTIVE;

  // Header theme subscription
  headerSubscription: Subscription | undefined;

  constructor(
    private loginService: LoginService,
    private togglerService: TogglerService,
    private authenticationService: AuthenticationService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.isUser) {
      this.user = this.authenticationService.user;
    }

    // Timeout for header color subscription.
    setTimeout(() => {
      this.headerSubscription = this.themeService.header.subscribe((color) => {
        this.header?.nativeElement.setAttribute(Constant.HEADER, color);
      });
    }, 1);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setHeaderView();
    }, 0);    
  }

  ngOnDestroy(): void {
    this.headerSubscription?.unsubscribe();
  }

  /**
   * Set header view according parent input.
   */
  setHeaderView(): void {
    switch (this.headerView) {
      case Constant?.HEADER_VIEW?.landing:
        this.headerTemplate = this.landingHeader;
        break;
      case Constant?.HEADER_VIEW?.app:
        this.headerTemplate = this.appHeader;
        break;
      default:
        this.headerTemplate = this.landingHeader;
        break;
    }
  }

  /**
   * Sidebar toggler click event
   */
  toggler(): void {
    this.togglerService.toggler();
  }

  /**
   * Set user option link inner HTML
   * @param obj 
   * @returns {string}
   */
  userOptionLinkHTML(obj: any): string {
    return obj.icon + '<span class="ms-2">' + obj.name + '</span>';
  }

  /**
   * User logout
   */
  logout() {
    this.loginService.userLogout();
  }

}
