import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { padAtStrt } from './../shared/utils/utils.functions';

@Directive({
  selector: '[smartPadAtstart]'
})
export class PadAtstartDirective {

  inputElement: ElementRef;
  @Input('smartPadAtstart') padWidth: string;
  constructor(el: ElementRef) {
    this.inputElement = el;
  }
  @HostListener('keyup', ['$event']) keyOnUp(event: KeyboardEvent) {
    if (event.keyCode !== 8) {
      const val = this.inputElement.nativeElement.value ? this.inputElement.nativeElement.value.toString() : '';
      this.inputElement.nativeElement.value = padAtStrt(val, this.padWidth, 0);
    }

  }
  @HostListener('blur', ['$event']) onBlur(event: Event) {
    if (this.inputElement.nativeElement.value) {
      const val = this.inputElement.nativeElement.value ? this.inputElement.nativeElement.value.toString() : '';
      this.inputElement.nativeElement.value = padAtStrt(val, this.padWidth, 0);
    }

  }

}
