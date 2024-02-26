import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVacina } from '../vacina.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vacina.test-samples';

import { VacinaService, RestVacina } from './vacina.service';

const requireRestSample: RestVacina = {
  ...sampleWithRequiredData,
  criado: sampleWithRequiredData.criado?.toJSON(),
};

describe('Vacina Service', () => {
  let service: VacinaService;
  let httpMock: HttpTestingController;
  let expectedResult: IVacina | IVacina[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VacinaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Vacina', () => {
      const vacina = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vacina).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vacina', () => {
      const vacina = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vacina).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vacina', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vacina', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vacina', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVacinaToCollectionIfMissing', () => {
      it('should add a Vacina to an empty array', () => {
        const vacina: IVacina = sampleWithRequiredData;
        expectedResult = service.addVacinaToCollectionIfMissing([], vacina);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacina);
      });

      it('should not add a Vacina to an array that contains it', () => {
        const vacina: IVacina = sampleWithRequiredData;
        const vacinaCollection: IVacina[] = [
          {
            ...vacina,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVacinaToCollectionIfMissing(vacinaCollection, vacina);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vacina to an array that doesn't contain it", () => {
        const vacina: IVacina = sampleWithRequiredData;
        const vacinaCollection: IVacina[] = [sampleWithPartialData];
        expectedResult = service.addVacinaToCollectionIfMissing(vacinaCollection, vacina);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacina);
      });

      it('should add only unique Vacina to an array', () => {
        const vacinaArray: IVacina[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vacinaCollection: IVacina[] = [sampleWithRequiredData];
        expectedResult = service.addVacinaToCollectionIfMissing(vacinaCollection, ...vacinaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vacina: IVacina = sampleWithRequiredData;
        const vacina2: IVacina = sampleWithPartialData;
        expectedResult = service.addVacinaToCollectionIfMissing([], vacina, vacina2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacina);
        expect(expectedResult).toContain(vacina2);
      });

      it('should accept null and undefined values', () => {
        const vacina: IVacina = sampleWithRequiredData;
        expectedResult = service.addVacinaToCollectionIfMissing([], null, vacina, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacina);
      });

      it('should return initial array if no Vacina is added', () => {
        const vacinaCollection: IVacina[] = [sampleWithRequiredData];
        expectedResult = service.addVacinaToCollectionIfMissing(vacinaCollection, undefined, null);
        expect(expectedResult).toEqual(vacinaCollection);
      });
    });

    describe('compareVacina', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVacina(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVacina(entity1, entity2);
        const compareResult2 = service.compareVacina(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVacina(entity1, entity2);
        const compareResult2 = service.compareVacina(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVacina(entity1, entity2);
        const compareResult2 = service.compareVacina(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
