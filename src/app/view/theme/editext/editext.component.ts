import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "../../../core/services/api/contact.service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {ChangeEvent} from "@ckeditor/ckeditor5-angular/ckeditor.component";
import {CategoryService} from "../../../core/services/api/category.service";

@Component({
  selector: 'app-editext',
  templateUrl: './editext.component.html',
  styleUrls: ['./editext.component.scss']
})
export class EditextComponent implements OnInit {
  public editor = ClassicEditor;
  public text: any = {
    id: "",
    text: ""
  };

  public editorData: any;

  public config = {
    language: 'fr',
  };
  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.getLastText().then(r => this.text = {id: r.data[0]?.id, text: r.data[0]?.text});
  }

  public onChange( { editor }: ChangeEvent ) {
    this.editorData = editor.data.get();
  }

  onSubmit() {
    this.categoryService.modifyText({id: this.text.id, text: this.editorData}).then(() => alert('Texte modifié')).catch((e) => {
      alert('Erreur')
    })
  }
}
