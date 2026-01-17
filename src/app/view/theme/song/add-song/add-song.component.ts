// src/app/modules/.../add-song/add-song.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SongService } from '../../../../core/services/api/song.service';
import { CategoryService } from '../../../../core/services/api/category.service';
import { Subscription } from 'rxjs';
import { UploadService } from '../../../../core/utils/upload';

type UrlMap = Record<string, string>;
type NumMap = Record<string, number>;

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss']
})
export class AddSongComponent implements OnInit, OnDestroy {
  musicForm: FormGroup;
  subcategory: any[] = [];
  filteredSubcategories: any[] = [];
  progress: NumMap = {};
  downloadUrls: UrlMap = {};
  display = 'none';
  picturebackground?: string;

  // flags (si tu veux, tu peux les binder à des toggles)
  isExclu = 'non';
  isHeartStroke = 'non';
  isLicenceBase = 'non';
  isPremium = 'non';
  isLicenceBaseCreatoke = 'non';
  isPremiumCreatoke = 'non';

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private songService: SongService,
    private uploader: UploadService
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
      subcategory: ['', Validators.required],
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
    });
  }

  ngOnInit(): void {
    this.categoryService.getSubCategory().then((res) => {
      this.subcategory = res.data || [];
    });
    this.categoryService.getBackgroundImg().then(r => {
      this.picturebackground = r.data?.[0]?.picture;
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onCategoryChange(event: Event) {
    const selected = (event.target as HTMLSelectElement)?.value || '';
    this.filteredSubcategories = selected
      ? this.subcategory.filter(s => String(s.category) === selected)
      : [];
  }

  onFileSelected(event: Event, fileType: string) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const { progress$, downloadUrl$ } = this.uploader.startUpload(file, fileType, 'songs');

    // Maj de la progression
    this.subs.add(progress$.subscribe(p => {
      this.progress[fileType] = p;
    }));

    // Récupérer l’URL finale et la ranger dans downloadUrls[fileType]
    this.subs.add(downloadUrl$.subscribe(url => {
      this.downloadUrls[fileType] = url;
      // Option: patcher tout de suite les champs liés
      const patch: Partial<Record<string, string>> = {};
      patch[fileType] = url; // si les noms de fileType == noms de champs
      this.musicForm.patchValue(patch);
    }));
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
    Object.keys(payload).forEach((k) => {
      // @ts-ignore — on sait que payload est un index signature ici
      payload[k] = ensureValue(payload[k], k === 'image' ? placeholderImage : 'vide');
    });

    return payload;
  }

  addMusic(): void {
    if (!this.musicForm.valid) {
      alert('Merci de remplir les champs');
      return;
    }
    const payload = this.buildPayload();

    this.songService.createSong(payload)
      .catch(err => console.error(err));
  }

  openModal() { this.display = 'block'; }
  onCloseHandled() { this.display = 'none'; }
}