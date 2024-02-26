import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVacina, NewVacina } from '../vacina.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVacina for edit and NewVacinaFormGroupInput for create.
 */
type VacinaFormGroupInput = IVacina | PartialWithRequiredKeyOf<NewVacina>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVacina | NewVacina> = Omit<T, 'criado'> & {
  criado?: string | null;
};

type VacinaFormRawValue = FormValueOf<IVacina>;

type NewVacinaFormRawValue = FormValueOf<NewVacina>;

type VacinaFormDefaults = Pick<NewVacina, 'id' | 'criado'>;

type VacinaFormGroupContent = {
  id: FormControl<VacinaFormRawValue['id'] | NewVacina['id']>;
  nome: FormControl<VacinaFormRawValue['nome']>;
  criado: FormControl<VacinaFormRawValue['criado']>;
  doenca: FormControl<VacinaFormRawValue['doenca']>;
};

export type VacinaFormGroup = FormGroup<VacinaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VacinaFormService {
  createVacinaFormGroup(vacina: VacinaFormGroupInput = { id: null }): VacinaFormGroup {
    const vacinaRawValue = this.convertVacinaToVacinaRawValue({
      ...this.getFormDefaults(),
      ...vacina,
    });
    return new FormGroup<VacinaFormGroupContent>({
      id: new FormControl(
        { value: vacinaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(vacinaRawValue.nome),
      criado: new FormControl(vacinaRawValue.criado),
      doenca: new FormControl(vacinaRawValue.doenca),
    });
  }

  getVacina(form: VacinaFormGroup): IVacina | NewVacina {
    return this.convertVacinaRawValueToVacina(form.getRawValue() as VacinaFormRawValue | NewVacinaFormRawValue);
  }

  resetForm(form: VacinaFormGroup, vacina: VacinaFormGroupInput): void {
    const vacinaRawValue = this.convertVacinaToVacinaRawValue({ ...this.getFormDefaults(), ...vacina });
    form.reset(
      {
        ...vacinaRawValue,
        id: { value: vacinaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VacinaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      criado: currentTime,
    };
  }

  private convertVacinaRawValueToVacina(rawVacina: VacinaFormRawValue | NewVacinaFormRawValue): IVacina | NewVacina {
    return {
      ...rawVacina,
      criado: dayjs(rawVacina.criado, DATE_TIME_FORMAT),
    };
  }

  private convertVacinaToVacinaRawValue(
    vacina: IVacina | (Partial<NewVacina> & VacinaFormDefaults),
  ): VacinaFormRawValue | PartialWithRequiredKeyOf<NewVacinaFormRawValue> {
    return {
      ...vacina,
      criado: vacina.criado ? vacina.criado.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
