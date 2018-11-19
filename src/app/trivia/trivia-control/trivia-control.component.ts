import { Component, OnInit } from '@angular/core';
import { TriviaCard } from '@shared/interfaces/trivia-card';
import { TriviaService } from '@shared/services/trivia.service';
import { Router } from '@angular/router';
import { ManagementService } from '@shared/services/management.service';

@Component({
  selector: 'app-trivia-control',
  templateUrl: './trivia-control.component.html',
  styleUrls: ['./trivia-control.component.css']
})
export class TriviaControlComponent implements OnInit {
  triviaDeck: TriviaCard[] = []
  activeNum: Number = 0
  triviaModeState: boolean
  showTeams: boolean = false;
  constructor(public triviaService: TriviaService, public managementService: ManagementService) { }

  ngOnInit() {
    this.triviaService.clearAcitveQuestion()
    this.managementService.getState('main').snapshotChanges().subscribe(screenState => {
      screenState.map(state => {
        if (state.key == "trivia") {
          this.triviaModeState = state.payload.val() as boolean;
        }
      })
    })
    this.triviaService.getTriviaDeck().snapshotChanges().subscribe(deck => {
      this.triviaDeck = [];
      deck.map(element => {
        var y = element.payload.toJSON();
        if (element.key != 'activeNum' && element.key != 'showScore') {
          y['key'] = element.key
          this.triviaDeck.push(y as TriviaCard)
        }
        else if (element.key == 'activeNum')
          this.activeNum = y as Number;
        else if (element.key == 'showScore')
          this.triviaService.showScore = y as boolean;
      })
      this.triviaDeck.sort((el1, el2) => el1.order - el2.order)
    })
  }

  onTeams() {
    this.showTeams = true
  }
  onShowQuestions() {
    this.showTeams = false
  }

  displayTeams() {
    this.triviaService.toggleShowScore()
  }

  toggleTriviaMode() {
    if (this.triviaModeState == true) {
      this.triviaModeState = false
      this.managementService.stopTrivia();
    } else {
      this.triviaModeState = true
      this.managementService.setTrivia();
    }
  }

  onAdd() {
    this.triviaService.selectedCard = Object.assign({}, new TriviaCard())
    this.triviaService.selectedCard.order = 1
    this.triviaService.editMode = true
  }

  onInsert(obj: { card: TriviaCard }) {
    this.triviaService.selectedCard = Object.assign({}, new TriviaCard())
    this.triviaService.selectedCard.order = obj.card.order + 1
    this.triviaService.editMode = true
    this.triviaService.triviaDeck = this.triviaDeck
  }

  onEdit(obj: { card: TriviaCard }) {
    this.triviaService.selectedCard = Object.assign({}, obj.card)
    this.triviaService.editMode = true
    this.triviaService.triviaDeck = this.triviaDeck
    this.triviaService.edit(obj.card)
  }

  onRemove(obj: { card: TriviaCard }) {
    this.triviaService.triviaDeck = this.triviaDeck
    this.triviaService.remove(obj.card)
  }

  onShiftUp(obj: { card: TriviaCard }) {
    this.triviaService.triviaDeck = this.triviaDeck
    this.triviaService.shiftUp(obj.card)
  }

  onShiftDown(obj: { card: TriviaCard }) {
    this.triviaService.shiftDown(obj.card)
    this.triviaService.triviaDeck = this.triviaDeck
  }

  onShowAnswer(obj: { card: TriviaCard }) {
    this.triviaService.toggleShowAnswer(obj.card)
  }

  onSetQuestion(obj: { card: TriviaCard }) {
    this.triviaService.setActiveQuestion(obj.card)
  }
  onSetNoQuestion(obj: { card: TriviaCard }) {
    this.triviaService.clearAcitveQuestion()
  }
}