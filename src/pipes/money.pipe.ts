import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'money'
})
@Injectable()
export class Money {
  transform(value: string, format: string) {
    if (value) {
      value = parseFloat(parseFloat(value).toFixed(2)).toLocaleString();
    }
    return value;
  }
}
