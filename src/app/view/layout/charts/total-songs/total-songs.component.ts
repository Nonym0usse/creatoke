// Angular
import { Component, OnInit } from '@angular/core';

// Chart.js
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

// Constant classes
import { Utils } from './../../../../core/utils/utils';


@Component({
  selector: 'app-total-songs',
  templateUrl: './total-songs.component.html'
})
export class TotalSongsComponent implements OnInit {

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
        label: 'Songs',
        data: [65, 59, 42, 73, 56, 55, 40],
        backgroundColor: Utils.getCSSVarValue('green'),
        hoverBackgroundColor: Utils.getCSSVarValue('green'),
        borderWidth: 0,
        borderColor: 'rgba(0,0,0, 0)',
        barThickness: 16,
        pointRadius: 0
      }]
    };
  }

}
