import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPais } from '../pais.model';
import { PaisService } from '../service/pais.service';

@Component({
  standalone: true,
  templateUrl: './pais-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PaisDeleteDialogComponent {
  pais?: IPais;

  constructor(
    protected paisService: PaisService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paisService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
