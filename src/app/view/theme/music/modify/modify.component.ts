import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UploadService} from "../../../../core/services/api/upload.service";
import {CategoryService} from "../../../../core/services/api/category.service";
import {SongService} from "../../../../core/services/api/song.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit {

  musicForm: FormGroup;
  subcategory: any = [];
  files: any = [];
  isFormVisible = false;
  isFormVisible2 = false;
  routerSubscription: Subscription | undefined;
  song: any;
  picturebackground: any;

  constructor(private uploadService: UploadService, private fb: FormBuilder, private categoryService: CategoryService, private songService: SongService, private activatedRoute: ActivatedRoute) {
    this.musicForm = this.fb.group({
      title: ['', Validators.required],
      artist: [''],
      lyrics: [''],
      description: [''],
      price_base: [''],
      price_base_plus: [''],
      price_pro: [''],
      image: [''],
      category: [''],
      created_at: [''],
      youtubeURL: [''],
      spotifyURL: [''],
      full_creatoke: [''],
      full_music: [''],
    });
  }

  onFileSelected(event: any, fileName: string) {
    const file: File = event.target.files[0];
    if (fileName === 'url') {
      this.files.push({ name: 'url', file: file });
    } else if (fileName === 'full_creatoke') {
      this.files.push({ name: 'full_creatoke', file: file });
    } else if (fileName === 'full_music') {
      this.files.push({ name: 'full_music', file: file });
    } else if (fileName == "image") {
      this.files.push({ name: 'image', file: file });
    } else {
      this.files.push([]);
    }
  }
  addMusic(): void {
    const currentDate = new Date();
    const random = Math.floor((Math.random() * 100000) + 1);
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    this.uploadService.uploadSong(this.files).then((url) => {
      url.forEach((data) => {
        this.musicForm.patchValue({ [data['name']]: data['url'] });
        this.musicForm.patchValue({ id: random });
        this.musicForm.patchValue({ created_at: formattedDate });
      })
      for (const key in this.musicForm.value) {
        if (this.musicForm.value.hasOwnProperty(key)) {
          if (this.musicForm.value[key] === null || this.musicForm.value[key] === undefined || this.musicForm.value[key] === '') {
            this.musicForm.value[key] = 'vide'; // Replace with the desired value
          }
        }
      }
      this.songService.modifySong(this.musicForm.value).catch((success) => console.log(success))
    });
  }

  updateForm(e) {
    if(e.target.value == "chanson"){
      this.isFormVisible = !this.isFormVisible;
      this.isFormVisible2 = this.isFormVisible2;
    }else{
      this.isFormVisible2 = !this.isFormVisible2;
      this.isFormVisible = this.isFormVisible;
    }
  }

  ngOnInit(): void {
    this.routerSubscription = this.activatedRoute.params.subscribe(param => {
      this.getSongs(param['id']);
    });
    this.categoryService.getSubCategory().then((data) => { this.subcategory = data.data; });
    this.getBackground();
  }

  getSongs(id: string): void {
    this.songService.getSongByID(id).then(response => {
      this.song = response.data;
      // @ts-ignore
      this.musicForm.get('title').setValue(this.song.title);
      // @ts-ignore
      this.musicForm.get('lyrics').setValue(this.song.lyrics);
      // @ts-ignore
      this.musicForm.get('description').setValue(this.song.description);
      // @ts-ignore
      this.musicForm.get('price_base').setValue(this.song.price_base);
      // @ts-ignore
      this.musicForm.get('price_base_plus').setValue(this.song.price_base_plus);
      // @ts-ignore
      this.musicForm.get('price_pro').setValue(this.song.price_pro);
      // @ts-ignore
      this.musicForm.get('image').setValue(this.song.image);
      // @ts-ignore
      this.musicForm.get('artist').setValue(this.song.artist);
      // @ts-ignore
      this.musicForm.get('category').setValue(this.song.category);
      // @ts-ignore
      this.musicForm.get('created_at').setValue(this.song.created_at);
      // @ts-ignore
      this.musicForm.get('youtubeURL').setValue(this.song.youtubeURL);
      // @ts-ignore
      this.musicForm.get('spotifyURL').setValue(this.song.spotifyURL);
      // @ts-ignore
      this.musicForm.get('full_creatoke').setValue(this.song.full_creatoke);
      // @ts-ignore
      this.musicForm.get('full_music').setValue(this.song.full_music);

    });
  }
  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }
}
