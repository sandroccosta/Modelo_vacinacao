import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';
import { IFabricante } from 'app/entities/fabricante/fabricante.model';
import { FabricanteService } from 'app/entities/fabricante/service/fabricante.service';
import { IVacinacaoPessoa } from '../vacinacao-pessoa.model';
import { VacinacaoPessoaService } from '../service/vacinacao-pessoa.service';
import { VacinacaoPessoaFormService } from './vacinacao-pessoa-form.service';

import { VacinacaoPessoaUpdateComponent } from './vacinacao-pessoa-update.component';

describe('VacinacaoPessoa Management Update Component', () => {
  let comp: VacinacaoPessoaUpdateComponent;
  let fixture: ComponentFixture<VacinacaoPessoaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vacinacaoPessoaFormService: VacinacaoPessoaFormService;
  let vacinacaoPessoaService: VacinacaoPessoaService;
  let pessoaService: PessoaService;
  let vacinaService: VacinaService;
  let fabricanteService: FabricanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), VacinacaoPessoaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VacinacaoPessoaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacinacaoPessoaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vacinacaoPessoaFormService = TestBed.inject(VacinacaoPessoaFormService);
    vacinacaoPessoaService = TestBed.inject(VacinacaoPessoaService);
    pessoaService = TestBed.inject(PessoaService);
    vacinaService = TestBed.inject(VacinaService);
    fabricanteService = TestBed.inject(FabricanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pessoa query and add missing value', () => {
      const vacinacaoPessoa: IVacinacaoPessoa = { id: 456 };
      const pessoa: IPessoa = { id: 1782 };
      vacinacaoPessoa.pessoa = pessoa;

      const pessoaCollection: IPessoa[] = [{ id: 14313 }];
      jest.spyOn(pessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: pessoaCollection })));
      const additionalPessoas = [pessoa];
      const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
      jest.spyOn(pessoaService, 'addPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacinacaoPessoa });
      comp.ngOnInit();

      expect(pessoaService.query).toHaveBeenCalled();
      expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(
        pessoaCollection,
        ...additionalPessoas.map(expect.objectContaining),
      );
      expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Vacina query and add missing value', () => {
      const vacinacaoPessoa: IVacinacaoPessoa = { id: 456 };
      const vacina: IVacina = { id: 13307 };
      vacinacaoPessoa.vacina = vacina;

      const vacinaCollection: IVacina[] = [{ id: 16975 }];
      jest.spyOn(vacinaService, 'query').mockReturnValue(of(new HttpResponse({ body: vacinaCollection })));
      const additionalVacinas = [vacina];
      const expectedCollection: IVacina[] = [...additionalVacinas, ...vacinaCollection];
      jest.spyOn(vacinaService, 'addVacinaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacinacaoPessoa });
      comp.ngOnInit();

      expect(vacinaService.query).toHaveBeenCalled();
      expect(vacinaService.addVacinaToCollectionIfMissing).toHaveBeenCalledWith(
        vacinaCollection,
        ...additionalVacinas.map(expect.objectContaining),
      );
      expect(comp.vacinasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Fabricante query and add missing value', () => {
      const vacinacaoPessoa: IVacinacaoPessoa = { id: 456 };
      const fabricante: IFabricante = { id: 26493 };
      vacinacaoPessoa.fabricante = fabricante;

      const fabricanteCollection: IFabricante[] = [{ id: 11370 }];
      jest.spyOn(fabricanteService, 'query').mockReturnValue(of(new HttpResponse({ body: fabricanteCollection })));
      const additionalFabricantes = [fabricante];
      const expectedCollection: IFabricante[] = [...additionalFabricantes, ...fabricanteCollection];
      jest.spyOn(fabricanteService, 'addFabricanteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacinacaoPessoa });
      comp.ngOnInit();

      expect(fabricanteService.query).toHaveBeenCalled();
      expect(fabricanteService.addFabricanteToCollectionIfMissing).toHaveBeenCalledWith(
        fabricanteCollection,
        ...additionalFabricantes.map(expect.objectContaining),
      );
      expect(comp.fabricantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const vacinacaoPessoa: IVacinacaoPessoa = { id: 456 };
      const pessoa: IPessoa = { id: 2157 };
      vacinacaoPessoa.pessoa = pessoa;
      const vacina: IVacina = { id: 17141 };
      vacinacaoPessoa.vacina = vacina;
      const fabricante: IFabricante = { id: 25529 };
      vacinacaoPessoa.fabricante = fabricante;

      activatedRoute.data = of({ vacinacaoPessoa });
      comp.ngOnInit();

      expect(comp.pessoasSharedCollection).toContain(pessoa);
      expect(comp.vacinasSharedCollection).toContain(vacina);
      expect(comp.fabricantesSharedCollection).toContain(fabricante);
      expect(comp.vacinacaoPessoa).toEqual(vacinacaoPessoa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacinacaoPessoa>>();
      const vacinacaoPessoa = { id: 123 };
      jest.spyOn(vacinacaoPessoaFormService, 'getVacinacaoPessoa').mockReturnValue(vacinacaoPessoa);
      jest.spyOn(vacinacaoPessoaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacinacaoPessoa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacinacaoPessoa }));
      saveSubject.complete();

      // THEN
      expect(vacinacaoPessoaFormService.getVacinacaoPessoa).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vacinacaoPessoaService.update).toHaveBeenCalledWith(expect.objectContaining(vacinacaoPessoa));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacinacaoPessoa>>();
      const vacinacaoPessoa = { id: 123 };
      jest.spyOn(vacinacaoPessoaFormService, 'getVacinacaoPessoa').mockReturnValue({ id: null });
      jest.spyOn(vacinacaoPessoaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacinacaoPessoa: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacinacaoPessoa }));
      saveSubject.complete();

      // THEN
      expect(vacinacaoPessoaFormService.getVacinacaoPessoa).toHaveBeenCalled();
      expect(vacinacaoPessoaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacinacaoPessoa>>();
      const vacinacaoPessoa = { id: 123 };
      jest.spyOn(vacinacaoPessoaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacinacaoPessoa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vacinacaoPessoaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePessoa', () => {
      it('Should forward to pessoaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pessoaService, 'comparePessoa');
        comp.comparePessoa(entity, entity2);
        expect(pessoaService.comparePessoa).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVacina', () => {
      it('Should forward to vacinaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(vacinaService, 'compareVacina');
        comp.compareVacina(entity, entity2);
        expect(vacinaService.compareVacina).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareFabricante', () => {
      it('Should forward to fabricanteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(fabricanteService, 'compareFabricante');
        comp.compareFabricante(entity, entity2);
        expect(fabricanteService.compareFabricante).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
