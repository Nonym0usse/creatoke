import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UploadService} from "../../../core/services/api/upload.service";
import {SongService} from "../../../core/services/api/song.service";
import {CategoryService} from "../../../core/services/api/category.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  //@ts-ignore
  files: File;
  category: any = [];
  constructor(private uploadService: UploadService, private fb: FormBuilder, private categoryService: CategoryService, private uploaderService: UploadService) {

    this.categoryForm = this.fb.group({
      title_fr:  ['', Validators.required],
      title_en: ['', Validators.required],
      url: ['']
    });

    this.subCategoryForm = this.fb.group({
      title_fr:  ['', Validators.required],
      title_en:  ['', Validators.required],
      category: ['', Validators.required],
      picture: ['']
    });
  }

  ngOnInit(): void {
    this.getCategory();
  }

  onFileSelected(event: any) {
    this.files = event.target.files[0];
  }

  getCategory(){
    this.categoryService.getCategory().then((data) => {
      this.category = data
      console.log(data)
    });
  }

  addCategory(){
    if(this.categoryForm.get('title_fr')?.value && this.categoryForm.get('title_en')?.value){
      const uri = this.categoryForm.get('title_fr')?.value.replace(/\s+/g, "-");
      this.categoryForm.patchValue({ url: uri });
      this.categoryService.createCategory(this.categoryForm.value).then(r => console.log(r));
    }
  }

  addSubCategory(){
    if(this.subCategoryForm.get('title_fr')?.value){
      this.uploaderService.uploadFile(this.files).then(url => {
        this.subCategoryForm.patchValue({ picture: url });
        this.categoryService.createSousCategorie(this.subCategoryForm.value).then(r => console.log(r));
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
