import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../core/services/api/category.service";
import { Title } from '@angular/platform-browser';
import { NotifyService } from "../../../core/services/global/notify.service";

@Component({
  selector: 'app-editext',
  templateUrl: './editext.component.html',
  styleUrls: ['./editext.component.scss']
})
export class EditextComponent implements OnInit {
  public editor = "";
  public text: any = {id: "", text: ""};
  picturebackground: any;

  constructor(private categoryService: CategoryService, private title: Title, private notify: NotifyService) {}

  ngOnInit(): void {
    this.title.setTitle('Créatoke | Modifier les textes');
    this.categoryService.getLastText().then(r => {
      this.text = {id: r.data[0]?.id, text: r.data[0]?.text}
      this.editor = r.data[0]?.text ?? '';
    });
    this.getBackground();
  }


  onSubmit() {
    this.categoryService.modifyText({id: this.text.id, text: this.editor})
      .then(() => this.notify.success('Le texte de l\'accueil est enregistré.'))
      .catch((_e) => this.notify.error('Le texte n\'a pas pu être enregistré. Réessayez dans un instant.'));
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

}
