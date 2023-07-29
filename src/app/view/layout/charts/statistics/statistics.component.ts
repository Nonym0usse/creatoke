// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Chart.js
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

// Services
import { ThemeService } from './../../../../core/services/design/theme.service';

// Constant classes
import { Constant } from './../../../../core/constants/constant';
import { Utils } from './../../../../core/utils/utils';
import {PaypalService} from "../../../../core/services/api/paypal.service";


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnInit, OnDestroy {

  // Holds chart type
  chartType: ChartType = 'bar';
  turnover: any = [];

  // Chart config object
  chartData: ChartConfiguration<ChartType>['data'] = {
    datasets: []
  };

  // Chart options object
  chartOptions: ChartOptions<ChartType> = {};

  // Flag for chart legend
  chartLegend: boolean = false;

  // Holds country data
  topCountries: any = [];

  // Theme subscription
  themeSubscription: Subscription | undefined;

  constructor(
    private themeService: ThemeService,
    private sellingService: PaypalService
  ) {
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.themeMode.subscribe((value) => {
      this.chartOptionsConfig();
    });
    this.sellingService.listSales().then((data) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      this.turnover = this.calculateMonthlySelling(data.data, currentYear)
      this.chartDataConfig();
    })
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  /**
   * Configuration for chart option
   */
  chartOptionsConfig(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {tension: 0.4}
      },
      scales: {
        x: {
          grid: {
            borderColor: Constant.DARK_MODE ? '#34343e' : '#EFF2F5'
          }
        },
        y: {
          min: 0,
          max: 80,
          grid: {
            borderColor: Constant.DARK_MODE ? '#34343e' : '#EFF2F5'
          }
        }
      },
      layout: {
        padding: 0
      },
      plugins: {
        legend: {display: false}
      }
    };
  }

  /**
   * Configuration for chart data
   */
  chartDataConfig(): void {
    this.chartData = {
      labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Jui', 'Août', 'Sep', 'Nov', 'Déc'],
      datasets: [{
        label: 'C.A',
        data: this.turnover,
        backgroundColor: Utils.getCSSVarValue('purple'),
        hoverBackgroundColor: Utils.getCSSVarValue('purple'),
        borderWidth: 0,
        borderColor: 'rgba(0,0,0, 0)',
        barThickness: 32,
        pointRadius: 0
      }]
    };
  }


  calculateMonthlySelling(data, currentYear) {
    const monthlySelling = new Array(12).fill(0); // Initialize the array with zeros for each month.

    for (const item of data) {
      if (item.year === currentYear) {
        const monthIndex = item.month - 1; // Convert month (1 to 12) to array index (0 to 11)
        monthlySelling[monthIndex] += item.price;
      }
    }

    return monthlySelling;
  }
}
