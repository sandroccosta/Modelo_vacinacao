import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';
import { IFabricante } from 'app/entities/fabricante/fabricante.model';
import { FabricanteService } from 'app/entities/fabricante/service/fabricante.service';
import { VacinacaoPessoaService } from '../service/vacinacao-pessoa.service';
import { IVacinacaoPessoa } from '../vacinacao-pessoa.model';
import { VacinacaoPessoaFormService, VacinacaoPessoaFormGroup } from './vacinacao-pessoa-form.service';

@Component({
  standalone: true,
  selector: 'jhi-vacinacao-pessoa-update',
  templateUrl: './vacinacao-pessoa-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VacinacaoPessoaUpdateComponent implements OnInit {
  isSaving = false;
  vacinacaoPessoa: IVacinacaoPessoa | null = null;

  pessoasSharedCollection: IPessoa[] = [];
  vacinasSharedCollection: IVacina[] = [];
  fabricantesSharedCollection: IFabricante[] = [];

  editForm: VacinacaoPessoaFormGroup = this.vacinacaoPessoaFormService.createVacinacaoPessoaFormGroup();

  constructor(
    protected vacinacaoPessoaService: VacinacaoPessoaService,
    protected vacinacaoPessoaFormService: VacinacaoPessoaFormService,
    protected pessoaService: PessoaService,
    protected vacinaService: VacinaService,
    protected fabricanteService: FabricanteService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  comparePessoa = (o1: IPessoa | null, o2: IPessoa | null): boolean => this.pessoaService.comparePessoa(o1, o2);

  compareVacina = (o1: IVacina | null, o2: IVacina | null): boolean => this.vacinaService.compareVacina(o1, o2);

  compareFabricante = (o1: IFabricante | null, o2: IFabricante | null): boolean => this.fabricanteService.compareFabricante(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacinacaoPessoa }) => {
      this.vacinacaoPessoa = vacinacaoPessoa;
      if (vacinacaoPessoa) {
        this.updateForm(vacinacaoPessoa);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vacinacaoPessoa = this.vacinacaoPessoaFormService.getVacinacaoPessoa(this.editForm);
    if (vacinacaoPessoa.id !== null) {
      this.subscribeToSaveResponse(this.vacinacaoPessoaService.update(vacinacaoPessoa));
    } else {
      this.subscribeToSaveResponse(this.vacinacaoPessoaService.create(vacinacaoPessoa));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVacinacaoPessoa>>): void {
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

  protected updateForm(vacinacaoPessoa: IVacinacaoPessoa): void {
    this.vacinacaoPessoa = vacinacaoPessoa;
    this.vacinacaoPessoaFormService.resetForm(this.editForm, vacinacaoPessoa);

    this.pessoasSharedCollection = this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(
      this.pessoasSharedCollection,
      vacinacaoPessoa.pessoa,
    );
    this.vacinasSharedCollection = this.vacinaService.addVacinaToCollectionIfMissing<IVacina>(
      this.vacinasSharedCollection,
      vacinacaoPessoa.vacina,
    );
    this.fabricantesSharedCollection = this.fabricanteService.addFabricanteToCollectionIfMissing<IFabricante>(
      this.fabricantesSharedCollection,
      vacinacaoPessoa.fabricante,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pessoaService
      .query()
      .pipe(map((res: HttpResponse<IPessoa[]>) => res.body ?? []))
      .pipe(map((pessoas: IPessoa[]) => this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(pessoas, this.vacinacaoPessoa?.pessoa)))
      .subscribe((pessoas: IPessoa[]) => (this.pessoasSharedCollection = pessoas));

    this.vacinaService
      .query()
      .pipe(map((res: HttpResponse<IVacina[]>) => res.body ?? []))
      .pipe(map((vacinas: IVacina[]) => this.vacinaService.addVacinaToCollectionIfMissing<IVacina>(vacinas, this.vacinacaoPessoa?.vacina)))
      .subscribe((vacinas: IVacina[]) => (this.vacinasSharedCollection = vacinas));

    this.fabricanteService
      .query()
      .pipe(map((res: HttpResponse<IFabricante[]>) => res.body ?? []))
      .pipe(
        map((fabricantes: IFabricante[]) =>
          this.fabricanteService.addFabricanteToCollectionIfMissing<IFabricante>(fabricantes, this.vacinacaoPessoa?.fabricante),
        ),
      )
      .subscribe((fabricantes: IFabricante[]) => (this.fabricantesSharedCollection = fabricantes));
  }
}
