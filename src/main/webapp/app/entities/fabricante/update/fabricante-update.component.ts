import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPais } from 'app/entities/pais/pais.model';
import { PaisService } from 'app/entities/pais/service/pais.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';
import { FabricanteService } from '../service/fabricante.service';
import { IFabricante } from '../fabricante.model';
import { FabricanteFormService, FabricanteFormGroup } from './fabricante-form.service';

@Component({
  standalone: true,
  selector: 'jhi-fabricante-update',
  templateUrl: './fabricante-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FabricanteUpdateComponent implements OnInit {
  isSaving = false;
  fabricante: IFabricante | null = null;

  paisSharedCollection: IPais[] = [];
  vacinasSharedCollection: IVacina[] = [];

  editForm: FabricanteFormGroup = this.fabricanteFormService.createFabricanteFormGroup();

  constructor(
    protected fabricanteService: FabricanteService,
    protected fabricanteFormService: FabricanteFormService,
    protected paisService: PaisService,
    protected vacinaService: VacinaService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  comparePais = (o1: IPais | null, o2: IPais | null): boolean => this.paisService.comparePais(o1, o2);

  compareVacina = (o1: IVacina | null, o2: IVacina | null): boolean => this.vacinaService.compareVacina(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fabricante }) => {
      this.fabricante = fabricante;
      if (fabricante) {
        this.updateForm(fabricante);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fabricante = this.fabricanteFormService.getFabricante(this.editForm);
    if (fabricante.id !== null) {
      this.subscribeToSaveResponse(this.fabricanteService.update(fabricante));
    } else {
      this.subscribeToSaveResponse(this.fabricanteService.create(fabricante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFabricante>>): void {
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

  protected updateForm(fabricante: IFabricante): void {
    this.fabricante = fabricante;
    this.fabricanteFormService.resetForm(this.editForm, fabricante);

    this.paisSharedCollection = this.paisService.addPaisToCollectionIfMissing<IPais>(this.paisSharedCollection, fabricante.pais);
    this.vacinasSharedCollection = this.vacinaService.addVacinaToCollectionIfMissing<IVacina>(
      this.vacinasSharedCollection,
      ...(fabricante.vacinas ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.paisService
      .query()
      .pipe(map((res: HttpResponse<IPais[]>) => res.body ?? []))
      .pipe(map((pais: IPais[]) => this.paisService.addPaisToCollectionIfMissing<IPais>(pais, this.fabricante?.pais)))
      .subscribe((pais: IPais[]) => (this.paisSharedCollection = pais));

    this.vacinaService
      .query()
      .pipe(map((res: HttpResponse<IVacina[]>) => res.body ?? []))
      .pipe(
        map((vacinas: IVacina[]) =>
          this.vacinaService.addVacinaToCollectionIfMissing<IVacina>(vacinas, ...(this.fabricante?.vacinas ?? [])),
        ),
      )
      .subscribe((vacinas: IVacina[]) => (this.vacinasSharedCollection = vacinas));
  }
}
