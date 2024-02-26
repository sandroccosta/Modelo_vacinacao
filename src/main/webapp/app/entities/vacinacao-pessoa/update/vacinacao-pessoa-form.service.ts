import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVacinacaoPessoa, NewVacinacaoPessoa } from '../vacinacao-pessoa.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVacinacaoPessoa for edit and NewVacinacaoPessoaFormGroupInput for create.
 */
type VacinacaoPessoaFormGroupInput = IVacinacaoPessoa | PartialWithRequiredKeyOf<NewVacinacaoPessoa>;

type VacinacaoPessoaFormDefaults = Pick<NewVacinacaoPessoa, 'id'>;

type VacinacaoPessoaFormGroupContent = {
  id: FormControl<IVacinacaoPessoa['id'] | NewVacinacaoPessoa['id']>;
  quando: FormControl<IVacinacaoPessoa['quando']>;
  cns: FormControl<IVacinacaoPessoa['cns']>;
  codigoProfissinal: FormControl<IVacinacaoPessoa['codigoProfissinal']>;
  pessoa: FormControl<IVacinacaoPessoa['pessoa']>;
  vacina: FormControl<IVacinacaoPessoa['vacina']>;
  fabricante: FormControl<IVacinacaoPessoa['fabricante']>;
};

export type VacinacaoPessoaFormGroup = FormGroup<VacinacaoPessoaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VacinacaoPessoaFormService {
  createVacinacaoPessoaFormGroup(vacinacaoPessoa: VacinacaoPessoaFormGroupInput = { id: null }): VacinacaoPessoaFormGroup {
    const vacinacaoPessoaRawValue = {
      ...this.getFormDefaults(),
      ...vacinacaoPessoa,
    };
    return new FormGroup<VacinacaoPessoaFormGroupContent>({
      id: new FormControl(
        { value: vacinacaoPessoaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      quando: new FormControl(vacinacaoPessoaRawValue.quando),
      cns: new FormControl(vacinacaoPessoaRawValue.cns),
      codigoProfissinal: new FormControl(vacinacaoPessoaRawValue.codigoProfissinal),
      pessoa: new FormControl(vacinacaoPessoaRawValue.pessoa),
      vacina: new FormControl(vacinacaoPessoaRawValue.vacina),
      fabricante: new FormControl(vacinacaoPessoaRawValue.fabricante),
    });
  }

  getVacinacaoPessoa(form: VacinacaoPessoaFormGroup): IVacinacaoPessoa | NewVacinacaoPessoa {
    return form.getRawValue() as IVacinacaoPessoa | NewVacinacaoPessoa;
  }

  resetForm(form: VacinacaoPessoaFormGroup, vacinacaoPessoa: VacinacaoPessoaFormGroupInput): void {
    const vacinacaoPessoaRawValue = { ...this.getFormDefaults(), ...vacinacaoPessoa };
    form.reset(
      {
        ...vacinacaoPessoaRawValue,
        id: { value: vacinacaoPessoaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VacinacaoPessoaFormDefaults {
    return {
      id: null,
    };
  }
}
