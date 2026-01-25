import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = "";
  @Input() closeOnBackdrop = true;
  @Input() closeOnEsc = true;
  @Input() showCloseBtn = true;

  // footer (optionnel)
  @Input() showFooter = false;
  @Input() confirmText = "Confirmer";
  @Input() cancelText = "Annuler";
  @Input() loading = false;
  @Input() disableConfirm = false;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @HostListener("document:keydown.escape", ["$event"])
  onEsc(event: KeyboardEvent) {
    if (!this.open || !this.closeOnEsc) return;
    event.preventDefault();
    this.close();
  }

  close() {
    this.open = false;
    this.openChange.emit(false);
    this.closed.emit();
  }

  onBackdropClick() {
    if (!this.closeOnBackdrop) return;
    this.close();
  }

  onCancel() {
    this.cancelled.emit();
    this.close();
  }

  onConfirm() {
    this.confirmed.emit();
  }
}