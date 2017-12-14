import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {TokenDto} from '../Dto/token-dto';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SnackService} from './snack.service';
import {BucketCreateRequest} from '../Dto/bucket-create-request';
import {BucketCreateResult} from '../Dto/bucket-create-result';
import {LoadResult} from '../Dto/load-result';
import {TranslationJobDto} from '../Dto/translation-job-dto';
import {TranslateJobResultDto} from '../Dto/translate-job-result-dto';
import {JobManifestDto} from '../Dto/job-manifest-dto';
import {environment} from '../../environments/environment';
import {Buckets} from '../Dto/buckets';

@Injectable()
export class ForgeService {
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  public token: string;
  private endpoint: string = environment.apiEndpoint;

  constructor(private http: HttpClient, private snackService: SnackService) {

  }

  public getToken(appId: string, secret: string): Observable<TokenDto> {
    return this.http.get(`${this.endpoint}getToken?appId=${appId}&secret=${secret}`)
      .map(x => {
        const tokenDto = x as TokenDto;
        this.token = tokenDto.access_token;
        this.headers = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${tokenDto.access_token}`);
        return tokenDto;
      })
      .catch((e: Error) => this.handleError(e));
  }

  public getBuckets(): Observable<Buckets> {
    return this.http.get(`https://developer.api.autodesk.com/oss/v2/buckets`,
      {headers: this.headers})
      .map(x => x as Buckets)
      .catch((e: Error) => this.handleError(e));
  }

  public createBucket(bucketName: string, bucketType: string): Observable<BucketCreateResult> {
    const bucketDto = new BucketCreateRequest();
    bucketDto.bucketKey = bucketName;
    bucketDto.policyKey = bucketType;
    return this.http.post('https://developer.api.autodesk.com/oss/v2/buckets'
      , bucketDto
      , {headers: this.headers})
      .map(x => x as BucketCreateResult)
      .catch((e: HttpErrorResponse) => {
        if (e.status === 400) {
          this.snackService.error('Invalid bucket name');
          return Observable.throw(e);
        }
        if (e.status === 409) {
          this.snackService.error('Bucket already exist');
          return Observable.throw(e);
        }
        return Observable.throw(e);
      });
  }

  public loadModel(bucketName: string, modelName: string, fileData: any): Observable<LoadResult> {
    return Observable.create(observer => {
      let bytesArray = new Uint8Array(fileData);

      var xhr = new XMLHttpRequest();
      xhr.open('PUT', `https://developer.api.autodesk.com/oss/v2/buckets/${bucketName}/objects/${modelName}`);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          observer.next(JSON.parse(xhr.responseText) as LoadResult);
          observer.complete();
        }
      };
      xhr.send(bytesArray);
    });

    // return this.http.put(`https://developer.api.autodesk.com/oss/v2/buckets/${bucketName}/objects/${modelName}`
    //   , fileData
    //   , {
    //     headers: new HttpHeaders().set('Content-Type', 'application/octet-stream')
    //       .set('Authorization', `Bearer ${this.token}`)
    //   })
    //   .map(x => x as LoadResult)
    //   .catch((e: Error) => this.handleError(e));
  }

  public convertModel(urn: string): Observable<TranslateJobResultDto> {
    const job = new TranslationJobDto();
    job.input.urn = urn;
    job.output.destination.region = 'us';
    job.output.formats.push({views: ['3d'], type: 'svf'});

    return this.http.post(`https://developer.api.autodesk.com/modelderivative/v2/designdata/job`
      , job
      , {headers: this.headers})
      .map(x => x as TranslateJobResultDto)
      .catch((e: Error) => this.handleError(e));
  }

  public checkJob(urn: string): Observable<JobManifestDto> {
    return this.http.get(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`,
      {headers: this.headers})
      .map(x => x as JobManifestDto)
      .catch((e: Error) => this.handleError(e));
  }

  private handleError(e: any): Observable<any> {
    this.snackService.error('Ошибка: ' + (e && e.message) || 'ошибка');
    return Observable.throw(e);
  }

}
