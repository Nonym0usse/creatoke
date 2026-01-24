import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ContactService} from '../../../core/services/api/contact.service'
import {CategoryService} from "../../../core/services/api/category.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  recaptchaResponse: string = '';
  error: string | undefined;
  success: string | undefined;
  picturebackground: any;

  constructor(private fb: FormBuilder, private contactService: ContactService, private categoryService: CategoryService, private docTitle: Title) {

    this.contactForm = this.fb.group({
        email:  ['', [Validators.required, Validators.email]],
        name: ['', Validators.required],
        message: ['', [Validators.required, Validators.maxLength(2000)]],
        tel: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    });
  }

  ngOnInit(): void {
    this.getBackground();
    this.docTitle.setTitle("Contactez-nous | Creatoke");
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }

  onSubmit(){
    if (this.recaptchaResponse) {
      this.error = "";
      this.contactService.sendEmail(this.contactForm.value).then(() => this.success = "Merci votre message à été envoyé.").catch(() => {
        this.error = "Une erreur s'est produite."
        this.success = "";
      })
    }
    else{
      this.error = "Merci de valider le captcha";
    }
  }
  resolved(captchaResponse: string) {
    this.recaptchaResponse = captchaResponse;
  }
}
