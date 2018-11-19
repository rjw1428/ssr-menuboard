import { Component, OnInit, Input } from '@angular/core';
import { Team } from '@shared/interfaces/team';
import { TriviaService } from '@shared/services/trivia.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  @Input() team: Team
  @Input() editMode: boolean
  @Input() index: number
  constructor(public triviaService: TriviaService) { }

  ngOnInit() {
  }
  onRemovePoints() {
    this.triviaService.removePoint(this.team);
  }
  onAddPoints() {
    this.triviaService.addPoint(this.team)
  }
  onRemove() {
    this.triviaService.removeTeam(this.team.key)
  }

}
