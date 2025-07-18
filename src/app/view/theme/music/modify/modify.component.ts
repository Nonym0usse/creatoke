
// Angular
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable, Subscription } from "rxjs";
import { SongService } from "../../../../core/services/api/song.service";
import { CategoryService } from "../../../../core/services/api/category.service";
import { ActivatedRoute } from "@angular/router";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit {
  musicForm: FormGroup;
  subcategory: any = [];
  picturebackground: any;
  song: any;
  isExclu = "non";
  isLicenceBase = "non";
  isPremium = "non";
  isLicenceBaseCreatoke = "non";
  isHeartStroke = "non";
  isPremiumCreatoke = "non";
  routerSubscription: Subscription | undefined;
  filteredSubcategories: any = [];
  display = "none";
  currentAudio: HTMLAudioElement | null = null;
  isPlaying: boolean = false;
  files: any = [];
  progress: { [key: string]: number } = {};
  downloadUrls: { [key: string]: string } = {};
  audioMap: { [key: string]: HTMLAudioElement } = {};
  playingMap: { [key: string]: boolean } = {};

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private songService: SongService, private activatedRoute: ActivatedRoute, private storage: AngularFireStorage) {

    this.musicForm = this.fb.group({
      title: [this.song?.title || '', Validators.required],
      artist: [this.song?.artist || '', Validators.required],
      lyrics: [''],
      description: [this.song?.description || '', Validators.required],
      price_base: [this.song?.price_base || ''],
      price_base_creatoke: [this.song?.price_base_creatoke || ''],
      price_premium_creatoke: [this.song?.price_premium_creatoke || ''],
      exclu: [this.song?.exclu || ''],
      price_premium: [this.song?.price_premium || ''],
      category: [this.song?.category || '', Validators.required],
      subcategory: [this.song?.subcategory || '', Validators.required],
      youtubeURL: [this.song?.youtubeURL || ''],
      spotifyURL: [this.song?.spotifyURL || ''],
      id: [this.song?.id || ''],
      isLicenceBase: [this.song?.isLicenceBase || ''],
      isPremium: [this.song?.isPremium || ''],
      isLicenceBaseCreatoke: [this.song?.isLicenceBaseCreatoke || ''],
      isPremiumCreatoke: [this.song?.isPremiumCreatoke || ''],
      isHeartStroke: [this.song?.isHeartStroke || ''],
      message: [this.song?.message || ''],
    });
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }


  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['id']);
    });
    this.categoryService.getSubCategory().then((data) => { this.subcategory = data.data; this.filteredSubcategories = this.subcategory });
    this.getBackground();
  }

  getSongs(id) {
    this.songService.getSongByID(id).then((songs) => {
      this.song = songs.data;
      console.log(this.song);
      this.musicForm.patchValue({
        title: this.song.title,
        artist: this.song.artist,
        lyrics: this.song.lyrics,
        description: this.song.description,
        price_base: this.song?.price_base_chanson,
        price_premium: this.song?.price_premium,
        category: this.song?.category,
        subcategory: this.song?.subcategory,
        youtubeURL: this.song?.youtubeURL,
        spotifyURL: this.song?.spotifyURL,
        id: this.song?.id,
        isLicenceBase: ['non'],
        isPremium: ['non'],
        isLicenceBaseCreatoke: ['non'],
        isPremiumCreatoke: ['non'],
        isHeartStroke: ['non'],
        message: this.song?.message,
      });
    });
  }

  playSong(key: string, url: string) {
    // Stop any currently playing audio
    Object.keys(this.audioMap).forEach(k => {
      if (this.audioMap[k]) {
        this.audioMap[k].pause();
        this.audioMap[k].currentTime = 0;
        this.playingMap[k] = false;
      }
    });

    // Create and play the new audio
    const audio = new Audio(url);
    this.audioMap[key] = audio;
    this.playingMap[key] = true;

    audio.play();

    audio.onended = () => {
      this.playingMap[key] = false;
    };
  }

  pauseSong(key: string) {
    const audio = this.audioMap[key];
    if (audio) {
      audio.pause();
      this.playingMap[key] = false;
    }
  }

  stopSong(key: string) {
    const audio = this.audioMap[key];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.playingMap[key] = false;
    }
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedCategory = target ? target.value : null;
    if (selectedCategory) {
      this.filteredSubcategories = this.subcategory.filter(sub => sub.category === selectedCategory) ?? [];
    } else {
      this.filteredSubcategories = [];
    }
  }

  onFileSelected(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      this.startUpload(file, fileType);
    }
  }


  startUpload(file: File, fileType: string): void {
    const filePath = `songs/${file.name}`;
    const fileRef = this.storage.ref(filePath);

    const task: AngularFireUploadTask = this.storage.upload(filePath, file);
    this.progress[fileType] = 0;
    //@ts-ignore
    task.percentageChanges().subscribe((progress: number) => {
      //@ts-ignore
      this.progress[fileType] = progress.toFixed(2);
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url: string) => {
          this.handleDownloadURL(url, fileType);
        });
      })
    ).subscribe();
  }

  openModal() {
    this.display = "block";
  }

  onCloseHandled() {
    this.display = "none";
  }

  modifyMusic(): void {
    for (const key in this.musicForm.value) {
      if (this.musicForm.value.hasOwnProperty(key)) {
        if (
          this.musicForm.value[key] === null ||
          this.musicForm.value[key] === undefined ||
          this.musicForm.value[key] === ''
        ) {
          if (key === 'image') {
            this.musicForm.value['image'] = 'https://placehold.co/600x400';
          } else {
            this.musicForm.value[key] = 'vide';
          }
        }
      }
    }
    this.musicForm.patchValue({
      title: this.musicForm.value['title'].toUpperCase()
    });
    this.musicForm.value['creatoke_wav'] = this.downloadUrls['creatoke_wav'];
    this.musicForm.value['creatoke_mp3'] = this.downloadUrls['creatoke_mp3'];
    this.musicForm.value['chanson_mp3'] = this.downloadUrls['chanson_mp3'];
    this.musicForm.value['chanson_wav'] = this.downloadUrls['chanson_wav'];

    this.musicForm.value['image'] = this.downloadUrls['image'];
    this.musicForm.value['creatoke'] = this.downloadUrls['creatoke'];
    this.musicForm.value['url'] = this.downloadUrls['url'];
    if (this.musicForm.valid) {
      this.songService.modifySong(this.musicForm.value).then((success) => alert("Chanson modifiée"));
    } else {
      alert('Merci de remplir les champs')
    }
  }

  handleDownloadURL(url: string, fileType: string): void {
    this.downloadUrls[fileType] = url;
  }
}
