import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TextService } from 'src/app/core/services/api/text.service';
import { CategoryService } from "../../../core/services/api/category.service";

@Component({
    selector: 'app-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['./texts.component.scss']
})
export class TextsComponent implements OnInit {
    mainDiapo: FormGroup;
    picturebackground: any;

    constructor(private fb: FormBuilder, private textService: TextService, private categoryService: CategoryService) {
        this.mainDiapo = this.fb.group({
            title_fr: [''],
            title_en: [''],
            text_fr: [''],
            text_en: ['']
        });
    }

    ngOnInit(): void {
        this.getBackground();
    }

    sendContact(): void {
        this.textService.mainDiapo(this.mainDiapo.value)
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }

}
