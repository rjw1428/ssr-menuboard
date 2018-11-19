import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TriviaService } from '@shared/services/trivia.service';
import { Team } from '@shared/interfaces/team';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  teamList: Team[]
  showForm: boolean = false;
  fancy: boolean = false;
  @Input() editMode: boolean;
  @Output() showQuestions = new EventEmitter<{}>()
  constructor(private triviaService: TriviaService) { }

  ngOnInit() {
    this.triviaService.getTeamList().snapshotChanges().subscribe(teams => {
      this.teamList = [];
      teams.forEach(team => {
        var y = team.payload.toJSON() as Team;
        y['key'] = team.key;
        this.teamList.push(y);
      })
      if (!this.editMode)
        this.teamList.sort((el1, el2) => el2.score - el1.score)
    })
  }
  showTeams() {
    this.triviaService.toggleShowScore()
  }

  openForm() {
    this.triviaService.selectedTeam = {
      name: null,
      score: 0,
      key: null,
      points: 0,
    }
    this.showForm = true;
  }
  closeForm() {
    this.showForm = false;
  }

  updateScore() {
    this.triviaService.sumPoints(this.teamList)
  }

  clearTeams() {
    this.triviaService.clearTeams(this.teamList)
  }
  onQuestions() {
    this.showQuestions.emit()
  }
}
