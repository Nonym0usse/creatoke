// Angular
import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { PlayerService } from './../../../core/services/design/player.service';
import { ThemeService } from './../../../core/services/design/theme.service';

// Constant classes
import { Constant } from './../../../core/constants/constant';
import { Utils } from './../../../core/utils/utils';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  // Component attributes
  @HostBinding('id') id = 'player';
  @HostBinding('class') classes = '';
  @HostBinding('attr.' + Constant.PLAYER) attrPlayer = '';

  // Volume HTML element
  @ViewChild('volume') volume: ElementRef<any> | undefined;

  // Holds song object
  song: any = {};

  // Holds playlist
  playlist: any = [];

  // Router subscription
  private routerSubscription: Subscription | undefined;

  // Song subscription
  private songSubscription: Subscription | undefined;

  // Playlist subscription
  private playlistSubscription: Subscription | undefined;

  // Player theme subscription
  private playerSubscription: Subscription | undefined;

  // Theme subscription
  themeSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private playerService: PlayerService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.routerSubscription = this.router.events?.subscribe(event => {
      if (event instanceof NavigationEnd && this.playerService.isPlaying) {
        setTimeout(() => {
          this.playerService.buttonAddClass();
        }, 10);
      }
    });

    this.songSubscription = this.playerService.song.subscribe((value) => {
      this.song = value;
      this.ref.detectChanges();
    });

    this.playlistSubscription = this.playerService.playlist.subscribe((value) => {
      this.playlist = value;
      this.ref.detectChanges();
    });

    this.playerSubscription = this.themeService.player.subscribe((color) => {
      this.attrPlayer = color;
    });

    this.themeSubscription = this.themeService.themeMode.subscribe((value) => {
      setTimeout(() => {
        this.playerService.volumeBackground();
      }, 10);
    });
  }

  ngAfterViewInit(): void {
    const volumeRange = this.volume?.nativeElement.querySelector('input[type="range"]');
    this.playerService.setupPlayer(volumeRange);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.songSubscription?.unsubscribe();
    this.playlistSubscription?.unsubscribe();
    this.playerSubscription?.unsubscribe();
    this.themeSubscription?.unsubscribe();
  }

  /**
   * Play song
   * @param event
   */
  play(event: any, id: number): void {
    const index = this.playerService.getSongIndex(id);
    if (index > -1) {
      this.playerService.songPlayPause(event, this.playlist[index]);
    }
  }

  /**
   * Play pause song on click
   */
  playPause(): void {
    this.playerService.onSongChange();
  }

  /**
   * Remove song from playlist
   * @param id
   */
  removeSong(id: number): void {
    this.playerService.removeSong(id);
  }

  /**
   * Clear playlist
   */
  clearPlaylist(): void {
    this.playerService.emptyPlaylist();
  }

  /**
   * Set icon & gradient on volume change
   * @param event
   */
  onVolumeChange(event: any): void {
    const mute = this.volume?.nativeElement.querySelector('.ri-volume-mute-fill');
    const down = this.volume?.nativeElement.querySelector('.ri-volume-down-fill');
    const up = this.volume?.nativeElement.querySelector('.ri-volume-up-fill');
    const block = 'd-block';
    const none = 'd-none';
    const value = parseInt(event.target.value);

    this.playerService.volumeBackground();

    // Change icon volume on input value
    if (value === 0) {
      Utils.removeClass(mute, none);
      Utils.addClass(mute, block);
      Utils.addClass(down, none);
      Utils.addClass(up, none);

    } else if (value > 0 && value < 70) {
      Utils.addClass(mute, none);
      Utils.removeClass(down, none);
      Utils.addClass(down, block);
      Utils.addClass(up, none);

    } else if (value > 70) {
      Utils.addClass(mute, none);
      Utils.addClass(down, none);
      Utils.removeClass(up, none);
      Utils.addClass(up, block);
    }
  }

}
