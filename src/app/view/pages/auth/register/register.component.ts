// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { LoginService } from '../../../../core/services/api/login.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  // Holds form
  form!: FormGroup;

  // I agree checkbox value
  agree = true;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
  }

  /**
   * Build registration form
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  /**
   * User registration
   */
  register(): void {
   // this.loginService.userLogin('', '');
  }

  /**
   * Do your Google login code here
   */
  googleLogin(): void {
  }

}
