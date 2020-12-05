import { Howl } from 'howler';
export class Soundtrack{
    private configSound = {
        src: [],
        autoplay: true,
        loop: true,
        volume: 0.2
    };

    private pathVoice = {
        welcome: '../../assets/music/voiceMuseum/welcomeMuseum.mp3'
    }

    private soundTrackAmbient : Howl;
    private soundTrackFocus: Howl;
    private soundTrackSelect: Howl;
    private soundTrackDeSelect: Howl;
    private voice: Howl;

    constructor(){
        this.soundTrackAmbient = new Howl(this.changeSoundSrc('../../assets/music/musicMuseum.mp3'));
        this.changeConfigSound();
        this.soundTrackFocus = new Howl(this.changeSoundSrc('../../assets/music/menu/focus.mp3'));
        this.soundTrackSelect = new Howl(this.changeSoundSrc('../../assets/music/menu/select.mp3'));
        this.soundTrackDeSelect = new Howl(this.changeSoundSrc('../../assets/music/menu/deselect.mp3'));
    }

    public playSoudTrackAmbient(){
        this.soundTrackAmbient.play();
    }

    public stopSoundTrackAmbient(){
        this.soundTrackAmbient.stop();
    }

    public playSoundTrackFocus(){  
        this.soundTrackFocus.play();
    }

    public playSoundTrackSelect(){ 
        this.soundTrackSelect.play();
    }

    public playSoundTrackDeSelect(){
        this.soundTrackDeSelect.play();
    }

    private changeConfigSound(){
        this.configSound.volume = 1;
        this.configSound.loop = false;
        this.configSound.autoplay = false
    }

    private changeSoundSrc(src: string){
        this.configSound.src = [src];
        return this.configSound
    }

    public playVoice(optionSound: string){
        this.voice = new Howl(this.changeSoundSrc(this.pathVoice[optionSound]));  
        this.voice.play();
    }

    public stopVoice(){
        this.voice.stop();
    }
}