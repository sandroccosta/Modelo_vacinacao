import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VacinaDetailComponent } from './vacina-detail.component';

describe('Vacina Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacinaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: VacinaDetailComponent,
              resolve: { vacina: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(VacinaDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load vacina on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', VacinaDetailComponent);

      // THEN
      expect(instance.vacina).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
