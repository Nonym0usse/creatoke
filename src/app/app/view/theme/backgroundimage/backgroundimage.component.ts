import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UploadService} from "../../../../core/services/api/upload.service";
import {CategoryService} from "../../../../core/services/api/category.service";

@Component({
  selector: 'app-backgroundimage',
  templateUrl: './backgroundimage.component.html',
  styleUrls: ['./backgroundimage.component.scss']
})
export class BackgroundimageComponent implements OnInit {
  imageForm: FormGroup;
  //@ts-ignore
  files: File;
  imgUrl: string = "";
  constructor(private uploaderService: UploadService, private fb: FormBuilder, private categoryService: CategoryService) {
    this.imageForm = this.fb.group({
      picture: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.getBackgroundImg().then((url) => this.imgUrl = url.data[0])
  }

  onFileSelected(event: any) {
    this.files = event.target.files[0];
  }

  addCategory(){
    if(this.imageForm.get('picture')?.value){
      this.uploaderService.uploadFile(this.files).then(url => {
        this.imageForm.patchValue({ picture: url });
        this.categoryService.createBackground(this.imageForm.value).then(r => console.log(r));
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
