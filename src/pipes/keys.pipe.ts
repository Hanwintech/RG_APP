import { Injectable, Pipe } from '@angular/core';

@Pipe({
    name: 'keys'
})
@Injectable()
export class Keys {
    transform(value, args) {
        let keys = [];
        for (let key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    }
}