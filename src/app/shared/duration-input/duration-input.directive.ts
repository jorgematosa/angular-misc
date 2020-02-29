import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDurationInput]'
})
export class DurationInputDirective {
  private decimalRegex: RegExp = new RegExp(/^\-*\d*\.?\d{0,2}$/g);
  private hourRegex: RegExp = new RegExp(/^\-*\d*\:\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  @Input() mode: 'decimal' | 'hours';

  constructor(private el: ElementRef  ) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const e = event;
    console.log(this.el.nativeElement.value);

    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');

    // decimal number validations
    if (next && this.mode === 'decimal' && !String(next).match(this.decimalRegex)) {
      event.preventDefault();
    }

    if (this.mode === 'decimal') {
      if ((Number(next)) > 23 || (Number(next) < -23)) {
        event.preventDefault();
      }
    }

    // hours validations
  }
}
