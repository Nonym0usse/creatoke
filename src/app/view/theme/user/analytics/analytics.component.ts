// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Chart.js
import { Chart } from 'chart.js';

// Services
import { ThemeService } from '../../../../core/services/design/theme.service';

// Constant classes
import { Constant } from '../../../../core/constants/constant';
import { Utils } from '../../../../core/utils/utils';
import {PaypalService} from "../../../../core/services/api/paypal.service";
import {CategoryService} from "../../../../core/services/api/category.service";


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  // Holds referral data
  referrals: any = [];

  turnover: any;
  picturebackground: any;

  // Theme subscription
  themeSubscription: Subscription | undefined;

  constructor(
    private themeService: ThemeService,
    private sellingService: PaypalService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.sellingService.listSales().then((data) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      this.turnover = this.sumPricesForCurrentYear(data.data, currentYear);
    })
    this.themeSubscription = this.themeService.themeMode.subscribe((value) => {
      this.overrideChartDefaults();
    });
    this.getBackground();
    // this.overrideChartDefaults();
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  /**
   * Override chart default object
   */
  overrideChartDefaults(): void {
    const defaults = Chart.defaults;

    // Chart defaults config settings
    const config = {
      color: Constant.DARK_MODE ? '#92929F' : Utils.getCSSVarValue('body-color'),
      borderColor: Constant.DARK_MODE ? '#34343e' : '#EFF2F5',

      // Chart typo
      font: {
        family: Utils.getCSSVarValue('body-font-family'),
        size: 13
      },

      // Chart hover settings
      hover: {
        intersect: false,
        mode: 'index'
      }
    };

    // Chart tooltip settings
    const tooltip = {
      titleMarginBottom: 6,
      caretSize: 6,
      caretPadding: 10,
      boxWidth: 10,
      boxHeight: 10,
      boxPadding: 4,
      intersect: false,
      mode: 'index',

      padding: {
        top: 8,
        right: 12,
        bottom: 8,
        left: 12
      }
    }

    // Override Chart js defaults object
    Object.assign(defaults, config);
    Object.assign(defaults.plugins.tooltip, tooltip);
  }

   sumPricesForCurrentYear(array, currentYear) {
    let sum = 0;

    for (const item of array) {
      if (item.year === currentYear) {
        sum += item.price;
      }
    }

    return sum.toFixed(2);
  }
  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }
}
