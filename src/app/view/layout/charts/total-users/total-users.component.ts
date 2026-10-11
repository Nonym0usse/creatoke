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
  // Nombre de ventes de l'année en cours
  salesCount = 0;
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
      this.nbUsr = this.countObjectsByMonth(data.data);
      this.salesCount = this.nbUsr.reduce((total: number, n: number) => total + n, 0);
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
          min: 0
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
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      datasets: [{
        label: 'Ventes',
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
      // month est stocké en texte ("01"…"12") : conversion explicite
      const m = Number(month);
      if (Number(year) === currentYear && m >= 1 && m <= 12) {
        monthCounts[m - 1]++;
      }
    }

    return monthCounts;
  }

}
