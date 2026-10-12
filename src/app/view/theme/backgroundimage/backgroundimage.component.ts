import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../core/services/api/category.service';
import { UploadService } from '../../../core/utils/upload';
import { NotifyService } from '../../../core/services/global/notify.service';

interface ImageCheck {
  kind: 'ok' | 'warn';
  text: string;
}

// Repères pour une image de bandeau : large, en paysage, pas trop lourde.
const MIN_WIDTH = 1600;
const MIN_RATIO = 1.3;
const HEAVY_MB = 4;

@Component({
  selector: 'app-backgroundimage',
  templateUrl: './backgroundimage.component.html',
  styleUrls: ['../song/song-form.scss', './backgroundimage.component.scss'],
})
export class BackgroundimageComponent implements OnInit, OnDestroy {
  /** Image actuellement en ligne. */
  picturebackground = '';
  loadingCurrent = true;

  /** Nouvelle image : aperçu local, puis adresse sur le serveur une fois envoyée. */
  newPreview = '';
  newFileName = '';
  uploaded: { url: string; fileName: string } | null = null;
  progress: number | null = null;
  checks: ImageCheck[] = [];
  isSaving = false;

  private upload?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private uploader: UploadService,
    private title: Title,
    private notify: NotifyService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Créatoke | Image de fond');
    this.categoryService.getBackgroundImg()
      .then((r) => (this.picturebackground = r.data?.[0]?.picture ?? ''))
      .finally(() => (this.loadingCurrent = false));
  }

  ngOnDestroy(): void {
    this.upload?.unsubscribe();
    this.revokePreview();
  }

  get uploading(): boolean {
    return this.progress !== null && !this.uploaded;
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // permet de choisir à nouveau le même fichier
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.notify.warning('Ce fichier n\'est pas une image. Choisissez une photo (JPG, PNG ou WebP).');
      return;
    }

    this.discard();
    this.newFileName = file.name;
    this.newPreview = URL.createObjectURL(file);
    this.checks = await this.checkImage(file, this.newPreview);
    this.startUpload(file);
  }

  /** Vérifie que l'image convient à un bandeau (taille, orientation, poids). */
  private checkImage(file: File, src: string): Promise<ImageCheck[]> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const mb = file.size / 1024 / 1024;
        const checks: ImageCheck[] = [];
        checks.push(w >= MIN_WIDTH
          ? { kind: 'ok', text: `Bonne taille (${w} × ${h} px) : l'image restera nette sur un grand écran.` }
          : { kind: 'warn', text: `Image petite (${w} × ${h} px) : elle risque d'être floue sur un grand écran. Idéalement, au moins 1920 px de large.` });
        checks.push(w / h >= MIN_RATIO
          ? { kind: 'ok', text: 'Format en largeur (paysage) : adapté au bandeau.' }
          : { kind: 'warn', text: 'Image plutôt carrée ou verticale : seule une bande horizontale, au centre, sera visible. Regardez bien l\'aperçu.' });
        if (mb > HEAVY_MB) {
          checks.push({ kind: 'warn', text: `Image lourde (${mb.toFixed(1)} Mo) : les pages mettront plus de temps à s'afficher. Moins de ${HEAVY_MB} Mo, c'est mieux.` });
        }
        resolve(checks);
      };
      img.onerror = () => resolve([{ kind: 'warn', text: 'Impossible de lire cette image : vérifiez qu\'elle s\'ouvre bien sur votre ordinateur.' }]);
      img.src = src;
    });
  }

  private startUpload(file: File): void {
    this.progress = 0;
    const { progress$, result$ } = this.uploader.startUpload(file, 'picture', 'background', { resizeImages: false });
    this.upload = new Subscription();
    this.upload.add(progress$.subscribe((p) => (this.progress = p)));
    this.upload.add(result$.subscribe({
      next: (result) => (this.uploaded = result),
      error: (err) => {
        console.error('Upload error:', err);
        this.notify.error(`L'envoi de « ${file.name} » a échoué. Vérifiez votre connexion internet et réessayez.`);
        this.discard();
      },
    }));
  }

  /** Abandonne la nouvelle image (rien ne change sur le site). */
  discard(): void {
    this.upload?.unsubscribe();
    this.upload = undefined;
    this.revokePreview();
    this.newFileName = '';
    this.uploaded = null;
    this.progress = null;
    this.checks = [];
  }

  async apply(): Promise<void> {
    if (!this.uploaded) return;
    const ok = await this.notify.confirm({
      title: 'Mettre cette image en fond ?',
      message: 'Elle s\'affichera en haut de toutes les pages du site. L\'image actuelle sera supprimée du serveur.',
      confirmLabel: 'Oui, utiliser cette image',
    });
    if (!ok) return;

    this.isSaving = true;
    try {
      await this.categoryService.createBackground({ picture: this.uploaded.url, picture_name: this.uploaded.fileName });
      this.picturebackground = this.uploaded.url;
      this.upload = undefined; // l'image est en ligne : ne pas la considérer comme abandonnée
      this.discard();
      this.notify.success('Elle est visible en haut de toutes les pages du site.', { title: 'Nouvelle image de fond en place' });
    } catch {
      this.notify.error('L\'image de fond n\'a pas pu être changée. Réessayez dans un instant.');
    } finally {
      this.isSaving = false;
    }
  }

  private revokePreview(): void {
    if (this.newPreview) URL.revokeObjectURL(this.newPreview);
    this.newPreview = '';
  }
}
