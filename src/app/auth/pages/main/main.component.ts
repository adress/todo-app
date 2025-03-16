import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  imports: [RouterOutlet]
})
export default class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
