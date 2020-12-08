import { Howl } from 'howler';
export class Soundtrack{
    private configSound = {
        src: [],
        autoplay: true,
        loop: true,
        volume: 0.1
    };

    private pathVoice = {
        welcome: '../../assets/music/voiceMuseum/welcomeMuseum.mp3'
    }

    private pathVoiceuph = [
        '../../assets/music/voiceMuseum/to220.mp3',
        '../../assets/music/voiceMuseum/ciSV.mp3',
        '../../assets/music/voiceMuseum/oblea.mp3',
        '../../assets/music/voiceMuseum/hpJornada.mp3',
        '../../assets/music/voiceMuseum/libreto110c.mp3',
        '../../assets/music/voiceMuseum/disk1541.mp3',
        '../../assets/music/voiceMuseum/txiPortatil.mp3',
        '../../assets/music/voiceMuseum/dnsSv.mp3'
    ]
    private countVoiceUph:number = 0;

    private soundTrackAmbient : Howl;
    private soundTrackFocus: Howl;
    private soundTrackSelect: Howl;
    private soundTrackDeSelect: Howl;
    private voice: Howl;
    private voiceUph: Howl;

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

    public playVoiceUph(){
        this.voiceUph = new Howl(this.changeSoundSrc(this.pathVoiceuph[this.countVoiceUph]));
        this.voiceUph.play();
        this.countVoiceUph++;
    }

    public stopVoiceUph(){
        this.voiceUph.stop();
    }
}