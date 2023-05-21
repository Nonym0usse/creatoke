// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

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
   * Build form
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.email])
    });
  }

  /**
   * Do it your code here
   */
  sendEmail(): void {    
  }

}
