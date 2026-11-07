// Angular
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Services
import { AuthenticationService } from '../../../../core/services/global/authentication.service';
import { CategoryService } from '../../../../core/services/api/category.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['../login/login.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    readonly minLength = 10;
    state: 'checking' | 'invalid' | 'form' = 'checking';
    form: FormGroup;
    email = '';
    message = '';
    loading = false;
    showPassword = false;
    picturebackground = '';
    private token = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService,
        private categoryService: CategoryService
    ) {
        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(200)]],
            confirm: ['', [Validators.required]]
        });
    }

    async ngOnInit(): Promise<void> {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture ?? ''; }).catch(() => undefined);
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
        if (!this.token) {
            this.state = 'invalid';
            return;
        }
        try {
            const email = await this.authService.checkResetToken(this.token);
            if (email) {
                this.email = email;
                this.state = 'form';
            } else {
                this.state = 'invalid';
            }
        } catch (error: any) {
            this.message = error.message;
            this.state = 'invalid';
        }
    }

    passwordLength(): number {
        return String(this.form.get('password')?.value ?? '').length;
    }

    showError(name: 'password' | 'confirm'): boolean {
        const control = this.form.get(name);
        return !!control && control.invalid && control.touched;
    }

    mismatch(): boolean {
        const confirm = this.form.get('confirm');
        return !!confirm && !!confirm.value && confirm.value !== this.form.get('password')?.value;
    }

    async submit(): Promise<void> {
        if (this.form.invalid || this.mismatch() || this.loading) return;
        this.loading = true;
        this.message = '';
        try {
            await this.authService.resetPassword(this.token, this.form.get('password')?.value);
            await this.router.navigate(['/login'], { queryParams: { reset: 1 } });
        } catch (error: any) {
            this.message = error.message;
            if (/plus valable/.test(this.message)) this.state = 'invalid';
        } finally {
            this.loading = false;
        }
    }
}
