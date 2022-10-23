import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RibbonComponent } from './main/ribbon/ribbon.component';
import { FormComponent } from './clients/form/form.component';
import { ForgotPassComponent } from './clients/forgot-pass/forgot-pass.component';
import { CurrentPageComponent } from './main/current-page/current-page.component';

const routes: Routes = [
  { path: '', component: RibbonComponent },
  { path: 'form', component: FormComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
  { path: 'current-page/:id', component: CurrentPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
