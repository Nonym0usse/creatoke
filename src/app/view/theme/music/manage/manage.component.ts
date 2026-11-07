import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SongService } from 'src/app/core/services/api/song.service';
import { CategoryService } from "../../../../core/services/api/category.service";
import { Section, SectionService } from 'src/app/core/services/api/section.service';
import { NotifyService } from 'src/app/core/services/global/notify.service';
import { CREATOKE_OFFERS, Offer, SONG_OFFERS } from '../../song/song-form';

interface SongRow {
  song: any;
  section?: Section;
  search: string;
  added: number;
  prices: { label: string; value: string }[];
  missing: string[];   // fichiers manquants pour des offres proposées
}

const euro = (value: unknown) => {
  const n = Number(value) || 0;
  return n === 0 ? 'gratuit' : `${n.toLocaleString('fr-FR')}\u00a0€`;
};

// Recherche sans tenir compte des accents ni des majuscules
const normalize = (text: string) => (text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Liste des chansons du catalogue (page /manage, administrateurs)
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  picturebackground: any;
  loading = true;

  private rows: SongRow[] = [];
  sections: Section[] = [];
  query = '';
  sectionFilter = '';
  sort: 'recent' | 'title' = 'recent';

  // Liste affichée (recalculée quand la recherche, le filtre ou le tri change)
  visible: SongRow[] = [];
  counts: Record<string, number> = {};
  missingCount = 0;

  private sectionsSubscription?: Subscription;

  constructor(private musicService: SongService, private router: Router, private categoryService: CategoryService,
    private title: Title, private notify: NotifyService, private sectionService: SectionService) { }

  ngOnInit(): void {
    this.title.setTitle('Créatoke | Mes chansons');
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    this.sectionsSubscription = this.sectionService.sections$.subscribe(sections => {
      this.sections = sections;
      this.rows = this.rows.map(r => this.toRow(r.song));
      this.refresh();
    });
    this.musicService.getAllSongs()
      .then((music) => this.rows = (music.data ?? []).map((s: any) => this.toRow(s)))
      .catch(() => this.notify.error('Les chansons n\'ont pas pu être chargées. Rechargez la page.'))
      .finally(() => { this.loading = false; this.refresh(); });
  }

  ngOnDestroy(): void {
    this.sectionsSubscription?.unsubscribe();
  }

  private toRow(song: any): SongRow {
    const section = this.sections.find(s => s.slug === song.category);
    const exclu = song.exclu === 'oui';
    const on = (o: Offer) => song[o.show] === 'oui';
    const songOffers = exclu ? [] : SONG_OFFERS.filter(on);
    const creatokeOffers = section?.has_creatoke ? CREATOKE_OFFERS.filter(on) : [];
    // « base Gratuit · premium 4 € » pour la chanson, puis pour le créatoké
    const line = (offers: Offer[]) => offers.map(o => `${o.show.startsWith('isPremium') ? 'premium' : 'base'}\u00a0${euro(song[o.price])}`).join(' · ');
    const prices: { label: string; value: string }[] = [];
    if (songOffers.length) prices.push({ label: 'Chanson', value: line(songOffers) });
    if (creatokeOffers.length) prices.push({ label: 'Créatoké', value: line(creatokeOffers) });
    if (!prices.length) prices.push({ label: 'Offres', value: exclu ? 'exclusivité, sur demande' : 'aucune' });
    const missing = [...songOffers, ...creatokeOffers].filter(o => !song[o.file]).map(o => o.fileLabel);
    const [y, m, d] = String(song.created_at ?? '').split('-').map(Number);
    return {
      song,
      section,
      search: normalize(`${song.title} ${song.artist}`),
      added: y ? new Date(y, (m || 1) - 1, d || 1).getTime() : 0,
      prices,
      missing,
    };
  }

  refresh() {
    const words = normalize(this.query).split(/\s+/).filter(Boolean);
    const matching = this.rows.filter(r => words.every(w => r.search.includes(w)));
    this.counts = { '': matching.length };
    for (const r of matching) this.counts[r.song.category] = (this.counts[r.song.category] ?? 0) + 1;
    this.visible = matching
      .filter(r => !this.sectionFilter || r.song.category === this.sectionFilter)
      .sort((a, b) => this.sort === 'title'
        ? String(a.song.title).localeCompare(String(b.song.title), 'fr')
        : b.added - a.added);
    this.missingCount = this.rows.filter(r => r.missing.length).length;
  }

  setQuery(value: string) { this.query = value; this.refresh(); }
  setSection(slug: string) { this.sectionFilter = slug; this.refresh(); }
  setSort(value: string) { this.sort = value === 'title' ? 'title' : 'recent'; this.refresh(); }

  get total(): number { return this.rows.length; }

  addedLabel(row: SongRow): string {
    return row.added ? new Date(row.added).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  }

  missingTitle(row: SongRow): string {
    return `Offre proposée sans fichier : il manque ${row.missing.join(', ')}. Les acheteurs ne pourraient pas télécharger.`;
  }

  modify(slug: string) {
    this.router.navigate(['/modify-song', slug]);
  }

  async delete(row: SongRow) {
    const { id, title } = row.song;
    const ok = await this.notify.confirm({
      title: `Supprimer « ${title} » ?`,
      message: 'La chanson disparaîtra du site. Cette action est définitive.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (!ok) return;
    try {
      await this.musicService.deleteSong(id);
    } catch {
      this.notify.error(`« ${title} » n'a pas pu être supprimée. Réessayez dans un instant.`);
      return;
    }
    this.notify.success(`« ${title} » a été supprimée.`);
    this.rows = this.rows.filter(r => r.song.id !== id);
    this.refresh();
  }
}
