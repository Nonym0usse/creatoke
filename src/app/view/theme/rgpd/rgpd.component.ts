import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';

@Component({
    selector: 'app-rgpd',
    templateUrl: './rgpd.component.html',
    styleUrls: ['./rgpd.component.scss']
})
export class RgpdComponent implements OnInit {
    picturebackground: any;

    constructor(private categoryService: CategoryService, private docTitle: Title) { }

    ngOnInit() {
        this.getBackground();
        this.docTitle.setTitle("Données personnelles (RGPD) | Creatoke");
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}
