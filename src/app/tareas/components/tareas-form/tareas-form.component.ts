import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TareasService } from '../../services/tareas.service';
import { Tarea, FormEvent, Accion } from '../../interfaces/tarea.interface';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tareas-form',
  templateUrl: './tareas-form.component.html',
  imports: [CommonModule, ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatChipsModule
  ]
})
export class TareasFormComponent implements OnInit {

  @Input() tareaId!: string;
  miFormulario: FormGroup;

  tarea: Tarea = {
    descripcion: '',
    finalizada: false,
    fechaCreacion: '',
    fechaVencimiento: '',
    usuario: { id: '', username: '' }
  }

  errors: string[] = [];

  @Output() formEvent = new EventEmitter<FormEvent>();
  @Output() close = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private tareasService: TareasService) {
    this.miFormulario = this.fb.group({
      titulo: [],
      descripcion: ['', [Validators.required]],
      fechaVencimiento: ['', [Validators.required]],
      fechaCreacion: [],
      finalizada: [],
    });
  }

  ngOnInit(): void {
    if (this.tareaId) {
      this.tareasService.getTareaById(this.tareaId).subscribe(
        (tarea) => {
          this.tarea = tarea;
          this.miFormulario.reset(tarea);
        }
      );
    }
  }



  guardar() {
    const estadoAntiguo = this.tarea.finalizada;
    const idtarea = this.tarea.id;
    this.tarea = this.miFormulario.value;
    this.tarea['id'] = idtarea;
    console.log(this.tarea);

    if (this.tarea.id) {
      this.tareasService.actualizarTarea(this.tarea).subscribe(
        {
          next: (tareaResp) => {
            if (!estadoAntiguo && tareaResp.tarea.finalizada) {
              this.playAudio();
            }
            this.formEvent.emit({
              accion: Accion.Actualizar, tareaId: tareaResp.tarea.id
            });
          },
          error: (e) => {
            if (e.status == 400) {
              this.errors = e.error.errors
            }
          }
        }
      );
    } else {
      this.tareasService.agregarTarea(this.tarea).subscribe(
        {
          next: (tareaResp) => {
            if (tareaResp.tarea.finalizada) {
              this.playAudio();
            }
            this.formEvent.emit({
              accion: Accion.Crear, tareaId: tareaResp.tarea.id
            });
          },
          error: (e) => {
            if (e.status == 400) {
              console.log(e.error.errors);
              this.errors = e.error.errors;
            }
          }
        }
      );
    }
  }

  cerrar() {
    this.close.emit(true);
  }


  borrar() {
    if (this.tarea.id) {
      this.tareasService.borrarTarea(this.tarea.id).subscribe(
        () => {
          this.formEvent.emit({
            accion: Accion.Borrar, tareaId: this.tarea.id
          });
        }
      );
    }
  }

  cerrarErrores() {
    this.errors = [];
  }

  playAudio() {
    let audio = new Audio();
    audio.src = "/notificacion.mp3";
    audio.load();
    audio.play();
  }

}
