import {Component, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {SnackService} from '../services/snack.service';
import 'rxjs/add/observable/of';
import {ForgeService} from '../services/forge.service';
import {Subject} from 'rxjs/Subject';

declare const Autodesk: any;

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild('viewerContainer') viewerContainer: any;
  public viewer: any;
  private urn: string;

  public modelLoaded: Subject<string> = new Subject<string>();

  constructor(private ngZone: NgZone, private forgeService: ForgeService, private snackService: SnackService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.viewer && this.viewer.running) {
      this.viewer.tearDown();
      this.viewer.finish();
    }
  }

  public init(urn: string) {
    this.urn = urn;
    this.launchViewer(this.forgeService.token);
  }

  private launchViewer(token: string) {
    if (this.viewer) return;
    const options = {
      env: 'AutodeskProduction',
      accessToken: token
    };
    this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.viewerContainer.nativeElement);
    const documentUrn = `urn:${this.urn}`;
    this.ngZone.runOutsideAngular(() => Autodesk.Viewing.Initializer(
      options,
      () => Autodesk.Viewing.Document.load(documentUrn, doc => this.onDocumentLoadSuccess(doc),
        viewerErrorCode => this.onDocumentLoadFailure(viewerErrorCode))));
  }

  private onDocumentLoadSuccess(doc) {
    const viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
      type: 'geometry'
    }, true);
    if (viewables.length === 0) {
      this.snackService.error('Document empty');
      return;
    }
    const initialViewable = viewables[0];
    const svfUrl = doc.getViewablePath(initialViewable);
    const modelOptions = {
      sharedPropertyDbPath: doc.getPropertyDbPath()
    };
    this.viewer.start(svfUrl, modelOptions, model => this.onLoadModelSuccess(model), code => this.onLoadModelError(code));
  }

  private onLoadModelSuccess(model) {
    // this.snackService.success('Model loaded')
    this.modelLoaded.next(this.urn);
  }

  private onLoadModelError(viewerErrorCode) {
    this.snackService.error('Model load error: ' + viewerErrorCode);
  }

  private onDocumentLoadFailure(viewerErrorCode: string) {
    this.snackService.error('Document load error: ' + viewerErrorCode);
  }
}



