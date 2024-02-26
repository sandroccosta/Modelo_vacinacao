import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IPais } from 'app/entities/pais/pais.model';
import { PaisService } from 'app/entities/pais/service/pais.service';
import { DoencaService } from '../service/doenca.service';
import { IDoenca } from '../doenca.model';
import { DoencaFormService } from './doenca-form.service';

import { DoencaUpdateComponent } from './doenca-update.component';

describe('Doenca Management Update Component', () => {
  let comp: DoencaUpdateComponent;
  let fixture: ComponentFixture<DoencaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let doencaFormService: DoencaFormService;
  let doencaService: DoencaService;
  let paisService: PaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), DoencaUpdateComponent],
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
      .overrideTemplate(DoencaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DoencaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    doencaFormService = TestBed.inject(DoencaFormService);
    doencaService = TestBed.inject(DoencaService);
    paisService = TestBed.inject(PaisService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pais query and add missing value', () => {
      const doenca: IDoenca = { id: 456 };
      const paisPrimeiroCaso: IPais = { id: 21793 };
      doenca.paisPrimeiroCaso = paisPrimeiroCaso;

      const paisCollection: IPais[] = [{ id: 19122 }];
      jest.spyOn(paisService, 'query').mockReturnValue(of(new HttpResponse({ body: paisCollection })));
      const additionalPais = [paisPrimeiroCaso];
      const expectedCollection: IPais[] = [...additionalPais, ...paisCollection];
      jest.spyOn(paisService, 'addPaisToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ doenca });
      comp.ngOnInit();

      expect(paisService.query).toHaveBeenCalled();
      expect(paisService.addPaisToCollectionIfMissing).toHaveBeenCalledWith(paisCollection, ...additionalPais.map(expect.objectContaining));
      expect(comp.paisSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const doenca: IDoenca = { id: 456 };
      const paisPrimeiroCaso: IPais = { id: 12181 };
      doenca.paisPrimeiroCaso = paisPrimeiroCaso;

      activatedRoute.data = of({ doenca });
      comp.ngOnInit();

      expect(comp.paisSharedCollection).toContain(paisPrimeiroCaso);
      expect(comp.doenca).toEqual(doenca);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDoenca>>();
      const doenca = { id: 123 };
      jest.spyOn(doencaFormService, 'getDoenca').mockReturnValue(doenca);
      jest.spyOn(doencaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ doenca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: doenca }));
      saveSubject.complete();

      // THEN
      expect(doencaFormService.getDoenca).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(doencaService.update).toHaveBeenCalledWith(expect.objectContaining(doenca));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDoenca>>();
      const doenca = { id: 123 };
      jest.spyOn(doencaFormService, 'getDoenca').mockReturnValue({ id: null });
      jest.spyOn(doencaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ doenca: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: doenca }));
      saveSubject.complete();

      // THEN
      expect(doencaFormService.getDoenca).toHaveBeenCalled();
      expect(doencaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDoenca>>();
      const doenca = { id: 123 };
      jest.spyOn(doencaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ doenca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(doencaService.update).toHaveBeenCalled();
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
  });
});
