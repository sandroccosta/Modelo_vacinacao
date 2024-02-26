import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDoenca, NewDoenca } from '../doenca.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDoenca for edit and NewDoencaFormGroupInput for create.
 */
type DoencaFormGroupInput = IDoenca | PartialWithRequiredKeyOf<NewDoenca>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDoenca | NewDoenca> = Omit<T, 'criado'> & {
  criado?: string | null;
};

type DoencaFormRawValue = FormValueOf<IDoenca>;

type NewDoencaFormRawValue = FormValueOf<NewDoenca>;

type DoencaFormDefaults = Pick<NewDoenca, 'id' | 'criado'>;

type DoencaFormGroupContent = {
  id: FormControl<DoencaFormRawValue['id'] | NewDoenca['id']>;
  nome: FormControl<DoencaFormRawValue['nome']>;
  criado: FormControl<DoencaFormRawValue['criado']>;
  dataPrimeiroCaso: FormControl<DoencaFormRawValue['dataPrimeiroCaso']>;
  localPrimeiroCaso: FormControl<DoencaFormRawValue['localPrimeiroCaso']>;
  paisPrimeiroCaso: FormControl<DoencaFormRawValue['paisPrimeiroCaso']>;
};

export type DoencaFormGroup = FormGroup<DoencaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DoencaFormService {
  createDoencaFormGroup(doenca: DoencaFormGroupInput = { id: null }): DoencaFormGroup {
    const doencaRawValue = this.convertDoencaToDoencaRawValue({
      ...this.getFormDefaults(),
      ...doenca,
    });
    return new FormGroup<DoencaFormGroupContent>({
      id: new FormControl(
        { value: doencaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(doencaRawValue.nome),
      criado: new FormControl(doencaRawValue.criado),
      dataPrimeiroCaso: new FormControl(doencaRawValue.dataPrimeiroCaso),
      localPrimeiroCaso: new FormControl(doencaRawValue.localPrimeiroCaso),
      paisPrimeiroCaso: new FormControl(doencaRawValue.paisPrimeiroCaso),
    });
  }

  getDoenca(form: DoencaFormGroup): IDoenca | NewDoenca {
    return this.convertDoencaRawValueToDoenca(form.getRawValue() as DoencaFormRawValue | NewDoencaFormRawValue);
  }

  resetForm(form: DoencaFormGroup, doenca: DoencaFormGroupInput): void {
    const doencaRawValue = this.convertDoencaToDoencaRawValue({ ...this.getFormDefaults(), ...doenca });
    form.reset(
      {
        ...doencaRawValue,
        id: { value: doencaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DoencaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      criado: currentTime,
    };
  }

  private convertDoencaRawValueToDoenca(rawDoenca: DoencaFormRawValue | NewDoencaFormRawValue): IDoenca | NewDoenca {
    return {
      ...rawDoenca,
      criado: dayjs(rawDoenca.criado, DATE_TIME_FORMAT),
    };
  }

  private convertDoencaToDoencaRawValue(
    doenca: IDoenca | (Partial<NewDoenca> & DoencaFormDefaults),
  ): DoencaFormRawValue | PartialWithRequiredKeyOf<NewDoencaFormRawValue> {
    return {
      ...doenca,
      criado: doenca.criado ? doenca.criado.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
