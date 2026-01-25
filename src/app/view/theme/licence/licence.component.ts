import { Component, OnInit } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {LicenceService} from "../../../core/services/api/licence.service";
import {CategoryService} from "../../../core/services/api/category.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-licence',
  templateUrl: './licence.component.html',
  styleUrls: ['./licence.component.scss']
})
export class LicenceComponent implements OnInit {

  public Editor = ClassicEditor;
  public Editor2 = ClassicEditor;
  public Editor3 = ClassicEditor;

  public config = {
    language: 'fr',

  };
  //@ts-ignore
  public editorData: any;
  public editorData2: any;
  public editorData3: any;
  picturebackground: any;

  public data: any;
  public id: string | undefined;
  constructor(private licenceService: LicenceService, private categoryService: CategoryService, private title: Title) {
  }

  ngOnInit(): void {
    this.licenceService.listLicence().then(r => this.data = r.data[0]);
    this.getBackground();
    this.title.setTitle('Créatoke | Gérer les licences');
  }

  public onChange( { editor }: ChangeEvent ) {
    this.editorData = editor.data.get();
  }

  public onChange2( { editor }: ChangeEvent ) {
    this.editorData2 = editor.data.get();
  }

  public onChange3( { editor }: ChangeEvent ) {
    this.editorData3 = editor.data.get();
  }

  submit(){
    const licenceData = {
      id: this.data.id,
      basic: this.editorData,
      base_plus: this.editorData2,
      premium: this.editorData3,
    }
    const entries = Object.entries(licenceData);
    const filteredEntries = entries.filter(([key, value]) => value !== '' && value !== undefined);
    const result = Object.fromEntries(filteredEntries);
    this.licenceService.modifyLicence(result).then(() => alert('Licences modifiées'))
  }
  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

}
