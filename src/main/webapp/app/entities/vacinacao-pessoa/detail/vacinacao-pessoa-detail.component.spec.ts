import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VacinacaoPessoaDetailComponent } from './vacinacao-pessoa-detail.component';

describe('VacinacaoPessoa Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacinacaoPessoaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: VacinacaoPessoaDetailComponent,
              resolve: { vacinacaoPessoa: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(VacinacaoPessoaDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load vacinacaoPessoa on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', VacinacaoPessoaDetailComponent);

      // THEN
      expect(instance.vacinacaoPessoa).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
