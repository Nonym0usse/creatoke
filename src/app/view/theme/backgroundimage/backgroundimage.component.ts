import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { CategoryService } from "../../../core/services/api/category.service";
import { UploadService } from "../../../core/utils/upload";
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-backgroundimage',
    templateUrl: './backgroundimage.component.html',
    styleUrls: ['./backgroundimage.component.scss']
})
export class BackgroundimageComponent implements OnInit {
    imageForm: FormGroup;
    files?: File;
    isLoading = false
    picturebackground: any;
    progress: { [key: string]: number } = {};
    downloadUrls: { [key: string]: { url: string, fileName: string } } = {};
    image = "";
    constructor(private fb: FormBuilder, private categoryService: CategoryService, private uploader: UploadService, private title: Title) {
        this.imageForm = this.fb.group({
            picture: [''],
            picture_name: ['']
        });
    }

    ngOnInit(): void {
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
        this.categoryService.createBackground(this.imageForm.value).then(_r => alert('OK, image de fond changée'));
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }

    startUpload(file: File, fileType: string): void {
        const { progress$, result$ } = this.uploader.startUpload(file, fileType, 'background', { resizeImages: false });
        this.progress[fileType] = 0;
        progress$.subscribe((progress) => {
            this.progress[fileType] = progress;
        });

        result$.subscribe({
            next: ({ url, fileName }) => this.handleDownloadURL(url, fileType, fileName),
            error: (err) => {
                console.error('Upload error:', err);
                delete this.progress[fileType];
                alert("L'envoi de l'image a échoué. Merci de réessayer.");
            },
        });
    }

    handleDownloadURL(url: string, fileType: string, fileName: string): void {
        this.downloadUrls[fileType] = {
            url: url,
            fileName: fileName
        };
    }
}
