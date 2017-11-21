import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'datetime'
})
@Injectable()
export class DateTime {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value, args) {
    return new Date(value).toLocaleString();
  }
}
