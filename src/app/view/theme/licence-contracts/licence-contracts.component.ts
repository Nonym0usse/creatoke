import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LicenceService } from 'src/app/core/services/api/licence.service';
import { CategoryService } from 'src/app/core/services/api/category.service';

type Format = 'mp3' | 'wav';

@Component({
    selector: 'app-licence-contracts',
    templateUrl: './licence-contracts.component.html'
})
export class LicenceContractsComponent implements OnInit {
    picturebackground: any;
    contractMp3: string | undefined;
    contractWav: string | undefined;
    loading = true;

    activeFormat: Format = 'mp3';

    readonly formats: { key: Format; label: string; hint: string; icon: string }[] = [
        { key: 'mp3', label: 'Format MP3', hint: 'Fichier compressé', icon: 'ri-music-2-line' },
        { key: 'wav', label: 'Format WAV', hint: 'Qualité studio', icon: 'ri-equalizer-line' },
    ];

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

    get activeContract(): string | undefined {
        return this.activeFormat === 'mp3' ? this.contractMp3 : this.contractWav;
    }

    async getContracts() {
        this.licenceService.listLicence()
            .then(r => {
                const licence = r.data[0];
                this.contractMp3 = licence?.contract_mp3;
                this.contractWav = licence?.contract_wav;
            })
            .finally(() => this.loading = false);
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}
