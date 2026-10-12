import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  kind: ToastKind;
  title?: string;
  message: string;
  /** Durée d'affichage en ms ; 0 = reste affiché jusqu'au clic sur la croix. */
  duration: number;
}

export interface ToastOptions {
  title?: string;
  duration?: number;
}

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Action destructrice : bouton de confirmation en rouge. */
  danger?: boolean;
}

export interface ConfirmRequest extends ConfirmOptions {
  resolve: (ok: boolean) => void;
}

// Durées par défaut : on laisse plus de temps pour lire une erreur.
const DURATIONS: Record<ToastKind, number> = {
  success: 4000,
  info: 5000,
  warning: 7000,
  error: 8000,
};

/**
 * Messages à l'écran (toasts) et demandes de confirmation, à la place des
 * alert() / confirm() du navigateur. Affichés par <app-notifications>.
 */
@Injectable({ providedIn: 'root' })
export class NotifyService {
  private nextId = 1;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private confirmSubject = new BehaviorSubject<ConfirmRequest | null>(null);

  readonly toasts$ = this.toastsSubject.asObservable();
  readonly confirm$ = this.confirmSubject.asObservable();

  // Les rappels de bibliothèques tierces (PayPal…) peuvent tourner hors
  // d'Angular : on repasse dans la zone pour que l'écran se mette à jour.
  constructor(private zone: NgZone) {}

  success(message: string, options?: ToastOptions): void {
    this.show('success', message, options);
  }

  error(message: string, options?: ToastOptions): void {
    this.show('error', message, options);
  }

  info(message: string, options?: ToastOptions): void {
    this.show('info', message, options);
  }

  warning(message: string, options?: ToastOptions): void {
    this.show('warning', message, options);
  }

  dismiss(id: number): void {
    this.zone.run(() => this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id)));
  }

  /** Fenêtre de confirmation : résout true si l'utilisateur confirme. */
  confirm(options: ConfirmOptions): Promise<boolean> {
    // Une demande encore ouverte est considérée comme annulée.
    this.confirmSubject.value?.resolve(false);
    return new Promise<boolean>((resolve) => {
      this.zone.run(() => this.confirmSubject.next({
        ...options,
        resolve: (ok) => {
          this.confirmSubject.next(null);
          resolve(ok);
        },
      }));
    });
  }

  private show(kind: ToastKind, message: string, options: ToastOptions = {}): void {
    const toast: Toast = {
      id: this.nextId++,
      kind,
      title: options.title,
      message,
      duration: options.duration ?? DURATIONS[kind],
    };
    // Au plus 4 messages à la fois : les plus anciens laissent la place.
    this.zone.run(() => this.toastsSubject.next([...this.toastsSubject.value, toast].slice(-4)));
    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(toast.id), toast.duration);
    }
  }
}
