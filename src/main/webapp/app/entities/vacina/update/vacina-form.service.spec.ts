import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vacina.test-samples';

import { VacinaFormService } from './vacina-form.service';

describe('Vacina Form Service', () => {
  let service: VacinaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacinaFormService);
  });

  describe('Service methods', () => {
    describe('createVacinaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVacinaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            criado: expect.any(Object),
            doenca: expect.any(Object),
          }),
        );
      });

      it('passing IVacina should create a new form with FormGroup', () => {
        const formGroup = service.createVacinaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            criado: expect.any(Object),
            doenca: expect.any(Object),
          }),
        );
      });
    });

    describe('getVacina', () => {
      it('should return NewVacina for default Vacina initial value', () => {
        const formGroup = service.createVacinaFormGroup(sampleWithNewData);

        const vacina = service.getVacina(formGroup) as any;

        expect(vacina).toMatchObject(sampleWithNewData);
      });

      it('should return NewVacina for empty Vacina initial value', () => {
        const formGroup = service.createVacinaFormGroup();

        const vacina = service.getVacina(formGroup) as any;

        expect(vacina).toMatchObject({});
      });

      it('should return IVacina', () => {
        const formGroup = service.createVacinaFormGroup(sampleWithRequiredData);

        const vacina = service.getVacina(formGroup) as any;

        expect(vacina).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVacina should not enable id FormControl', () => {
        const formGroup = service.createVacinaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVacina should disable id FormControl', () => {
        const formGroup = service.createVacinaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
