import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { TextService } from 'src/app/core/services/api/text.service';

@Component({
  selector: 'app-texts',
  templateUrl: './texts.component.html',
  styleUrls: ['./texts.component.scss']
})
export class TextsComponent implements OnInit {
mainDiapo: FormGroup;

  constructor(private fb: FormBuilder, private textService: TextService) {
    this.mainDiapo = this.fb.group({
        title_fr:  [''],
        title_en: [''],
        text_fr:  [''],
        text_en: ['']
      });
 }

  ngOnInit(): void {
  }

    sendContact(): void{
       this.textService.mainDiapo(this.mainDiapo.value)
    }

}
