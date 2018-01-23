import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'distance'
})
@Injectable()
export class Distance {
  transform(value: number) {
    if (!value) {
      return "";
    } else if (value < 1000) {
      return value.toFixed(0) + "m";
    } else if (1000 <= value && value < 10000) {
      return (value / 1000).toFixed(2) + "km";
    } else if (10000 <= value && value < 100000) {
      return (value / 1000).toFixed(1) + "km";
    } else {
      return (value / 1000).toFixed(0) + "km";
    }
  }
}
