import { Component, OnInit } from '@angular/core';
import { DataService } from '@shared/services/data.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { ScreenInfo } from '@shared/interfaces/screen';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-screen-control',
  templateUrl: './screen-control.component.html',
  styleUrls: ['./screen-control.component.css']
})
export class ScreenControlComponent implements OnInit {
  screenInfo: Observable<ScreenInfo[]>
  client: string
  size: number
  constructor(
    private service: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.screenInfo = this.route.parent.params.switchMap(val => {
      this.client = val['client']
      return this.service.getScreenInfo(val['client'])
    })
    this.screenInfo.subscribe(list=>{
      this.size=list.length
    })
  }

  add() {
    this.service.addScreen(this.client, String(this.size+1))
  }
}
