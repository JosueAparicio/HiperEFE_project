import { Component, OnInit } from '@angular/core';
import { Trophy } from '../../../../models/trophy';
import { Topic } from '../../../../models/topics';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Howl, Howler } from 'howler';


@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  private listTopics: Array<any>;
  public listCardOption: Array<string>;
  private topicActiveCardOption: any;
  private posicionNumberTopic: number;

  private listTrophy: Array<Trophy>;
  private trophyActive: any;
  private posicionNumberTrophy: number;
  private topicSelect: any;
  private uidCreator: string;
  private codeRoom: string;
  private cursorVR: string;
  private rotateActive: any;
  private sensibilityCamera: number = 0.2;
  private velocityCamera: number = 10;
  
  constructor(
    private location: Location,
    public _router: Router,
    public routerParams: ActivatedRoute,

  ) {
    this.listCardOption = [
      '1', '2', '3', '4'
    ]

    this.listTrophy = [
      new Trophy('?', 'Diamond', 'Descubre el secreto de HiperEFE', '1'),
      new Trophy('Sumergiendonos en la VR', 'Silver', 'Visita el edificio de las CardBoard y cosntruye tus propias gafas de VR', '1'),
      new Trophy('Atravez de la Historia', 'Silver', 'Completa el recorrido por el museo de historia de la informatica de El Salvador', '2'),
      new Trophy('Hola Mundo', 'Gold', 'Toma las clases de basicas de programacion y realiza tu primer hola mundo', '3'),
      new Trophy('Bienvenido al Streaming', 'Silver', 'Toma la clase para aprender a hacer streaming de calidad', '4')
    ]

    this.posicionNumberTopic = 4;
    this.posicionNumberTrophy = 4;
    this.cursorVR = 'mouseCursor';
  }

  ngOnInit(): void {
    this.listTopics = JSON.parse(sessionStorage.getItem('topics'));
    this.uidCreator = this.routerParams.snapshot.paramMap.get('creator');
    this.codeRoom = this.routerParams.snapshot.paramMap.get('codeRoom');

    this.checkMobileDevice();

    if (this.listTopics.length < 4) {
      this.modificView('imgNext', 'visible', false);
      this.modificView('imgPrev', 'visible', false);
    }

    this.trophyActive = this.orderArray(this.getStartPosition(this.posicionNumberTrophy), this.posicionNumberTrophy, this.listTrophy);
    this.topicActiveCardOption = this.orderArray(this.getStartPosition(this.posicionNumberTopic), this.getEndPosition(), this.listTopics);

    this.startMusicBackgroud();
  }

  sceneLoad() {
    this.loadTrophyCard();
  }

  loadTopicCardOption() {
    this.listCardOption.forEach(element => {
      let title = this.topicActiveCardOption[element];

      this.modificView('lblTitulo' + element, 'value', title.tema.toString());
      this.modificView('imgIconCard' + element, 'src', '#' + title.idTema.toString());

      this.removeColorTitleCard();
    });
  }

  backMainMenu() {
    this.topicSelect = 0;
    this.removeColorTitleCard();
  }

  selectTopic(posCard: string) {
    this.topicSelect = this.topicActiveCardOption[posCard];

    this.removeColorTitleCard();
    this.modificView('lblTituloItem', 'value', this.topicSelect.tema);
    this.modificView('lblDescripcionItem', 'value', this.topicSelect.descripcion);
  }

  nextTopic() {
    if (this.posicionNumberTopic != this.listTopics.length) {
      this.posicionNumberTopic++;
      this.topicActiveCardOption = this.orderArray(this.getStartPosition(this.posicionNumberTopic), this.getEndPosition(), this.listTopics);
      this.loadTopicCardOption();
    }
  }

  prevTopic() {
    if (this.posicionNumberTopic != 4) {
      this.posicionNumberTopic--;
      this.topicActiveCardOption = this.orderArray(this.getStartPosition(this.posicionNumberTopic), this.getEndPosition(), this.listTopics);
      this.loadTopicCardOption();
    }
  }

  removeColorTitleCard() {
    this.listCardOption.forEach(element => {

      if (this.topicActiveCardOption[element] == this.topicSelect) {
        this.modificView('lblTitulo' + element, 'color', '#36FF00');
      } else {
        this.modificView('lblTitulo' + element, 'color', '#FFF');
      }
    });
  }

  getStartPosition(posicion: number) {
    return posicion - 4;
  }

  getEndPosition() {
    return this.posicionNumberTopic;
  }

  modificView(idItem: string, attribute: any, value: any) {
    let itemView = document.getElementById(idItem);
    itemView.setAttribute(attribute, value);
  }


  loadTrophyCard() {
    this.listCardOption.forEach(element => {
      let trophy = this.trophyActive[element];

      this.modificView('cardTrophyIcon' + element, 'src', '#' + trophy.idTema.toString());
      this.modificView('cardTrophyTitle' + element, 'value', trophy.nombreLogro.toString());
    });
  }

  nextTrophy() {
    if (this.posicionNumberTrophy != this.listTrophy.length) {
      this.posicionNumberTrophy++;
      this.trophyActive = this.orderArray(this.getStartPosition(this.posicionNumberTrophy), this.posicionNumberTrophy, this.listTrophy);
      this.loadTrophyCard();
    }
  }

  prevTrophy() {
    if (this.posicionNumberTrophy != 4) {
      this.posicionNumberTrophy--;
      this.trophyActive = this.orderArray(this.getStartPosition(this.posicionNumberTrophy), this.posicionNumberTrophy, this.listTrophy);
      this.loadTrophyCard();
    }
  }

  selectTrophy(position: string) {
    const topicSelect = this.trophyActive[position];

    this.modificView('lblNameTrophy', 'value', topicSelect.nombreLogro);
    this.modificView('lblDescripcionTrophy', 'value', topicSelect.descripcion);
    this.modificView('lblCategory', 'value', topicSelect.categoria);
    this.modificView('trophyIconCategory', 'src', '#trophy' + topicSelect.categoria);
  }

  orderArray(start: number, end: number, arrayFilter: any) {
    let topicSlice = arrayFilter.slice(start, end);

    return topicSlice.reduce((acc, el, i) => ({
      ...acc, [i + 1]: el,
    }), {});
  }

  exitLobby() {
    this._router.navigate([`detailsRoom/${this.uidCreator}/${this.codeRoom}`]);
  }


  /**CODIGO DE COMPATIBILIDAD CON MOVIL */
  checkMobileDevice() {
    if (AFRAME.utils.device.isMobile()) {
      this.configCameraMobile();
    } else {
      this.configCameraDefault();
    }
  }

  /**Configura la camara del usuario para funcionar en Movil */
  configCameraMobile() {
    let configCamera = {
      cursor: { fuse: true, fuseTimeout: 2000 },
      position : { x: 0, y:0, z:-1 },
      geometry: { primitive: 'ring', radiusInner: 0.03, radiusOuter: 0.04 },
      visible : true
    }

    let configPortals = {
      menu: { id: 'portalMenu', src: '#imgArrowgo', visible: true, position: { x: 0, y: -2, z: -4}, rotation: { x: -90, y: 0, z: 0 }},
      trophy: { id: 'portalTrophy', src: '#imgArrowgo', visible: true, position: { x: -4.5, y: -2, z: -4 }, rotation: { x: -90, y: 90, z: 0 }}
    }
    
    /**Añadiendo los atributos a la camara en modo Movil */
    this.modificView(this.cursorVR, 'cursor', configCamera.cursor);
    this.modificView(this.cursorVR, 'position', configCamera.position);
    this.modificView(this.cursorVR, 'geometry', configCamera.geometry);
    this.modificView(this.cursorVR, 'visible', configCamera.visible);

    /**Añadiendo los atributos al portal del menu en modo Movil*/
    this.modificView(configPortals.menu.id, 'src', configPortals.menu.src);
    this.modificView(configPortals.menu.id, 'visible', configPortals.menu.visible);
    this.modificView(configPortals.menu.id, 'position', configPortals.menu.position);
    this.modificView(configPortals.menu.id, 'rotation', configPortals.menu.rotation);

    /**Añadiendo los atributos al portal de trofeos en Modo movil */
    this.modificView(configPortals.trophy.id, 'src', configPortals.trophy.src);
    this.modificView(configPortals.trophy.id, 'visible', configPortals.trophy.visible);
    this.modificView(configPortals.trophy.id, 'position', configPortals.trophy.position);
    this.modificView(configPortals.trophy.id, 'rotation', configPortals.trophy.rotation);
  }

  /**Configura una camara por default */
  configCameraDefault(){
    let configCamera = { cursor: { rayOrigin: 'mouse' }};
    this.modificView(this.cursorVR, 'cursor', configCamera.cursor);
  }

  /**TELEPORTS DEL MODO MOVIL */
  goPortalMenu(){
    this.modificView('cameraUser', 'position', { x: 0, y: 0, z: -4 });
  }

  goPortalTrophy(){
    this.modificView('cameraUser', 'position', { x: -3.5, y: 0, z: -4 });
  }

  /**CONFIGURACION DE CONTROLES DE SENSIBILIDAD */
  rotateCameraLeft(){
    this.rotateActive = setInterval(() => this.startRotate.call(this, this.sensibilityCamera), this.velocityCamera);
  }

  rotateCameraRight(){
    this.rotateActive = window.setInterval(()=> this.startRotate.call(this,-this.sensibilityCamera), this.velocityCamera);
  }

  stopRotateCamera(){
    clearInterval(this.rotateActive);
  }

  startRotate(sensibility: number){
    let cameraUser = document.querySelector('#entornoVR');
    let valueRotation = AFRAME.utils.entity.getComponentProperty(cameraUser, 'rotation');
    
    let newValue = { x: valueRotation['x'], y: (valueRotation['y'] - sensibility), z: valueRotation['z']};
    console.log(newValue);
    AFRAME.utils.entity.setComponentProperty(cameraUser,'rotation', newValue);
  }

  /**CONFIGURACION DE BANDA SONORA LOBBY VR */
  startMusicBackgroud(){
    var sound = new Howl({
      src: ['../../../../../assets/music/musicLobby.mp3'],
      autoplay: true,
      loop: true,
      volume: 0.5,
      onend: function () {
        console.log('Finished!');
      }
    });
    sound.play();
  }
}
