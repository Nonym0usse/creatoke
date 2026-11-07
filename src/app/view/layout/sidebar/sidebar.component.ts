// Angular
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

// Services
import { TogglerService } from './../../../core/services/design/toggler.service';
import { ThemeService } from './../../../core/services/design/theme.service';
import { Section, SectionService } from './../../../core/services/api/section.service';
import { AuthenticationService } from './../../../core/services/global/authentication.service';

// Constant classes
import { Constant } from './../../../core/constants/constant';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {


  // Navigation publique (l'administration est dans le menu du compte, en haut à droite)
  navbar: any[] = Constant.navbar;
  legalLinks = Constant.legalLinks;

  // Active class name
  active = Constant.ACTIVE;

  // Flag for set attribute
  toggled: boolean = false;

  // Sidebar element reference
  @ViewChild('sidebar') sidebar: ElementRef<any> | undefined;

  // Sidebar theme subscription
  sidebarSubscription: Subscription | undefined;
  private sectionsSubscription: Subscription | undefined;
  private authSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;

  // Administrateur connecté : affiche les liens réservés (adminOnly)
  isAdmin = false;

  constructor(
    private togglerService: TogglerService,
    private themeService: ThemeService,
    private sectionService: SectionService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sidebarSubscription = this.themeService.sidebar.subscribe((color) => {
      this.sidebar?.nativeElement.setAttribute(Constant.SIDEBAR, color);
    });
    this.sectionsSubscription = this.sectionService.sections$.subscribe((sections) => {
      this.navbar = this.withSections(sections);
    });
    this.authSubscription = this.authenticationService.isAuthenticated().subscribe((isAuth) => this.isAdmin = isAuth);
    // Mobile : le menu se ferme dès qu'on change de page
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.togglerService.closeOnMobile());
  }

  /** Menu public : les rubriques du catalogue s'insèrent après l'intitulé « Catalogue ». */
  private withSections(sections: Section[]): any[] {
    // Le nom et l'icône viennent de l'API : échappés avant d'entrer dans le HTML du lien.
    const escape = (value: string) =>
      value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const items = sections.map((s) => ({
      name: escape(s.label),
      icon: `<i class="${escape(s.icon)} fs-5"></i>`,
      link: `/song/${s.slug}`,
    }));
    const at = Constant.navbar.findIndex((n: any) => n.head === 'Catalogue') + 1;
    return [...Constant.navbar.slice(0, at), ...items, ...Constant.navbar.slice(at)];
  }

  ngOnDestroy(): void {
    this.sidebarSubscription?.unsubscribe();
    this.sectionsSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Sidebar toggler click event
   */
  toggler(): void {
    this.togglerService.toggler();
  }

  /** Mobile : ferme le menu au clic sur un lien (même celui de la page déjà ouverte) */
  closeOnMobile(): void {
    this.togglerService.closeOnMobile();
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
