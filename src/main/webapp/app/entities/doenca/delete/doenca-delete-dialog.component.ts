import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDoenca } from '../doenca.model';
import { DoencaService } from '../service/doenca.service';

@Component({
  standalone: true,
  templateUrl: './doenca-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DoencaDeleteDialogComponent {
  doenca?: IDoenca;

  constructor(
    protected doencaService: DoencaService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.doencaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
