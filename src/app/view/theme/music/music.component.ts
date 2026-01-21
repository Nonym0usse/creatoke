import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject, from, of } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  takeUntil,
  switchMap,
  tap,
  catchError,
} from 'rxjs/operators';
import { CategoryService } from "../../../core/services/api/category.service";

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit, OnDestroy {
  subCategory: any[] = [];
  title = '';
  picturebackground: string | null = null;

  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private docTitle: Title,
  ) {}

  ngOnInit(): void {
    // Background une seule fois
    this.categoryService.getBackgroundImg()
      .then(r => {
        this.picturebackground = r?.data?.[0]?.picture ?? null;
      })
      .catch(() => {
        this.picturebackground = null;
      });

    // Params -> title + data
    this.route.paramMap.pipe(
      map(pm => (pm.get('category') ?? '').trim()),
      distinctUntilChanged(),

      tap(category => {
        // reset UI
        this.error = null;
        this.loading = true;
        this.subCategory = [];

        // title component + title onglet
        this.title = this.mapTitle(category);
        this.docTitle.setTitle(`${this.title} | Creatoke`);
      }),

      switchMap(category =>
        from(this.categoryService.getSubCategoryByID({ category })).pipe(
          catchError((err) => {
            console.error('getSubCategoryByID error:', err);
            this.error = "Impossible de charger les chansons.";
            return of({ data: [] as any[] });
          })
        )
      ),

      tap(() => {
        this.loading = false;
      }),

      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.subCategory = res?.data ?? [];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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