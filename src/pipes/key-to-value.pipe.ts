import { Injectable, Pipe } from '@angular/core';
import { EnumAreaCode } from './../models/enum';
import { IntegerKeyValue } from "./../models/integer-key-value.model";

@Pipe({
  name: 'keyToValue'
})
@Injectable()
export class KeyToValue {
  transform(key: number, dataSource: IntegerKeyValue[]) {
    for (let kvp of dataSource) {
      if (kvp.key == key) {
        return kvp.value;
      }
    }
    return null;
  }

}
