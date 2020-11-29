export class Tour {
    private tour = {
        uph:{
            first: { x: 8.6, z: -7.412 , order: ["z", "x"]}
        },
        generation:{
            first: {z: -12.5, order: ['z']}
        }
    }
    constructor(){}

    public next(){

    }

    public prev(){

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