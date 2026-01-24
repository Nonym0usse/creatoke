// Angular
import { AfterViewInit, Component, Input, OnInit, ElementRef, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
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
  isAuthenticated: boolean = false;
  // Header element reference
  @ViewChild('header') header: ElementRef<any> | undefined;

  // Holds login user object
  user: any;

  // Holds brand object
  brand = Constant.BRAND;

  active = Constant.ACTIVE;
  imgProfile = "";
  // Header theme subscription
  headerSubscription: Subscription | undefined;

  constructor(
    private togglerService: TogglerService,
    private authenticationService: AuthenticationService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated
      this.imgProfile = "https://firebasestorage.googleapis.com/v0/b/creatoke-a8611.appspot.com/o/users%2Fadmin%2FIMG_8469.JPG?alt=media&token=93738ee8-b4de-4910-bd0f-4135ac195f12"
      this.user = this.authenticationService.getCurrentUser();
    });

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
    this.authenticationService.logOut();
  }

}
