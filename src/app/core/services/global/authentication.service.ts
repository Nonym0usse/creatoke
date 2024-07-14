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
        this.user = { email: user.email, uid: user.uid }
      }
    });
  }
  /**
   * Get user object
   */
  logIn(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(async (user) => {
      const token = await user.user?.getIdToken();
      // @ts-ignore
      localStorage.setItem('firebaseToken', token);
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }).catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = Constant.AUTH_ERROR_MESSAGES_FR[errorCode] || 'Erreur inconnue.';
      throw new Error(errorMessage);
    });
  }

  logOut() {
    localStorage.removeItem('firebaseToken');
    return this.afAuth.signOut().then(() => this.router.navigate(['/']))
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
}
