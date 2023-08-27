import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SongService } from "../../../core/services/api/song.service";
import { CategoryService } from "../../../core/services/api/category.service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/compat/storage";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    categoryForm: FormGroup;
    //@ts-ignore
    files: File;
    categories: any = [];
    picturebackground: any;
    progress: { [key: string]: number } = {};
    downloadUrls: { [key: string]: { url: string, fileName: string } } = {};
    constructor(private fb: FormBuilder, private categoryService: CategoryService, private storage: AngularFireStorage) {

        this.categoryForm = this.fb.group({
            title_fr: ['', Validators.required],
            category: ['', Validators.required],
            picture: [''],
            picture_name: ['']
        });

    }

    ngOnInit(): void {
        this.getCategory();
        this.getBackground();
    }

    onFileSelected(event: any, fileType: string) {
        const file = event.target.files[0];
        if (file) {
            this.startUpload(file, fileType);
        }
    }

    getCategory() {
        this.categoryService.getCategory().then((data) => {
            this.categories = data.data;
        });
    }

    delete(id, imagePath) {
        this.categoryService.deleteCategory(id, imagePath).then((data) => {alert('OK supprimé'); console.log(data)})
    }

    addCategory() {
        if (this.categoryForm.get('title_fr')?.value) {
            this.categoryForm.patchValue({ picture: this.downloadUrls['picture'].url });
            this.categoryForm.patchValue({ picture_name: this.downloadUrls['picture'].fileName });
            this.categoryForm.patchValue({
                title_fr: this.categoryForm.value['title_fr'].toUpperCase()
            });
            this.categoryService.createCategory(this.categoryForm.value).then(r => console.log(r));
        }
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }

    protected readonly ClassicEditor = ClassicEditor;

    startUpload(file: File, fileType: string): void {
        const filePath = `category/${file.name}`;
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
