import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputRestrictionDirective } from './input-restriction.directive';
import { PadAtstartDirective } from './pad-atstart.directive';




@NgModule({
  declarations: [InputRestrictionDirective, PadAtstartDirective],
  imports: [
    CommonModule
  ],
  exports: [
    InputRestrictionDirective,
    PadAtstartDirective
  ]
})
export class DirectivesModule { }
