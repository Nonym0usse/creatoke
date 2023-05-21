// Angular
import { Component, OnInit } from '@angular/core';

// Chart.js
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { color } from 'chart.js/helpers/helpers.mjs';


@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html'
})
export class PurchasesComponent implements OnInit {

  // Holds chart type
  chartType: ChartType = 'line';

  // Chart config object
  chartData: ChartConfiguration<ChartType>['data'] = {
    datasets: []
  };

  // Chart options object
  chartOptions: ChartOptions<ChartType> = {};

  // Flag for chart legend
  chartLegend: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.chartOptionsConfig();
    this.chartDataConfig();
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
        x: { display: false },
        y: {
          display: false,
          min: 0,
          max: 85
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
        label: 'Purchases',
        data: [65, 59, 42, 73, 56, 55, 40],
        backgroundColor: 'transparent',
        borderColor: '#000000',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 12,
        pointBackgroundColor: color('#000000').alpha(0).rgbString(),
        pointBorderColor: color('#000000').alpha(0).rgbString(),
        pointHoverBackgroundColor: '#000000',
        pointHoverBorderColor: color('#000000').alpha(0.1).rgbString()
      }]
    };
  }

}
