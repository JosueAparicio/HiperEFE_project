import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from '../../../../services/global';
import { Howl } from 'howler';

@Component({
  selector: 'app-scene-museum',
  templateUrl: './scene-museum.component.html',
  styleUrls: ['./scene-museum.component.css']
})
export class SceneMuseumComponent implements OnInit {

  private uidCreator: string;
  private codeRoom: string;
  private musicBackgroud: Howl;
  private moveCamera: any;
  private sensibilityCamera: number = 0.2;
  private velocityCamera: number = 50;
  private configSound ={
    src: [],
    autoplay: true,
    loop: true,
    volume: 0.2
  }
  private voice: Howl;
  private soundMenuSelect: Howl;
  private soundMenuFocus: Howl;
  private soundMenudeselect: Howl;
  constructor(
    public _router: Router,
    public routerParams: ActivatedRoute) {
    this.configSound.src = ['../../../../../assets/music/musicMuseum.mp3']
    this.musicBackgroud = new Howl(this.configSound)
    //this.configSound.src = ['../../../../../assets/music/voiceMuseum/doVisit.mp3'];
    this.configSound.src = ['../../../../../assets/music/voiceMuseum/doVisitD.m4a'];
    this.configSound.volume = 1;
    this.configSound.loop = false;
    this.voice = new Howl(this.configSound);
    
    this.configSound.src = ['../../../../../assets/music/menu/focus.mp3'];
    this.soundMenuFocus = new Howl(this.configSound);
    this.configSound.src = ['../../../../../assets/music/menu/select.mp3'];
    this.soundMenuSelect = new Howl(this.configSound);
    this.configSound.src = ['../../../../../assets/music/menu/deselect.mp3'];
    this.soundMenudeselect = new Howl(this.configSound);
  }

  ngOnInit(): void {
    this.musicBackgroud.stop();
    this.uidCreator = this.routerParams.snapshot.paramMap.get('creator');
    this.codeRoom = this.routerParams.snapshot.paramMap.get('codeRoom');
    this.musicBackgroud.play();
    this.voice.play();
  }

  goToLobby() {
    this.musicBackgroud.stop();
    this._router.navigate([`vr/lobby/${this.uidCreator}/${this.codeRoom}`]);
  }

  startTravelFree() {
    this.selectObject();
    this.fullTourVoice()
    this.modificView('ligthOff', 'visible', 'false');
    this.modificView('question', 'text', 'value:Adelante, Comienza tu viaje');
  }

  visitGuided(){
    this.modificView('question', 'text','value:Elige que quieres ver en el Museo');
    this.selectObject()
    this.exhibitionOrFreeVoice();
  }

  moveCameraUser(){
    this.moveCamera = window.setInterval(() => this.startMove.call(this, -this.sensibilityCamera, 'z', -7), this.velocityCamera);
  }

  startMove(sensibility: number, axis: string, arrivalPoint: number) {

    let valueRotation = AFRAME.utils.entity.getComponentProperty(document.querySelector('#cameraUser'), 'position');

    if(valueRotation[axis] > arrivalPoint){
      valueRotation[axis] +=sensibility;
      AFRAME.utils.entity.setComponentProperty(document.querySelector('#cameraUser'), 'position', valueRotation);
    }else{
      this.modificView('lightSphere', 'visible', 'true');
      this.modificView('focoRobot', 'visible', 'false');
      this.modificView('focoMenu', 'visible', 'false');
      this.stopMoveCamera();
    }
  }

  stopMoveCamera() {
    clearInterval(this.moveCamera);
  }

  modificView(idItem: string, attribute: any, value: any) {
    let itemView = document.getElementById(idItem);
    itemView.setAttribute(attribute, value);
  }
  
  exhibitionOrFreeVoice(){
    //const pathSound = '../../../../../assets/music/voiceMuseum/exhibitionOrFree.mp3';
    const pathSound = '../../../../../assets/music/voiceMuseum/exhibitionOrFreeD.m4a';
    this.configVoice(pathSound, 1);
  }
  
  configVoice(src: string, volumen: number){
    this.configSound.src = [src]
    this.configSound.volume = volumen;
    this.voice.stop();
    this.voice = new Howl(this.configSound);
    this.voice.play();
  }
  
  fullTourVoice(){
    //const pathSound = '../../../../../assets/music/voiceMuseum/fullTour.mp3';
    const pathSound = '../../../../../assets/music/voiceMuseum/fullTourD.m4a';
    this.configVoice(pathSound, 1);
  }
  
  
  //CONFIGURACION DE SONIDOS DEL MENU
  focusObject(){
    this.soundMenuFocus.play();
  }
  
  selectObject(){
    this.soundMenuSelect.play();
  }
  
  deselectObject(){
    this.soundMenudeselect.play();
  }
}
