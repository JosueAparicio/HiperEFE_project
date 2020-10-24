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
  public phrases = {
    1: 'Yepa, que pasa gente',
    2: 'Buenas, Como esta?',
    3: 'Todo bien, Todo correcto',
    4: 'Hola, mi nombre es HYPER',
    5: 'Listo para aprender?'
  }
  private musicBackgroud: Howl;
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
    this.uidCreator = this.routerParams.snapshot.paramMap.get('creator');
    this.codeRoom = this.routerParams.snapshot.paramMap.get('codeRoom');
    let phrasesRamdon = { value: this.phrases[Global.generarNumero(1, 5)] };
    this.modificView('phrasesRobot', 'text', phrasesRamdon);
    this.musicBackgroud.play();
  }

  goToLobby() {
    this.musicBackgroud.stop();
    this._router.navigate([`vr/lobby/${this.uidCreator}/${this.codeRoom}`]);
  }

  startTravel() {
    this.modificView('ligthAmbient', 'visible', 'true');
    this.modificView('ligthOff', 'visible', 'false');
    this.modificView('containerLigth', 'visible', 'true');
  }

  modificView(idItem: string, attribute: any, value: any) {
    let itemView = document.getElementById(idItem);
    itemView.setAttribute(attribute, value);
  }
}
