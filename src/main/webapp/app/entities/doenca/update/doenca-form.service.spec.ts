import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../doenca.test-samples';

import { DoencaFormService } from './doenca-form.service';

describe('Doenca Form Service', () => {
  let service: DoencaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoencaFormService);
  });

  describe('Service methods', () => {
    describe('createDoencaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDoencaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            criado: expect.any(Object),
            dataPrimeiroCaso: expect.any(Object),
            localPrimeiroCaso: expect.any(Object),
            paisPrimeiroCaso: expect.any(Object),
          }),
        );
      });

      it('passing IDoenca should create a new form with FormGroup', () => {
        const formGroup = service.createDoencaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            criado: expect.any(Object),
            dataPrimeiroCaso: expect.any(Object),
            localPrimeiroCaso: expect.any(Object),
            paisPrimeiroCaso: expect.any(Object),
          }),
        );
      });
    });

    describe('getDoenca', () => {
      it('should return NewDoenca for default Doenca initial value', () => {
        const formGroup = service.createDoencaFormGroup(sampleWithNewData);

        const doenca = service.getDoenca(formGroup) as any;

        expect(doenca).toMatchObject(sampleWithNewData);
      });

      it('should return NewDoenca for empty Doenca initial value', () => {
        const formGroup = service.createDoencaFormGroup();

        const doenca = service.getDoenca(formGroup) as any;

        expect(doenca).toMatchObject({});
      });

      it('should return IDoenca', () => {
        const formGroup = service.createDoencaFormGroup(sampleWithRequiredData);

        const doenca = service.getDoenca(formGroup) as any;

        expect(doenca).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDoenca should not enable id FormControl', () => {
        const formGroup = service.createDoencaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDoenca should disable id FormControl', () => {
        const formGroup = service.createDoencaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
