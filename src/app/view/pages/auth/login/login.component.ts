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
    login(): void {
        this.authService.logIn(this.form.get('email')?.value, this.form.get('password')?.value).then((userCredential) => {
            if (userCredential) {
                this.router.navigate(['/']);
            }
        }).catch((error) => {
             this.message = error.message;
        });
    }
}
