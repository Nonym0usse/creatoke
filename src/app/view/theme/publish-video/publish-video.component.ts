import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';
import { SongService } from 'src/app/core/services/api/song.service';
import { NetworkId, PublishResult, VideoPostStatus, VideoPublishService } from 'src/app/core/services/api/video-publish.service';

// Limites appliquées par l'API (routes/admin/videoPublish.ts) : 512 Mo, description tronquée à 280 caractères.
const MAX_VIDEO_BYTES = 512 * 1024 * 1024;
const MAX_DESCRIPTION = 280;
// Lien facultatif d'une chanson : fiche du site + prise de rendez-vous Calendly (?promote=1)
const SITE_URL = 'https://creatoke.com';

interface SongOption { slug: string; title: string; artist: string; category: string; image: string; search: string; }

// Recherche sans tenir compte des accents ni des majuscules
const normalize = (text: string) => (text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
// Suivi de la publication (faite en arrière-plan par l'API via Upload-Post)
const POLL_INTERVAL_MS = 5000;
const POLL_MAX_MS = 45 * 60 * 1000;

@Component({
  selector: 'app-publish-video',
  templateUrl: './publish-video.component.html',
  styleUrls: ['./publish-video.component.scss']
})
export class PublishVideoComponent implements OnInit, OnDestroy {
  picturebackground: string = "";
  videoForm: FormGroup;
  isLoading = false;

  readonly maxDescription = MAX_DESCRIPTION;

  // Réseaux de publication (via Upload-Post), dans l'ordre de l'API.
  // configured : null tant que l'API n'a pas répondu ; selected : coché pour cette publication
  platforms: { id: NetworkId; name: string; icon: string; configured: boolean | null; selected: boolean }[] = [
    { id: 'instagram', name: 'Instagram', icon: 'ri-instagram-line', configured: null, selected: true },
    { id: 'tiktok', name: 'TikTok', icon: 'ri-music-2-line', configured: null, selected: true },
    { id: 'youtube', name: 'YouTube', icon: 'ri-youtube-line', configured: null, selected: true },
    { id: 'facebook', name: 'Facebook', icon: 'ri-facebook-circle-line', configured: null, selected: true },
    { id: 'linkedin', name: 'LinkedIn', icon: 'ri-linkedin-box-line', configured: null, selected: true },
    { id: 'twitter', name: 'X (Twitter)', icon: 'ri-twitter-line', configured: null, selected: true },
    { id: 'threads', name: 'Threads', icon: 'ri-at-line', configured: null, selected: true },
    { id: 'bluesky', name: 'Bluesky', icon: 'ri-cloud-line', configured: null, selected: true },
  ];
  networksError = '';

  // Chanson jointe (facultatif) : recherche dans le catalogue
  songs: SongOption[] = [];
  songQuery = '';
  songListOpen = false;
  selectedSong: SongOption | null = null;
  private pollTimer: ReturnType<typeof setTimeout> | null = null;

  // Détail par réseau de la dernière publication
  results: (PublishResult & { name: string; icon: string })[] = [];

  // Vidéo choisie : nom, taille et aperçu local
  fileName = '';
  fileSize = '';
  previewUrl: string | null = null;
  // Angular 13 bloque les adresses blob: (« unsafe:blob:… ») : celle-ci vient du fichier choisi, on la déclare sûre
  previewSafeUrl: SafeUrl | null = null;
  fileError = '';

  // Résultat de la dernière publication, affiché dans la page
  status: 'idle' | 'success' | 'partial' | 'error' = 'idle';
  statusMessage = '';

  constructor(private categoryService: CategoryService, private fb: FormBuilder, private videoPublishService: VideoPublishService, private title: Title,
    private sanitizer: DomSanitizer, private songService: SongService
  ) {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(MAX_DESCRIPTION)]],
      video: [null as File | null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getBackground();
    this.getNetworks();
    this.getSongs();
    this.title.setTitle('Créatoke | Publier une vidéo sur les plateformes');
  }

  ngOnDestroy(): void {
    this.clearPreview();
    if (this.pollTimer) clearTimeout(this.pollTimer);
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

  async getNetworks() {
    try {
      const res = await this.videoPublishService.getNetworks();
      this.networksError = res.data.error ?? '';
      for (const n of res.data.networks) {
        const platform = this.platforms.find(p => p.id === n.id);
        if (!platform) continue;
        platform.configured = n.configured;
        platform.selected = n.configured;
      }
    } catch (e) {
      console.error(e);
      this.networksError = 'Impossible de lire les réseaux connectés.';
    }
  }

  async getSongs() {
    try {
      const res = await this.songService.getAllSongs();
      this.songs = (res?.data ?? [])
        .filter((s: any) => s?.slug && s?.category)
        .map((s: any) => ({
          slug: s.slug, title: s.title ?? '', artist: s.artist ?? '', category: s.category, image: s.image ?? '',
          search: normalize(`${s.title} ${s.artist}`),
        }))
        .sort((a: SongOption, b: SongOption) => a.title.localeCompare(b.title, 'fr'));
    } catch (e) {
      console.error(e);
    }
  }

  /** Chansons correspondant à la recherche (toutes si le champ est vide) */
  get songMatches(): SongOption[] {
    const words = normalize(this.songQuery).split(/\s+/).filter(Boolean);
    return this.songs.filter(s => words.every(w => s.search.includes(w))).slice(0, 8);
  }

  selectSong(song: SongOption) {
    this.selectedSong = song;
    this.songQuery = '';
    this.songListOpen = false;
  }

  clearSong() {
    this.selectedSong = null;
  }

  // Laisse le temps au clic sur une chanson d'être pris en compte avant de fermer la liste
  closeSongList() {
    setTimeout(() => this.songListOpen = false, 150);
  }

  private get songLink(): string | null {
    const s = this.selectedSong;
    return s ? `${SITE_URL}/song/${s.category}/${s.slug}?promote=1` : null;
  }

  /** Réseaux connectés */
  get availablePlatforms() {
    return this.platforms.filter(p => p.configured);
  }

  /** Réseaux cochés pour cette publication */
  get selectedNetworks(): NetworkId[] {
    return this.platforms.filter(p => p.configured && p.selected).map(p => p.id);
  }

  /** Réseaux non connectés (ou à reconnecter) */
  get unavailableNames(): string[] {
    return this.platforms.filter(p => p.configured === false).map(p => p.name);
  }

  /** Ce qu'il manque pour que le bouton « Publier la vidéo » s'active */
  get missing(): string[] {
    const invalid = (name: string) => this.videoForm.get(name)?.invalid;
    return [
      invalid('video') ? 'la vidéo (étape 1)' : '',
      invalid('title') ? 'le titre (étape 2)' : '',
      invalid('description') ? 'le texte (étape 3)' : '',
      !this.selectedNetworks.length ? 'un réseau (étape 5)' : '',
    ].filter(Boolean);
  }

  togglePlatform(id: NetworkId) {
    const platform = this.platforms.find(p => p.id === id);
    if (platform?.configured && !this.isLoading) platform.selected = !platform.selected;
  }

  get descriptionLength(): number {
    return (this.videoForm.get('description')?.value ?? '').length;
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectFile(file);
    input.value = ''; // permet de re-sélectionner le même fichier
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    const file = ev.dataTransfer?.files?.[0] || null;
    if (file && !file.type.startsWith('video/')) {
      this.fileError = 'Ce fichier n\'est pas une vidéo.';
      return;
    }
    this.selectFile(file);
  }

  removeFile() {
    this.selectFile(null);
  }

  private selectFile(file: File | null) {
    this.clearPreview();
    this.fileError = '';
    if (file && file.size > MAX_VIDEO_BYTES) {
      this.fileError = 'Vidéo trop lourde : 512 Mo maximum.';
      file = null;
    }
    this.videoForm.patchValue({ video: file });
    this.videoForm.get('video')?.markAsTouched();
    if (file) {
      this.fileName = file.name;
      this.fileSize = this.formatSize(file.size);
      this.previewUrl = URL.createObjectURL(file);
      this.previewSafeUrl = this.sanitizer.bypassSecurityTrustUrl(this.previewUrl);
    }
  }

  private clearPreview() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = null;
    this.previewSafeUrl = null;
    this.fileName = '';
    this.fileSize = '';
  }

  private formatSize(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} Mo` : `${Math.ceil(bytes / 1024)} Ko`;
  }

  reset() {
    this.videoForm.reset();
    this.selectedSong = null;
    this.clearPreview();
    this.fileError = '';
    this.status = 'idle';
    this.results = [];
  }

  async validatePublishing() {
    if (this.videoForm.invalid || this.isLoading || !this.selectedNetworks.length) return;

    this.isLoading = true;
    this.status = 'idle';
    this.results = [];

    const { title, description, video } = this.videoForm.value as any;
    const link = this.songLink;
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    if (link) form.append('link', link);
    form.append('networks', this.selectedNetworks.join(','));
    form.append('video', video);

    try {
      // L'API répond dès la vidéo reçue ; compression et publication continuent de son côté
      const res = await this.videoPublishService.publish(form);
      this.waitForPost(res.data.id, title, Date.now());
    } catch (e: any) {
      console.error(e);
      this.isLoading = false;
      this.status = 'error';
      // L'API renvoie { status: "error", message } en cas d'échec
      const raw = e?.response?.data?.message;
      const detail = typeof raw === 'string' ? raw : '';
      this.statusMessage = detail
        ? `La publication a échoué : ${detail}`
        : 'Une erreur est survenue lors de l\'envoi de la vidéo. Réessayez dans quelques minutes.';
    }
  }

  private waitForPost(id: number, title: string, started: number) {
    this.pollTimer = setTimeout(async () => {
      let post: VideoPostStatus | null = null;
      try {
        post = (await this.videoPublishService.getPost(id)).data;
      } catch (e) {
        console.error(e); // incident passager : on réessaie
      }
      if (post && post.status !== 'running') {
        this.showResult(post, title);
      } else if (Date.now() - started > POLL_MAX_MS) {
        this.isLoading = false;
        this.status = 'partial';
        this.statusMessage = 'La publication prend plus de temps que prévu. Elle continue toute seule : vérifiez sur vos réseaux dans un moment, sans la relancer.';
      } else {
        this.waitForPost(id, title, started);
      }
    }, POLL_INTERVAL_MS);
  }

  private showResult(post: VideoPostStatus, title: string) {
    this.isLoading = false;
    if (post.status === 'failed') {
      this.status = 'error';
      this.statusMessage = `La publication a échoué : ${post.error ?? 'erreur inconnue'}`;
      return;
    }
    this.results = post.results.map(r => {
      const platform = this.platforms.find(p => p.id === r.network);
      return { ...r, name: platform?.name ?? r.network, icon: platform?.icon ?? 'ri-share-line' };
    });
    const published = this.results.filter(r => r.status === 'ok').length;
    const failed = this.results.filter(r => r.status === 'error').length;

    if (published && !failed) {
      this.status = 'success';
      this.statusMessage = `« ${title} » est publiée sur ${published} réseau${published > 1 ? 'x' : ''}.`;
    } else if (published) {
      this.status = 'partial';
      this.statusMessage = `« ${title} » est publiée sur ${published} réseau${published > 1 ? 'x' : ''}, mais ${failed} publication${failed > 1 ? 's ont' : ' a'} échoué.`;
    } else {
      this.status = 'error';
      this.statusMessage = failed
        ? 'La vidéo n\'a été publiée sur aucun réseau.'
        : 'Aucun réseau n\'est connecté : la vidéo n\'a pas été publiée.';
    }
    if (published) {
      this.videoForm.reset();
      this.selectedSong = null;
      this.clearPreview();
    }
  }
}
