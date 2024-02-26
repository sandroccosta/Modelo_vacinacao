import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fabricante.test-samples';

import { FabricanteFormService } from './fabricante-form.service';

describe('Fabricante Form Service', () => {
  let service: FabricanteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FabricanteFormService);
  });

  describe('Service methods', () => {
    describe('createFabricanteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFabricanteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            criado: expect.any(Object),
            pais: expect.any(Object),
            vacinas: expect.any(Object),
          }),
        );
      });

      it('passing IFabricante should create a new form with FormGroup', () => {
        const formGroup = service.createFabricanteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            criado: expect.any(Object),
            pais: expect.any(Object),
            vacinas: expect.any(Object),
          }),
        );
      });
    });

    describe('getFabricante', () => {
      it('should return NewFabricante for default Fabricante initial value', () => {
        const formGroup = service.createFabricanteFormGroup(sampleWithNewData);

        const fabricante = service.getFabricante(formGroup) as any;

        expect(fabricante).toMatchObject(sampleWithNewData);
      });

      it('should return NewFabricante for empty Fabricante initial value', () => {
        const formGroup = service.createFabricanteFormGroup();

        const fabricante = service.getFabricante(formGroup) as any;

        expect(fabricante).toMatchObject({});
      });

      it('should return IFabricante', () => {
        const formGroup = service.createFabricanteFormGroup(sampleWithRequiredData);

        const fabricante = service.getFabricante(formGroup) as any;

        expect(fabricante).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFabricante should not enable id FormControl', () => {
        const formGroup = service.createFabricanteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFabricante should disable id FormControl', () => {
        const formGroup = service.createFabricanteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
