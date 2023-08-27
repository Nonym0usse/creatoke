// Angular
import { Component, ElementRef, HostBinding, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Constant classes
import { Constant } from '../../../core/constants/constant';
import { SearchService } from 'src/app/core/services/api/search.service';
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  // Component classes
  @HostBinding('class') classes = 'flex-fill';
  searchTerm: string = '';
  results: any[] = [];
  searchTermChanged = new Subject<string>();

  songs: any = []
  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private searchService: SearchService
  ) { }


  ngOnInit() {
    this.searchTermChanged.pipe(
      debounceTime(1000), // Adjust the debounce time in milliseconds
      distinctUntilChanged(), // Ensure that the search term has changed
      switchMap(newSearchTerm => this.searchService.searchSong(newSearchTerm.toUpperCase()))
    ).subscribe(
      (response) => {
        console.log(response.data)
        this.results = response.data;
      },
      (error) => {
        console.error('Search error:', error);
      }
    );
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

  onSearchTermChange(event: any) {
    document.body.setAttribute(Constant.SEARCH_RESULTS, 'true');
    const newValue = event.target.value;
    this.searchTermChanged.next(newValue);
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

