// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { PlanService } from './../../../core/services/api/plan.service';
import { AuthenticationService } from './../../../core/services/global/authentication.service';

// Constant classes
import { HttpStatus } from './../../../core/constants/http-status';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html'
})
export class PricingComponent implements OnInit {

  // Holds plan data
  plans: any = [];

  // Flag for user login
  isUser: boolean = false;

  constructor(
    private planService: PlanService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getPlans();
    this.isUser = this.authenticationService.isUser;
  }

  /**
   * Get plan data from default json.
   */
   getPlans(): void {
    this.planService.getPlans().subscribe(response => {
      if (response && response.code === HttpStatus.SUCCESSFUL) {
        this.plans = response.data;
      }
    });
  }

}
