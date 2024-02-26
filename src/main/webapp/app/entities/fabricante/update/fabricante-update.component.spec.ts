import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IPais } from 'app/entities/pais/pais.model';
import { PaisService } from 'app/entities/pais/service/pais.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';
import { IFabricante } from '../fabricante.model';
import { FabricanteService } from '../service/fabricante.service';
import { FabricanteFormService } from './fabricante-form.service';

import { FabricanteUpdateComponent } from './fabricante-update.component';

describe('Fabricante Management Update Component', () => {
  let comp: FabricanteUpdateComponent;
  let fixture: ComponentFixture<FabricanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fabricanteFormService: FabricanteFormService;
  let fabricanteService: FabricanteService;
  let paisService: PaisService;
  let vacinaService: VacinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), FabricanteUpdateComponent],
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
      .overrideTemplate(FabricanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FabricanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fabricanteFormService = TestBed.inject(FabricanteFormService);
    fabricanteService = TestBed.inject(FabricanteService);
    paisService = TestBed.inject(PaisService);
    vacinaService = TestBed.inject(VacinaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pais query and add missing value', () => {
      const fabricante: IFabricante = { id: 456 };
      const pais: IPais = { id: 13742 };
      fabricante.pais = pais;

      const paisCollection: IPais[] = [{ id: 28670 }];
      jest.spyOn(paisService, 'query').mockReturnValue(of(new HttpResponse({ body: paisCollection })));
      const additionalPais = [pais];
      const expectedCollection: IPais[] = [...additionalPais, ...paisCollection];
      jest.spyOn(paisService, 'addPaisToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fabricante });
      comp.ngOnInit();

      expect(paisService.query).toHaveBeenCalled();
      expect(paisService.addPaisToCollectionIfMissing).toHaveBeenCalledWith(paisCollection, ...additionalPais.map(expect.objectContaining));
      expect(comp.paisSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Vacina query and add missing value', () => {
      const fabricante: IFabricante = { id: 456 };
      const vacinas: IVacina[] = [{ id: 20373 }];
      fabricante.vacinas = vacinas;

      const vacinaCollection: IVacina[] = [{ id: 3762 }];
      jest.spyOn(vacinaService, 'query').mockReturnValue(of(new HttpResponse({ body: vacinaCollection })));
      const additionalVacinas = [...vacinas];
      const expectedCollection: IVacina[] = [...additionalVacinas, ...vacinaCollection];
      jest.spyOn(vacinaService, 'addVacinaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fabricante });
      comp.ngOnInit();

      expect(vacinaService.query).toHaveBeenCalled();
      expect(vacinaService.addVacinaToCollectionIfMissing).toHaveBeenCalledWith(
        vacinaCollection,
        ...additionalVacinas.map(expect.objectContaining),
      );
      expect(comp.vacinasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fabricante: IFabricante = { id: 456 };
      const pais: IPais = { id: 21652 };
      fabricante.pais = pais;
      const vacinas: IVacina = { id: 15085 };
      fabricante.vacinas = [vacinas];

      activatedRoute.data = of({ fabricante });
      comp.ngOnInit();

      expect(comp.paisSharedCollection).toContain(pais);
      expect(comp.vacinasSharedCollection).toContain(vacinas);
      expect(comp.fabricante).toEqual(fabricante);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFabricante>>();
      const fabricante = { id: 123 };
      jest.spyOn(fabricanteFormService, 'getFabricante').mockReturnValue(fabricante);
      jest.spyOn(fabricanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fabricante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fabricante }));
      saveSubject.complete();

      // THEN
      expect(fabricanteFormService.getFabricante).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fabricanteService.update).toHaveBeenCalledWith(expect.objectContaining(fabricante));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFabricante>>();
      const fabricante = { id: 123 };
      jest.spyOn(fabricanteFormService, 'getFabricante').mockReturnValue({ id: null });
      jest.spyOn(fabricanteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fabricante: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fabricante }));
      saveSubject.complete();

      // THEN
      expect(fabricanteFormService.getFabricante).toHaveBeenCalled();
      expect(fabricanteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFabricante>>();
      const fabricante = { id: 123 };
      jest.spyOn(fabricanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fabricante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fabricanteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePais', () => {
      it('Should forward to paisService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(paisService, 'comparePais');
        comp.comparePais(entity, entity2);
        expect(paisService.comparePais).toHaveBeenCalledWith(entity, entity2);
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
  });
});
