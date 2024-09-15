import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth) {
    // Set the user observable to the authState observable provided by AngularFireAuth
    this.user$ = this.afAuth.authState;
  }

  // Sign in with email and password
  logIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign out
  logOut() {
    return this.afAuth.signOut();
  }

  // Check if the user is logged in
  isAuthenticated(): Observable<boolean> {
    // Use the authState observable and map it to a boolean value
    return this.afAuth.authState.pipe(
      map(user => !!user) // Convert the user object to a boolean
    );
  }

  // Optionally, you can create a method to get the current user information
  getCurrentUser(): Observable<any> {
    return this.user$;
  }

  getToken(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return user.getIdToken(); // Return the ID token as an observable
        } else {
          return new Observable<string | null>((observer) => {
            observer.next(null);
            observer.complete();
          });
        }
      })
    );
  }
}