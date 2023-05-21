// Angular
import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

// Constant classes
import { Constant } from '../constants/constant';
import { Messages } from './../constants/messages';


@Directive({
  selector: '[appValidation]'
})
export class ValidationDirective implements OnInit, OnDestroy {

  // Holds custom message 
  @Input() message: string = '';

  // Holds element id name
  elementId: string = '';

  // Holds element class name
  elementClass: string = 'is-invalid';

  // Status change subscription
  controlSubscription: Subscription | undefined;

  constructor(
    private elementRef: ElementRef,
    private control: NgControl
  ) { }

  /**
   * Get random number
   * @returns {number}
   */
  get randomNum(): number {
    const max = 1000000;
    const min = 1;
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Input blur event
   */
  @HostListener('blur', ['$event']) handleBlurEvent(): void {
    if (this.control.value === null || this.control.value === '') {
      this.control.errors ? this.insertMessage() : this.removeMessage();
    }
  }

  ngOnInit(): void {
    this.elementId = 'error_' + this.randomNum;
    this.controlSubscription = this.control.statusChanges?.subscribe(status => {
      (this.control.errors && status === Constant.FORM_INVALID) ? this.insertMessage() : this.removeMessage();
    });
  }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
  }

  /**
   * Insert error message for form control
   */
  insertMessage(): void {
    const errors: ValidationErrors | null = this.control.errors;
    const nativeEl = this.elementRef.nativeElement;
    let errorMessage = '';

    // Remove message first
    this.removeMessage();

    if (this.message) {
      errorMessage = this.message;

    } else {
      if (errors?.['required']) {
        errorMessage = Messages.REQUIRE_FIELD;
      } else if (errors?.['email']) {
        errorMessage = Messages.INVALID_EMAIL;
      } else if (errors?.['minlength']) {
        errorMessage = Messages.INVALID_MIN_LENGTH.replace('{length}', errors?.['minlength'].requiredLength);
      }
    }
    
    const el = `<span class="invalid-feedback fw-medium" id="${this.elementId}">${errorMessage}</span>`;

    nativeEl.classList.add(this.elementClass);
    nativeEl.parentElement.insertAdjacentHTML('beforeend', el);
  }

  /**
   * Remove inserted error message
   */
  removeMessage(): void {
    const el = document.getElementById(this.elementId);
    el?.remove();
    this.elementRef.nativeElement.classList.remove(this.elementClass);
  }

}
