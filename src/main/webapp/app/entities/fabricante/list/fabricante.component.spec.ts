import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FabricanteService } from '../service/fabricante.service';

import { FabricanteComponent } from './fabricante.component';

describe('Fabricante Management Component', () => {
  let comp: FabricanteComponent;
  let fixture: ComponentFixture<FabricanteComponent>;
  let service: FabricanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'fabricante', component: FabricanteComponent }]),
        HttpClientTestingModule,
        FabricanteComponent,
      ],
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
      .overrideTemplate(FabricanteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FabricanteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FabricanteService);

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
    expect(comp.fabricantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to fabricanteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFabricanteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFabricanteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
