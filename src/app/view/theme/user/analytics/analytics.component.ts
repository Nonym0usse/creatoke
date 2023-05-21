// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Chart.js
import { Chart } from 'chart.js';

// Services
import { ThemeService } from './../../../../core/services/design/theme.service';

// Constant classes
import { Constant } from './../../../../core/constants/constant';
import { Utils } from './../../../../core/utils/utils';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  // Holds referral data
  referrals: any = [];

  // Theme subscription
  themeSubscription: Subscription | undefined;

  constructor(
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.themeMode.subscribe((value) => {
      this.overrideChartDefaults();
    });
    // this.overrideChartDefaults();
    this.getReferralsData();
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

  /**
   * Referral static data
   */
  getReferralsData(): void {
    this.referrals = [
      {
        name: 'Facebook',
        data: 3421,
        class: 'primary'
      },
      {
        name: 'Instagram',
        data: 2401,
        class: 'danger'
      },
      {
        name: 'Twitter',
        data: 975,
        class: 'info'
      },
      {
        name: 'Affiliates',
        data: 1672,
        class: 'success'
      }
    ];

    // Find percentage
    let total = 0;
    Array.from(this.referrals).forEach((referral: any) => {
      total += referral.data;
    });    
    Array.from(this.referrals).forEach((referral: any) => {
      referral.percentage = Math.round(referral.data/total * 100);
    });
  }

}
