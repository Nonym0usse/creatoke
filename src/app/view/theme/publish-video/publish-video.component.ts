import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';
import { NetworkId, PublishResult, VideoPublishService } from 'src/app/core/services/api/video-publish.service';

// Limites appliquées par l'API (routes/admin/videoPublish.ts) : 512 Mo, description tronquée à 280 caractères.
const MAX_VIDEO_BYTES = 512 * 1024 * 1024;
const MAX_DESCRIPTION = 280;

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

  // Réseaux de publication, dans l'ordre de l'API. configured : null tant que l'API n'a pas répondu
  platforms: { id: NetworkId; name: string; icon: string; detail: string; configured: boolean | null }[] = [
    { id: 'instagram', name: 'Instagram', icon: 'ri-instagram-line', detail: 'en Reel', configured: null },
    { id: 'facebook', name: 'Facebook', icon: 'ri-facebook-circle-line', detail: 'sur la Page', configured: null },
    { id: 'youtube', name: 'YouTube', icon: 'ri-youtube-line', detail: 'catégorie Musique', configured: null },
    { id: 'bluesky', name: 'Bluesky', icon: 'ri-cloud-line', detail: 'vidéo intégrée', configured: null },
    { id: 'linkedin', name: 'LinkedIn', icon: 'ri-linkedin-box-line', detail: 'lien YouTube', configured: null },
    { id: 'twitter', name: 'X (Twitter)', icon: 'ri-twitter-line', detail: 'lien YouTube', configured: null },
  ];

  // Détail par réseau de la dernière publication
  results: (PublishResult & { name: string; icon: string })[] = [];

  // Vidéo choisie : nom, taille et aperçu local
  fileName = '';
  fileSize = '';
  previewUrl: string | null = null;
  fileError = '';

  // Résultat de la dernière publication, affiché dans la page
  status: 'idle' | 'success' | 'partial' | 'error' = 'idle';
  statusMessage = '';

  constructor(private categoryService: CategoryService, private fb: FormBuilder, private videoPublishService: VideoPublishService, private title: Title
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
    this.title.setTitle('Créatoke | Publier une vidéo sur les plateformes');
  }

  ngOnDestroy(): void {
    this.clearPreview();
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

  async getNetworks() {
    try {
      const res = await this.videoPublishService.getNetworks();
      for (const n of res.data.networks) {
        const platform = this.platforms.find(p => p.id === n.id);
        if (platform) platform.configured = n.configured;
      }
    } catch (e) {
      console.error(e);
    }
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
    }
  }

  private clearPreview() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = null;
    this.fileName = '';
    this.fileSize = '';
  }

  private formatSize(bytes: number): string {
    return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} Mo` : `${Math.ceil(bytes / 1024)} Ko`;
  }

  reset() {
    this.videoForm.reset();
    this.clearPreview();
    this.fileError = '';
    this.status = 'idle';
    this.results = [];
  }

  async validatePublishing() {
    if (this.videoForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.status = 'idle';
    this.results = [];

    const { title, description, video } = this.videoForm.value as any;
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('video', video);

    try {
      const res = await this.videoPublishService.publish(form);
      this.results = res.data.results.map(r => {
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
          : 'Aucun réseau n\'est configuré : la vidéo n\'a pas été publiée.';
      }
      if (published) {
        this.videoForm.reset();
        this.clearPreview();
      }
    } catch (e: any) {
      console.error(e);
      this.status = 'error';
      // L'API renvoie { status: "error", message } en cas d'échec
      const raw = e?.response?.data?.message;
      const detail = typeof raw === 'string' ? raw : '';
      this.statusMessage = detail
        ? `La publication a échoué : ${detail}`
        : 'Une erreur est survenue lors de la publication. Réessayez dans quelques minutes.';
    } finally {
      this.isLoading = false;
    }
  }
}
