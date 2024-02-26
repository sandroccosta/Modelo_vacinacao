import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IDoenca } from 'app/entities/doenca/doenca.model';
import { DoencaService } from 'app/entities/doenca/service/doenca.service';
import { IVacina } from '../vacina.model';
import { VacinaService } from '../service/vacina.service';
import { VacinaFormService, VacinaFormGroup } from './vacina-form.service';

@Component({
  standalone: true,
  selector: 'jhi-vacina-update',
  templateUrl: './vacina-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VacinaUpdateComponent implements OnInit {
  isSaving = false;
  vacina: IVacina | null = null;

  doencasSharedCollection: IDoenca[] = [];

  editForm: VacinaFormGroup = this.vacinaFormService.createVacinaFormGroup();

  constructor(
    protected vacinaService: VacinaService,
    protected vacinaFormService: VacinaFormService,
    protected doencaService: DoencaService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareDoenca = (o1: IDoenca | null, o2: IDoenca | null): boolean => this.doencaService.compareDoenca(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacina }) => {
      this.vacina = vacina;
      if (vacina) {
        this.updateForm(vacina);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vacina = this.vacinaFormService.getVacina(this.editForm);
    if (vacina.id !== null) {
      this.subscribeToSaveResponse(this.vacinaService.update(vacina));
    } else {
      this.subscribeToSaveResponse(this.vacinaService.create(vacina));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVacina>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(vacina: IVacina): void {
    this.vacina = vacina;
    this.vacinaFormService.resetForm(this.editForm, vacina);

    this.doencasSharedCollection = this.doencaService.addDoencaToCollectionIfMissing<IDoenca>(this.doencasSharedCollection, vacina.doenca);
  }

  protected loadRelationshipsOptions(): void {
    this.doencaService
      .query()
      .pipe(map((res: HttpResponse<IDoenca[]>) => res.body ?? []))
      .pipe(map((doencas: IDoenca[]) => this.doencaService.addDoencaToCollectionIfMissing<IDoenca>(doencas, this.vacina?.doenca)))
      .subscribe((doencas: IDoenca[]) => (this.doencasSharedCollection = doencas));
  }
}
