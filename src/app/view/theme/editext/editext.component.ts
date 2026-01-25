import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../core/services/api/category.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editext',
  templateUrl: './editext.component.html',
  styleUrls: ['./editext.component.scss']
})
export class EditextComponent implements OnInit {
  public editor = "";
  public text: any = {id: "", text: ""};
  picturebackground: any;

  constructor(private categoryService: CategoryService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Créatoke | Modifier les textes');
    this.categoryService.getLastText().then(r => {
      this.text = {id: r.data[0]?.id, text: r.data[0]?.text}
      setTimeout(() => {
        this.editor = r.data[0]?.text;
      }, 1000)
    });
    this.getBackground();
  }


  onSubmit() {
    this.categoryService.modifyText({id: this.text.id, text: this.editor}).then(() => alert('Texte modifié')).catch((e) => {
      alert('Erreur')
    })
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

}
