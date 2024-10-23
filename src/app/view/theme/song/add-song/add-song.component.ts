// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SongService } from "../../../../core/services/api/song.service";
import { CategoryService } from "../../../../core/services/api/category.service";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss']
})
export class AddSongComponent implements OnInit {
  musicForm: FormGroup;
  subcategory: any = [];
  files: any = [];
  progress: { [key: string]: number } = {};
  downloadUrls: { [key: string]: string } = {};
  display = "none";
  picturebackground: any;
  isExclu = "non";
  isHeartStroke = "non";
  isLicenceBase = "non";
  isPremium = "non";
  isLicenceBaseCreatoke = "non";
  isPremiumCreatoke = "non";
  filteredSubcategories: any = [];

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private songService: SongService, private storage: AngularFireStorage) {

    this.musicForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      lyrics: [''],
      description: ['', Validators.required],
      price_base: ['',],
      price_premium: [''],
      price_base_creatoke: [''],
      price_premium_creatoke: [''],
      exclu: [''],
      image: [''],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      created_at: [''],
      youtubeURL: [''],
      spotifyURL: [''],
      creatoke: [''],
      chanson_wav: [''],
      creatoke_wav: [''],
      chanson_mp3: [''],
      creatoke_mp3: [''],
      url: [''],
      isLicenceBase: ['non'],
      isPremium: ['non'],
      isLicenceBaseCreatoke: ['non'],
      isPremiumCreatoke: ['non'],
      isHeartStroke: ['non'],
    });
  }

  onFileSelected(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      this.startUpload(file, fileType);
    }
  }


  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }


  ngOnInit(): void {
    this.categoryService.getSubCategory().then((data) => { 
      this.subcategory = data.data; 
    });
    this.getBackground();
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedCategory = target ? target.value : null;
    if (selectedCategory) {
      this.filteredSubcategories = this.subcategory.filter(sub => sub.category === selectedCategory);
    } else {
      this.filteredSubcategories = [];
    }
  }

  addMusic(): void {
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
    const currentDate = new Date();
    this.musicForm.value['created_at'] = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    this.musicForm.value['creatoke_wav'] = this.downloadUrls['creatoke_wav'];
    this.musicForm.value['creatoke_mp3'] = this.downloadUrls['creatoke_mp3'];
    this.musicForm.value['chanson_mp3'] = this.downloadUrls['chanson_mp3'];
    this.musicForm.value['chanson_wav'] = this.downloadUrls['chanson_wav'];

    this.musicForm.value['image'] = this.downloadUrls['image'];
    this.musicForm.value['creatoke'] = this.downloadUrls['creatoke'];
    this.musicForm.value['url'] = this.downloadUrls['url'];
    if (this.musicForm.valid) {
      this.songService.createSong(this.musicForm.value).catch((success) => console.log(success))
    } else {
      alert('Merci de remplir les champs')
    }
  }

  startUpload(file: File, fileType: string): void {
    const filePath = `songs/${file.name}`;
    const fileRef = this.storage.ref(filePath);

    if (file.type.startsWith('image/')) {
      this.resizeImage(file, 800, 600, (resizedImage) => {
        const task: AngularFireUploadTask = this.storage.upload(filePath, resizedImage);
        //@ts-ignore
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
      });
    } else {
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
  }

  openModal() {
    this.display = "block";
  }

  onCloseHandled() {
    this.display = "none";
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number, callback: (Blob) => void): void {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        callback(blob);
      }, file.type);
    };

    img.src = URL.createObjectURL(file);
  }

  handleDownloadURL(url: string, fileType: string): void {
    this.downloadUrls[fileType] = url;
  }
}



