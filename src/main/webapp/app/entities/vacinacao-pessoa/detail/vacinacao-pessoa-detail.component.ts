import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IVacinacaoPessoa } from '../vacinacao-pessoa.model';

@Component({
  standalone: true,
  selector: 'jhi-vacinacao-pessoa-detail',
  templateUrl: './vacinacao-pessoa-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class VacinacaoPessoaDetailComponent {
  @Input() vacinacaoPessoa: IVacinacaoPessoa | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
