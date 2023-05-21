// Angular
import { Component, Input, OnInit } from '@angular/core';

// Services
import { PlayerService } from './../../../../core/services/design/player.service';


@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html'
})
export class ListViewComponent implements OnInit {

  // Holds data to view
  @Input() data: any;

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

  // Flag to view download option
  @Input() viewDownload: boolean = false;

  // Flag to view song duration
  @Input() viewTime: boolean = true;

  constructor(
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Play song
   * @param event
   */
  play(event: any): void {
    this.playerService.songPlayPause(event, this.data);
  }

}
