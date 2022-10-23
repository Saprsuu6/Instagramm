import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RibbonComponent } from './ribbon/ribbon.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { MainRoutingModule } from './main-routing.module';
import { CurrentPageComponent } from './current-page/current-page.component';
import { ClientsModule } from '../clients/clients.module';

@NgModule({
  declarations: [
    RibbonComponent,
    PostsComponent,
    PostComponent,
    CommentComponent,
    AddComponent,
    CurrentPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MainRoutingModule,
    ClientsModule
  ],
  exports:[
    RibbonComponent
  ]
})
export class MainModule { }
