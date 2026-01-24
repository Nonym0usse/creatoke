import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { PlayerService } from "../../../../core/services/design/player.service";
import { Song } from "src/app/core/models/song.model";

@Component({
  selector: "app-cover-view",
  templateUrl: "./cover-view.component.html",
})
export class CoverViewComponent implements OnChanges {
  @Input() songs: Song[] = [];
  @Input() isHome: boolean = false;
  @Input() coverLink = false;
  @Input() viewDropdown = true;
  @Input() viewPlayButton = true;
  @Input() viewQueueOptions = true;
  @Input() viewFavorite = true;
  @Input() viewPlaylist = true;

  constructor(private playerService: PlayerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["songs"]) {
      console.log("songs updated:");
    }
  }

  ngOnInit(): void {
    console.log("CoverViewComponent initialized with songs:", this.songs, typeof this.songs);
  }

  play(event: any, song: Song): void {
    const newSong = { ...song, url: song.url || (song as any).creatoke };
    this.playerService.songPlayPause(event, newSong);
  }

  trackById(_: number, s: any) {
    return s.id || s.firestoreID || s.url || s.title;
  }
}