
import { NgModule } from '@angular/core';
import { DateTime } from './datetime.pipe';
import { Keys } from './keys.pipe';
import { KeyToValue } from './key-to-value.pipe';
import { Money } from './money.pipe';

@NgModule({
  declarations: [Keys, DateTime, KeyToValue, Money],
  exports: [Keys, DateTime, KeyToValue, Money]
})
export class PipesModule { }