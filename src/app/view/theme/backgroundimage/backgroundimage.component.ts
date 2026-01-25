import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoryService } from "../../../core/services/api/category.service";
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/compat/storage";
import { finalize } from "rxjs/operators";
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-backgroundimage',
    templateUrl: './backgroundimage.component.html',
    styleUrls: ['./backgroundimage.component.scss']
})
export class BackgroundimageComponent implements OnInit {
    imageForm: FormGroup;
    //@ts-ignore
    files: File;
    isLoading = false
    picturebackground: any;
    progress: { [key: string]: number } = {};
    downloadUrls: { [key: string]: { url: string, fileName: string } } = {};
    image = "";
    constructor(private fb: FormBuilder, private categoryService: CategoryService, private storage: AngularFireStorage, private title: Title) {
        this.imageForm = this.fb.group({
            picture: [''],
            picture_name: ['']
        });
    }

    ngOnInit(): void {
        this.categoryService.getBackgroundImg().then((url) => console.log(url.data[0]))
        this.getBackground();
        this.title.setTitle('Créatoke | Modifier l\'image de fond');
    }

    onFileSelected(event: any, fileType: string) {
        const file = event.target.files[0];
        if (file) {
            this.startUpload(file, fileType);
        }
    }


    modifyImage() {
        this.imageForm.patchValue({ picture: this.downloadUrls['picture'].url });
        this.imageForm.patchValue({ picture_name: this.downloadUrls['picture'].fileName });
        console.log(this.imageForm.value)
        this.categoryService.createBackground(this.imageForm.value).then(r => alert('OK, image de fond changée'));
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }

    startUpload(file: File, fileType: string): void {
        const filePath = `background/${file.name}`;
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
                    this.handleDownloadURL(url, fileType, file.name);
                });
            })
        ).subscribe();
    }

    handleDownloadURL(url: string, fileType: string, fileName: string): void {
        this.downloadUrls[fileType] = {
            url: url,
            fileName: fileName
        };
    }
}
