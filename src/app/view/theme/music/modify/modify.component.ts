// modify.component.ts (refactor complet)
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/compat/storage";
import { finalize, Subject, takeUntil } from "rxjs";

import { SongService } from "../../../../core/services/api/song.service";
import { CategoryService } from "../../../../core/services/api/category.service";

type OuiNon = "oui" | "non";

type UploadKey =
  | "url"
  | "creatoke"
  | "chanson_mp3"
  | "chanson_wav"
  | "creatoke_mp3"
  | "creatoke_wav"
  | "image";


interface PlayerBlock {
  key: UploadKey;
  label: string;
  accept: string;
  play?: boolean;
  hideWhenCategoryIn?: string[]; // ex: ["instrumentaux", ...]
}

@Component({
  selector: "app-modify",
  templateUrl: "./modify.component.html",
  styleUrls: ["./modify.component.scss"],
})
export class ModifyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Form + data
  musicForm: FormGroup;
  song: any = {}; // évite undefined dans le template

  // Background
  picturebackground: string = "";

  // Modal
  display = "none";

  // Upload/progress
  progress: Record<string, number> = {};
  downloadUrls: Partial<Record<UploadKey, string>> = {};

  // Audio
  audioMap: Record<string, HTMLAudioElement> = {};
  playingMap: Record<string, boolean> = {};

  // Options category (utilisées en HTML)
  readonly categories = [
    { value: "chansons-a-chanter", label: "Publier dans les chansons à chanter" },
    { value: "creacourcis", label: "Publier dans les creacourcis" },
    { value: "virgules-sonores", label: "Publier dans virgules sonores" },
    { value: "chansons-cherche-auteur", label: "Publier dans les chanson(s) cherche auteur" },
    { value: "instrumentaux", label: "Publier dans les instrumentaux" },
    { value: "musique-de-contenus", label: "Musique de contenu" },
  ] as const;

  // Config “players/uploads” (utilisée en ngFor dans le HTML)
  readonly playerBlocks: PlayerBlock[] = [
    {
      key: "url",
      label: "Chanson (player client web) .mp3",
      accept: ".mp3,audio/mpeg",
      play: true,
    },
    {
      key: "creatoke",
      label: "Creatoke (player client web) .mp3",
      accept: ".mp3,audio/mpeg",
      play: true,
      hideWhenCategoryIn: ["instrumentaux", "musique-de-contenus", "virgules-sonores"],
    },
    {
      key: "chanson_mp3",
      label: "Chanson au format mp3",
      accept: ".mp3,audio/mpeg",
      play: true,
    },
    {
      key: "chanson_wav",
      label: "Chanson au format .wav",
      accept: ".wav,audio/wav,audio/x-wav",
      play: true,
    },
    {
      key: "creatoke_mp3",
      label: "Creatoke au format mp3",
      accept: ".mp3,audio/mpeg",
      play: true,
      hideWhenCategoryIn: ["instrumentaux", "musique-de-contenus", "virgules-sonores"],
    },
    {
      key: "creatoke_wav",
      label: "Créatoké wav",
      accept: ".wav,audio/wav,audio/x-wav",
      play: true,
      hideWhenCategoryIn: ["instrumentaux", "musique-de-contenus", "virgules-sonores"],
    },
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private songService: SongService,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) {
    this.musicForm = this.fb.group({
      title: ["", Validators.required],
      artist: ["", Validators.required],
      lyrics: [""],
      description: ["", Validators.required],

      price_base: [0],
      price_premium: [0],
      price_base_creatoke: [0],
      price_premium_creatoke: [0],

      category: ["", Validators.required],

      exclu: ["non" as OuiNon, Validators.required],
      isHeartStroke: ["non" as OuiNon],

      isLicenceBase: ["non" as OuiNon],
      isPremium: ["non" as OuiNon],
      isLicenceBaseCreatoke: ["non" as OuiNon],
      isPremiumCreatoke: ["non" as OuiNon],

      youtubeURL: [""],
      spotifyURL: [""],
      message: [""],
      id: [""],
    });
  }

  // ------------ Lifecycle ------------
  ngOnInit(): void {
    // route id -> load song
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((param) => {
      const slug = param["slug"];
      if (slug) this.getSong(slug);
    });

    // background
    this.getBackground();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // stop all audios
    Object.keys(this.audioMap).forEach((k) => {
      const a = this.audioMap[k];
      if (!a) return;
      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
    });
  }

  // ------------ Getters for template ------------
  get categoryValue(): string {
    return (this.musicForm.get("category")?.value ?? "").toString().trim();
  }

  get excluValue(): OuiNon {
    return (this.musicForm.get("exclu")?.value ?? "non") as OuiNon;
  }

  get showLyrics(): boolean {
    // CKEditor: keep in DOM via [hidden] (avoid duplication errors)
    const c = this.categoryValue;
    return !!c && !["instrumentaux", "musique-de-contenus", "virgules-sonores", "creacourcis"].includes(c);
  }

  get showMessage(): boolean {
    return this.excluValue === "non";
  }

  get showSongPrices(): boolean {
    // logique initiale: cacher si exclu == oui ET category dans (chansons-a-chanter, chansons-cherche-auteur)
    if (this.excluValue !== "oui") return true;
    const c = this.categoryValue;
    return !["chansons-a-chanter", "chansons-cherche-auteur"].includes(c);
  }

  get showCreatokePrices(): boolean {
    const c = this.categoryValue;
    return !["instrumentaux", "musique-de-contenus", "virgules-sonores"].includes(c);
  }

  // ------------ Data loading ------------
  async getBackground() {
    const r = await this.categoryService.getBackgroundImg();
    this.picturebackground = r.data?.[0]?.picture ?? "";
  }


  private async getSong(slug: string) {
    const res = await this.songService.getSongBySlug(slug);
    this.song = res.data ?? {};

    this.musicForm.patchValue({
      title: this.song.title ?? "",
      artist: this.song.artist ?? "",
      lyrics: this.song.lyrics ?? "",
      description: this.song.description ?? "",

      price_base: Number(this.song.price_base_chanson ?? 0),
      price_premium: Number(this.song.price_premium ?? 0),
      price_base_creatoke: Number(this.song.price_base_creatoke ?? 0),
      price_premium_creatoke: Number(this.song.price_premium_creatoke ?? 0),

      category: this.song.category ?? "",

      youtubeURL: this.song.youtubeURL ?? "",
      spotifyURL: this.song.spotifyURL ?? "",

      id: this.song.id ?? "",

      exclu: (this.song.exclu ?? "non") as OuiNon,
      isHeartStroke: (this.song.isHeartStroke ?? "non") as OuiNon,

      isLicenceBase: (this.song.isLicenceBase ?? "non") as OuiNon,
      isPremium: (this.song.isPremium ?? "non") as OuiNon,
      isLicenceBaseCreatoke: (this.song.isLicenceBaseCreatoke ?? "non") as OuiNon,
      isPremiumCreatoke: (this.song.isPremiumCreatoke ?? "non") as OuiNon,

      message: this.song.message ?? "",
    });

  }

  // ------------ Player Blocks helpers for template ------------
  trackByBlock(_: number, b: PlayerBlock) {
    return b.key;
  }

  showBlock(block: PlayerBlock): boolean {
    const c = this.categoryValue;
    if (block.hideWhenCategoryIn?.includes(c)) return false;
    return true;
  }

  getMediaUrl(key: UploadKey): string {
    // priorité: nouvel upload -> sinon valeur existante song
    const url = (this.downloadUrls[key] ?? this.song?.[key] ?? "").toString();
    return url.trim();
  }

  hasMediaUrl(key: UploadKey): boolean {
    return this.getMediaUrl(key).length > 0;
  }

  // ------------ Audio ------------
  playSong(key: string, url?: string) {
    const u = (url ?? "").trim();
    if (!u) return;

    // stop all
    Object.keys(this.audioMap).forEach((k) => {
      const a = this.audioMap[k];
      if (!a) return;
      a.pause();
      a.currentTime = 0;
      this.playingMap[k] = false;
    });

    const audio = new Audio(u);
    this.audioMap[key] = audio;
    this.playingMap[key] = true;

    audio.play().catch(() => {
      this.playingMap[key] = false;
    });

    audio.onended = () => {
      this.playingMap[key] = false;
    };
  }

  stopSong(key: string) {
    const audio = this.audioMap[key];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    this.playingMap[key] = false;
  }

  // ------------ Upload ------------
  onFileSelected(event: Event, fileType: UploadKey) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    // garde-fous
    const maxMb = 80;
    if (file.size > maxMb * 1024 * 1024) {
      alert(`Fichier trop lourd (max ${maxMb}MB)`);
      input.value = "";
      return;
    }

    this.startUpload(file, fileType);
    input.value = ""; // permet de re-selectionner le même fichier
  }

  private startUpload(file: File, fileType: UploadKey): void {
    const filePath = `songs/${file.name}`;
    const fileRef = this.storage.ref(filePath);

    const task: AngularFireUploadTask = this.storage.upload(filePath, file);

    this.progress[fileType] = 0;
    task
      .percentageChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((p) => {
        const val = p ?? 0;
        this.progress[fileType] = Math.round(val * 100) / 100;
      });

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef
            .getDownloadURL()
            .pipe(takeUntil(this.destroy$))
            .subscribe((url: string) => {
              this.downloadUrls[fileType] = url;
            });
        })
      )
      .subscribe();
  }

  // ------------ Modal ------------
  openModal() {
    this.display = "block";
  }

  onCloseHandled() {
    this.display = "none";
  }

  // ------------ Save ------------
  async modifyMusic(): Promise<void> {
    if (!this.musicForm.valid) {
      alert("Merci de remplir les champs");
      return;
    }

    const v = this.musicForm.getRawValue();

    // payload propre (ne pas muter musicForm.value)
    const payload: any = {
      ...v,
      title: (v.title ?? "").toString().toUpperCase(),

      url: this.getMediaUrl("url"),
      creatoke: this.getMediaUrl("creatoke"),
      chanson_mp3: this.getMediaUrl("chanson_mp3"),
      chanson_wav: this.getMediaUrl("chanson_wav"),
      creatoke_mp3: this.getMediaUrl("creatoke_mp3"),
      creatoke_wav: this.getMediaUrl("creatoke_wav"),

      image: (this.downloadUrls.image ?? this.song?.image ?? "https://placehold.co/600x400").toString(),
    };

    await this.songService.modifySong(payload);
    alert("Chanson modifiée");
  }


  getOriginalFilenameFromFirebaseUrl(url?: string) {
    const s = (url ?? "").trim();
    if (!s) return "";
    try {
      const u = new URL(s);
      const encodedPathPart = u.pathname.split("/o/")[1] || "";
      const decodedFullPath = decodeURIComponent(encodedPathPart);
      return decodedFullPath.split("/").pop() || "";
    } catch {
      return "";
    }
  }
}