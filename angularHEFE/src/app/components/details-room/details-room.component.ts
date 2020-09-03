import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'La Tasca', weight: 'tasca@gmail.com', symbol: 'H' },
  { position: 2, name: 'El Inutil', weight: 'inutil@gmail.com', symbol: 'He' },
  { position: 3, name: 'Gustabo', weight: 'trabuko@gmail.com', symbol: 'Li' },
  { position: 4, name: 'Horacio', weight: 'horacios@gmail.com', symbol: 'Be' },
  { position: 5, name: 'Conway', weight: 'super@gmail.com', symbol: 'B' }
];
@Component({
  selector: 'app-details-room',
  templateUrl: './details-room.component.html',
  styleUrls: ['./details-room.component.css']
})
export class DetailsRoomComponent implements OnInit {

  constructor() { }
 
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  ngOnInit(): void {
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  prueba(userJoin){
    console.log(userJoin);
  }

}
