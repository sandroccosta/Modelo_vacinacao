import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFabricante, NewFabricante } from '../fabricante.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFabricante for edit and NewFabricanteFormGroupInput for create.
 */
type FabricanteFormGroupInput = IFabricante | PartialWithRequiredKeyOf<NewFabricante>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFabricante | NewFabricante> = Omit<T, 'criado'> & {
  criado?: string | null;
};

type FabricanteFormRawValue = FormValueOf<IFabricante>;

type NewFabricanteFormRawValue = FormValueOf<NewFabricante>;

type FabricanteFormDefaults = Pick<NewFabricante, 'id' | 'criado' | 'vacinas'>;

type FabricanteFormGroupContent = {
  id: FormControl<FabricanteFormRawValue['id'] | NewFabricante['id']>;
  nome: FormControl<FabricanteFormRawValue['nome']>;
  criado: FormControl<FabricanteFormRawValue['criado']>;
  pais: FormControl<FabricanteFormRawValue['pais']>;
  vacinas: FormControl<FabricanteFormRawValue['vacinas']>;
};

export type FabricanteFormGroup = FormGroup<FabricanteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FabricanteFormService {
  createFabricanteFormGroup(fabricante: FabricanteFormGroupInput = { id: null }): FabricanteFormGroup {
    const fabricanteRawValue = this.convertFabricanteToFabricanteRawValue({
      ...this.getFormDefaults(),
      ...fabricante,
    });
    return new FormGroup<FabricanteFormGroupContent>({
      id: new FormControl(
        { value: fabricanteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(fabricanteRawValue.nome),
      criado: new FormControl(fabricanteRawValue.criado),
      pais: new FormControl(fabricanteRawValue.pais),
      vacinas: new FormControl(fabricanteRawValue.vacinas ?? []),
    });
  }

  getFabricante(form: FabricanteFormGroup): IFabricante | NewFabricante {
    return this.convertFabricanteRawValueToFabricante(form.getRawValue() as FabricanteFormRawValue | NewFabricanteFormRawValue);
  }

  resetForm(form: FabricanteFormGroup, fabricante: FabricanteFormGroupInput): void {
    const fabricanteRawValue = this.convertFabricanteToFabricanteRawValue({ ...this.getFormDefaults(), ...fabricante });
    form.reset(
      {
        ...fabricanteRawValue,
        id: { value: fabricanteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FabricanteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      criado: currentTime,
      vacinas: [],
    };
  }

  private convertFabricanteRawValueToFabricante(
    rawFabricante: FabricanteFormRawValue | NewFabricanteFormRawValue,
  ): IFabricante | NewFabricante {
    return {
      ...rawFabricante,
      criado: dayjs(rawFabricante.criado, DATE_TIME_FORMAT),
    };
  }

  private convertFabricanteToFabricanteRawValue(
    fabricante: IFabricante | (Partial<NewFabricante> & FabricanteFormDefaults),
  ): FabricanteFormRawValue | PartialWithRequiredKeyOf<NewFabricanteFormRawValue> {
    return {
      ...fabricante,
      criado: fabricante.criado ? fabricante.criado.format(DATE_TIME_FORMAT) : undefined,
      vacinas: fabricante.vacinas ?? [],
    };
  }
}
