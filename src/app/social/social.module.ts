import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialPageComponent } from '@social/social-page.component';
import { SocialService } from '@shared/services/social.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SocialPageComponent
  ],
  providers: [
    SocialService
  ],
  exports: [
    SocialPageComponent
  ]
})
export class SocialModule { }
