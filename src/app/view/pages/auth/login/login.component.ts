// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// Services
import { AuthenticationService } from './../../../../core/services/global/authentication.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    // Holds form
    form!: FormGroup;
    //error
    message!: string;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthenticationService
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
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(4)])
        });
    }

    /**
     * User login
     */
    async login(): Promise<void> {
        try {
          const email = this.form.get('email')?.value;
          const password = this.form.get('password')?.value;
          const userCredential = await this.authService.logIn(email, password);
          if (userCredential) {
            await this.router.navigateByUrl('/');
          }
        } catch (error: any) {
          this.message = error.message;
        }
      }
}
