import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TriviaService } from '@shared/services/trivia.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {
  @Output() closeForm = new EventEmitter<{}>()
  constructor(private triviaService: TriviaService) { }

  ngOnInit() {
  }
  onClose() {
    this.closeForm.emit()
  }
  onSubmit() {
    this.triviaService.saveTeam();
    this.onClose()
  }
}
