import { Component, OnInit, Input } from '@angular/core';
import { ScreenInfo } from '@shared/interfaces/screen';
import { DataService } from '@shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {
  @Input() screenInfo: ScreenInfo
  constructor(
    private service: DataService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  toggleStaticButton() {
    this.service.setScreenStaticProperty(this.screenInfo.id, !this.screenInfo.static)
  }
  toggleDraftListButton() {
    this.service.setScreenDraftListProperty(this.screenInfo.id, !this.screenInfo.draftList)
  }
  toggleFeaturesButton() {
    this.service.setScreenFeaturesProperty(this.screenInfo.id, !this.screenInfo.features)
  }
  togglePauseButton() {
    this.service.setScreenPauseProperty(this.screenInfo.id, !this.screenInfo.pause)
  }

  onRefresh() {
    this.service.setRefresh(this.screenInfo.id).then(ref => {
      this.snackBar.open(`Refresh Command sent to ${this.screenInfo.name}`, "OK", {
        duration: 3000,
      })
    })
  }

  setStaticButtonColor() {
    if (this.screenInfo.static)
      return "primary"
    return "default"
  }

  setDraftListButtonColor() {
    if (this.screenInfo.draftList)
      return "primary"
    return "default"
  }

  setFeaturesButtonColor() {
    if (this.screenInfo.features)
      return "primary"
    return "default"
  }
}
