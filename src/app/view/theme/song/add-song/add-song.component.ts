// Angular
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from "rxjs";
import { UploadService } from "../../../../core/services/api/upload.service";
import { SongService } from "../../../../core/services/api/song.service";
import { CategoryService } from "../../../../core/services/api/category.service";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-add-song',
    templateUrl: './add-song.component.html'
})
export class AddSongComponent implements OnInit {
    musicForm: FormGroup;
    subcategory: any = [];
    files: any = [];
    picturebackground: any;
    urlProgress: number = 0;
    chanson_wavProgress: number = 0;
    creatoke_wavProgress: number = 0;
    creatokeProgress: number = 0;
    imageProgress: number = 0;
    constructor(private uploadService: UploadService, private fb: FormBuilder, private categoryService: CategoryService, private songService: SongService, private storage: AngularFireStorage) {

        this.musicForm = this.fb.group({
            title: [''],
            artist: [''],
            lyrics: [''],
            description: [''],
            price_base: [''],
            price_premium: [''],
            image: [''],
            category: [''],
            subcategory: [''],
            created_at: [''],
            youtubeURL: [''],
            spotifyURL: [''],
            full_creatoke: [''],
            mp3: [''],
            wav: [''],
            url: [''],
            full_music: [''],
        });
    }

    onFileSelected(event: any, fileType: string) {
        const file = event.target.files[0];
        if (file) {
            this.startUpload(file, fileType);
        }else{
            console.log(':(')
        }
    }


    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }

    addMusic(): void {
        const currentDate = new Date();
        const random = Math.floor((Math.random() * 100000) + 1);
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        for (const key in this.musicForm.value) {
            if (this.musicForm.value.hasOwnProperty(key)) {
                if (this.musicForm.value[key] === null || this.musicForm.value[key] === undefined || this.musicForm.value[key] === '') {
                    if (this.musicForm.value['image'] == null) {
                        this.musicForm.value['image'] = "https://placehold.co/600x400";
                    } else {
                        this.musicForm.value[key] = 'vide';
                    } // Replace with the desired value
                }
            }
        }
        this.songService.createSong(this.musicForm.value).catch((success) => console.log(success))
    }

    ngOnInit(): void {
        this.categoryService.getSubCategory().then((data) => { this.subcategory = data.data; });
        this.getBackground();
    }

    startUpload(file: File, fileType: string) {
        const filePath = `uploads/${file.name}`;
        const task: AngularFireUploadTask = this.storage.upload(filePath, file);
        const progressProperty = fileType + 'Progress';
        this[progressProperty] = 0;

        //@ts-ignore
        task.percentageChanges().subscribe((progress: number) => {
            this[progressProperty] = progress.toFixed(2);
        });

        task.snapshotChanges().pipe(
            finalize(() => {
                // Handle completion and download URL
                // Update corresponding property based on fileType
            })
        ).subscribe();
    }
}
