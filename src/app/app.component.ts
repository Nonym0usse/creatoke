// Angular
import { AfterViewInit, Component } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { LoaderService } from './core/services/design/loader.service';
import { SeoService } from './core/services/global/seo.service';

// Constant classes
import { Constant } from './core/constants/constant';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  constant = Constant;
  // Theme subscription
  themeSubscription: Subscription | undefined;

  constructor(
    private loaderService: LoaderService,
    seoService: SeoService
  ) { 
    this.loaderService.startLoading();
    seoService.init();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loaderService.stopLoading();
    }, 200);
  }
  
}
