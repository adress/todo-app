import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  imports: [RouterOutlet]
})
export default class TareasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
