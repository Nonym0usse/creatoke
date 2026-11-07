// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Services
import { AuthenticationService } from '../../../../core/services/global/authentication.service';
import { CategoryService } from '../../../../core/services/api/category.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['../login/login.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    form: FormGroup;
    message = '';
    loading = false;
    // Adresse à laquelle le lien a été demandé (affiche la confirmation)
    sentTo = '';
    picturebackground = '';

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private categoryService: CategoryService
    ) {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture ?? ''; }).catch(() => undefined);
    }

    showError(): boolean {
        const control = this.form.get('email');
        return !!control && control.invalid && control.touched;
    }

    async submit(): Promise<void> {
        if (this.form.invalid || this.loading) return;
        this.loading = true;
        this.message = '';
        const email = String(this.form.get('email')?.value ?? '').trim();
        try {
            await this.authService.requestPasswordReset(email);
            this.sentTo = email;
        } catch (error: any) {
            this.message = error.message;
        } finally {
            this.loading = false;
        }
    }
}
