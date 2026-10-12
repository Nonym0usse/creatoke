import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConstant } from '../../constants/api-constant';

// Rubriques du catalogue (« Chansons à chanter », « Instrumentaux »…), lues dans
// l'API (table sections). Elles peuvent être créées depuis l'assistant IA.

export interface Section {
  slug: string;
  label: string;
  icon: string;
  description: string;
  /** Fin du titre « Acheter … » sur les fiches (« la chanson à chanter »). */
  item_label: string;
  /** La rubrique propose une version créatoké (fichiers et prix). */
  has_creatoke: boolean;
  /** Les paroles sont proposées. */
  has_lyrics: boolean;
  position: number;
}

// Rubriques d'origine : affichées tout de suite, et si l'API ne répond pas.
export const DEFAULT_SECTIONS: Section[] = [
  { slug: 'chansons-a-chanter', label: 'Chansons à chanter', icon: 'ri-mic-line', description: 'Des chansons originales à interpréter, avec leur version créatoké pour chanter dessus.', item_label: 'la chanson à chanter', has_creatoke: true, has_lyrics: true, position: 10 },
  { slug: 'chansons-cherche-auteur', label: 'Chanson(s) cherche auteur', icon: 'ri-quill-pen-line', description: 'Des chansons en quête d\'auteur.', item_label: 'la chanson cherche auteur', has_creatoke: true, has_lyrics: true, position: 20 },
  { slug: 'instrumentaux', label: 'Instrumentaux', icon: 'ri-music-2-line', description: 'Des compositions instrumentales originales.', item_label: 'l\'instrumental', has_creatoke: false, has_lyrics: false, position: 30 },
  { slug: 'musique-de-contenus', label: 'Musique de contenus', icon: 'ri-film-line', description: 'Des musiques pour habiller vos vidéos, podcasts et contenus.', item_label: 'la musique de contenu', has_creatoke: false, has_lyrics: false, position: 40 },
  { slug: 'creacourcis', label: 'Créacourcis', icon: 'ri-flashlight-line', description: 'Des créations courtes et originales.', item_label: 'le créacourcis', has_creatoke: false, has_lyrics: true, position: 50 },
  { slug: 'virgules-sonores', label: 'Virgules sonores', icon: 'ri-sound-module-line', description: 'De courtes signatures sonores pour ponctuer vos contenus.', item_label: 'la virgule sonore', has_creatoke: false, has_lyrics: true, position: 60 },
];

@Injectable({ providedIn: 'root' })
export class SectionService {
  private readonly sectionsSubject = new BehaviorSubject<Section[]>(DEFAULT_SECTIONS);
  private loaded = false;

  /** Liste à jour (d'abord les rubriques d'origine, puis celles de l'API). */
  get sections$(): Observable<Section[]> {
    this.load();
    return this.sectionsSubject.asObservable();
  }

  get sections(): Section[] {
    this.load();
    return this.sectionsSubject.value;
  }

  find(slug: string | null | undefined): Section | undefined {
    return this.sections.find((s) => s.slug === slug);
  }

  /** Relit les rubriques (après un ajout, par exemple). */
  refresh(): void {
    this.loaded = false;
    this.load();
  }

  private load(): void {
    if (this.loaded) return;
    this.loaded = true;
    axios
      .get<{ data: Section[] }>(`${ApiConstant.API}/sections`)
      .then((res) => {
        if (Array.isArray(res.data?.data) && res.data.data.length) this.sectionsSubject.next(res.data.data);
      })
      .catch((error) => {
        console.error('Sections:', error);
        this.loaded = false; // nouvel essai au prochain affichage
      });
  }
}
