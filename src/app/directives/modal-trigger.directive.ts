import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appModalTrigger]'
})
export class ModalTriggerDirective implements AfterViewInit {

  @Input('appModalTrigger')
  modalId: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    if (!this.modalId) {
      throw new Error('Modal Id has not been provided.');
    }

    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-toggle', 'modal');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-target', `#${this.modalId}`);
  }
}
