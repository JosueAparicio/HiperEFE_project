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
  constructor(
    public _router: Router,
    public routerParams: ActivatedRoute) {
    this.musicBackgroud = new Howl({
      src: ['../../../../../assets/music/musicMuseum.mp3'],
      autoplay: true,
      loop: true,
      volume: 0.2,
      onend: function () {
        console.log('Finished!');
      }
    })
  }

  ngOnInit(): void {
    this.musicBackgroud.stop();
    this.uidCreator = this.routerParams.snapshot.paramMap.get('creator');
    this.codeRoom = this.routerParams.snapshot.paramMap.get('codeRoom');
    this.musicBackgroud.play();
  }

  goToLobby() {
    this.musicBackgroud.stop();
    this._router.navigate([`vr/lobby/${this.uidCreator}/${this.codeRoom}`]);
  }

  startTravelFree() {
    this.modificView('ligthOff', 'visible', 'false');
    this.modificView('question', 'text', 'value:Adelante, Comienza tu viaje');
  }

  visitGuided(){
    this.modificView('question', 'text','value:Elige que quieres ver en el Museo');
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
}
