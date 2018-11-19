import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { environment } from '@environments/environment';
import { Property } from '@shared/interfaces/property';
import 'rxjs/operator/map'
import { AuthService } from '@shared/services/auth.service';

@Injectable()
export class ManagementService {
  //FEATURE PROPERTIES
  featuredCaptionTop: Property;
  featuredCaptionSize: Property;
  featuredCaptionColor: Property;
  featuredCaptionFont: Property;
  featuredCaptionShadow: Property;
  featuredCaptionLetterSpace: Property;
  featuredHeaderTop: Property;
  featuredHeaderSize: Property;
  featuredHeaderColor: Property;
  featuredHeaderFont: Property;
  featuredHeaderShadow: Property;
  featuredHeaderLetterSpace: Property;
  featuredDescriptionTop: Property;
  featuredDescriptionSize: Property;
  featuredDescriptionColor: Property;
  featuredDescriptionFont: Property;
  featuredDescriptionShadow: Property;
  featuredDescriptionLetterSpace: Property;
  featuredBannerWidth: Property;
  featuredBannerColor: Property;

  //ITEM PROPERTIES
  itemTitleFontSize: Property
  itemTitleFont: Property
  itemTitleFontColor: Property
  itemTitleShadow: Property
  itemTitleLetterSpace: Property
  itemNoteFontSize: Property
  itemNoteFont: Property
  itemNoteFontColor: Property
  itemNoteShadow: Property
  itemAbvFontSize: Property
  itemAbvFont: Property
  itemAbvFontColor: Property
  itemAbvShadow: Property
  iconSize: Property
  itemBackground: Property
  itemBackgroundHeight: Property //NOT ON
  itemBorder: Property //NOT ON
  itemBorderRadius: Property
  itemBoxShadow: Property
  itemSoldOutFontSize: Property
  itemSoldOutFont: Property
  itemSoldOutFontColor: Property
  itemSoldOutShadow: Property

  //COLUMN PROPERTIES
  headerFontSize: Property
  headerFontColor: Property
  headerFont: Property
  headerTextShadow: Property
  headerAlignment: Property
  headerBackColor: Property
  headerShadow: Property
  headerBorder: Property
  headerBorderRadius: Property

  //SPECIAL ITEM PROPERTIES
  specialHeader: Property
  specialBackColor: Property
  specialHeaderSize: Property
  specialTitleSize: Property
  specialTitleFont: Property
  specialTitleColor: Property
  specialDescSize: Property
  specialDescColor: Property
  specialDescFont: Property
  specialBoxShadow: Property
  specialBorder: Property
  specialBorderRadius: Property

  //TIMER PROPERTIES
  timerColor: Property
  timerHeight: Property
  timerDirection: Property
  timerOn: Property

  //MASTER VARIABLES
  delay: Property;
  numConsecFeatures: Property; //NOT ON

  constructor(private firebaseData: AngularFireDatabase,
    public auth: AuthService) {
  }

  getTiming() {
    return this.firebaseData.list('properties/delay')
  }

  getProperties() {
    return this.firebaseData.list('properties/')
  }

  getProperties2() {
    return this.firebaseData.list('properties2/')
  }

  getTimerProperties() {
    return this.firebaseData.list('properties2/timer')
  }

  getStatus() {
    return this.firebaseData.list('status', ref => ref.orderByKey())
  }

  getConsecFeatureNum() {
    return this.firebaseData.list('properties/numConsecFeatures')
  }

  initiateProperties() {
    this.getProperties().snapshotChanges().subscribe(properties => {
      properties.forEach(property => {
        let x = property.payload.toJSON()
        x['key'] = property.key
        this.parseProperties(x as Property)
      })
    })
  }

  checkForRefresh(screenKey: string) {
    this.getStatus().snapshotChanges().forEach(screens => {
      screens.forEach(property => {
        let key = property.key
        let val: { refresh: boolean } = property.payload.toJSON() as any
        if (key == screenKey) {
          if (val.refresh) {
            window.location.reload(true)
          }
        }
      })
    })
  }

  setStatic() {
    this.getStatus().update('backyard', {
      static: true
    })
    this.getStatus().update('gameroom', {
      static: true
    })
    this.getStatus().update('main', {
      static: true
    })
  }

  stopStatic() {
    this.getStatus().update('backyard', {
      static: false
    })
    this.getStatus().update('gameroom', {
      static: false
    })
    this.getStatus().update('main', {
      static: false
    })
  }
  setSlideshow() {
    this.getStatus().update('backyard', {
      slideshow: true
    })
    this.getStatus().update('gameroom', {
      slideshow: true
    })
    this.getStatus().update('main', {
      slideshow: true
    })
  }

  stopSlideshow() {
    this.getStatus().update('backyard', {
      slideshow: false
    })
    this.getStatus().update('gameroom', {
      slideshow: false
    })
    this.getStatus().update('main', {
      slideshow: false
    })
  }

  setTrivia() {
    this.getStatus().update('backyard', {
      trivia: true
    })
    this.getStatus().update('gameroom', {
      trivia: true
    })
    this.getStatus().update('main', {
      trivia: true
    })
  }

  stopTrivia() {
    this.getStatus().update('backyard', {
      trivia: false
    })
    this.getStatus().update('gameroom', {
      trivia: false
    })
    this.getStatus().update('main', {
      trivia: false
    })
  }

  getState(screenKey: string) {
    return this.firebaseData.list('status/' + screenKey)
  }

  setScreenName(displayNum: number): string {
    let out = 'test'
    switch (+displayNum) {
      case 1:
        out = "main"
        break;
      case 2:
        out = "backyard"
        break;
      case 3:
        out = "gameroom"
        break
    }
    return out
  }

  storeScreenResolution(screenName, width, height) {
    this.getStatus().update(screenName, {
      screenWidth: width,
      screenHeight: height
    })
  }

  resetRefreshOnLoad(screenKey: string) {
    this.firebaseData.list('status').update(screenKey, {
      refresh: false
    })
  }

  setLastRefreshData(screenKey: string) {
    this.firebaseData.list('status/' + screenKey).update("lastUpdate",
      {
        version: environment.version,
        agent: navigator.userAgent,
        timestamp: this.timestamp()
      })
  }

  forceRefresh() {
    let screenList = ['backyard', 'main', 'gameroom', 'test']
    screenList.forEach(screen => {
      this.firebaseData.list('status').update(screen, {
        refresh: true
      })
    });
  }

  updateProperty(property: Property) {
    this.getProperties().update(property.key, {
      value: property.value,
      lastModified: this.timestamp()
    })
    alert("Property Saved: " + property.title)
  }

  setMachineActive(screenKey: string) {
    this.firebaseData.list('status').update(screenKey, {
      active: true
    })
  }

  parseProperties(val: Property) {
    switch (val.key) {
      case ('headerFontSize'):
        this.headerFontSize = val
        break;
      case ('headerFontColor'):
        this.headerFontColor = val
        break;
      case ('headerFont'):
        this.headerFont = val
        break;
      case ('headerTextShadow'):
        this.headerTextShadow = val
        break;
      case ('headerAlignment'):
        this.headerAlignment = val
        break;
      case ('headerBackColor'):
        this.headerBackColor = val
        break;
      case ('headerShadow'):
        this.headerShadow = val
        break;
      case ('headerBorder'):
        this.headerBorder = val
        break;
      case ('headerBorderRadius'):
        this.headerBorderRadius = val
        break;
      case ('featuredCaptionTop'):
        this.featuredCaptionTop = val
        break;
      case ('featuredCaptionSize'):
        this.featuredCaptionSize = val
        break;
      case ('featuredCaptionColor'):
        this.featuredCaptionColor = val
        break;
      case ('featuredCaptionFont'):
        this.featuredCaptionFont = val
        break;
      case ('featuredCaptionShadow'):
        this.featuredCaptionShadow = val
        break;
      case ('featuredCaptionLetterSpace'):
        this.featuredCaptionLetterSpace = val
        break;
      case ('featuredHeaderTop'):
        this.featuredHeaderTop = val
        break;
      case ('featuredHeaderSize'):
        this.featuredHeaderSize = val
        break;
      case ('featuredHeaderColor'):
        this.featuredHeaderColor = val
        break;
      case ('featuredHeaderFont'):
        this.featuredHeaderFont = val
        break;
      case ('featuredHeaderShadow'):
        this.featuredHeaderShadow = val
        break;
      case ('featuredHeaderLetterSpace'):
        this.featuredHeaderLetterSpace = val
        break;
      case ('featuredDescriptionTop'):
        this.featuredDescriptionTop = val
        break;
      case ('featuredDescriptionSize'):
        this.featuredDescriptionSize = val
        break;
      case ('featuredDescriptionColor'):
        this.featuredDescriptionColor = val
        break;
      case ('featuredDescriptionFont'):
        this.featuredDescriptionFont = val
        break;
      case ('featuredDescriptionShadow'):
        this.featuredDescriptionShadow = val
        break;
      case ('featuredDescriptionLetterSpace'):
        this.featuredDescriptionLetterSpace = val
        break;
      case ('featureBannerWidth'):
        this.featuredBannerWidth = val
        break;
      case ('featureBannerColor'):
        this.featuredBannerColor = val
        break;
      case ('featuredDescriptionShadow'):
        this.featuredDescriptionShadow = val
        break;
      case ('itemTitleFontSize'):
        this.itemTitleFontSize = val
        break;
      case ('itemTitleFont'):
        this.itemTitleFont = val
        break;
      case ('itemTitleFontColor'):
        this.itemTitleFontColor = val
        break;
      case ('itemTitleShadow'):
        this.itemTitleShadow = val
        break;
      case ('itemTitleLetterSpace'):
        this.itemTitleLetterSpace = val
        break;
      case ('itemNoteFontSize'):
        this.itemNoteFontSize = val
        break;
      case ('itemNoteFont'):
        this.itemNoteFont = val
        break;
      case ('itemNoteFontColor'):
        this.itemNoteFontColor = val
        break;
      case ('itemNoteShadow'):
        this.itemNoteShadow = val
        break;
      case ('itemAbvFontSize'):
        this.itemAbvFontSize = val
        break;
      case ('itemAbvFont'):
        this.itemAbvFont = val
        break;
      case ('itemAbvFontColor'):
        this.itemAbvFontColor = val
        break;
      case ('itemAbvShadow'):
        this.itemAbvShadow = val
        break;
      case ('iconSize'):
        this.iconSize = val
        break;
      case ('itemBackground'):
        this.itemBackground = val
        break;
      case ('itemBackgroundHeight'):
        this.itemBackgroundHeight = val
        break;
      case ('itemBorder'):
        this.itemBorder = val
        break;
      case ('itemBorderRadius'):
        this.itemBorderRadius = val
        break;
      case ('itemBoxShadow'):
        this.itemBoxShadow = val
        break;
      case ('itemSoldOutFontSize'):
        this.itemSoldOutFontSize = val
        break;
      case ('itemSoldOutFont'):
        this.itemSoldOutFont = val
        break;
      case ('itemSoldOutFontColor'):
        this.itemSoldOutFontColor = val
        break;
      case ('itemSoldOutShadow'):
        this.itemSoldOutShadow = val
        break;
      case ('delay'):
        this.delay = val
        break;
      case ('numConsecFeatures'):
        this.numConsecFeatures = val
        break;
      case ('specialBackColor'):
        this.specialBackColor = val
        break;
      case ('specialTitleSize'):
        this.specialTitleSize = val
        break;
      case ('specialTitleFont'):
        this.specialTitleFont = val
        break;
      case ('specialTitleColor'):
        this.specialTitleColor = val
        break;
      case ('specialDescSize'):
        this.specialDescSize = val
        break;
      case ('specialDescColor'):
        this.specialDescColor = val
        break;
      case ('specialDescFont'):
        this.specialDescFont = val
        break;
      case ('specialBoxShadow'):
        this.specialBoxShadow = val
        break;
      case ('specialBorder'):
        this.specialBorder = val
        break;
      case ('specialBorderRadius'):
        this.specialBorderRadius = val
        break;
      case ('specialHeaderSize'):
        this.specialHeaderSize = val
        break;
      case ('specialHeader'):
        this.specialHeader = val
        break;
      case ('timerColor'):
        this.timerColor = val
        break;
      case ('timerHeight'):
        this.timerHeight = val
        break;
      case ('timerDirection'):
        this.timerDirection = val
        break;
      case ('timerOn'):
        this.timerOn = val
        break;
    }
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}