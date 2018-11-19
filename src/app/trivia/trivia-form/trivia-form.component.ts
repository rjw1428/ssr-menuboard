import { Component, OnInit } from '@angular/core';
import { TriviaService } from '@shared/services/trivia.service';
import { TriviaCard } from '@shared/interfaces/trivia-card';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-trivia-form',
  templateUrl: './trivia-form.component.html',
  styleUrls: ['./trivia-form.component.css']
})
export class TriviaFormComponent implements OnInit {

  constructor(public triviaService: TriviaService) { }

  ngOnInit() {
  }
  onClose() {
    this.triviaService.editMode = false
  }

  onSubmit(form: NgForm) {
    if (form.value.key == null) {
      //NEW VALUE
      let newTrivia: TriviaCard = {
        key: null,
        order: form.value.order,
        question: form.value.question,
        answer: form.value.answer,
        showAnswer: false,
        lastModified: ''
      }
      console.log(newTrivia)
      this.triviaService.insert(newTrivia)
      this.onClose()

    } else {
      //EDIT VALUE
      this.triviaService.edit(form.value)
      this.onClose()
    }
    this.resetForm();
  }

  resetForm() {
    this.triviaService.selectedCard = new TriviaCard()
  }
}
