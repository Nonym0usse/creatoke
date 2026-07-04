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

type UrlMap = Record<string, string>;
type NumMap = Record<string, number>;

interface MediaBlock {
  key: string;
  label: string;
  accept: string;
  hideWhenCategoryIn?: string[];
  hideWhenExclu?: boolean;
}

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

  // Blocs de fichiers audio (même design que la page Modifier)
  readonly mediaBlocks: MediaBlock[] = [
    { key: 'url', label: 'Chanson (player client web) .mp3', accept: '.mp3,audio/mpeg', hideWhenExclu: true },
    { key: 'creatoke', label: 'Creatoke (player client web) .mp3', accept: '.mp3,audio/mpeg', hideWhenCategoryIn: ['instrumentaux', 'musique-de-contenus', 'virgules-sonores'] },
    { key: 'chanson_wav', label: 'Chanson au format .wav (téléchargement)', accept: '.wav,audio/wav,audio/x-wav' },
    { key: 'creatoke_wav', label: 'Creatoke au format .wav (téléchargement)', accept: '.wav,audio/wav,audio/x-wav', hideWhenCategoryIn: ['instrumentaux', 'musique-de-contenus', 'virgules-sonores'] },
    { key: 'chanson_mp3', label: 'Chanson au format .mp3 (téléchargement)', accept: '.mp3,audio/mpeg', hideWhenExclu: true },
    { key: 'creatoke_mp3', label: 'Creatoke au format .mp3 (téléchargement)', accept: '.mp3,audio/mpeg', hideWhenCategoryIn: ['instrumentaux', 'musique-de-contenus', 'virgules-sonores'] },
  ];

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private songService: SongService,
    private uploader: UploadService,
    private sanitizer: DomSanitizer,
    private docTitle: Title
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
      exclu: [''],
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
        alert("L'envoi du fichier a échoué. Merci de réessayer.");
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
      alert('Merci de remplir les champs');
      return;
    }
    this.isLoading = true;
    const payload = this.buildPayload();
    try {
      await this.songService.createSong(payload);
      alert('Chanson enregistrée avec succès.');
      this.router.navigate(['/manage']);
    } catch (error) {
      console.error('Error creating song:', error);
      alert('Erreur lors de la création de la chanson. Merci de réessayer.');
    } finally {
      this.isLoading = false;
    }
  }

  generateContentWithIA(action: string) {
    if (!this.songFile) {
      alert('Merci de sélectionner un fichier audio avant de générer du contenu avec l\'IA.');
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
      alert('La génération IA a échoué. Merci de réessayer.');
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