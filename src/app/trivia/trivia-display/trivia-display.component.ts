import { Component, OnInit } from '@angular/core';
import { TriviaCard } from '@shared/interfaces/trivia-card';
import { TriviaService } from '@shared/services/trivia.service';

@Component({
  selector: 'app-trivia-display',
  templateUrl: './trivia-display.component.html',
  styleUrls: ['./trivia-display.component.css']
})
export class TriviaDisplayComponent implements OnInit {
  triviaDeck: TriviaCard[] = []
  activeNum: Number = -1
  constructor(public triviaService: TriviaService) { }

  ngOnInit() {
    this.triviaService.getTriviaDeck().snapshotChanges().subscribe(deck => {
      let list = [];
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
}
