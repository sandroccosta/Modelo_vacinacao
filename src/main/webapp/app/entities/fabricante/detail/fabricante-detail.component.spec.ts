import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FabricanteDetailComponent } from './fabricante-detail.component';

describe('Fabricante Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabricanteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: FabricanteDetailComponent,
              resolve: { fabricante: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(FabricanteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load fabricante on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FabricanteDetailComponent);

      // THEN
      expect(instance.fabricante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
