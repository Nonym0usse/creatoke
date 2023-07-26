import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ContactService} from '../../../core/services/api/contact.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  token: string|undefined;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.token = undefined;

    this.contactForm = this.fb.group({
        email:  [''],
        name: [''],
        text: [''],
        tel: [''],
      recaptcha: ['', Validators.required], // Add the 'recaptcha' form control
    });
 }

  ngOnInit(): void {
  }

  sendEmail(){
    this.contactService.sendEmail(this.contactForm.value);
  }

}
