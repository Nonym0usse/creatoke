import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';

import { SongService } from '../../../../core/services/api/song.service';
import { CategoryService } from '../../../../core/services/api/category.service';
import { UploadService } from '../../../../core/utils/upload';
import { NotifyService } from '../../../../core/services/global/notify.service';
import {
  CATEGORIES, CREATOKE_OFFERS, MAX_UPLOAD_MB, MEDIA_BLOCKS, MediaBlock, NO_CREATOKE, NO_LYRICS, Offer, SONG_OFFERS,
  blockVisible, fileNameFromUrl, spotifyEmbed, spotifyOk, youtubeId, youtubePreview,
} from '../../song/song-form';

type OuiNon = 'oui' | 'non';

const PRICE_FIELDS = ['price_base', 'price_premium', 'price_base_creatoke', 'price_premium_creatoke'];
const FILE_FIELDS = ['url', 'creatoke', 'chanson_mp3', 'chanson_wav', 'creatoke_mp3', 'creatoke_wav'];

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['../../song/song-form.scss', './modify.component.scss'],
})
export class ModifyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  musicForm: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  song: any = null;
  notFound = false;

  picturebackground = '';
  display = 'none';

  readonly categories = CATEGORIES;
  readonly mediaBlocks = MEDIA_BLOCKS;
  readonly songOffers = SONG_OFFERS;
  readonly creatokeOffers = CREATOKE_OFFERS;

  // Nouveaux fichiers envoyés pendant cette visite (pris en compte à l'enregistrement).
  progress: Record<string, number> = {};
  downloadUrls: Record<string, string> = {};
  newFileNames: Record<string, string> = {};
  // Fichiers retirés (enlevés de la chanson à l'enregistrement, annulable d'ici là).
  removed: Record<string, boolean> = {};
  activeUploads = 0;

  private audioMap: Record<string, HTMLAudioElement> = {};
  playingMap: Record<string, boolean> = {};

  isSaving = false;
  isDeleting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private songService: SongService,
    private activatedRoute: ActivatedRoute,
    private uploader: UploadService,
    private docTitle: Title,
    private notify: NotifyService
  ) {
    this.musicForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      artist: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      lyrics: [''],
      message: [''],
      exclu: ['non' as OuiNon],
      isHeartStroke: ['non' as OuiNon],
      isLicenceBase: ['non' as OuiNon],
      isPremium: ['non' as OuiNon],
      isLicenceBaseCreatoke: ['non' as OuiNon],
      isPremiumCreatoke: ['non' as OuiNon],
      // Prix : chaîne vide = pas de prix (« — » sur la fiche), 0 = gratuit.
      price_base: [''],
      price_premium: [''],
      price_base_creatoke: [''],
      price_premium_creatoke: [''],
      youtubeURL: [''],
      spotifyURL: [''],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((param) => {
      const slug = param['slug'];
      if (slug) this.loadSong(slug);
    });
    this.categoryService.getBackgroundImg().then((r) => (this.picturebackground = r.data?.[0]?.picture ?? ''));
    this.docTitle.setTitle('Créatoke | Modifier une chanson');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    Object.values(this.audioMap).forEach((a) => {
      try { a.pause(); } catch { /* ignore */ }
    });
  }

  // ---- Chargement ----
  private async loadSong(slug: string): Promise<void> {
    try {
      const res = await this.songService.getSongBySlug(slug);
      const song = res.data;
      if (!song || Object.keys(song).length === 0) throw new Error('not found');
      this.song = song;
    } catch {
      this.notFound = true;
      return;
    }

    const clean = (v: unknown) => (v === null || v === undefined || v === 'vide' ? '' : String(v));
    const ouiNon = (v: unknown): OuiNon => (v === 'oui' ? 'oui' : 'non');
    const s = this.song;
    this.musicForm.reset({
      id: s.id ?? '',
      title: clean(s.title),
      artist: clean(s.artist),
      category: clean(s.category),
      description: clean(s.description),
      lyrics: clean(s.lyrics),
      message: clean(s.message),
      exclu: ouiNon(s.exclu),
      isHeartStroke: ouiNon(s.isHeartStroke),
      isLicenceBase: ouiNon(s.isLicenceBase),
      isPremium: ouiNon(s.isPremium),
      isLicenceBaseCreatoke: ouiNon(s.isLicenceBaseCreatoke),
      isPremiumCreatoke: ouiNon(s.isPremiumCreatoke),
      // « 4.00 » → « 4 » ; un prix absent reste vide (ne devient pas 0, donc pas gratuit).
      ...Object.fromEntries(PRICE_FIELDS.map((f) => [f, clean(s[f]) === '' ? '' : String(Number(s[f]))])),
      youtubeURL: clean(s.youtubeURL),
      spotifyURL: clean(s.spotifyURL),
    });
    this.docTitle.setTitle(`Créatoke | Modifier « ${s.title} »`);
  }

  // ---- Raccourcis pour le gabarit ----
  value(name: string): string {
    return (this.musicForm.get(name)?.value ?? '').toString();
  }

  setValue(name: string, value: string): void {
    const control = this.musicForm.get(name);
    if (!control || control.value === value) return;
    control.setValue(value);
    control.markAsDirty();
  }

  filled(name: string): boolean {
    return this.value(name).trim() !== '';
  }

  get category(): string {
    return this.value('category');
  }

  get categoryLabel(): string {
    return this.categories.find((c) => c.value === this.category)?.label ?? '';
  }

  get isExclu(): boolean {
    return this.value('exclu') === 'oui';
  }

  get hasCreatoke(): boolean {
    return !!this.category && !NO_CREATOKE.includes(this.category);
  }

  get hasLyrics(): boolean {
    return !NO_LYRICS.includes(this.category);
  }

  get showSongPrices(): boolean {
    return !this.isExclu;
  }

  /** Adresse publique de la fiche (elle suit la catégorie enregistrée). */
  get publicLink(): string[] | null {
    return this.song ? ['/song', this.song.category, this.song.slug] : null;
  }

  get imageUrl(): string {
    const url = this.downloadUrls['image'] ?? this.song?.image ?? '';
    return url && url !== 'vide' ? url : '';
  }

  get hasChanges(): boolean {
    return this.musicForm.dirty || Object.keys(this.downloadUrls).length > 0 || Object.keys(this.removed).length > 0;
  }

  // ---- Fichiers ----
  /** Fichier enregistré pour la chanson (avant les changements de cette visite). */
  savedUrl(key: string): string {
    const url = (this.song?.[key] ?? '').toString().trim();
    return url === 'vide' ? '' : url;
  }

  /** Fichier actuel : le nouveau s'il y en a un, rien s'il est retiré, sinon celui enregistré. */
  fileUrl(key: string): string {
    if (this.downloadUrls[key]) return this.downloadUrls[key];
    return this.removed[key] ? '' : this.savedUrl(key);
  }

  fileName(key: string): string {
    return this.newFileNames[key] ?? fileNameFromUrl(this.fileUrl(key)) ?? '';
  }

  // Un bloc masqué par les règles reste visible si la chanson a un fichier à cet
  // endroit (pour pouvoir l'écouter ou le retirer).
  showBlock(block: MediaBlock): boolean {
    return blockVisible(block, this.category, this.isExclu) || !!this.savedUrl(block.key);
  }

  blocksOf(group: 'chanson' | 'creatoke'): MediaBlock[] {
    return this.cached('blocks-' + group,
      [this.category, this.isExclu, ...FILE_FIELDS.map((k) => !!this.savedUrl(k))].join('|'),
      () => this.mediaBlocks.filter((b) => b.group === group && this.showBlock(b)));
  }

  trackByBlock(_: number, b: MediaBlock): string {
    return b.key;
  }

  togglePlay(key: string): void {
    if (this.playingMap[key]) {
      const audio = this.audioMap[key];
      if (audio) { audio.pause(); audio.currentTime = 0; }
      this.playingMap[key] = false;
      return;
    }
    const url = this.fileUrl(key);
    if (!url) return;
    Object.keys(this.audioMap).forEach((k) => {
      this.audioMap[k]?.pause();
      this.playingMap[k] = false;
    });
    const audio = new Audio(url);
    this.audioMap[key] = audio;
    this.playingMap[key] = true;
    audio.play().catch(() => (this.playingMap[key] = false));
    audio.onended = () => (this.playingMap[key] = false);
  }

  /** Retire le fichier de la chanson (effectif à l'enregistrement). */
  removeFile(key: string): void {
    if (this.playingMap[key]) this.togglePlay(key);
    delete this.downloadUrls[key];
    delete this.newFileNames[key];
    delete this.progress[key];
    if (this.savedUrl(key)) this.removed[key] = true;
  }

  undoRemove(key: string): void {
    delete this.removed[key];
  }

  /** Les visiteurs écoutent ces fichiers sur la fiche (les autres sont vendus). */
  isListeningFile(key: string): boolean {
    return key === 'url' || key === 'creatoke';
  }

  onFileSelected(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    input.value = ''; // permet de choisir à nouveau le même fichier

    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      this.notify.warning(`Ce fichier est trop lourd (${Math.round(file.size / 1024 / 1024)} Mo). La limite est de ${MAX_UPLOAD_MB} Mo.`);
      return;
    }

    if (this.playingMap[key]) this.togglePlay(key);
    delete this.downloadUrls[key];
    delete this.removed[key];
    this.newFileNames[key] = file.name;
    this.progress[key] = 0;
    this.activeUploads++;

    const { progress$, downloadUrl$ } = this.uploader.startUpload(file, key, 'songs', { resizeImages: key === 'image' });
    progress$.pipe(takeUntil(this.destroy$)).subscribe((p) => (this.progress[key] = p));
    downloadUrl$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (url: string) => {
        this.downloadUrls[key] = url;
        this.activeUploads--;
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.activeUploads--;
        delete this.progress[key];
        delete this.newFileNames[key];
        this.notify.error(`L'envoi de « ${file.name} » a échoué. Vérifiez votre connexion internet et choisissez le fichier à nouveau.`);
      },
    });
  }

  // ---- Vérifications ----
  private memo: Record<string, { key: string; value: unknown }> = {};

  // Listes recalculées seulement quand leurs entrées changent : une nouvelle
  // liste à chaque passage relancerait l'affichage sans fin.
  private cached<T>(name: string, key: string, compute: () => T): T {
    const hit = this.memo[name];
    if (hit && hit.key === key) return hit.value as T;
    const value = compute();
    this.memo[name] = { key, value };
    return value;
  }

  get missing(): { label: string; step: string }[] {
    const key = ['category', 'title', 'artist', 'description'].map((n) => +this.filled(n)).join('');
    return this.cached('missing', key, () => {
      const list: { label: string; step: string }[] = [];
      if (!this.filled('title')) list.push({ label: 'Le titre de la chanson est vide', step: 'step-info' });
      if (!this.filled('artist')) list.push({ label: 'Le nom de l\'artiste est vide', step: 'step-info' });
      if (!this.filled('description')) list.push({ label: 'La description est vide', step: 'step-texts' });
      return list;
    });
  }

  /** Offres proposées sans leur fichier : le client paierait sans rien recevoir. */
  get offersMissingFile(): Offer[] {
    const offers = [...(this.showSongPrices ? this.songOffers : []), ...(this.hasCreatoke ? this.creatokeOffers : [])];
    const key = [this.isExclu, this.category, ...[...this.songOffers, ...this.creatokeOffers]
      .map((o) => this.value(o.show) + (this.fileUrl(o.file) ? 1 : 0))].join('|');
    return this.cached('offers', key,
      () => offers.filter((o) => this.value(o.show) === 'oui' && !this.fileUrl(o.file)));
  }

  get youtubePreviewId(): string {
    return youtubePreview(this.value('youtubeURL'));
  }

  get spotifyLinkOk(): boolean {
    return spotifyOk(this.value('spotifyURL'));
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---- Enregistrer ----
  async save(): Promise<void> {
    if (!this.musicForm.valid) {
      this.notify.warning('Il manque des informations obligatoires : regardez la liste en bas de la page.');
      return;
    }
    const v = this.musicForm.getRawValue();
    const payload = {
      ...v,
      title: (v.title ?? '').toString().toUpperCase(),
      youtubeURL: youtubeId(v.youtubeURL),
      spotifyURL: spotifyEmbed(v.spotifyURL),
      ...Object.fromEntries(FILE_FIELDS.map((k) => [k, this.fileUrl(k)])),
      image: this.imageUrl || 'https://placehold.co/600x400',
    };

    this.isSaving = true;
    try {
      await this.songService.modifySong(payload);
      this.notify.success('Les modifications sont enregistrées.', { title: 'Chanson modifiée' });
      this.router.navigate(['/manage']);
    } catch (error) {
      console.error('Error modifying song:', error);
      this.notify.error('Les modifications n\'ont pas pu être enregistrées. Vos changements sont toujours là : réessayez dans un instant.', { title: 'Enregistrement impossible' });
    } finally {
      this.isSaving = false;
    }
  }

  // ---- Supprimer ----
  async deleteSong(): Promise<void> {
    if (!this.song) return;
    const name = this.song.title;
    const ok = await this.notify.confirm({
      title: `Supprimer « ${name} » ?`,
      message: 'La chanson disparaîtra du site, avec ses fichiers audio et sa pochette. Cette action est définitive : elle ne pourra pas être récupérée.',
      confirmLabel: 'Supprimer définitivement',
      danger: true,
    });
    if (!ok) return;

    this.isDeleting = true;
    try {
      await this.songService.deleteSong(this.song.id);
      this.notify.success(`« ${name} » a été supprimée du site.`, { title: 'Chanson supprimée' });
      this.router.navigate(['/manage']);
    } catch {
      this.notify.error(`« ${name} » n'a pas pu être supprimée. Réessayez dans un instant.`);
    } finally {
      this.isDeleting = false;
    }
  }

  openModal(): void { this.display = 'block'; }
  onCloseHandled(): void { this.display = 'none'; }
}
