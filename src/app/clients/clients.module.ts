import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { FormSelfInfoComponent } from './form-self-info/form-self-info.component';

@NgModule({
  declarations: [
    FormComponent,
    ForgotPassComponent,
    FormSelfInfoComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  exports: [
    FormSelfInfoComponent
  ]
})
export class ClientsModule { }
