// Angular
import { Component, Input } from '@angular/core';

/**
 * Barre de progression commune au site.
 *   <app-progress-bar [value]="42" label="Envoi du fichier"></app-progress-bar>
 * Sans [value] (ou value = null), la barre défile en continu (durée inconnue).
 */
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() value: number | null | undefined = null;
  @Input() label = '';

  get indeterminate(): boolean {
    return this.value === null || this.value === undefined;
  }

  get percent(): number {
    return Math.max(0, Math.min(100, Math.round(this.value ?? 0)));
  }
}
