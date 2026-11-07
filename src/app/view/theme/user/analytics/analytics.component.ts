// Angular
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

// Chart.js (enregistré globalement par ng2-charts)
import { Chart } from 'chart.js';

// Services
import { ThemeService } from '../../../../core/services/design/theme.service';
import { PaypalService } from "../../../../core/services/api/paypal.service";
import { CategoryService } from "../../../../core/services/api/category.service";
import { VisitService } from "../../../../core/services/global/visit.service";

interface Sale {
  date: string;          // jj/mm/aaaa
  month: string;         // 01 à 12
  year: number;
  email_client: string;
  nom_client: string;
  titre_chanson: string;
  licence_name: string;
  price: number;
}

interface TopSong { title: string; count: number; revenue: number; share: number; }

const MONTHS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
const MONTHS_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// Offres vendues (champ licence_name de la vente)
const LICENCES: Record<string, string> = {
  price_base: 'Licence de base',
  price_premium: 'Licence premium',
  price_base_creatoke: 'Licence de base (créatoké)',
  price_premium_creatoke: 'Licence premium (créatoké)',
};

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

// Statistiques des ventes (page /analytics, administrateurs).
// Les chiffres sont calculés une fois (chargement, changement d'année ou de recherche), pas à chaque rendu.
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('monthChart') monthChart?: ElementRef<HTMLCanvasElement>;

  picturebackground: any;
  loading = true;
  loadError = false;

  private sales: Sale[] = [];
  years: number[] = [new Date().getFullYear()];
  year = new Date().getFullYear();
  query = '';

  // Chiffres de l'année choisie
  yearSales: Sale[] = [];
  revenue = 0;
  previousRevenue = 0;
  evolution: number | null = null;
  bestMonth: string | null = null;
  topSongs: TopSong[] = [];
  tableSales: Sale[] = [];
  tableTotal = 0;
  private months: number[] = new Array(12).fill(0);

  // Visites du site (compteur sans cookie, depuis sa mise en service) : null = indisponible
  visits: number[] | null = null;
  visitsLabel = '';
  visitsValue = 0;
  visitsNote = '';

  private chart?: Chart;
  private themeSubscription?: Subscription;
  private viewReady = false;

  constructor(
    private themeService: ThemeService,
    private sellingService: PaypalService,
    private categoryService: CategoryService,
    private title: Title,
    private zone: NgZone,
    private visitService: VisitService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Créatoke | Statistiques');
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    this.sellingService.listSales().then((res) => {
      this.sales = (res.data ?? []).map((s: any) => ({ ...s, year: Number(s.year), price: Number(s.price) || 0 }));
      const years = new Set<number>([new Date().getFullYear(), ...this.sales.map(s => s.year).filter(Boolean)]);
      this.years = [...years].sort((a, b) => b - a);
    }).catch(() => this.loadError = true)
      .finally(() => {
        this.loading = false;
        this.compute();
        setTimeout(() => this.renderChart());
      });
    this.loadVisits();
    // Couleurs du graphique : redessiné au changement de thème
    this.themeSubscription = this.themeService.lightMode.subscribe(() => setTimeout(() => this.renderChart()));
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.chart?.destroy();
  }

  setYear(year: number | string) {
    this.year = Number(year);
    this.compute();
    this.renderChart();
    this.loadVisits();
  }

  private loadVisits() {
    const year = this.year;
    this.visitService.getVisits(year)
      .then(res => {
        if (year !== this.year) return;
        this.visits = res.data.months;
        this.computeVisits();
        this.renderChart();
      })
      .catch(() => {
        if (year !== this.year) return;
        this.visits = null;
        this.computeVisits();
      });
  }

  /** Année en cours : visites du mois ; année passée : total de l'année */
  private computeVisits() {
    const now = new Date();
    if (!this.visits) {
      this.visitsLabel = 'Visites';
      this.visitsValue = 0;
      this.visitsNote = 'compteur indisponible';
      return;
    }
    const total = this.visits.reduce((sum, v) => sum + v, 0);
    if (this.year === now.getFullYear()) {
      this.visitsLabel = `Visites en ${MONTHS_LONG[now.getMonth()]}`;
      this.visitsValue = this.visits[now.getMonth()];
      this.visitsNote = `${total.toLocaleString('fr-FR')} depuis janvier`;
    } else {
      this.visitsLabel = `Visites en ${this.year}`;
      this.visitsValue = total;
      this.visitsNote = total ? `${Math.round(total / 12).toLocaleString('fr-FR')} par mois en moyenne` : 'compteur pas encore en service';
    }
  }

  setQuery(query: string) {
    this.query = query;
    this.computeTable();
  }

  licence(s: Sale): string {
    return LICENCES[s.licence_name] ?? (s.licence_name || '—');
  }

  money(value: number): string {
    return euro.format(value);
  }

  // ---------------- Calculs ----------------

  private salesOf(year: number): Sale[] {
    return this.sales.filter(s => s.year === year);
  }

  private total(list: Sale[]): number {
    return list.reduce((sum, s) => sum + s.price, 0);
  }

  private compute() {
    this.yearSales = this.salesOf(this.year);
    this.revenue = this.total(this.yearSales);
    this.previousRevenue = this.total(this.salesOf(this.year - 1));
    this.evolution = this.previousRevenue > 0
      ? Math.round(((this.revenue - this.previousRevenue) / this.previousRevenue) * 100)
      : null;

    this.months = new Array(12).fill(0);
    for (const s of this.yearSales) {
      const m = Number(s.month) - 1;
      if (m >= 0 && m < 12) this.months[m] += s.price;
    }
    // Meilleur mois (plusieurs en cas d'égalité)
    const max = Math.max(...this.months);
    const best = MONTHS_LONG.filter((_, i) => max > 0 && this.months[i] === max);
    this.bestMonth = best.length
      ? `${best.length > 1 ? best.slice(0, -1).join(', ') + ' et ' + best[best.length - 1] : best[0]} (${this.money(max)})`
      : null;

    // Chansons de l'année, de la plus vendue à la moins vendue (chiffre d'affaires)
    const bySong = new Map<string, { title: string; count: number; revenue: number }>();
    for (const s of this.yearSales) {
      const key = s.titre_chanson || '—';
      const row = bySong.get(key) ?? { title: key, count: 0, revenue: 0 };
      row.count++;
      row.revenue += s.price;
      bySong.set(key, row);
    }
    const rows = [...bySong.values()].sort((a, b) => b.revenue - a.revenue || b.count - a.count).slice(0, 6);
    const top = rows[0]?.revenue || 1;
    this.topSongs = rows.map(r => ({ ...r, share: r.revenue / top }));

    this.computeTable();
  }

  /** Ventes de l'année, les plus récentes d'abord, filtrées par la recherche */
  private computeTable() {
    const q = this.query.trim().toLowerCase();
    const time = (s: Sale) => {
      const [d, m, y] = (s.date ?? '').split('/').map(Number);
      return y ? new Date(y, m - 1, d).getTime() : 0;
    };
    this.tableSales = this.yearSales
      .filter(s => !q || [s.titre_chanson, s.email_client, s.nom_client, this.licence(s)].some(v => (v ?? '').toLowerCase().includes(q)))
      .sort((a, b) => time(b) - time(a));
    this.tableTotal = this.total(this.tableSales);
  }

  // ---------------- Graphique ----------------

  private renderChart() {
    const canvas = this.monthChart?.nativeElement;
    if (!this.viewReady || !canvas || this.loading) return;
    // Thème lu sur l'interrupteur du site (mis à jour tout de suite), pas sur les variables CSS :
    // la feuille du mode clair se charge en asynchrone et n'est pas encore appliquée ici
    const dark = !this.themeService.lightMode.value;
    const inkRgb = dark ? '255, 255, 255' : '21, 23, 25';
    const bar = dark ? '#8f7be4' : '#5438d1';           // validées (contraste ≥ 3:1) sur les fonds clair et sombre
    const muted = `rgba(${inkRgb}, 0.6)`;
    const grid = `rgba(${inkRgb}, 0.08)`;
    const months = [...this.months];
    const counts = new Array(12).fill(0);
    for (const s of this.yearSales) {
      const m = Number(s.month) - 1;
      if (m >= 0 && m < 12) counts[m]++;
    }
    const year = this.year;
    const visits = this.visits ? [...this.visits] : null;

    // Hors de la zone Angular : les animations et survols du graphique ne relancent pas le rendu de la page
    this.zone.runOutsideAngular(() => {
      this.chart?.destroy();
      this.chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: MONTHS,
          datasets: [{
            label: 'Chiffre d\'affaires',
            data: months,
            backgroundColor: bar,
            hoverBackgroundColor: bar,
            borderRadius: 4,
            borderSkipped: 'bottom',
            barPercentage: 0.55,
            categoryPercentage: 0.9,
            maxBarThickness: 36,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: dark ? '#24252b' : '#151719',
              titleColor: '#fff',
              bodyColor: '#fff',
              padding: 10,
              displayColors: false,
              callbacks: {
                title: (items) => `${MONTHS_LONG[items[0].dataIndex]} ${year}`,
                label: (item) => {
                  const count = counts[item.dataIndex];
                  const lines = [`${euro.format(Number(item.raw))} · ${count} vente${count > 1 ? 's' : ''}`];
                  if (visits) lines.push(`${visits[item.dataIndex].toLocaleString('fr-FR')} visite${visits[item.dataIndex] > 1 ? 's' : ''} sur le site`);
                  return lines;
                },
              },
            },
          },
          scales: {
            x: { grid: { display: false, drawBorder: false }, ticks: { color: muted } } as any,
            y: {
              beginAtZero: true,
              suggestedMax: 5,
              grid: { color: grid, drawBorder: false },
              ticks: { color: muted, maxTicksLimit: 5, callback: (v: any) => euro.format(Number(v)).replace(',00', '') },
            } as any,
          },
        },
      });
    });
  }
}
