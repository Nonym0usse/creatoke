// Angular
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Amplitude js
import * as Amplitude from 'amplitudejs';

// Constant classes
import { Constant } from './../../constants/constant';
import { Utils } from '../../utils/utils';
import {SongService} from "../api/song.service";


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // Holds document element
  doc = Utils.doc;

  // Holds volume HTML
  volume: any;

  // Holds songs
  songs: any = [];

  // Hold flags for media session
  mediaControls: any = {
    playPause: false,
    nextPrev: false
  };

  // Song observer
  private song$ = new BehaviorSubject<any>(null);

  // Playlist observer
  private playlist$ = new BehaviorSubject<any>(null);

  constructor(private songService: SongService) { }

  /**
   * Get songs from player
   */
  get playerSongs() {
    return Amplitude.getSongs();
  }

  /**
   * Get player active song
   */
  get activeSong() {
    return Amplitude.getActiveSongMetadata();
  }

  /**
   * Get player is playing or not
   */
  get isPlaying() {
    return (Amplitude.getPlayerState() === 'playing');
  }

  /**
   * Get songs from local storage
   */
  get localSongs() {
    const songs = localStorage.getItem(Constant.SONG_KEY);
    // @ts-ignore
    const songList = JSON.parse(songs);
    //console.log(songList)
    return songList;
  }

  /**
   * Set songs in local storage
   */    
  
  set localSongs(songs: any) {
    this.songService.getAllSongs()
      .then((music) => {
        if (!music.data) {
          return;
        }
        const songsWithUrl = music.data
          .filter(song => song && !song.url) // Filter out songs without a URL
          .map(song => ({ ...song, url: song.creatoke })); // Map to new array with URLs
  
        // Overwrite the existing value in localStorage
        localStorage.setItem(Constant.SONG_KEY, JSON.stringify(songsWithUrl));
      })
      .catch(error => {
        console.error('Error fetching songs:', error);
        // Handle any errors here, like notifying the user
      });
  }

  /**
   * Emit song
   */
  set emitSong(song: any) {
    this.song$?.next(song);
  }

  get song() {
    return this.song$;
  }

  /**
   * Emit playlist
   */
  set emitPlaylist(songs: any) {
    this.playlist$?.next(songs);
  }

  get playlist() {
    return this.playlist$;
  }

  /**
   * Set songs in local storage & emit it
   */
  setSongs(): void {
    this.emitPlaylist = this.localSongs = this.songs;
  }

  /**
   * Get index of song by it's id
   * @param id
   * @returns {number}
   */
  getSongIndex(id: number): number {
    return this.songs?.findIndex((song: { id: any; }) => song.id === id);
  }

  /**
   * Get suitable object to add in player
   * @param data
   * @returns {object}
   */
  getSongObject(data: any): object {
    data.cover_art_url = data.image;
    return data;
  }

  /**
   * Play player
   */
  play(): void {
    Amplitude.play();
  }

  /**
   * Pause player
   */
  pause(): void {
    Amplitude.pause();
  }

  /**
   * Remove class from play button
   */
  buttonRemoveClass(): void {
    const buttonListEl = this.doc.querySelectorAll('[data-play-id]');
    const collectionButtonListEl = this.doc.querySelectorAll('[data-collection-play-id]');

    Array.from(buttonListEl).forEach(el => {
      Utils.removeClass(el, Constant.ACTIVE);
    });

    if (collectionButtonListEl) {
      Array.from(collectionButtonListEl).forEach(el => {
        Utils.removeClass(el, Constant.ACTIVE);
      });
    }
  }

  /**
   * Add class on play button
   */
  buttonAddClass(): void {
    const buttonEl = this.doc.querySelectorAll('[data-play-id="' + this.activeSong.id + '"]');

    Array.from(buttonEl).forEach(el => {
      Utils.addClass(el, Constant.ACTIVE);
    });
  }

  /**
   * Change player play/pause button classes
   * @param playing
   */
  playButtonToggleClass(playing: boolean = false): void {
    const buttonEl = this.doc.querySelectorAll('.amplitude-play-pause');
    const play = 'amplitude-playing';
    const pause = 'amplitude-paused';

    Array.from(buttonEl).forEach(el => {
      if (playing) {
        Utils.removeClass(el, pause);
        Utils.addClass(el, play);
      } else {
        Utils.removeClass(el, play);
        Utils.addClass(el, pause);
      }
    });
  }

  /**
   * Set volume slider background gradient
   */
  volumeBackground(): void {
    const value = parseInt(this.volume.value, 10);

    // Change input background gradient
    const color = Constant.DARK_MODE ? '255, 255, 255' : Utils.getCSSVarValue('dark-rgb');
    const gradient = 'linear-gradient(to right, rgb(' +
    color + ') 0%, rgb(' + color + ') ' + value + '%, rgba(' +
    color + ', 0.2) ' + value + '%, rgba(' + color + ', 0.2) 100%)';

    this.volume.style.background = gradient;
  }

  /**
   * Setup player if songs added in the local storage
   * @param volumeEl
   */
  setupPlayer(volumeEl: any): void {
    this.volume = volumeEl;
    if (this.localSongs && this.localSongs.length) {
      this.songs = this.localSongs;
      this.initPlayer(false);

      // Add and remove class to player play pause button
      this.playButtonToggleClass();
    }
  }

  /**
   * Initialize Amplitude audio player
   * @param isPlay
   */
  initPlayer(isPlay: boolean = true): void {
    Utils.addClass(document.getElementById('player'), Constant.SHOW);

    if (this.playerSongs && this.playerSongs.length === 1) {
      this.pause();
      // Change volume input background
      this.volumeBackground();
    }

    // Init Amplitude plugin
    Amplitude.init({
      songs: this.songs,
      callbacks: {
        song_change: () => {
          this.onSongChange(); // Change play pause button view
        }
      }
    });

    this.emitSong = this.songs[0];
    this.emitPlaylist = this.songs;

    // Add and remove class to player play pause button
    this.playButtonToggleClass(true);

    if (isPlay) {
      this.play();
      this.mediaSession();
    }
  }

  /**
   * Change song data on song change
   */
  onSongChange(): void {
    this.mediaSession();
    setTimeout(() => {
      this.buttonRemoveClass();
      this.emitSong = this.activeSong;

      if (this.isPlaying) {
        this.buttonAddClass();
      }
    }, 0);
  }

  /**
   * Play & pause song on button click
   * @param event
   * @param data
   */
  songPlayPause(event: any, data: any): void {
    const buttonEl = event.currentTarget as HTMLElement;

   

    if (Utils.hasClass(buttonEl, Constant.ACTIVE)) {
      this.buttonRemoveClass();
      this.pause();
      this.playButtonToggleClass();

    } else {
      const index = this.getSongIndex(data.id);
      // Add song if not exist
      if (index === -1) {
        const song = this.getSongObject(data);
        this.songs?.push(song);

        if (this.songs?.length === 1) {
          this.initPlayer();
        } else {
          Amplitude.playSongAtIndex(this.songs?.length - 1);
          this.emitPlaylist = this.songs;
          //window.location.reload();
        }

      } else { // Play exist song
        Amplitude.playSongAtIndex(index);
      }

      this.buttonAddClass();
    }

    this.localSongs = this.songs;
  }

  /**
   * Add song in queue to play
   * @param data
   * @returns
   */
  addToQueue(data: any): void {
    const index = this.getSongIndex(data.id);
    if (index > -1) {
      return;
    }

    this.songs.push(this.getSongObject(data));
    // Initialize player
    if (this.songs.length === 1) {
      this.initPlayer();
      this.buttonAddClass();
    }

    this.setSongs();
  }

  /**
   * Add song in queue to play in next
   * @param data
   * @returns
   */
  nextToPlay(data: any): void {
    const index = this.getSongIndex(data.id);
    if (index > -1) {
      return;
    }

    if (this.songs.length) {
      const activeIndex = Amplitude.getActiveIndex();
      if (index === -1) {
        this.songs.splice(activeIndex + 1, 0, this.getSongObject(data));
      }

    } else { // Initialize player
      this.songs.push(this.getSongObject(data));
      this.initPlayer();
      this.buttonAddClass();
    }

    this.setSongs();
  }

  /**
   * Play list of songs
   * @param event
   * @param data
   */
  playSongs(event: any, data: any): void {
    if (data.songs && data.songs.length) {
      const songList: any = [];
      data.songs.forEach((song: any, index: number) => {
        songList.push(this.getSongObject(song));
      });

      if (this.songs && this.songs.length) {
        this.songs.push(...songList);
        this.emitPlaylist = this.songs;

      } else {
        this.songs = songList;
        this.initPlayer();
        this.buttonAddClass();
        Utils.addClass(event.currentTarget, Constant.ACTIVE);
      }

      this.localSongs = this.songs;
    }
  }

  mediaSession(): void {
    const playlistName = Amplitude.getActivePlaylist() ? Amplitude.getActivePlaylist() : '';

    // Media play onclick
    const mediaPlay = () => {
      this.play();
      this.playButtonToggleClass(true);
      this.buttonRemoveClass();
      this.buttonAddClass();
    }


    // Media pause onclick
    const mediaPause = () => {
      this.pause();
      this.playButtonToggleClass();
      this.buttonRemoveClass();
    }

    if ('mediaSession' in navigator) {
      const MEDIA = navigator.mediaSession;
      // Set song meta on notification
      MEDIA.metadata = new MediaMetadata({
          title: this.activeSong.title,
          artist: this.activeSong.artist,
          album: "test",
          artwork: [
            { src: this.activeSong.image, sizes: '96x96',   type: 'image/png' },
            { src: this.activeSong.image, sizes: '128x128', type: 'image/png' },
            { src: this.activeSong.image, sizes: '192x192', type: 'image/png' },
            { src: this.activeSong.image, sizes: '256x256', type: 'image/png' },
            { src: this.activeSong.image, sizes: '384x384', type: 'image/png' },
            { src: this.activeSong.image, sizes: '512x512', type: 'image/png' },
          ]
      });

      if (this.songs.length >= 1 && !this.mediaControls.playPause) {
          this.mediaControls.playPause = true;
          MEDIA.setActionHandler('play', () => mediaPlay());
          MEDIA.setActionHandler('pause', () => mediaPause());
      }

      if (this.songs.length >= 2 && !this.mediaControls.nextPrev) {
          this.mediaControls.nextPrev = true;
          MEDIA.setActionHandler('previoustrack', () => Amplitude.prev(playlistName));
          MEDIA.setActionHandler('nexttrack', () => Amplitude.next(playlistName));
      }
    }
  }

  /**
   * Remove song from the playlist
   * @param id
   */
  removeSong(id: number): void {
    const index = this.getSongIndex(id);
    if (index > -1) {
      this.songs.splice(index, 0);
      Amplitude.removeSong(index);

      // Clear playlist
      if (this.songs.length === 0) {
        this.emptyPlaylist();
      }

      this.setSongs();
    }
  }

  /**
   * Clear playlist data
   */
  emptyPlaylist(): void {
    if (this.songs.length) {
      this.songs.forEach((song: any, index: number) => {
        Amplitude.removeSong(index);
      });
    }

    this.songs = [];
    this.emitPlaylist = this.songs;

    // Pause player
    this.pause();
    this.buttonRemoveClass();
    this.playButtonToggleClass();

    this.mediaSession();

    // Remove from local storage
    localStorage.removeItem(Constant.SONG_KEY);
  }

}
