import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DoencaDetailComponent } from './doenca-detail.component';

describe('Doenca Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoencaDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: DoencaDetailComponent,
              resolve: { doenca: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(DoencaDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load doenca on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', DoencaDetailComponent);

      // THEN
      expect(instance.doenca).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
