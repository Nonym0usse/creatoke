// Angular
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

// Services
import { ThemeService } from './../../../core/services/design/theme.service';

// Constant classes
import { Constant } from './../../../core/constants/constant';
import { Utils } from './../../../core/utils/utils';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  // Holds constant class
  constant = Constant;

  // Settings element reference
  @ViewChild('settings') settings: ElementRef<any> | undefined;

  // Theme options
  theme = ['light', 'dark'];

  // Color options
  colors = ['yellow', 'orange', 'red', 'green', 'blue', 'purple', 'indigo', 'dark'];

  // Holds options to view
  options: any = [];

  constructor(
    private elementRef: ElementRef,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.configOptions();
  }

  /**
   * Document click event
   * @param event 
   */
  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if(!this.elementRef.nativeElement.contains(event.target)) {
      Utils.removeClass(this.settings?.nativeElement, Constant.SHOW);
    }
  }

  /**
   * Get option object from name
   * @param name 
   * @returns {object}
   */
  getOption(name: string): object {
    return this.options.find((option: { name: string; }) => option.name === name);
  }

  /**
   * Configure options to view
   */
  configOptions(): void {
    this.options = [
      {
        title: 'Theme',
        name: 'theme',
        colors: this.theme,
        active: 'light'
      },
      {
        title: 'Header',
        name: 'header',
        colors: this.colors,
        active: Constant.HEADER_THEME
      },
      {
        title: 'Sidebar',
        name: 'sidebar',
        colors: this.colors,
        active: Constant.SIDEBAR_THEME
      },
      {
        title: 'Player',
        name: 'player',
        colors: this.colors,
        active: Constant.PLAYER_THEME
      },
    ];
  }

  /**
   * Change component theme
   * @param name 
   * @param option 
   */
  changeTheme(name: string, option: string): void {
    switch(name) {
      case 'theme':
        option === 'dark' ? this.themeService.theme = true : this.themeService.theme = false;
        break;
      case 'header':
        this.themeService.headerTheme = option;
        break;
      case 'sidebar':
        this.themeService.sidebarTheme = option;
        break;
      case 'player':
        this.themeService.playerTheme = option;
        break;
    }

    const obj = this.getOption(name);
    obj['active'] = option;
  }

  /**
   * Show settings view on click
   */
  showSettings(): void {
    Utils.addClass(this.settings?.nativeElement, Constant.SHOW);
  }

}
