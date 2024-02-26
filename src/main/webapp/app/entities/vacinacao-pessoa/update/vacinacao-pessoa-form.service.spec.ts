import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vacinacao-pessoa.test-samples';

import { VacinacaoPessoaFormService } from './vacinacao-pessoa-form.service';

describe('VacinacaoPessoa Form Service', () => {
  let service: VacinacaoPessoaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacinacaoPessoaFormService);
  });

  describe('Service methods', () => {
    describe('createVacinacaoPessoaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVacinacaoPessoaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quando: expect.any(Object),
            cns: expect.any(Object),
            codigoProfissinal: expect.any(Object),
            pessoa: expect.any(Object),
            vacina: expect.any(Object),
            fabricante: expect.any(Object),
          }),
        );
      });

      it('passing IVacinacaoPessoa should create a new form with FormGroup', () => {
        const formGroup = service.createVacinacaoPessoaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quando: expect.any(Object),
            cns: expect.any(Object),
            codigoProfissinal: expect.any(Object),
            pessoa: expect.any(Object),
            vacina: expect.any(Object),
            fabricante: expect.any(Object),
          }),
        );
      });
    });

    describe('getVacinacaoPessoa', () => {
      it('should return NewVacinacaoPessoa for default VacinacaoPessoa initial value', () => {
        const formGroup = service.createVacinacaoPessoaFormGroup(sampleWithNewData);

        const vacinacaoPessoa = service.getVacinacaoPessoa(formGroup) as any;

        expect(vacinacaoPessoa).toMatchObject(sampleWithNewData);
      });

      it('should return NewVacinacaoPessoa for empty VacinacaoPessoa initial value', () => {
        const formGroup = service.createVacinacaoPessoaFormGroup();

        const vacinacaoPessoa = service.getVacinacaoPessoa(formGroup) as any;

        expect(vacinacaoPessoa).toMatchObject({});
      });

      it('should return IVacinacaoPessoa', () => {
        const formGroup = service.createVacinacaoPessoaFormGroup(sampleWithRequiredData);

        const vacinacaoPessoa = service.getVacinacaoPessoa(formGroup) as any;

        expect(vacinacaoPessoa).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVacinacaoPessoa should not enable id FormControl', () => {
        const formGroup = service.createVacinacaoPessoaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVacinacaoPessoa should disable id FormControl', () => {
        const formGroup = service.createVacinacaoPessoaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
