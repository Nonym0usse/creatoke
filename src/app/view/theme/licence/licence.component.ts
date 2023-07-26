import { Component, OnInit } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {LicenceService} from "../../../core/services/api/licence.service";

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

  public data: any;
  public id: string | undefined;
  constructor(private licenceService: LicenceService) {
  }

  ngOnInit(): void {
    this.licenceService.listLicence().then(r => this.data = r.data[0]);
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
      premium: this.editorData2,
      regular: this.editorData3,
    }
    const entries = Object.entries(licenceData);
    const filteredEntries = entries.filter(([key, value]) => value !== '' && value !== undefined);
    const result = Object.fromEntries(filteredEntries);
    this.licenceService.modifyLicence(result).then(() => console.log('ok'))
  }

}
