
// Angular
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable, Subscription} from "rxjs";
import { SongService } from "../../../../core/services/api/song.service";
import { CategoryService } from "../../../../core/services/api/category.service";
import {ActivatedRoute} from "@angular/router";

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
  routerSubscription: Subscription | undefined;
  constructor(private fb: FormBuilder, private categoryService: CategoryService, private songService: SongService, private activatedRoute: ActivatedRoute) {

    this.musicForm = this.fb.group({
      title: [this.song?.title || '', Validators.required],
      artist: [this.song?.artist || '', Validators.required],
      lyrics: [this.song?.lyrics || '', Validators.required],
      description: [this.song?.description || '', Validators.required],
      price_base_creatoke: [this.song?.price_base_creatoke || ''],
      price_premium_creatoke: [this.song?.price_premium_creatoke || ''],
      price_base_chanson: [this.song?.price_base_chanson || '' ],
      price_premium_chanson: [this.song?.price_premium_chanson || ''],
      category: [this.song?.category || '', Validators.required],
      subcategory: [this.song?.subcategory || '', Validators.required],
      youtubeURL: [this.song?.youtubeURL || ''],
      spotifyURL: [this.song?.spotifyURL || ''],
      id: [this.song?.id || '']
    });
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }


  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['id']);
    });
    this.categoryService.getSubCategory().then((data) => { this.subcategory = data.data; });
    this.getBackground();
  }

  getSongs(id){
    this.songService.getSongByID(id).then((songs) => {
      this.song = songs.data;
      this.musicForm.patchValue({
        title: this.song.title,
        artist: this.song.artist,
        lyrics: this.song.lyrics,
        description: this.song.description,
        price_base_creatoke: this.song?.price_base_creatoke,
        price_premium_creatoke: this.song?.price_premium_creatoke,
        price_base_chanson: this.song?.price_base_chanson,
        price_premium_chanson: this.song?.price_premium_chanson,
        category: this.song?.category,
        subcategory: this.song?.subcategory,
        youtubeURL: this.song?.youtubeURL,
        spotifyURL: this.song?.spotifyURL,
        id: this.song?.id
      });
    });
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

    this.songService.modifySong(this.musicForm.value).then((success) => alert("Chanson modifiée"));
  }
}
