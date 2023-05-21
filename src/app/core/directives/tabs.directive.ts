// Angular
import { Directive, ElementRef, OnInit } from '@angular/core';


@Directive({
  selector: '[appTabs]'
})
export class TabsDirective implements OnInit {

  // Holds tabs
  tabs: any;

  // Holds line element
  line: any;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.initTab();
  }

  /**
   * Initialize tab
   */
  initTab(): void {
    this.tabs = this.elementRef.nativeElement;
    this.line = document.createElement('span');
    this.line.className = 'mat-tabs__line';
    this.tabs.appendChild(this.line);
    this.setLinePosition();
    
    // Change position on tab click
    const links = this.tabs.querySelectorAll('button[data-bs-toggle="tab"]');
    Array.from(links).forEach((link: any) => {
      link.addEventListener('shown.bs.tab', (event: any) => {
        this.setLinePosition();
      });
    });
  }

  /**
   * Set line position of the active tab
   */
  setLinePosition(): void {
    const activeTab = this.tabs.querySelector('.nav-link.active');
    this.line.style.left = activeTab.offsetLeft + 'px';
    this.line.style.width = activeTab.clientWidth + 'px';
  }

}
