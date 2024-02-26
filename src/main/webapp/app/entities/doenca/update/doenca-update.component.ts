import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPais } from 'app/entities/pais/pais.model';
import { PaisService } from 'app/entities/pais/service/pais.service';
import { IDoenca } from '../doenca.model';
import { DoencaService } from '../service/doenca.service';
import { DoencaFormService, DoencaFormGroup } from './doenca-form.service';

@Component({
  standalone: true,
  selector: 'jhi-doenca-update',
  templateUrl: './doenca-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DoencaUpdateComponent implements OnInit {
  isSaving = false;
  doenca: IDoenca | null = null;

  paisSharedCollection: IPais[] = [];

  editForm: DoencaFormGroup = this.doencaFormService.createDoencaFormGroup();

  constructor(
    protected doencaService: DoencaService,
    protected doencaFormService: DoencaFormService,
    protected paisService: PaisService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  comparePais = (o1: IPais | null, o2: IPais | null): boolean => this.paisService.comparePais(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ doenca }) => {
      this.doenca = doenca;
      if (doenca) {
        this.updateForm(doenca);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const doenca = this.doencaFormService.getDoenca(this.editForm);
    if (doenca.id !== null) {
      this.subscribeToSaveResponse(this.doencaService.update(doenca));
    } else {
      this.subscribeToSaveResponse(this.doencaService.create(doenca));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDoenca>>): void {
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

  protected updateForm(doenca: IDoenca): void {
    this.doenca = doenca;
    this.doencaFormService.resetForm(this.editForm, doenca);

    this.paisSharedCollection = this.paisService.addPaisToCollectionIfMissing<IPais>(this.paisSharedCollection, doenca.paisPrimeiroCaso);
  }

  protected loadRelationshipsOptions(): void {
    this.paisService
      .query()
      .pipe(map((res: HttpResponse<IPais[]>) => res.body ?? []))
      .pipe(map((pais: IPais[]) => this.paisService.addPaisToCollectionIfMissing<IPais>(pais, this.doenca?.paisPrimeiroCaso)))
      .subscribe((pais: IPais[]) => (this.paisSharedCollection = pais));
  }
}
