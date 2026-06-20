// Angular
import { AfterViewInit, Component } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { LoaderService } from './core/services/design/loader.service';

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
    private loaderService: LoaderService
  ) { 
    this.loaderService.startLoading();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loaderService.stopLoading();
    }, 200);
  }
  
}
