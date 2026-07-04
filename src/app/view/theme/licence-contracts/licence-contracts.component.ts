import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LicenceService } from 'src/app/core/services/api/licence.service';
import { CategoryService } from 'src/app/core/services/api/category.service';

@Component({
    selector: 'app-licence-contracts',
    templateUrl: './licence-contracts.component.html',
    styleUrls: ['./licence-contracts.component.scss']
})
export class LicenceContractsComponent implements OnInit {
    picturebackground: any;
    contractMp3: string | undefined;
    contractWav: string | undefined;

    constructor(
        private licenceService: LicenceService,
        private categoryService: CategoryService,
        private docTitle: Title
    ) { }

    ngOnInit() {
        this.getBackground();
        this.getContracts();
        this.docTitle.setTitle("Contrats de licence | Creatoke");
    }

    async getContracts() {
        this.licenceService.listLicence().then(r => {
            const licence = r.data[0];
            this.contractMp3 = licence?.contract_mp3;
            this.contractWav = licence?.contract_wav;
        });
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}
