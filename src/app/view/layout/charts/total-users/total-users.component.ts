// Angular
import { Component, OnInit } from '@angular/core';

// Chart.js
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { color } from 'chart.js/helpers/helpers.mjs';

// Constant classes
import { Utils } from './../../../../core/utils/utils';


@Component({
  selector: 'app-total-users',
  templateUrl: './total-users.component.html'
})
export class TotalUsersComponent implements OnInit {

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
        label: 'Users',
        data: [65, 59, 42, 73, 56, 55, 40],
        backgroundColor: Utils.getCSSVarValue('red'),
        borderColor: Utils.getCSSVarValue('red'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 12,
        pointBackgroundColor: color(Utils.getCSSVarValue('red')).alpha(0).rgbString(),
        pointBorderColor: color(Utils.getCSSVarValue('red')).alpha(0).rgbString(),
        pointHoverBackgroundColor: Utils.getCSSVarValue('red'),
        pointHoverBorderColor: color(Utils.getCSSVarValue('red')).alpha(0.1).rgbString(),
      }]
    };
  }

}
