import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDoenca } from '../doenca.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../doenca.test-samples';

import { DoencaService, RestDoenca } from './doenca.service';

const requireRestSample: RestDoenca = {
  ...sampleWithRequiredData,
  criado: sampleWithRequiredData.criado?.toJSON(),
  dataPrimeiroCaso: sampleWithRequiredData.dataPrimeiroCaso?.format(DATE_FORMAT),
  localPrimeiroCaso: sampleWithRequiredData.localPrimeiroCaso?.format(DATE_FORMAT),
};

describe('Doenca Service', () => {
  let service: DoencaService;
  let httpMock: HttpTestingController;
  let expectedResult: IDoenca | IDoenca[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DoencaService);
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

    it('should create a Doenca', () => {
      const doenca = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(doenca).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Doenca', () => {
      const doenca = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(doenca).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Doenca', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Doenca', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Doenca', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDoencaToCollectionIfMissing', () => {
      it('should add a Doenca to an empty array', () => {
        const doenca: IDoenca = sampleWithRequiredData;
        expectedResult = service.addDoencaToCollectionIfMissing([], doenca);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(doenca);
      });

      it('should not add a Doenca to an array that contains it', () => {
        const doenca: IDoenca = sampleWithRequiredData;
        const doencaCollection: IDoenca[] = [
          {
            ...doenca,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDoencaToCollectionIfMissing(doencaCollection, doenca);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Doenca to an array that doesn't contain it", () => {
        const doenca: IDoenca = sampleWithRequiredData;
        const doencaCollection: IDoenca[] = [sampleWithPartialData];
        expectedResult = service.addDoencaToCollectionIfMissing(doencaCollection, doenca);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(doenca);
      });

      it('should add only unique Doenca to an array', () => {
        const doencaArray: IDoenca[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const doencaCollection: IDoenca[] = [sampleWithRequiredData];
        expectedResult = service.addDoencaToCollectionIfMissing(doencaCollection, ...doencaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const doenca: IDoenca = sampleWithRequiredData;
        const doenca2: IDoenca = sampleWithPartialData;
        expectedResult = service.addDoencaToCollectionIfMissing([], doenca, doenca2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(doenca);
        expect(expectedResult).toContain(doenca2);
      });

      it('should accept null and undefined values', () => {
        const doenca: IDoenca = sampleWithRequiredData;
        expectedResult = service.addDoencaToCollectionIfMissing([], null, doenca, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(doenca);
      });

      it('should return initial array if no Doenca is added', () => {
        const doencaCollection: IDoenca[] = [sampleWithRequiredData];
        expectedResult = service.addDoencaToCollectionIfMissing(doencaCollection, undefined, null);
        expect(expectedResult).toEqual(doencaCollection);
      });
    });

    describe('compareDoenca', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDoenca(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDoenca(entity1, entity2);
        const compareResult2 = service.compareDoenca(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDoenca(entity1, entity2);
        const compareResult2 = service.compareDoenca(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDoenca(entity1, entity2);
        const compareResult2 = service.compareDoenca(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
