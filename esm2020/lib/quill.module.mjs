import { NgModule } from '@angular/core';
import { QUILL_CONFIG_TOKEN } from 'ngx-15-quill-2/config';
import { QuillEditorComponent } from './quill-editor.component';
import { QuillViewHTMLComponent } from './quill-view-html.component';
import { QuillViewComponent } from './quill-view.component';
import * as i0 from "@angular/core";
export class QuillModule {
    static forRoot(config) {
        return {
            ngModule: QuillModule,
            providers: [
                {
                    provide: QUILL_CONFIG_TOKEN,
                    useValue: config
                }
            ]
        };
    }
}
QuillModule.ɵfac = function QuillModule_Factory(t) { return new (t || QuillModule)(); };
QuillModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: QuillModule });
QuillModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillModule, [{
        type: NgModule,
        args: [{
                imports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
                exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(QuillModule, { imports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent], exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LTE1LXF1aWxsLTIvc3JjL2xpYi9xdWlsbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFFN0QsT0FBTyxFQUFFLGtCQUFrQixFQUFlLE1BQU0sdUJBQXVCLENBQUE7QUFFdkUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDL0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUE7QUFDcEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUE7O0FBTTNELE1BQU0sT0FBTyxXQUFXO0lBQ3RCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBb0I7UUFDakMsT0FBTztZQUNMLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsa0JBQWtCO29CQUMzQixRQUFRLEVBQUUsTUFBTTtpQkFDakI7YUFDRjtTQUNGLENBQUE7SUFDSCxDQUFDOztzRUFYVSxXQUFXOzZEQUFYLFdBQVc7aUVBSFosb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCO3VGQUcvRCxXQUFXO2NBSnZCLFFBQVE7ZUFBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBa0IsRUFBRSxzQkFBc0IsQ0FBQztnQkFDM0UsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCLENBQUM7YUFDNUU7O3dGQUNZLFdBQVcsY0FIWixvQkFBb0IsRUFBRSxrQkFBa0IsRUFBRSxzQkFBc0IsYUFDaEUsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5pbXBvcnQgeyBRVUlMTF9DT05GSUdfVE9LRU4sIFF1aWxsQ29uZmlnIH0gZnJvbSAnbmd4LTE1LXF1aWxsLTIvY29uZmlnJ1xuXG5pbXBvcnQgeyBRdWlsbEVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vcXVpbGwtZWRpdG9yLmNvbXBvbmVudCdcbmltcG9ydCB7IFF1aWxsVmlld0hUTUxDb21wb25lbnQgfSBmcm9tICcuL3F1aWxsLXZpZXctaHRtbC5jb21wb25lbnQnXG5pbXBvcnQgeyBRdWlsbFZpZXdDb21wb25lbnQgfSBmcm9tICcuL3F1aWxsLXZpZXcuY29tcG9uZW50J1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbUXVpbGxFZGl0b3JDb21wb25lbnQsIFF1aWxsVmlld0NvbXBvbmVudCwgUXVpbGxWaWV3SFRNTENvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtRdWlsbEVkaXRvckNvbXBvbmVudCwgUXVpbGxWaWV3Q29tcG9uZW50LCBRdWlsbFZpZXdIVE1MQ29tcG9uZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc/OiBRdWlsbENvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8UXVpbGxNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFF1aWxsTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBRVUlMTF9DT05GSUdfVE9LRU4sXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9XG59XG4iXX0=