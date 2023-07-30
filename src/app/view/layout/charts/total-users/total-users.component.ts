// Angular
import { Component, OnInit } from '@angular/core';

// Chart.js
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { color } from 'chart.js/helpers/helpers.mjs';

// Constant classes
import { Utils } from './../../../../core/utils/utils';
import {PaypalService} from "../../../../core/services/api/paypal.service";


@Component({
  selector: 'app-total-users',
  templateUrl: './total-users.component.html'
})
export class TotalUsersComponent implements OnInit {

  // Holds chart type
  chartType: ChartType = 'line';
  nbUsr: any = [];
  // Chart config object
  chartData: ChartConfiguration<ChartType>['data'] = {
    datasets: []
  };

  // Chart options object
  chartOptions: ChartOptions<ChartType> = {};

  // Flag for chart legend
  chartLegend: boolean = false;

  constructor(private sellingService: PaypalService) {
  }

  ngOnInit(): void {
    this.chartOptionsConfig();
    this.chartDataConfig();
    this.sellingService.listSales().then((data) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      this.nbUsr = this.countObjectsByMonth(data.data)
      this.chartDataConfig();
    })
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
      labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Jui', 'Août', 'Sep', 'Nov', 'Déc'],
      datasets: [{
        label: 'Utilisateurs',
        data: this.nbUsr,
        backgroundColor: Utils.getCSSVarValue('purple'),
        borderColor: Utils.getCSSVarValue('purple'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 12,
        pointBackgroundColor: color(Utils.getCSSVarValue('purple')).alpha(0).rgbString(),
        pointBorderColor: color(Utils.getCSSVarValue('purple')).alpha(0).rgbString(),
        pointHoverBackgroundColor: Utils.getCSSVarValue('purple'),
        pointHoverBorderColor: color(Utils.getCSSVarValue('purple')).alpha(0.1).rgbString(),
      }]
    };
  }

   countObjectsByMonth(array) {
    const currentYear = new Date().getFullYear();
    const monthCounts = Array(12).fill(0);

    for (const item of array) {
      const { year, month } = item;
      if (year === currentYear && month >= 1 && month <= 12) {
        monthCounts[month - 1]++;
      }
    }

    return monthCounts;
  }

}
