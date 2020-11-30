export class Tour {
    private tour = {
        uph:{
            first: { x: 8.6, z: -7.412 , order: ["z", "x"]},
            travel: [12.80, 17.43, 22.72, 27.66, 32.58, 37.81, 42.57]
        },
        generation:{
            first: {z: -12.5, order: ['z']}
        }
    };
    private countTravel: number = 0;
    constructor(){}

    public next(){
        let goMove = { x: this.tour.uph.travel[this.countTravel], order: ["x"]}
        this.countTravel++;
        return goMove;
    }

    public prev(){
        this.countTravel--;
        return this.tour.uph.travel[this.countTravel];
    }

    public exit(){

    }

    public getPositionUPH(nextStep: string){
        return this.tour.uph[nextStep];
    }

    public getPositionGeneration(nexStep: string){
        return this.tour.generation[nexStep];
    }

}