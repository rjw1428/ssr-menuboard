import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriviaControlComponent } from '@trivia//trivia-control/trivia-control.component';
import { TriviaDisplayComponent } from '@trivia//trivia-display/trivia-display.component';
import { TriviaCardComponent } from '@trivia//trivia-card/trivia-card.component';
import { TriviaFormComponent } from '@trivia//trivia-form/trivia-form.component';
import { TriviaService } from '@shared/services/trivia.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeamComponent } from '@trivia/teams/team/team.component';
import { TeamListComponent } from '@trivia/teams/team-list/team-list.component';
import { TeamFormComponent } from '@trivia/teams/team-form/team-form.component';
import { NintendoScoreComponent } from '@trivia/teams/nintendo-score/nintendo-score.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    TriviaControlComponent,
    TriviaDisplayComponent,
    TriviaCardComponent,
    TriviaFormComponent,
    TeamComponent,
    TeamListComponent,
    TeamFormComponent,
    NintendoScoreComponent,
  ],
  providers: [TriviaService],
  exports: [
    TriviaControlComponent,
    TriviaDisplayComponent,
    TriviaCardComponent,
    TriviaFormComponent,
    TeamComponent,
    TeamListComponent,
    TeamFormComponent,
    NintendoScoreComponent,
  ]
})
export class TriviaModule { }
