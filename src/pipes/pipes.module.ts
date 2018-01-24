
import { NgModule } from '@angular/core';
import { DateTime } from './datetime.pipe';
import { Distance } from './distance.pipe';
import { Keys } from './keys.pipe';
import { KeyToValue } from './key-to-value.pipe';
import { Money } from './money.pipe';

@NgModule({
  declarations: [Keys, DateTime, Distance, KeyToValue, Money],
  exports: [Keys, DateTime, Distance, KeyToValue, Money]
})
export class PipesModule { }