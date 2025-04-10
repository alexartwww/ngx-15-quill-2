import { NgModule } from '@angular/core';
import { QUILL_CONFIG_TOKEN } from './quill-editor.interfaces';
import * as i0 from "@angular/core";
/**
 * This `NgModule` provides a global Quill config on the root level, e.g., in `AppModule`.
 * But this eliminates the need to import the entire `ngx-quill` library into the main bundle.
 * The `quill-editor` itself may be rendered in any lazy-loaded module, but importing `QuillModule`
 * into the `AppModule` will bundle the `ngx-quill` into the vendor.
 */
export class QuillConfigModule {
    static forRoot(config) {
        return {
            ngModule: QuillConfigModule,
            providers: [{ provide: QUILL_CONFIG_TOKEN, useValue: config }],
        };
    }
}
QuillConfigModule.ɵfac = function QuillConfigModule_Factory(t) { return new (t || QuillConfigModule)(); };
QuillConfigModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: QuillConfigModule });
QuillConfigModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillConfigModule, [{
        type: NgModule
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtY29uZmlnLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9jb25maWcvc3JjL3F1aWxsLWNvbmZpZy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFFN0QsT0FBTyxFQUFlLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUE7O0FBRTNFOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQW1CO1FBQ2hDLE9BQU87WUFDTCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUMvRCxDQUFBO0lBQ0gsQ0FBQzs7a0ZBTlUsaUJBQWlCO21FQUFqQixpQkFBaUI7O3VGQUFqQixpQkFBaUI7Y0FEN0IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuaW1wb3J0IHsgUXVpbGxDb25maWcsIFFVSUxMX0NPTkZJR19UT0tFTiB9IGZyb20gJy4vcXVpbGwtZWRpdG9yLmludGVyZmFjZXMnXG5cbi8qKlxuICogVGhpcyBgTmdNb2R1bGVgIHByb3ZpZGVzIGEgZ2xvYmFsIFF1aWxsIGNvbmZpZyBvbiB0aGUgcm9vdCBsZXZlbCwgZS5nLiwgaW4gYEFwcE1vZHVsZWAuXG4gKiBCdXQgdGhpcyBlbGltaW5hdGVzIHRoZSBuZWVkIHRvIGltcG9ydCB0aGUgZW50aXJlIGBuZ3gtcXVpbGxgIGxpYnJhcnkgaW50byB0aGUgbWFpbiBidW5kbGUuXG4gKiBUaGUgYHF1aWxsLWVkaXRvcmAgaXRzZWxmIG1heSBiZSByZW5kZXJlZCBpbiBhbnkgbGF6eS1sb2FkZWQgbW9kdWxlLCBidXQgaW1wb3J0aW5nIGBRdWlsbE1vZHVsZWBcbiAqIGludG8gdGhlIGBBcHBNb2R1bGVgIHdpbGwgYnVuZGxlIHRoZSBgbmd4LXF1aWxsYCBpbnRvIHRoZSB2ZW5kb3IuXG4gKi9cbkBOZ01vZHVsZSgpXG5leHBvcnQgY2xhc3MgUXVpbGxDb25maWdNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IFF1aWxsQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVyczxRdWlsbENvbmZpZ01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUXVpbGxDb25maWdNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IFFVSUxMX0NPTkZJR19UT0tFTiwgdXNlVmFsdWU6IGNvbmZpZyB9XSxcbiAgICB9XG4gIH1cbn1cbiJdfQ==