// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// Services
import { AuthenticationService } from './../../../../core/services/global/authentication.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CategoryService } from './../../../../core/services/api/category.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    // Holds form
    form!: FormGroup;
    //error
    message!: string;
    // Connexion en cours (bouton bloqué) et affichage du mot de passe
    loading = false;
    showPassword = false;
    // Image de fond du site, floutée derrière la carte
    picturebackground = '';
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthenticationService,
        private categoryService: CategoryService,
        private title: Title
    ) {
        this.buildForm();
    }

    ngOnInit(): void {
        this.title.setTitle('Créatoke | Connexion admin');
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture ?? ''; });
    }

    /**
     * Build login form
     */
    buildForm(): void {
        this.form = this.formBuilder.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required])
        });
    }

    // Erreur affichée sous un champ, une fois celui-ci quitté
    showError(name: 'email' | 'password'): boolean {
        const control = this.form.get(name);
        return !!control && control.invalid && control.touched;
    }

    /**
     * User login
     */
    async login(): Promise<void> {
        if (this.form.invalid || this.loading) return;
        this.loading = true;
        this.message = '';
        try {
          const email = this.form.get('email')?.value;
          const password = this.form.get('password')?.value;
          const userCredential = await this.authService.logIn(email, password);
          if (userCredential) {
            await this.router.navigateByUrl('/');
          }
        } catch (error: any) {
          this.message = error.message;
        } finally {
          this.loading = false;
        }
      }
}
