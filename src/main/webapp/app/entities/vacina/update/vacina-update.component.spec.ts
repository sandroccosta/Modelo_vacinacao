import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IDoenca } from 'app/entities/doenca/doenca.model';
import { DoencaService } from 'app/entities/doenca/service/doenca.service';
import { VacinaService } from '../service/vacina.service';
import { IVacina } from '../vacina.model';
import { VacinaFormService } from './vacina-form.service';

import { VacinaUpdateComponent } from './vacina-update.component';

describe('Vacina Management Update Component', () => {
  let comp: VacinaUpdateComponent;
  let fixture: ComponentFixture<VacinaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vacinaFormService: VacinaFormService;
  let vacinaService: VacinaService;
  let doencaService: DoencaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), VacinaUpdateComponent],
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
      .overrideTemplate(VacinaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacinaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vacinaFormService = TestBed.inject(VacinaFormService);
    vacinaService = TestBed.inject(VacinaService);
    doencaService = TestBed.inject(DoencaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Doenca query and add missing value', () => {
      const vacina: IVacina = { id: 456 };
      const doenca: IDoenca = { id: 14988 };
      vacina.doenca = doenca;

      const doencaCollection: IDoenca[] = [{ id: 22823 }];
      jest.spyOn(doencaService, 'query').mockReturnValue(of(new HttpResponse({ body: doencaCollection })));
      const additionalDoencas = [doenca];
      const expectedCollection: IDoenca[] = [...additionalDoencas, ...doencaCollection];
      jest.spyOn(doencaService, 'addDoencaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacina });
      comp.ngOnInit();

      expect(doencaService.query).toHaveBeenCalled();
      expect(doencaService.addDoencaToCollectionIfMissing).toHaveBeenCalledWith(
        doencaCollection,
        ...additionalDoencas.map(expect.objectContaining),
      );
      expect(comp.doencasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const vacina: IVacina = { id: 456 };
      const doenca: IDoenca = { id: 17959 };
      vacina.doenca = doenca;

      activatedRoute.data = of({ vacina });
      comp.ngOnInit();

      expect(comp.doencasSharedCollection).toContain(doenca);
      expect(comp.vacina).toEqual(vacina);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacina>>();
      const vacina = { id: 123 };
      jest.spyOn(vacinaFormService, 'getVacina').mockReturnValue(vacina);
      jest.spyOn(vacinaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacina });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacina }));
      saveSubject.complete();

      // THEN
      expect(vacinaFormService.getVacina).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vacinaService.update).toHaveBeenCalledWith(expect.objectContaining(vacina));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacina>>();
      const vacina = { id: 123 };
      jest.spyOn(vacinaFormService, 'getVacina').mockReturnValue({ id: null });
      jest.spyOn(vacinaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacina: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacina }));
      saveSubject.complete();

      // THEN
      expect(vacinaFormService.getVacina).toHaveBeenCalled();
      expect(vacinaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacina>>();
      const vacina = { id: 123 };
      jest.spyOn(vacinaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacina });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vacinaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDoenca', () => {
      it('Should forward to doencaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(doencaService, 'compareDoenca');
        comp.compareDoenca(entity, entity2);
        expect(doencaService.compareDoenca).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
