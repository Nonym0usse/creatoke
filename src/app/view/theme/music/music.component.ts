// music.component.ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { SongService } from "../../../core/services/api/song.service";
import { CategoryService } from "../../../core/services/api/category.service";
import type { Song } from "src/app/core/models/song.model";
import { SectionService, type Section } from "../../../core/services/api/section.service";

interface CategoryInfo {
  label: string;
  icon: string;
  description: string;
}

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
  // Autres rubriques (pastilles en bas de page), lues dans l'API (SectionService).
  otherCategories: (CategoryInfo & { key: string })[] = [];
  private sections: Section[] = [];

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
    private docTitle: Title,
    private sectionService: SectionService
  ) {}

  ngOnInit(): void {
    // background (1x)
    this.categoryService
      .getBackgroundImg()
      .then((r) => (this.picturebackground = r?.data?.[0]?.picture ?? null))
      .catch(() => (this.picturebackground = null));

    // rubriques : d'abord celles d'origine, puis celles de l'API
    this.sectionService.sections$.pipe(takeUntil(this.destroy$)).subscribe((sections) => {
      this.sections = sections;
      this.applySection();
    });

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

  // En-tête, titre de l'onglet et pastilles d'après la rubrique affichée.
  private applySection() {
    const section = this.sections.find((s) => s.slug === this.categoryKey);
    this.category = section ? { label: section.label, icon: section.icon, description: section.description } : DEFAULT_CATEGORY;
    this.title = this.category.label;
    this.docTitle.setTitle(`${this.category.label} | Creatoke`);
    this.otherCategories = this.sections
      .filter((s) => s.slug !== this.categoryKey)
      .map((s) => ({ key: s.slug, label: s.label, icon: s.icon, description: s.description }));
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
    this.applySection();

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

}