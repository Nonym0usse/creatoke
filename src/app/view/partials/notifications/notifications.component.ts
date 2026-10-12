// Angular
import { Component, HostListener } from '@angular/core';

// Services
import { ConfirmRequest, NotifyService, Toast, ToastKind } from '../../../core/services/global/notify.service';

/** Affiche les toasts et la fenêtre de confirmation de NotifyService. */
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  readonly toasts$ = this.notify.toasts$;
  readonly confirm$ = this.notify.confirm$;

  readonly icons: Record<ToastKind, string> = {
    success: 'ri-checkbox-circle-fill',
    error: 'ri-close-circle-fill',
    warning: 'ri-error-warning-fill',
    info: 'ri-information-fill',
  };

  private openConfirm: ConfirmRequest | null = null;

  constructor(private notify: NotifyService) {
    this.confirm$.subscribe((c) => (this.openConfirm = c));
  }

  dismiss(toast: Toast): void {
    this.notify.dismiss(toast.id);
  }

  trackById(_: number, toast: Toast): number {
    return toast.id;
  }

  answer(ok: boolean): void {
    this.openConfirm?.resolve(ok);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.answer(false);
  }
}
