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
    this.modificView('ligthAmbient', 'visible', 'true');
    this.modificView('ligthOff', 'visible', 'false');
  }

  visitGuided(){
    console.log('CLICK EN GUIDED');
    this.modificView('question', 'text','value:Elige que quieres ver en el Museo');
  }

  modificView(idItem: string, attribute: any, value: any) {
    let itemView = document.getElementById(idItem);
    itemView.setAttribute(attribute, value);
  }

  moveCameraUser(){
    this.moveCamera = window.setInterval(() => this.startRotate.call(this, this.sensibilityCamera), this.velocityCamera);
  }

  startRotate(sensibility: number) {
    let cameraUser = document.querySelector('#cameraUser');
    let valueRotation = AFRAME.utils.entity.getComponentProperty(cameraUser, 'position');
    if(valueRotation['z'] > -7){
      let newValue = { x: valueRotation['x'], y: (valueRotation['y']), z: valueRotation['z'] - sensibility };

      AFRAME.utils.entity.setComponentProperty(cameraUser, 'position', newValue);
    }else{
      this.modificView('lightSphere', 'visible', 'true');
      this.stopRotateCamera();
    }
  }

  stopRotateCamera() {
    clearInterval(this.moveCamera);
  }
}
