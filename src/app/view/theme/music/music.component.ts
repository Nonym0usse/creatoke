// music.component.ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { SongService } from "../../../core/services/api/song.service";
import { CategoryService } from "../../../core/services/api/category.service";
import type { Song } from "src/app/core/models/song.model";

@Component({
  selector: "app-music",
  templateUrl: "./music.component.html",
  styleUrls: ["./music.component.scss"],
})
export class MusicComponent implements OnInit, OnDestroy {
  songs: Song[] = [];
  title = "";
  picturebackground: string | null = null;

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

  private loadCategory(category: string) {
    this.loading = true;
    this.error = null;
    this.songs = [];

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