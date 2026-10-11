// music.component.ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { SongService } from "../../../core/services/api/song.service";
import { CategoryService } from "../../../core/services/api/category.service";
import type { Song } from "src/app/core/models/song.model";

interface CategoryInfo {
  label: string;
  icon: string;
  description: string;
}

// Même icône que dans la barre latérale (core/constants/constant.ts).
const CATEGORIES: Record<string, CategoryInfo> = {
  "chansons-a-chanter": { label: "Chansons à chanter", icon: "ri-mic-line", description: "Des chansons originales à interpréter, avec leur version créatoké pour chanter dessus." },
  "chansons-cherche-auteur": { label: "Chanson(s) cherche auteur", icon: "ri-quill-pen-line", description: "Des chansons en quête d'auteur." },
  "instrumentaux": { label: "Instrumentaux", icon: "ri-music-2-line", description: "Des compositions instrumentales originales." },
  "musique-de-contenus": { label: "Musique de contenus", icon: "ri-film-line", description: "Des musiques pour habiller vos vidéos, podcasts et contenus." },
  "creacourcis": { label: "Créacourcis", icon: "ri-flashlight-line", description: "Des créations courtes et originales." },
  "virgules-sonores": { label: "Virgules sonores", icon: "ri-sound-module-line", description: "De courtes signatures sonores pour ponctuer vos contenus." },
};

const DEFAULT_CATEGORY: CategoryInfo = { label: "Musiques", icon: "ri-music-2-line", description: "" };

@Component({
  selector: "app-music",
  templateUrl: "./music.component.html",
  styleUrls: ["./music.component.scss"],
})
export class MusicComponent implements OnInit, OnDestroy {
  songs: Song[] = [];
  title = "";
  picturebackground: string | null = null;

  // Catégorie affichée (en-tête) et autres catégories (pastilles en bas de page)
  category: CategoryInfo = DEFAULT_CATEGORY;
  categoryKey = "";
  readonly categories = Object.entries(CATEGORIES).map(([key, info]) => ({ key, ...info }));

  // Filtre par titre / interprète (affiché au-delà de FILTER_THRESHOLD titres)
  filter = "";
  readonly FILTER_THRESHOLD = 6;

  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private songService: SongService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private docTitle: Title
  ) {}

  ngOnInit(): void {
    // background (1x)
    this.categoryService
      .getBackgroundImg()
      .then((r) => (this.picturebackground = r?.data?.[0]?.picture ?? null))
      .catch(() => (this.picturebackground = null));

    // category -> fetch songs
    this.route.paramMap
      .pipe(
        map((pm) => (pm.get("category") ?? "").trim()),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((category) => {
        this.loadCategory(category);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filteredSongs(): Song[] {
    const q = this.normalize(this.filter);
    if (!q) return this.songs;
    return this.songs.filter((s) => this.normalize(`${s.title ?? ""} ${s.artist ?? ""}`).includes(q));
  }

  get otherCategories() {
    return this.categories.filter((c) => c.key !== this.categoryKey);
  }

  private normalize(text: string): string {
    return (text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  private loadCategory(category: string) {
    this.loading = true;
    this.error = null;
    this.songs = [];
    this.filter = "";
    this.categoryKey = category;
    this.category = CATEGORIES[category] ?? DEFAULT_CATEGORY;

    const t = this.mapTitle(category);
    this.title = t;
    this.docTitle.setTitle(`${t} | Creatoke`);

    // ✅ payload: adapte si ton API attend autre chose
    this.songService
      .getSongByCategory({ category })
      .then((res) => {
        this.songs = res?.data ?? [];
        this.loading = false;
      })
      .catch((err) => {
        console.error("getSongByCategory error:", err);
        this.error = "Impossible de charger les chansons.";
        this.loading = false;
        this.songs = [];
      });
  }

  // ------- URL helpers -------
  private slugify(str: string) {
    return (str ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  songLink(song: any) {
    const cat = this.slugify(song?.category);
    const slug = this.slugify(song?.title || song?.artist || "song");
    return ["/song", cat, `${slug}--${song?.id}`];
  }

  private mapTitle(param: string): string {
    switch (param) {
      case "chansons-a-chanter": return "Chansons à chanter 🎤";
      case "creacourcis": return "Créacourcis 🎤";
      case "virgules-sonores": return "Virgules sonores 🎤";
      case "instrumentaux": return "Instrumentaux 🎶";
      case "musique-de-contenus": return "Musique de contenus 🖥️";
      case "chansons-cherche-auteur": return "Chanson(s) cherche auteur 🎙️";
      default: return "Musiques 🎶";
    }
  }
}