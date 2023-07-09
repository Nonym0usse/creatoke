// Angular
import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from "rxjs";
import {UploadService} from "../../../../core/services/api/upload.service";
import {SongService} from "../../../../core/services/api/song.service";
import {CategoryService} from "../../../../core/services/api/category.service";

@Component({
    selector: 'app-add-song',
    templateUrl: './add-song.component.html'
})
export class AddSongComponent implements OnInit {
  musicForm: FormGroup;
  subcategory: any = [];
  files: any = [];
    constructor(private uploadService: UploadService, private fb: FormBuilder, private categoryService: CategoryService, private songService: SongService) {

      this.musicForm = this.fb.group({
        title:  [''],
        artist: [''],
        lyrics: [''],
        description: [''],
        price_base:  [''],
        price_base_plus:  [''],
        price_pro:  [''],
        image:[''],
        category:  [''],
        created_at:  [''],
        youtubeURL: [''],
        spotifyURL:  [''],
        full_creatoke: [''],
        full_music: [''],
        url: [''],
        firestoreID: [''],
        id: null
      });
    }

  onFileSelected(event: any, fileName: string) {
    const file: File = event.target.files[0];
    if (fileName === 'url') {
      this.files.push({name: 'url', file: file});
    } else if (fileName === 'full_creatoke') {
      this.files.push({name: 'full_creatoke', file: file});
    } else if(fileName === 'full_music'){
      this.files.push({name: 'full_music', file: file});
    }else if(fileName == "image"){
      this.files.push({name: 'image', file: file});
    }else{
      this.files.push([]);
    }
  }
  addMusic(): void {
      const random = Math.floor((Math.random()*100000) + 1);
    this.uploadService.uploadSong(this.files).then((url) => {
      url.forEach((data) => {
        this.musicForm.patchValue({ [data['name']] : data['url'] });
        this.musicForm.patchValue({ firestoreID: data['firestoreID'] });
        this.musicForm.patchValue({ id: random});
      })
      this.songService.createSong(this.musicForm.value).catch((success) => console.log(success))
    });
  }

  ngOnInit(): void {
    this.categoryService.getSubCategory().then((data) => {this.subcategory = data; console.log(data)});
  }
}
