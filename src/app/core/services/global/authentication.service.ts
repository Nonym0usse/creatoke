import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConstant } from '../../constants/api-constant';

export const AUTH_TOKEN_KEY = 'authToken';

// Le token est renouvelé quand il lui reste moins de 3 jours (validité : 7 jours).
const REFRESH_BEFORE_MS = 3 * 24 * 60 * 60 * 1000;

export interface AuthUser {
  uid: string;
  email: string;
}

interface TokenPayload {
  sub: string;
  email: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$: Observable<AuthUser | null> = this.userSubject.asObservable();
  private refreshing: Promise<string | null> | null = null;

  constructor() {
    const payload = this.readPayload(this.storedToken());
    if (payload && payload.exp * 1000 > Date.now()) {
      this.userSubject.next({ uid: payload.sub, email: payload.email });
    } else {
      this.clearToken();
    }
  }

  // Sign in with email and password
  async logIn(email: string, password: string): Promise<AuthUser> {
    try {
      const res = await axios.post<{ token: string; user: AuthUser }>(ApiConstant.API + '/auth/login', { email, password });
      this.storeToken(res.data.token);
      this.userSubject.next(res.data.user);
      return res.data.user;
    } catch (error: any) {
      const code = error?.response?.data?.error;
      if (code === 'TOO_MANY_ATTEMPTS') throw new Error('Trop de tentatives. Réessayez dans 15 minutes.');
      if (code === 'INVALID_CREDENTIALS') throw new Error('Email ou mot de passe incorrect.');
      throw new Error('Connexion impossible. Réessayez plus tard.');
    }
  }

  // Sign out
  logOut(): Promise<void> {
    this.clearToken();
    this.userSubject.next(null);
    return Promise.resolve();
  }

  // Check if the user is logged in
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  getCurrentUser(): Observable<AuthUser | null> {
    return this.user$;
  }

  // Token valide (renouvelé s'il approche de l'expiration), ou null si déconnecté.
  getToken(): Observable<string | null> {
    return from(this.validToken());
  }

  private async validToken(): Promise<string | null> {
    const token = this.storedToken();
    const payload = this.readPayload(token);
    if (!token || !payload) return null;

    const expiresAt = payload.exp * 1000;
    if (expiresAt <= Date.now()) {
      await this.logOut();
      return null;
    }
    if (expiresAt - Date.now() > REFRESH_BEFORE_MS) return token;

    this.refreshing ??= axios
      .post<{ idToken: string }>(ApiConstant.API + '/auth/refresh-token', {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        this.storeToken(res.data.idToken);
        return res.data.idToken;
      })
      .catch(() => token) // le token actuel reste valable jusqu'à son expiration
      .finally(() => (this.refreshing = null));
    return this.refreshing;
  }

  private readPayload(token: string | null): TokenPayload | null {
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(decodeURIComponent(escape(atob(base64))));
      return typeof payload.exp === 'number' && payload.sub ? payload : null;
    } catch {
      return null;
    }
  }

  private storedToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private storeToken(token: string): void {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      // stockage indisponible (navigation privée) : la session ne survivra pas au rechargement
    }
  }

  private clearToken(): void {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // ignore
    }
  }
}
