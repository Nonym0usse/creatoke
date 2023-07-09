import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ContactService} from '../../../../app/core/services/api/contact.service'
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
        email:  [''],
        name: [''],
        text: [''],
      });
 }

  ngOnInit(): void {
  }

  sendEmail(){
    console.log(this.contactForm.value)
    this.contactService.sendEmail(this.contactForm.value);
  }

}
