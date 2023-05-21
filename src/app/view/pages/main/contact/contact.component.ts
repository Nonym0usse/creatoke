// Angular
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  // Holds form
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  /**
   * Build contact form
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });
  }

}
