import { NgModule } from '@angular/core';
import { QUILL_CONFIG_TOKEN } from 'ngx-quill/config';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXF1aWxsL3NyYy9saWIvcXVpbGwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBRTdELE9BQU8sRUFBRSxrQkFBa0IsRUFBZSxNQUFNLGtCQUFrQixDQUFBO0FBRWxFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBQy9ELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQ3BFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBOztBQU0zRCxNQUFNLE9BQU8sV0FBVztJQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQW9CO1FBQ2pDLE9BQU87WUFDTCxRQUFRLEVBQUUsV0FBVztZQUNyQixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGtCQUFrQjtvQkFDM0IsUUFBUSxFQUFFLE1BQU07aUJBQ2pCO2FBQ0Y7U0FDRixDQUFBO0lBQ0gsQ0FBQzs7c0VBWFUsV0FBVzs2REFBWCxXQUFXO2lFQUhaLG9CQUFvQixFQUFFLGtCQUFrQixFQUFFLHNCQUFzQjt1RkFHL0QsV0FBVztjQUp2QixRQUFRO2VBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCLENBQUM7Z0JBQzNFLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDO2FBQzVFOzt3RkFDWSxXQUFXLGNBSFosb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsc0JBQXNCLGFBQ2hFLG9CQUFvQixFQUFFLGtCQUFrQixFQUFFLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuaW1wb3J0IHsgUVVJTExfQ09ORklHX1RPS0VOLCBRdWlsbENvbmZpZyB9IGZyb20gJ25neC1xdWlsbC9jb25maWcnXG5cbmltcG9ydCB7IFF1aWxsRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9xdWlsbC1lZGl0b3IuY29tcG9uZW50J1xuaW1wb3J0IHsgUXVpbGxWaWV3SFRNTENvbXBvbmVudCB9IGZyb20gJy4vcXVpbGwtdmlldy1odG1sLmNvbXBvbmVudCdcbmltcG9ydCB7IFF1aWxsVmlld0NvbXBvbmVudCB9IGZyb20gJy4vcXVpbGwtdmlldy5jb21wb25lbnQnXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtRdWlsbEVkaXRvckNvbXBvbmVudCwgUXVpbGxWaWV3Q29tcG9uZW50LCBRdWlsbFZpZXdIVE1MQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW1F1aWxsRWRpdG9yQ29tcG9uZW50LCBRdWlsbFZpZXdDb21wb25lbnQsIFF1aWxsVmlld0hUTUxDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBRdWlsbE1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZz86IFF1aWxsQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVyczxRdWlsbE1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUXVpbGxNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFFVSUxMX0NPTkZJR19UT0tFTixcbiAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cbn1cbiJdfQ==