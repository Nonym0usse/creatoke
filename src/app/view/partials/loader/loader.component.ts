// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { LoaderService } from './../../../core/services/design/loader.service';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit, OnDestroy {

  // Flag for view loader
  loading: boolean = false;
  
  // Holds loading subscription
  loadingSubscription: Subscription | undefined;

  constructor(
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loadingSubscription = this.loaderService.loadingStatus.subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

}
