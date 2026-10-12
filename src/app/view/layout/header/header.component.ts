// Angular
import { AfterViewInit, Component, Input, OnInit, ElementRef, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { TogglerService } from './../../../core/services/design/toggler.service';
import { AuthenticationService } from './../../../core/services/global/authentication.service';
import { ThemeService } from './../../../core/services/design/theme.service';

// Constant classes
import { Constant } from './../../../core/constants/constant';
import { ApiConstant } from './../../../core/constants/api-constant';


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

  // Email de l'admin connecté (affiché dans le menu du compte)
  userEmail = '';
  // Photo de profil indisponible : on affiche l'initiale à la place
  imgError = false;
  // Liens d'administration, regroupés par rubrique
  adminMenu = Constant.adminMenu;

  // Holds brand object
  brand = Constant.BRAND;

  active = Constant.ACTIVE;
  imgProfile = "";
  // Header theme subscription
  headerSubscription: Subscription | undefined;

  // Mode clair / sombre choisi par le visiteur
  readonly lightMode$ = this.themeService.lightMode;

  constructor(
    private togglerService: TogglerService,
    private authenticationService: AuthenticationService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated
      this.imgProfile = ApiConstant.API + "/uploads/users/admin/IMG_8469.JPG"
    });
    this.authenticationService.getCurrentUser().subscribe((user) => {
      this.userEmail = user?.email ?? '';
    });

    // Timeout for header color subscription.
    setTimeout(() => {
      this.headerSubscription = this.themeService.header.subscribe((color) => {
        this.header?.nativeElement.setAttribute(Constant.HEADER, color);
      });
    }, 1);
  }

  toggleColorMode(): void {
    this.themeService.setLightMode(!this.themeService.lightMode.value);
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
