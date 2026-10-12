// src/app/modules/.../add-song/add-song.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SongService } from '../../../../core/services/api/song.service';
import { CategoryService } from '../../../../core/services/api/category.service';
import { Subscription } from 'rxjs';
import { UploadService } from '../../../../core/utils/upload';
import * as slug from 'slug';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { NotifyService } from '../../../../core/services/global/notify.service';

type UrlMap = Record<string, string>;
type NumMap = Record<string, number>;

interface MediaBlock {
  key: string;
  group: 'chanson' | 'creatoke';
  label: string;
  hint: string;
  format: string;
  accept: string;
  hideWhenCategoryIn?: string[];
  hideWhenExclu?: boolean;
}

interface CategoryChoice {
  value: string;
  label: string;
  icon: string;
  hint: string;
}

interface Offer {
  show: string;
  price: string;
  file: string;
  label: string;
  fileLabel: string;
}

// Catégories sans créatoké (ni fichiers, ni prix créatoké).
const NO_CREATOKE = ['instrumentaux', 'musique-de-contenus', 'virgules-sonores'];

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss']
})
export class AddSongComponent implements OnInit, OnDestroy {
  musicForm: FormGroup;
  progress: NumMap = {};
  downloadUrls: UrlMap = {};
  fileNames: Record<string, string> = {};
  display = 'none';
  picturebackground?: string;

  songFile: File | null = null;
  generatedImageFile: File | null = null;
  generatedImagePreview: SafeUrl | null = null;
  showImageModal = false;
  isLoading = false;

  // Uploads en cours : bloque l'enregistrement tant que tout n'est pas envoyé.
  activeUploads = 0;

  // Lecture des fichiers audio uploadés
  private audioMap: Record<string, HTMLAudioElement> = {};
  playingMap: Record<string, boolean> = {};

  readonly categories: CategoryChoice[] = [
    { value: 'chansons-a-chanter', label: 'Chansons à chanter', icon: 'ri-mic-line', hint: 'Une chanson originale, avec sa version créatoké pour chanter dessus.' },
    { value: 'chansons-cherche-auteur', label: 'Chanson(s) cherche auteur', icon: 'ri-quill-pen-line', hint: 'Une chanson qui attend son auteur.' },
    { value: 'instrumentaux', label: 'Instrumentaux', icon: 'ri-music-2-line', hint: 'Une musique sans chant.' },
    { value: 'musique-de-contenus', label: 'Musique de contenus', icon: 'ri-film-line', hint: 'Une musique pour des vidéos, podcasts…' },
    { value: 'creacourcis', label: 'Créacourcis', icon: 'ri-flashlight-line', hint: 'Un format court.' },
    { value: 'virgules-sonores', label: 'Virgules sonores', icon: 'ri-sound-module-line', hint: 'Un très court jingle.' },
  ];

  // Fichiers audio, regroupés en « La chanson » et « Le créatoké ».
  readonly mediaBlocks: MediaBlock[] = [
    { key: 'url', group: 'chanson', label: 'Pour l\'écouter sur le site', hint: 'C\'est ce que les visiteurs entendent quand ils cliquent sur « Écouter ».', format: 'MP3', accept: '.mp3,audio/mpeg', hideWhenExclu: true },
    { key: 'chanson_mp3', group: 'chanson', label: 'Fichier vendu — licence de base', hint: 'Le client le reçoit quand il achète la licence de base.', format: 'MP3', accept: '.mp3,audio/mpeg', hideWhenExclu: true },
    { key: 'chanson_wav', group: 'chanson', label: 'Fichier vendu — licence premium', hint: 'Le client le reçoit quand il achète la licence premium (meilleure qualité).', format: 'WAV', accept: '.wav,audio/wav,audio/x-wav' },
    { key: 'creatoke', group: 'creatoke', label: 'Pour l\'écouter sur le site', hint: 'La version sans la voix principale, que les visiteurs peuvent écouter.', format: 'MP3', accept: '.mp3,audio/mpeg', hideWhenCategoryIn: NO_CREATOKE },
    { key: 'creatoke_mp3', group: 'creatoke', label: 'Fichier vendu — licence de base', hint: 'Le client le reçoit quand il achète la licence de base du créatoké.', format: 'MP3', accept: '.mp3,audio/mpeg', hideWhenCategoryIn: NO_CREATOKE },
    { key: 'creatoke_wav', group: 'creatoke', label: 'Fichier vendu — licence premium', hint: 'Le client le reçoit quand il achète la licence premium du créatoké.', format: 'WAV', accept: '.wav,audio/wav,audio/x-wav', hideWhenCategoryIn: NO_CREATOKE },
  ];

  readonly songOffers: Offer[] = [
    { show: 'isLicenceBase', price: 'price_base', file: 'chanson_mp3', label: 'Licence de base', fileLabel: 'le fichier MP3 de la chanson' },
    { show: 'isPremium', price: 'price_premium', file: 'chanson_wav', label: 'Licence premium', fileLabel: 'le fichier WAV de la chanson' },
  ];

  readonly creatokeOffers: Offer[] = [
    { show: 'isLicenceBaseCreatoke', price: 'price_base_creatoke', file: 'creatoke_mp3', label: 'Licence de base', fileLabel: 'le fichier MP3 du créatoké' },
    { show: 'isPremiumCreatoke', price: 'price_premium_creatoke', file: 'creatoke_wav', label: 'Licence premium', fileLabel: 'le fichier WAV du créatoké' },
  ];

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private songService: SongService,
    private uploader: UploadService,
    private sanitizer: DomSanitizer,
    private docTitle: Title,
    private notify: NotifyService
  ) {
    this.musicForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      lyrics: [''],
      description: ['', Validators.required],
      price_base: [''],
      price_premium: [''],
      price_base_creatoke: [''],
      price_premium_creatoke: [''],
      // Jamais vide : une exclusivité non choisie affiche « vide » sur la fiche publique.
      exclu: ['non'],
      image: [''],
      category: ['', Validators.required],
      created_at: [''],
      youtubeURL: [''],
      spotifyURL: [''],
      creatoke: [''],
      chanson_wav: [''],
      creatoke_wav: [''],
      chanson_mp3: [''],
      creatoke_mp3: [''],
      url: [''],
      isLicenceBase: ['non'],
      isPremium: ['non'],
      isLicenceBaseCreatoke: ['non'],
      isPremiumCreatoke: ['non'],
      isHeartStroke: ['non'],
      message: [''],
    }) as FormGroup;
  }

  ngOnInit(): void {
    this.docTitle.setTitle('Créatoke | Ajouter une chanson');
    this.categoryService.getBackgroundImg().then(r => {
      this.picturebackground = r.data?.[0]?.picture;
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    Object.values(this.audioMap).forEach((a) => {
      try { a.pause(); } catch { /* ignore */ }
    });
  }

  // ---- Blocs fichiers ----
  showBlock(block: MediaBlock): boolean {
    if (block.hideWhenExclu && this.musicForm.get('exclu')?.value === 'oui') return false;
    const c = (this.musicForm.get('category')?.value ?? '').toString();
    if (block.hideWhenCategoryIn?.includes(c)) return false;
    return true;
  }

  trackByBlock(_: number, b: MediaBlock) {
    return b.key;
  }

  // Listes recalculées seulement quand leurs entrées changent : une nouvelle
  // liste à chaque passage relancerait l'affichage sans fin.
  private memo: Record<string, { key: string; value: unknown }> = {};

  private cached<T>(name: string, key: string, compute: () => T): T {
    const hit = this.memo[name];
    if (hit && hit.key === key) return hit.value as T;
    const value = compute();
    this.memo[name] = { key, value };
    return value;
  }

  blocksOf(group: 'chanson' | 'creatoke'): MediaBlock[] {
    return this.cached('blocks-' + group, this.category + '|' + this.value('exclu'),
      () => this.mediaBlocks.filter((b) => b.group === group && this.showBlock(b)));
  }

  // ---- Raccourcis pour le gabarit ----
  value(name: string): string {
    return (this.musicForm.get(name)?.value ?? '').toString();
  }

  setValue(name: string, value: string): void {
    this.musicForm.get(name)?.setValue(value);
    this.musicForm.get(name)?.markAsTouched();
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
    return this.category !== 'instrumentaux' && this.category !== 'musique-de-contenus';
  }

  // Mêmes règles que l'ancien formulaire : pas de prix « chanson » pour une exclusivité.
  get showSongPrices(): boolean {
    return !this.isExclu;
  }

  get hasAudio(): boolean {
    return !!this.songFile;
  }

  // ---- Étapes et vérification finale ----
  get stepInfoDone(): boolean {
    return this.filled('title') && this.filled('artist');
  }

  get stepFilesDone(): boolean {
    const visible = this.mediaBlocks.filter((b) => this.showBlock(b));
    return visible.length > 0 && visible.some((b) => !!this.downloadUrls[b.key]);
  }

  get stepTextsDone(): boolean {
    return this.filled('description');
  }

  /** Offres affichées sans leur fichier : le client paierait sans rien recevoir. */
  get offersMissingFile(): Offer[] {
    const key = [this.isExclu, this.category, ...[...this.songOffers, ...this.creatokeOffers]
      .map((o) => this.value(o.show) + (this.downloadUrls[o.file] ? 1 : 0))].join('|');
    return this.cached('offers', key, () => this.computeOffersMissingFile());
  }

  private computeOffersMissingFile(): Offer[] {
    const offers = [
      ...(this.showSongPrices ? this.songOffers : []),
      ...(this.hasCreatoke ? this.creatokeOffers : []),
    ];
    return offers.filter((o) => this.value(o.show) === 'oui' && !this.downloadUrls[o.file]);
  }

  get missing(): { label: string; step: string }[] {
    const key = ['category', 'title', 'artist', 'description'].map((n) => +this.filled(n)).join('');
    return this.cached('missing', key, () => this.computeMissing());
  }

  private computeMissing(): { label: string; step: string }[] {
    const list: { label: string; step: string }[] = [];
    if (!this.filled('category')) list.push({ label: 'Choisir une catégorie (étape 1)', step: 'step-category' });
    if (!this.filled('title')) list.push({ label: 'Écrire le titre de la chanson (étape 2)', step: 'step-info' });
    if (!this.filled('artist')) list.push({ label: 'Écrire le nom de l\'artiste (étape 2)', step: 'step-info' });
    if (!this.filled('description')) list.push({ label: 'Écrire la description (étape 5)', step: 'step-texts' });
    return list;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---- Liens : on accepte le lien tel que copié, on garde le format attendu ----

  /** « https://www.youtube.com/watch?v=Aq1NJxJZo6E » → « Aq1NJxJZo6E ». */
  static youtubeId(input: string): string {
    const v = (input ?? '').trim();
    const m = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : v;
  }

  /** Lien de partage ou code d'intégration Spotify → lien d'intégration. */
  static spotifyEmbed(input: string): string {
    let v = (input ?? '').trim();
    const src = v.match(/src="([^"]+)"/);
    if (src) v = src[1];
    const m = v.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(?:embed\/)?(track|album|playlist|episode|artist)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : v;
  }

  get youtubePreviewId(): string {
    const id = AddSongComponent.youtubeId(this.value('youtubeURL'));
    return /^[\w-]{11}$/.test(id) ? id : '';
  }

  get spotifyLinkOk(): boolean {
    return AddSongComponent.spotifyEmbed(this.value('spotifyURL')).startsWith('https://open.spotify.com/embed/');
  }

  togglePlay(key: string) {
    if (this.playingMap[key]) {
      const audio = this.audioMap[key];
      if (audio) { audio.pause(); audio.currentTime = 0; }
      this.playingMap[key] = false;
      return;
    }
    const url = this.downloadUrls[key];
    if (!url) return;
    // stoppe les autres lectures
    Object.keys(this.audioMap).forEach((k) => {
      this.audioMap[k]?.pause();
      this.playingMap[k] = false;
    });
    const audio = new Audio(url);
    this.audioMap[key] = audio;
    this.playingMap[key] = true;
    audio.play().catch(() => this.playingMap[key] = false);
    audio.onended = () => this.playingMap[key] = false;
  }

  onFileSelected(event: Event, fileType: string) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.fileNames[fileType] = file.name;
    delete this.downloadUrls[fileType];
    this.activeUploads++;

    const { progress$, downloadUrl$ } = this.uploader.startUpload(file, fileType, 'songs');

    // Maj de la progression
    this.subs.add(progress$.subscribe(p => {
      this.progress[fileType] = p;
    }));

    this.subs.add(downloadUrl$.subscribe({
      next: (url) => {
        this.downloadUrls[fileType] = url;
        const patch: Partial<Record<string, string>> = {};
        patch[fileType] = url; // si les noms de fileType == noms de champs
        this.musicForm.patchValue(patch);
        this.activeUploads--;
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.activeUploads--;
        delete this.progress[fileType];
        delete this.fileNames[fileType];
        this.notify.error(`L'envoi de « ${file.name} » a échoué. Vérifiez votre connexion internet et choisissez le fichier à nouveau.`);
      },
    }));
    // Le fichier audio sert de source à la génération IA (pas l'image).
    if (fileType !== 'image') {
      this.songFile = file;
    }
  }

  private buildPayload() {
    // On part du form et on ajoute/écrase proprement
    const raw = this.musicForm.getRawValue();

    const placeholderImage = 'https://placehold.co/600x400';
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const created_at = `${yyyy}-${mm}-${dd}`;
    const ensureValue = (v: unknown, fallback = 'vide') =>
      (v === null || v === undefined || v === '') ? fallback : v;

    const payload = {
      ...raw,
      title: (raw.title ?? '').toString().toUpperCase(),
      created_at,
      slug: slug(raw.title ?? ''),
      youtubeURL: AddSongComponent.youtubeId(raw.youtubeURL),
      spotifyURL: AddSongComponent.spotifyEmbed(raw.spotifyURL),
      image: this.downloadUrls['image'] ?? ensureValue(raw.image, placeholderImage),
      creatoke: this.downloadUrls['creatoke'] ?? ensureValue(raw.creatoke),
      url: this.downloadUrls['url'] ?? ensureValue(raw.url),

      // fichiers audio stockés par type
      creatoke_wav: this.downloadUrls['creatoke_wav'] ?? ensureValue(raw.creatoke_wav),
      creatoke_mp3: this.downloadUrls['creatoke_mp3'] ?? ensureValue(raw.creatoke_mp3),
      chanson_mp3: this.downloadUrls['chanson_mp3'] ?? ensureValue(raw.chanson_mp3),
      chanson_wav: this.downloadUrls['chanson_wav'] ?? ensureValue(raw.chanson_wav),
    };

    // Remplace les autres champs vides par 'vide'
    const indexedPayload = payload as Record<string, any>;
    Object.keys(indexedPayload).forEach((k) => {
      indexedPayload[k] = ensureValue(indexedPayload[k], k === 'image' ? placeholderImage : 'vide');
    });

    return payload;
  }

  async addMusic(): Promise<void> {
    if (!this.musicForm.valid) {
      this.notify.warning('Il manque des informations obligatoires : regardez la liste en bas de la page.');
      return;
    }
    this.isLoading = true;
    const payload = this.buildPayload();
    try {
      await this.songService.createSong(payload);
      this.notify.success('La chanson est en ligne. Vous la retrouvez dans la liste des chansons.', { title: 'Chanson publiée' });
      this.router.navigate(['/manage']);
    } catch (error) {
      console.error('Error creating song:', error);
      this.notify.error('La chanson n\'a pas pu être enregistrée. Vos informations sont toujours là : réessayez dans un instant.', { title: 'Publication impossible' });
    } finally {
      this.isLoading = false;
    }
  }

  generateContentWithIA(action: string) {
    if (!this.songFile) {
      this.notify.info('Ajoutez d\'abord un fichier audio à l\'étape 3 : l\'IA s\'en sert pour travailler.');
      return;
    }

    const prompt = this.generatePrompt(action);
    const payload = { file: this.songFile, prompt, isImage: action === 'image' ? true : false };
    this.isLoading = true;

    this.songService.generateSongWithIA(payload).then((res) => {
      if (action === 'image') {
        this.generatedImageFile = new File([res], 'generated-image.png', {
          type: 'image/png'
        });

        const objectUrl = URL.createObjectURL(this.generatedImageFile);
        this.generatedImagePreview = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.showImageModal = true;
      } else {
        this.musicForm.patchValue({ [action]: res });
      }
    }).catch((err) => {
      console.error(err);
      this.notify.error('L\'IA n\'a pas réussi cette fois-ci. Réessayez dans un instant.');
    }).finally(() => {
      this.isLoading = false;
    });
  }

  generatePrompt(action): string {
    switch (action) {
      case 'description':
        return `Génère une description à partir du fichier audio que tu vas reçevoir 
      La description doit être concise, accrocheuse et donner envie d'écouter la chanson.
      Retourne uniquement le texte final brut.
      Elle doit ne pas être trop longue (10 phrases) et mettre en avant les éléments clés de la chanson tels que le style musical, les émotions véhiculées et les thèmes abordés.`;
      case 'lyrics':
        return `Tu dois analyser le fichier audio que tu vas recevoir et en extraire les paroles de la chanson.
      Les paroles doivent être précises et refléter fidèlement le contenu de la chanson. Tu ne dois pas mettre les timpos, juste les paroles. Fais des sauts de ligne en ajoutant des "</br>" entre chaque ligne. Retourne uniquement le texte final brut.`;
      case 'image':
        return `Tu dois analyser le fichier audio que tu vas recevoir et en extraire les paroles de la chanson.
      Les paroles doivent être précises et refléter fidèlement le contenu de la chanson. Tu ne dois pas mettre les timpos, juste les paroles. Retourne uniquement le texte final brut. Si aucune parole n'est détectée, génère une image abstraite qui reflète les émotions véhiculées par la chanson.`;
      default:
        return '';
    }
  }

  closeImageModal(): void {
    this.showImageModal = false;
  }

  rejectImage(): void {
    this.generatedImageFile = null;
    this.generatedImagePreview = null;
    this.showImageModal = false;
  }

  acceptImage(): void {
    this.onFileSelected({ target: { files: [this.generatedImageFile] } } as unknown as Event, 'image');
    this.showImageModal = false;
  }

  openModal() { this.display = 'block'; }
  onCloseHandled() { this.display = 'none'; }
}