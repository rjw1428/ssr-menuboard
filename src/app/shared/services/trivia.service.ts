import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { TriviaCard } from '@shared/interfaces/trivia-card';
import { Team } from '@shared/interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  triviaDeck: TriviaCard[] = []
  selectedCard: TriviaCard;
  editMode: boolean = false;
  activeCardNum: number = 0
  selectedTeam: Team;
  showScore: boolean = false;
  constructor(private firebaseData: AngularFireDatabase) { }
  getTriviaDeck() {
    return this.firebaseData.list('triviaList', ref => ref.orderByChild('order'))
  }

  getTeamList() {
    return this.firebaseData.list('teams')
  }

  insert(card: TriviaCard) {
    this.triviaDeck.forEach(c => {
      if (c.order >= card.order) {
        this.firebaseData.list('triviaList').update(c.key, {
          order: c.order + 1
        })
      }
    })
    this.firebaseData.list('triviaList').push({
      question: card.question,
      answer: card.answer,
      order: card.order,
      showAnswer: false,
      lastModified: this.timestamp()
    })
  }
  edit(card: TriviaCard) {
    this.firebaseData.list('triviaList').update(card.key, {
      question: card.question,
      answer: card.answer,
      order: card.order,
      showAnswer: false,
      lastModified: this.timestamp()
    })
  }

  remove(card: TriviaCard) {
    this.triviaDeck.forEach(c => {
      if (c.order > card.order) {
        this.firebaseData.list('triviaList').update(c.key, {
          order: c.order - 1
        })
      }
    })
    this.firebaseData.list('triviaList').remove(card.key)
  }

  shiftUp(card: TriviaCard) {
    if (card.order > 1) {
      let currentIndex = card.order - 1
      let neighbor = this.triviaDeck[currentIndex - 1] as TriviaCard
      this.firebaseData.list('triviaList/').update(card.key, {
        order: card.order - 1,
      })
      this.firebaseData.list('triviaList/').update(neighbor.key, {
        order: neighbor.order + 1,
      })
    }
  }

  shiftDown(card: TriviaCard) {
    if (card.order < this.triviaDeck.length) {
      let currentIndex = card.order - 1
      let neighbor = this.triviaDeck[currentIndex + 1] as TriviaCard
      this.firebaseData.list('triviaList/').update(card.key, {
        order: card.order + 1,
      })
      this.firebaseData.list('triviaList/').update(neighbor.key, {
        order: neighbor.order - 1,
      })
    }
  }
  toggleShowAnswer(card: TriviaCard) {
    this.firebaseData.list('triviaList').update(card.key, {
      showAnswer: !card.showAnswer
    })
  }
  setActiveQuestion(card: TriviaCard) {
    this.firebaseData.list('/').update('triviaList', {
      activeNum: card.order - 1
    })
  }

  clearAcitveQuestion() {
    this.firebaseData.list('/').update('triviaList', {
      activeNum: -1
    })
  }

  saveTeam() {
    this.firebaseData.list('teams').push(this.selectedTeam)
    this.selectedTeam = {
      name: null,
      key: null,
      score: null,
      points: null,
    }
  }

  addPoint(team: Team) {
    this.firebaseData.list('teams').update(team.key, {
      points: team.points + 1
    })
  }

  removePoint(team: Team) {
    this.firebaseData.list('teams').update(team.key, {
      points: team.points - 1
    })
  }

  sumPoints(teams: Team[]) {
    teams.forEach(team => {
      this.firebaseData.list('teams').update(team.key, {
        score: team.score + team.points,
        points: 0
      })
    })
  }

  clearTeams(teams: Team[]) {
    teams.forEach(team => {
      this.removeTeam(team.key)
    })
  }

  removeTeam(key: string) {
    this.firebaseData.list('teams/' + key).remove()
  }

  toggleShowScore() {
    this.firebaseData.list('/').update('triviaList', {
      showScore: !this.showScore
    })
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}
