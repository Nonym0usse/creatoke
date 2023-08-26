import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UploadService} from "../../../core/services/api/upload.service";
import {SongService} from "../../../core/services/api/song.service";
import {CategoryService} from "../../../core/services/api/category.service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private uploaderService: UploadService) {

    this.categoryForm = this.fb.group({
      title_fr:  ['', Validators.required],
      category: ['', Validators.required],
      picture: ['']
    });

  }

  ngOnInit(): void {
    this.getCategory();
    this.getBackground();
  }

  onFileSelected(event: any) {
    this.files = event.target.files[0];
  }

  getCategory(){
    this.categoryService.getCategory().then((data) => {
      this.categories = data.data;
    });
  }

  delete(id){
    this.categoryService.deleteCategory(id).then((data) => console.log(data))
  }

  addCategory(){
    /*if(this.categoryForm.get('title_fr')?.value){
      this.uploaderService.uploadFile(this.files).then(url => {
        this.categoryForm.patchValue({ picture: url });
        this.categoryService.createCategory(this.categoryForm.value).then(r => console.log(r));
      }).catch(error => {
        console.log(error)
      })
    }*/
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

  protected readonly ClassicEditor = ClassicEditor;
}
