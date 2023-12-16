// Angular
import { Component, Input, OnInit } from '@angular/core';

// Services
import { PlayerService } from './../../../../core/services/design/player.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cover-view',
  templateUrl: './cover-view.component.html'
})
export class CoverViewComponent implements OnInit {

  // Holds data to view
  @Input() data: any;

  // Flag for link on cover
  @Input() coverLink: boolean = false;

  // Flag to view dropdown element
  @Input() viewDropdown: boolean = true;

  // Flag to view play button
  @Input() viewPlayButton: boolean = true;

  // Flag to view option like [add in queue, play next]
  @Input() viewQueueOptions: boolean = true;

  // Flag to view favorite option
  @Input() viewFavorite: boolean = true;

  // Flag to view playlist option
  @Input() viewPlaylist: boolean = true;

  constructor(
    private playerService: PlayerService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Play song
   * 
   * @param event 
   */

  play(event: any): void {
    console.log(this.data)
    if (this.data.exclu == "non") {
      this.playerService.songPlayPause(event, this.data);
    } else {
      this.router.navigateByUrl(`/song/${this.data.category}/${this.data.subcategory}/${this.data.id}/view`);
    }
  }
}
