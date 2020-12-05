import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour } from '../../../../models/tourMuseum';
import { Soundtrack } from '../../../../models/soundtrackMuseum';
@Component({
  selector: 'app-scene-museum',
  templateUrl: './scene-museum.component.html',
  styleUrls: ['./scene-museum.component.css']
})
export class SceneMuseumComponent implements OnInit {

  private uidCreator: string;
  private codeRoom: string;
  private moveCamera: any;
  private sensibilityCamera: number = 0.2;
  private velocityCamera: number = 50;
  private orderMoveAxis: number = 0;
  private positionMove: any;

  private configTour: Tour;
  private soundtrack: Soundtrack;
  constructor(
    public _router: Router,
    public routerParams: ActivatedRoute) 
  {
    this.soundtrack = new Soundtrack;
    this.configTour = new Tour();
  }

  ngOnInit(): void {
    this.soundtrack.stopSoundTrackAmbient();
    this.uidCreator = this.routerParams.snapshot.paramMap.get('creator');
    this.codeRoom = this.routerParams.snapshot.paramMap.get('codeRoom');
    this.soundtrack.playSoudTrackAmbient();
    this.soundtrack.playVoice('welcome');
  }

  goToLobby() {
    this.soundtrack.stopSoundTrackAmbient();
    this._router.navigate([`vr/lobby/${this.uidCreator}/${this.codeRoom}`]);
  }

  moveCameraUser(){
    this.positionMove = this.configTour.getPositionGeneration('first');
    this.configMoveCamera();
  }

  startMoveAhead(sensibility: number, axis: any, arrivalPoint: number) {

    let valueRotation = AFRAME.utils.entity.getComponentProperty(document.querySelector('#cameraUser'), 'position');

    if (valueRotation[axis] > arrivalPoint){
      valueRotation[axis] +=sensibility;
      AFRAME.utils.entity.setComponentProperty(document.querySelector('#cameraUser'), 'position', valueRotation);
    
    }else{
      this.stopMoveCamera();
    }
  }

  startMoveBehind(sensibility: number, axis: any, arrivalPoint: number){
    let valueRotation = AFRAME.utils.entity.getComponentProperty(document.querySelector('#cameraUser'), 'position');
    
    if (valueRotation[axis] < arrivalPoint) {
      valueRotation[axis] += sensibility;
      AFRAME.utils.entity.setComponentProperty(document.querySelector('#cameraUser'), 'position', valueRotation);

    } else {
      this.stopMoveCamera();
    }
  }

  stopMoveCamera() {
    clearInterval(this.moveCamera);
    this.configMoveCamera();
    
  }

  modificView(idItem: string, attribute: any, value: any) {
    let itemView = document.getElementById(idItem);
    itemView.setAttribute(attribute, value);
  }
  
  
  //CONFIGURACION DE SONIDOS DEL MENU
  focusObject(){
    this.soundtrack.playSoundTrackFocus();
  }
  
  selectObject(){
    this.soundtrack.playSoundTrackSelect();
  }
  
  deselectObject(){
    this.soundtrack.playSoundTrackDeSelect();
  }

  //Recorrido HIPEREFE x UnPocoDeHistoria
  startTravelUPH(){
    this.positionMove = this.configTour.getPositionUPH('first');
    this.soundtrack.playVoiceUph();
    this.configMoveCamera();
  }

  nextFrame(){
    this.positionMove = this.configTour.next();
    let prueba = { x: this.positionMove['x'] + 1.3, y: 1.9, z: -1.2 };
    console.log(prueba);
    this.modificView('ArrowFrame', 'position', prueba);
    this.configMoveCamera();
    this.soundtrack.playVoiceUph();
  }

  configMoveCamera(){
    if(this.orderMoveAxis < this.positionMove.order.length){
      let axisPosition: string = this.positionMove.order[this.orderMoveAxis];
      if (this.positionMove[axisPosition]<0){
        this.moveCamera = window.setInterval(() => this.startMoveAhead.call(this, -this.sensibilityCamera, axisPosition, this.positionMove[axisPosition]), this.velocityCamera);
      }else{
        this.moveCamera = window.setInterval(() => this.startMoveBehind.call(this, this.sensibilityCamera, axisPosition, this.positionMove[axisPosition]), this.velocityCamera); 
      }
      this.orderMoveAxis++;
    }else{
      this.orderMoveAxis = 0;
    }
  }
}
