// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { Constant } from '../../constants/constant';
import { User } from 'firebase/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public user: any = {}

    constructor(private afAuth: AngularFireAuth) {
        this.afAuth.authState.subscribe((user: User | any) => {
            if (user) {
                this.user = {email: user.email, uid: user.uid}
            }
        });
    }
    /**
     * Get user object
     */
    logIn(email: string, password: string): Promise<any> {
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .catch((error: any) => {
                const errorCode = error.code;
                const errorMessage = Constant.AUTH_ERROR_MESSAGES_FR[errorCode] || 'Erreur inconnue.';
                throw new Error(errorMessage);
            });
    }

    logOut() {
        return this.afAuth.signOut();
    }

    /**
     * Get user login status
     */
    isAuthenticated(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map((user) => user !== null)
        );
    }
}
