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
    progress: { [key: string]: number } = {};
    downloadUrls: { [key: string]: string } = {};
    picturebackground: any;
    constructor(private fb: FormBuilder, private categoryService: CategoryService, private songService: SongService, private storage: AngularFireStorage) {

        this.musicForm = this.fb.group({
            title: [''],
            artist: [''],
            lyrics: [''],
            description: [''],
            price_base_creatoke: [''],
            price_premium_creatoke: [''],
            price_base_chanson: [''],
            price_premium_chanson: [''],
            image: [''],
            category: [''],
            subcategory: [''],
            created_at: [''],
            youtubeURL: [''],
            spotifyURL: [''],
            creatoke: [''],
            chanson_wav: [''],
            creatoke_wav: [''],
            url: [''],
        });
    }

    onFileSelected(event: any, fileType: string) {
        const file = event.target.files[0];
        if (file) {
            this.startUpload(file, fileType);
        } else {
            console.log(':(')
        }
    }


    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }


    ngOnInit(): void {
        this.categoryService.getSubCategory().then((data) => { this.subcategory = data.data; });
        this.getBackground();
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
                    if (key === 'title') {
                        this.musicForm.value[key].toUpperCase();
                    }
                }
            }
        }

        this.musicForm.value['creatoke_wav'] = this.downloadUrls['creatoke_wav'];
        this.musicForm.value['image'] = this.downloadUrls['image'];
        this.musicForm.value['creatoke'] = this.downloadUrls['creatoke'];
        this.musicForm.value['url'] = this.downloadUrls['url'];

        this.songService.createSong(this.musicForm.value).catch((success) => console.log(success));
    }

    startUpload(file: File, fileType: string): void {
        const filePath = `uploads/${file.name}`;
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

    handleDownloadURL(url: string, fileType: string): void {
        this.downloadUrls[fileType] = url;
    }
}

