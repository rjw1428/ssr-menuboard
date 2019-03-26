import { Component, OnInit } from '@angular/core';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { FeaturesService } from '@shared/services/features.service';
import { environment } from '@environments/environment'
import { MatDialog, MatSnackBar } from '@angular/material';
import { FeatureForm2Component } from '@features/feature-form2/feature-form2.component';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { switchMap } from 'rxjs/operators';
import { DataService } from '@shared/services/data.service';
import { Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ContentService } from '@shared/services/content.service';

@Component({
  selector: 'app-features-control-page',
  templateUrl: './features-control-page.component.html',
  styleUrls: ['./features-control-page.component.css']
})
export class FeaturesControlPageComponent implements OnInit {
  featuredList: FeaturedItem[] = []
  selected: number
  constructor(
    // public featureService: FeaturesService, 
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private service: DataService,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.route.parent.params.switchMap(bar => {
      this.contentService.getFileList(bar['client'])
      return this.service.getFeaturedCollection(bar['client'])
    }).subscribe(vals => {
      console.log(vals)
      this.featuredList = vals
    })
  }

  //WHEN SCREEN IS BLANK, ADD FEATURE BUTTON ACTION
  addFeature() {
    const dialogRef = this.dialog.open(FeatureForm2Component, {
      width: '500px',
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe((result: FeaturedItem) => {
      if (result) {
        //console.log(result)
        if (!result.img)
          result.active = false
        this.route.parent.params.subscribe(bar => {
          //console.log("Bar: " + bar['client'])
          this.afs.collection('clients').doc(bar['client']).update({
            featuresList: firestore.FieldValue.arrayUnion(result)
          })
        })
        this.snackBar.open(result.pageTitle + " Added", "OK", {
          duration: 3000,
        })
      }
    });
  }

  onClick(featureNum: number) {
    //console.log('CLICKED: ' + featureNum)
    this.isSelected(featureNum) ? this.selected = null : this.selected = featureNum
    //console.log('SAVED:' + this.selected)
    this.saveContent('test')
  }

  isSelected(featureNum: number) {
    if (this.selected != null)
      return this.selected == featureNum
    return false
  }

  deleteFeature() {
    if (confirm("Are you sure you want to delete this Featured Item?") == true) {
      let obj = Object.assign({}, this.featuredList[this.selected])
      this.service.localFirestoreList.update({
        featuresList: firestore.FieldValue.arrayRemove(obj)
      })
      this.selected = null
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.featuredList, event.previousIndex, event.currentIndex);
    let modList = this.featuredList
    this.service.localFirestoreList.update({
      featuresList: modList
    })
  }


  editFeature() {
    console.log('EDIT - ' + this.featuredList[this.selected].pageTitle)
    // this.service.selectedLocal = this.featuredList[this.selected]
    let input = this.featuredList[this.selected]
    console.log(input)
    const dialogRef = this.dialog.open(FeatureForm2Component, {
      width: '550px',
      disableClose: true,
      data: input
    });

    dialogRef.afterClosed()
      .subscribe((result: FeaturedItem) => {
        if (result) {
          let output = Object.assign({}, result)
          this.featuredList[this.selected] = output
          this.service.localFirestoreList.update({
            featuresList: this.featuredList
          })
            .then(ref => {
              this.snackBar.open(result.pageTitle + " has been edited", "OK", {
                duration: 3000,
              })
            })
          this.onClick(this.selected)
        }
      })
  }

  saveContent(url: string) {

    // this.contentService.getFileList('knotty').valueChanges()


    // .map((x: { content: any[] }) => x.content)
    // .map((vals: any[]) => {
    //   return vals.forEach((val: { fileName: string, url: string }) => {
    //     if (url != val.fileName)
    //       console.log('ADD')
    //     else console.log('MATCH - SAVE WITH' + val.url)
    //   })
    // }).subscribe(console.log)
  }
}
