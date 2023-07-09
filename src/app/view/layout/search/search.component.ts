// Angular
import { Component, ElementRef, HostBinding, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Constant classes
import { Constant } from './../../../core/constants/constant';
import { SearchService } from 'src/app/core/services/api/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  // Component classes
  @HostBinding('class') classes = 'flex-fill';

  songs: any = []
  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.searchService.previewSongs().then((data) => this.songs = data);
  }

  /**
   * Document click event
   * @param event 
   */
  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if(!this.elementRef.nativeElement.contains(event.target)) {
      this.hideSearchView();
    }
  }

  /**
   * Show search view on input click
   */
  showSearchView(): void {
    document.body.setAttribute(Constant.SEARCH_RESULTS, 'true');
  }

   /**
   * Hide search view
   */
  hideSearchView(): void {
    document.body.removeAttribute(Constant.SEARCH_RESULTS);
  }

  /**
   * Element click event for go to the page
   * @param route 
   */
  routeToPage(route: string): void {
    this.hideSearchView();
    this.router.navigate([route]);
  }

}
