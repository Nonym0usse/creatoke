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


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnInit, OnDestroy {

  // Holds chart type
  chartType: ChartType = 'bar';

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
    private themeService: ThemeService
  ) {
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.themeMode.subscribe((value) => {
      this.chartOptionsConfig(); 
    });
    
    this.chartDataConfig();
    this.getTopCountries();
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
        line: { tension: 0.4 }
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
        legend: { display: false }
      }
    };
  }
  
  /**
   * Configuration for chart data
   */
  chartDataConfig(): void {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Statistics',
        data: [65, 59, 42, 73, 56, 55, 40],
        backgroundColor: Utils.getCSSVarValue('purple'),
        hoverBackgroundColor: Utils.getCSSVarValue('purple'),
        borderWidth: 0,
        borderColor: 'rgba(0,0,0, 0)',
        barThickness: 32,
        pointRadius: 0
      }]
    };
  }

  /**
   * Get static country data
   */
  getTopCountries(): void {
    this.topCountries = [
      {
        name: 'USA',
        data: '1,243'
      },
      {
        name: 'UK',
        data: '643'
      },
      {
        name: 'Canada',
        data: '351'
      }
    ];
  }

}
