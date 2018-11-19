import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TriviaCard } from '@shared/interfaces/trivia-card';

@Component({
  selector: 'app-trivia-card',
  templateUrl: './trivia-card.component.html',
  styleUrls: ['./trivia-card.component.css']
})
export class TriviaCardComponent implements OnInit {
  @Input() triviaCard: TriviaCard
  @Input() editMode: boolean
  @Input() activeQuestion: boolean
  @Output() add = new EventEmitter<{ card: TriviaCard }>()
  @Output() edit = new EventEmitter<{ card: TriviaCard }>()
  @Output() remove = new EventEmitter<{ card: TriviaCard }>()
  @Output() shiftUp = new EventEmitter<{ card: TriviaCard }>()
  @Output() shiftDown = new EventEmitter<{ card: TriviaCard }>()
  @Output() showAnswerEmitter = new EventEmitter<{ card: TriviaCard }>()
  @Output() onShowQuestion = new EventEmitter<{ card: TriviaCard }>()
  @Output() onHideQuestion = new EventEmitter<{ card: TriviaCard }>()
  menuOpen: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggleMenu() {
    this.menuOpen ? this.menuOpen = false : this.menuOpen = true
  }

  onAdd() {
    this.add.emit({ card: this.triviaCard })
  }

  onEdit() {
    this.edit.emit({ card: this.triviaCard })
  }

  onDelete() {
    if (confirm("Are you sure you want to delete this Trivia Question?") == true)
      this.remove.emit({ card: this.triviaCard })
  }

  onShiftUp() {
    this.shiftUp.emit({ card: this.triviaCard })
  }

  onShiftDown() {
    this.shiftDown.emit({ card: this.triviaCard })
  }

  showAnswer() {
    this.showAnswerEmitter.emit({ card: this.triviaCard })
  }
  setQuestion() {
    this.onShowQuestion.emit({ card: this.triviaCard })
  }
  hideQuestion() {
    this.onHideQuestion.emit({ card: this.triviaCard })
  }
}
