import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDurationInput]'
})
export class DurationInputDirective {
  private decimalRegex: RegExp = new RegExp(/^\-?\d*\.?\d{0,2}$/g);
  private hoursRegex: RegExp = new RegExp(/^\-?\d*\:?\d{0,2}$/g);
  private specialKeys: Array<string> = [
    'Backspace',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete',
    'Tab'
  ];

  @Input() mode: 'decimal' | 'hours';

  constructor(private el: ElementRef) {}

  @HostListener('blur', ['$event'])
  onBlur(event) {
    const input = event.target as HTMLInputElement;
    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [
      current.slice(0, position),
      event.key === 'Decimal' ? '.' : event.key,
      current.slice(position)
    ].join('');

    input.value = this.autoFillData(next, input);
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    let next: string = [
      current.slice(0, position),
      event.key === 'Decimal' ? '.' : event.key,
      current.slice(position)
    ].join('');

    // checks if the the whole input is selected
    if (this.el.nativeElement.selectionStart === 0 && this.el.nativeElement.selectionEnd === current.length) {
      next = event.key;
    }

    // decimal number validations
    if (
      next &&
      this.mode === 'decimal' &&
      !String(next).match(this.decimalRegex)
    ) {
      event.preventDefault();
    }

    if (this.mode === 'decimal' && String(next).match(this.decimalRegex)) {
      if (Number(next) > 24 || Number(next) < -24) {
        event.preventDefault();
      }
    }

    // hours validations
    if (next && this.mode === 'hours' && !String(next).match(this.hoursRegex)) {
      event.preventDefault();
    }

    if (next && this.mode === 'hours' && String(next).match(this.hoursRegex)) {
      const splitString = next.split(':');
      if (!splitString[1]) {
        if (Number(splitString[0]) > 24 || Number(splitString[0]) < -24) {
          event.preventDefault();
          return;
        }
        if (!splitString[0].includes('-')) {
          if (splitString[0].length === 2) {
            if (!next.includes(':')) {
              input.value = next + ':';
              event.preventDefault();
            }
          }
        } else {
          if (splitString[0].length === 3) {
            if (!next.includes(':')) {
              input.value = next + ':';
              event.preventDefault();
            }
          }
        }
      } else {
        if (
          Number(splitString[0]) > 23 ||
          Number(splitString[0]) < -23 ||
          Number(splitString[1]) > 59 ||
          Number(splitString[1]) < 0
        ) {
          event.preventDefault();
        }
      }
    }
    // auto-fill the data
    if (event.key === 'Enter') {
      input.value = this.autoFillData(next, input);
    }
  }

  private autoFillData(next, input): string {
    next = next.replace('Enter', '');
    if (this.mode === 'decimal') {
      if (next === '' || next === '.') {
        return '0';
      } else if (next.includes('.')) {
        const splitString = next.split('.');
        if (
          splitString[0].includes('-') &&
          splitString[0].length === 1 &&
          splitString[1] === ''
        ) {
          return '0';
        }
        if (!splitString[1]) {
          return next.replace('.', '');
        }
        if (splitString[0] === '') {
          splitString[1]
            ? (input.value = '0' + '.' + splitString[1])
            : (input.value = splitString[0]);
          return input.value;
        }
        if (splitString[0].includes('-') && splitString[0].length === 1) {

          splitString[1] && Number(splitString[1]) !== 0
            ? (input.value = '-' + '0' + '.' + splitString[1])
            : (input.value = '0');
          return input.value;
        }
      } else if (next === '-') {
        return '0';
      }
      if (next !== '') {
        return next;
      }
    } else {
        if (next === '') {
        return '00:00';
      } else if (next.includes(':')) {
        const splitString = next.split(':');
        if (splitString[1] !== '' && splitString[1].length < 2) {
          splitString[1] = '0' + splitString[1];
        }
        if (splitString[1] === '') {
          splitString[1] = '00';
        }
        if (splitString[0].includes('-')) {
          const hour = splitString[0].replace('-', '');
          if (hour.length < 2) {
            if (hour === '') {
              if (splitString[1] === '00') {
                splitString[0] = '00';
              } else {
                splitString[0] = '-00';
              }
            } else {
              splitString[0] = '-' + '0' + hour;
            }
          }
        } else {
          if (splitString[0].length < 2) {
            if (splitString[0] === '') {
              splitString[0] = '00';
            } else {
              splitString[0] = '0' + splitString[0];
            }
          }
        }
        if (splitString[0].replace('-', '') === '00' && splitString[1] === '00') {
          return '00:00';
        }
        splitString[1]
          ? (input.value = splitString[0] + ':' + splitString[1])
          : (input.value = splitString[0]);
        return input.value;
      } else {
        if (next.length < 2 && !next.includes('-')) {
          return '0' + next + ':00';
        } else if (next.length === 2 && next.includes('-')) {
          return '-' + '0' + next.replace('-', '') + ':00';
        }
      }
      return '00:00';
    }
  }
}
