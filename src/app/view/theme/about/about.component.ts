import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    picturebackground: any;

    constructor(private categoryService: CategoryService, private docTitle: Title) { }

    ngOnInit() {
        this.getBackground();
        this.docTitle.setTitle("Mentions légales | Creatoke");
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}