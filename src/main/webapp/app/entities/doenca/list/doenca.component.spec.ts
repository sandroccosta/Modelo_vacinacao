import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DoencaService } from '../service/doenca.service';

import { DoencaComponent } from './doenca.component';

describe('Doenca Management Component', () => {
  let comp: DoencaComponent;
  let fixture: ComponentFixture<DoencaComponent>;
  let service: DoencaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'doenca', component: DoencaComponent }]), HttpClientTestingModule, DoencaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(DoencaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DoencaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DoencaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.doencas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to doencaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDoencaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDoencaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
