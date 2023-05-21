// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { LoginService } from '../../../../core/services/api/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  // Holds form
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
  }

  /**
   * Build login form
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      username: new FormControl('listen_app@kri8thm.in', [Validators.required, Validators.email]),
      password: new FormControl('la.theme@123', [Validators.required, Validators.minLength(4)])
    });
  }

  /**
   * User login
   */
  login(): void {
    this.loginService.userLogin();
  }

  /**
   * Do your Google login code here
   */
  googleLogin(): void {
  }

}
