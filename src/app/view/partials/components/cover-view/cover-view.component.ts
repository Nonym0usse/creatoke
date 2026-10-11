import { Component, Input } from "@angular/core";
import { PlayerService } from "../../../../core/services/design/player.service";
import { Song } from "src/app/core/models/song.model";

@Component({
  selector: "app-cover-view",
  templateUrl: "./cover-view.component.html",
})
export class CoverViewComponent {
  @Input() songs: Song[] = [];
  @Input() isHome: boolean = false;
  // Classes de colonne des cartes (hors accueil) : surchargeable pour une grille plus dense.
  @Input() colClass = "col-6 col-md-4 col-xl-3";
  @Input() coverLink = false;
  @Input() viewDropdown = true;
  @Input() viewPlayButton = true;
  @Input() viewQueueOptions = true;
  @Input() viewFavorite = true;
  @Input() viewPlaylist = true;

  constructor(private playerService: PlayerService) {}

  play(event: any, song: Song): void {
    const newSong = { ...song, url: song.url || (song as any).creatoke };
    this.playerService.songPlayPause(event, newSong);
  }

  trackById(_: number, s: any) {
    return s.id || s.firestoreID || s.url || s.title;
  }
}