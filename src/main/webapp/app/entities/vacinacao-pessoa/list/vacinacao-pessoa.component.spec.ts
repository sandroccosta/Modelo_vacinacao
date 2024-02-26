import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VacinacaoPessoaService } from '../service/vacinacao-pessoa.service';

import { VacinacaoPessoaComponent } from './vacinacao-pessoa.component';

describe('VacinacaoPessoa Management Component', () => {
  let comp: VacinacaoPessoaComponent;
  let fixture: ComponentFixture<VacinacaoPessoaComponent>;
  let service: VacinacaoPessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'vacinacao-pessoa', component: VacinacaoPessoaComponent }]),
        HttpClientTestingModule,
        VacinacaoPessoaComponent,
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
      .overrideTemplate(VacinacaoPessoaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacinacaoPessoaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VacinacaoPessoaService);

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
    expect(comp.vacinacaoPessoas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to vacinacaoPessoaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVacinacaoPessoaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVacinacaoPessoaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
