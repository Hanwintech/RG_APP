import { DateTime } from './datetime.pipe';
import { Keys } from './keys.pipe';
import { NgModule } from '@angular/core';
import { KeyToValue } from './key-to-value.pipe';

@NgModule({
  declarations: [Keys, DateTime, KeyToValue],
  exports: [Keys, DateTime, KeyToValue]
})
export class PipesModule { }