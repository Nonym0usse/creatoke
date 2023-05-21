// Angular
import { Component, HostBinding, Input, OnInit } from '@angular/core';

// Services
import { PlayerService } from './../../../core/services/design/player.service';


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements OnInit {

  // Component classes
  @HostBinding('class') @Input() classes = 'dropdown';

  // Dropdown link classes
  @Input() dropdownLinkClasses: string = 'dropdown-link';

  // Holds data to view
  @Input() data: any;

  // Flag to view dropdown element
  @Input() viewDropdown: boolean = true;

  // Flag to view option like [add in queue, play next]
  @Input() viewQueueOptions: boolean = true;

  // Flag to view favorite option
  @Input() viewFavorite: boolean = true;

  // Flag to view playlist option
  @Input() viewPlaylist: boolean = true;

  // Flag to view play option
  @Input() viewPlay: boolean = true;

  // Flag to view download option
  @Input() viewDownload: boolean = false;

  // Flag to view vertical icon
  @Input() iconVertical: boolean = true;

  constructor(
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    if (!this.classes) {
      this.classes = '';
    }
  }

  /**
   * Play song & playlist
   * @param event 
   */
  play(event: any): void {
    this.data.songs && this.data.songs.length ? 
    this.playerService.playSongs(event, this.data) : 
    this.playerService.songPlayPause(event, this.data);
  }

  /**
   * Add song in the queue
   */
  addToQueue(): void {
    this.playerService.addToQueue(this.data);
  }

  /**
   * Add song to play in next
   */
  nextToPlay(): void {
    this.playerService.nextToPlay(this.data);
  }

}
