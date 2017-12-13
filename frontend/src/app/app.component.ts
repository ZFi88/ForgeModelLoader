import {Component, OnInit} from '@angular/core';
import {ForgeService} from './services/forge.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SnackService} from './services/snack.service';
import 'rxjs/add/operator/mergeMap';
import {Base64} from './services/base64';
import {clearInterval} from 'timers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  hide: boolean = true;

  constructor(private forgeService: ForgeService, fB: FormBuilder, private snack: SnackService) {
    this.form = fB.group({
      appId: '01CrtSJ2ph1k8khhe34h7Gstl7z4NOdp',
      secret: 'DsYLZ67NrJTGp69C',
      bucketName: 'qwerty123',
      file: '',
      fileData: {}
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
    reader.onloadend = () => {
      fileDataControl.setValue(reader.result);
      this.snack.info('file loaded')
    };
    reader.readAsDataURL(file);
  }

  loadModel() {
    const appId = this.form.get('appId').value as string;
    const secret = this.form.get('secret').value as string;
    const bucketName = this.form.get('bucketName').value as string;
    const fileName = this.form.get('file').value as string;
    const fileData = this.form.get('fileData').value as string;
    this.forgeService.getToken(appId, secret)
      .flatMap(token => {
        return this.forgeService.createBucket(bucketName);
      })
      .flatMap(bucket => {
        return this.forgeService.loadModel(bucketName, fileName, fileData);
      })
      .flatMap(fileLoadResult => {
        const base64 = new Base64();
        let urn = base64.encode(fileLoadResult.objectId);
        urn = urn.replace(/=/g, '').replace('/', '_');
        return this.forgeService.convertModel(urn);
      }).subscribe(job => {
      const intervalId = setInterval(() => {
        this.forgeService.checkJob(job.urn).subscribe(manifest => {
          if (manifest.status === 'complete') {
            clearInterval(intervalId);
          }
        });
      }, 1000);
    });
  }
}
