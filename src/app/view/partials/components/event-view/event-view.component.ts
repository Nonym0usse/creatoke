// Angular
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AuthenticationService } from './../../../../core/services/global/authentication.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html'
})
export class EventViewComponent {

  // Holds data to view
  @Input() data: any;

  // Flag for user login
  isUser: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  /**
   * Join event button click event
   */
  joinEvent(): void {
    const route = [this.isUser ? '/app/event/' + this.data.id + '/details' : '/login'];
    this.router.navigate(route);
  }

}
