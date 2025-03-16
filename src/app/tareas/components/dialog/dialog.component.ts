import { Component, OnInit, Inject } from '@angular/core';
import { TareasFormComponent } from '../tareas-form/tareas-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tarea, FormEvent } from '../../interfaces/tarea.interface';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  imports: [TareasFormComponent]
})
export class DialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<TareasFormComponent>,
    @Inject(MAT_DIALOG_DATA) public tareaId: string) { }

  ngOnInit(): void {

  }

  closeDialog(formEvent: FormEvent) {
    this.dialogRef.close(formEvent);
  }


  cerrar() {
    this.dialogRef.close();
  }

}
