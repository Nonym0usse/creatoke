// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map, filter } from 'rxjs';
import { Constant } from '../../constants/constant';
import { User } from 'firebase/auth';
import { NavigationEnd, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public user: any = {}

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user: User | any) => {
      if (user) {
        this.afAuth.onIdTokenChanged(async (user) => {
          if (user) {
            const token = await user.getIdToken();
            sessionStorage.setItem('firebaseToken', token);
          } else {
            sessionStorage.removeItem('firebaseToken');
          }
        });
      }
    });
  }
  /**
   * Get user object
   */
  async logIn(email: string, password: string): Promise<any> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const token = await userCredential.user?.getIdToken();
      if (token) {
        sessionStorage.setItem('firebaseToken', token);
      }
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = Constant.AUTH_ERROR_MESSAGES_FR[errorCode] || 'Erreur inconnue.';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async logOut(): Promise<void> {
    try {
      sessionStorage.removeItem('firebaseToken');
      this.router.navigateByUrl('/');
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  }

  /**
   * Get user login status
   */
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map((user) => user !== null)
    );
  }
  async getFirebaseIdToken(): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return token;
    } else {
      throw new Error('User not authenticated.');
    }
  }

  async refreshToken(): Promise<any> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); // true for forcing the refresh of the token
      sessionStorage.setItem('firebaseToken', token);
      return token; // Return the refreshed token
    }
    return null; // Return null if no user is logged in
  }
}
