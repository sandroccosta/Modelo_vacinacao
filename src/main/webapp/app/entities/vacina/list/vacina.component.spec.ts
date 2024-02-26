import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VacinaService } from '../service/vacina.service';

import { VacinaComponent } from './vacina.component';

describe('Vacina Management Component', () => {
  let comp: VacinaComponent;
  let fixture: ComponentFixture<VacinaComponent>;
  let service: VacinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'vacina', component: VacinaComponent }]), HttpClientTestingModule, VacinaComponent],
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
      .overrideTemplate(VacinaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacinaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VacinaService);

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
    expect(comp.vacinas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to vacinaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVacinaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVacinaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
