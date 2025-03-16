import { Component, OnInit } from '@angular/core';
import { TareasService } from '../../services/tareas.service';
import { Tarea, FormEvent, Accion, Filtro, usuario } from '../../interfaces/tarea.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { NgxMasonryModule } from 'ngx-masonry';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, MatDividerModule, MenuComponent, NgxMasonryModule,

    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatChipsModule
  ]
})
export default class HomeComponent implements OnInit {

  tareas: Tarea[] = [];

  filtro: Filtro = {
    finalizada: ''
  }

  tareaSelecionada: Tarea = {
    descripcion: '',
    fechaCreacion: '',
    finalizada: false,
    fechaVencimiento: '',
    usuario: { id: '', username: '' }
  }

  panelOpenState: boolean = true;

  constructor(private tareaService: TareasService,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    document.body.classList.remove('imagen-fondo-login');
    this.actualizarTareas();
  }

  actualizarTareas() {
    this.tareaService.getTareas().subscribe(
      (tareas) => {
        this.tareas = tareas;
      }
    );
  }

  actualizarTareasParams() {
    this.tareaService.getTareasParams(this.filtro).subscribe(
      (tareas) => {
        this.tareas = tareas;
      }
    );
  }


  playAudio() {
    let audio = new Audio();
    audio.src = "/notificacion.mp3";
    audio.load();
    audio.play();
  }

  nuevoEstado(tarea: Tarea) {
    const nuevaTarea = { ...tarea };
    nuevaTarea.finalizada = !tarea.finalizada;
    this.tareaService.actualizarTarea(nuevaTarea).subscribe(
      (resp) => {
        const tareaResponse = resp.tarea;
        if (this.filtro.finalizada == 'si' && !tareaResponse.finalizada) {
          this.tareas = this.tareas.filter((tareaFiltro) => tareaFiltro.id != tareaResponse.id);
        } else if (this.filtro.finalizada == 'no' && tareaResponse.finalizada) {
          this.tareas = this.tareas.filter((tareaFiltro) => tareaFiltro.id != tareaResponse.id);
        } else {
          tarea.finalizada = tareaResponse.finalizada
        }
        if (tareaResponse.finalizada) {
          this.playAudio();
        }
      }
    );
  }

  abrirDialogGuardar(tareaId: string) {
    const width = window.innerWidth >= 520 ? '60%' : '90%';
    const dialog = this.matDialog.open(DialogComponent, {
      //width: '60%',
      width,
      panelClass: 'custom-dialog-container',
      data: tareaId
    });

    dialog.afterClosed().subscribe((formEvent: FormEvent) => {
      if (formEvent) {

        if (formEvent.accion == Accion.Borrar) {
          this.tareas = this.tareas.filter((tarea) => tarea.id != formEvent.tareaId);
        } else {
          this.actualizarTareasParams();
        }
      }
    });
  }

  cambiarOrden(orden: string) {
    this.filtro.orden = orden;
    this.actualizarTareasParams();
  }

  cambiarEstado(finalizada: string) {
    this.filtro.finalizada = finalizada;
    console.log(this.filtro);
    this.actualizarTareasParams();
  }

  cambiarUsuario(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const value = isChecked ? 'me' : '';
    this.filtro.usuario = value;
    this.actualizarTareasParams();
  }

  cambiarBusqueda(busqueda: string) {
    this.filtro.busqueda = busqueda;
    this.actualizarTareasParams();
  }
}
