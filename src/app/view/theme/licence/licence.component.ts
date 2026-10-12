import { Component, OnInit } from '@angular/core';
import {LicenceService} from "../../../core/services/api/licence.service";
import {CategoryService} from "../../../core/services/api/category.service";
import { Title } from '@angular/platform-browser';
import { NotifyService } from "../../../core/services/global/notify.service";

@Component({
  selector: 'app-licence',
  templateUrl: './licence.component.html',
  styleUrls: ['./licence.component.scss']
})
export class LicenceComponent implements OnInit {

  public editorData: any;
  public editorData2: any;
  public editorData3: any;
  public editorData4: any;
  public editorData5: any;
  picturebackground: any;

  public data: any;
  public id: string | undefined;
  constructor(private licenceService: LicenceService, private categoryService: CategoryService, private title: Title,
    private notify: NotifyService) {
  }

  ngOnInit(): void {
    this.licenceService.listLicence().then(r => this.data = r.data[0]);
    this.getBackground();
    this.title.setTitle('Créatoke | Gérer les licences');
  }

  submit(){
    const licenceData = {
      id: this.data.id,
      basic: this.editorData,
      base_plus: this.editorData2,
      premium: this.editorData3,
      contract_mp3: this.editorData4,
      contract_wav: this.editorData5,
    }
    const entries = Object.entries(licenceData);
    const filteredEntries = entries.filter(([_key, value]) => value !== '' && value !== undefined);
    const result = Object.fromEntries(filteredEntries);
    this.licenceService.modifyLicence(result)
      .then(() => this.notify.success('Les textes des licences sont enregistrés.'))
      .catch(() => this.notify.error('Les licences n\'ont pas pu être enregistrées. Réessayez dans un instant.'));
  }
  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

}
