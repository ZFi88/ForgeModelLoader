import {Component, OnInit, ViewChild} from '@angular/core';
import {ForgeService} from './services/forge.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SnackService} from './services/snack.service';
import {Base64} from './services/base64';
import {ViewerComponent} from './viewer/viewer.component';
import {Bucket} from './Dto/buckets';
import {Observable} from 'rxjs/Observable';
import {BucketCreateResult} from './Dto/bucket-create-result';
import {LoadResult} from './Dto/load-result';
import {TranslateJobResultDto} from './Dto/translate-job-result-dto';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/if';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  hide: boolean;
  showProgress: boolean = false;
  buckets: Bucket[] = [];

  mode: string = 'indeterminate';
  status: string;

  @ViewChild(ViewerComponent) viewer: ViewerComponent;

  constructor(private forgeService: ForgeService, fB: FormBuilder, private snack: SnackService) {
    this.form = fB.group({
      appId: '',
      secret: '',
      bucketName: '',
      bucketType: '',
      file: '',
      fileData: {}
    });

    this.form.valueChanges.subscribe(value => {
      if (value.appId !== '' && value.secret !== '' && this.buckets.length == 0) {
        forgeService.getToken(value.appId, value.secret)
          .flatMap(x => this.forgeService.getBuckets())
          .subscribe(buckets => {
            this.buckets = buckets.items;
          });
      }
      let filter = this.buckets.filter(x => x.bucketKey === value.bucketName);
      let control = this.form.get('bucketType') as FormControl;
      if (filter.length > 0 && value.bucketType !== filter[0].policyKey) {
        control.setValue(filter[0].policyKey);
        // control.disable();
        // } else if (filter.length > 0 && value.bucketType !== filter[0].policyKey && control.disabled) {
        //   control.enable();
      }
    });
  }

  ngOnInit(): void {
  }

  onFileInput(event: any) {
    let fileControl = this.form.get('file') as FormControl;
    let fileDataControl = this.form.get('fileData') as FormControl;
    let file = event.currentTarget.files[0];
    fileControl.setValue(event.currentTarget.files[0].name);
    const reader = new FileReader();
    reader.onload = () => {
      fileDataControl.setValue(reader.result);
    };
    reader.readAsArrayBuffer(file);
  }

  loadModel() {
    const bucketName = this.form.get('bucketName').value as string;
    const bucketType = this.form.get('bucketType').value as string;
    const fileName = this.form.get('file').value as string;
    const fileData = this.form.get('fileData').value as string;

    this.showProgress = true;
    this.status = 'Uploading model...';

    Observable.if(() => this.buckets.filter(x => x.bucketKey === bucketName).length === 0
      , this.forgeService.createBucket(bucketName, bucketType)
      , Observable.of(new BucketCreateResult()))
      .flatMap(x => {
        return this.forgeService.loadModel(bucketName, fileName, fileData);
      })
      .flatMap((fileLoadResult: LoadResult) => {
        const base64 = new Base64();
        let urn = base64.encode(fileLoadResult.objectId);
        urn = urn.replace(/=/g, '').replace('/', '_');
        return this.forgeService.convertModel(urn);
      }).subscribe((job: TranslateJobResultDto) => {
      this.status = 'Translating model...';
      this.mode = 'query';
      const intervalId = setInterval(() => {
        this.forgeService.checkJob(job.urn).subscribe(manifest => {
          if (manifest.status.indexOf('succe') > -1) {
            clearInterval(intervalId);
            this.showProgress = false;
            this.viewer.init(manifest.urn);
          }
        });
      }, 3000);
    });
  }
}
