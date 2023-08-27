import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../core/services/api/category.service";

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

  image = "";
  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.imageForm = this.fb.group({
      picture: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.getBackgroundImg().then((url) => console.log(url.data[0]))
    this.getBackground();
  }

  onFileSelected(event: any) {
    this.files = event.target.files[0];
  }

  modifyImage(){
    this.isLoading = true;
    if(this.files !== undefined){
      /*this.uploaderService.uploadFile(this.files).then(url => {
        this.imageForm.patchValue({ picture: url });
        this.categoryService.createBackground(this.imageForm.value).then((res) => {
          if(res.data == "OK"){
              this.isLoading = false;
          }
        }).catch((e) => alert(e))
      }).catch(error => {
        alert(error)
      })*/
    }
  }
  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }
}
