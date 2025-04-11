import { NgModule } from '@angular/core';
import { QUILL_CONFIG_TOKEN } from './quill-editor.interfaces';
import * as i0 from "@angular/core";
/**
 * This `NgModule` provides a global Quill config on the root level, e.g., in `AppModule`.
 * But this eliminates the need to import the entire `ngx-15-quill-2` library into the main bundle.
 * The `quill-editor` itself may be rendered in any lazy-loaded module, but importing `QuillModule`
 * into the `AppModule` will bundle the `ngx-15-quill-2` into the vendor.
 */
export class QuillConfigModule {
    static forRoot(config) {
        return {
            ngModule: QuillConfigModule,
            providers: [{ provide: QUILL_CONFIG_TOKEN,
                    useValue: config }],
        };
    }
}
QuillConfigModule.ɵfac = function QuillConfigModule_Factory(t) { return new (t || QuillConfigModule)(); };
QuillConfigModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: QuillConfigModule });
QuillConfigModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({});
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillConfigModule, [{
        type: NgModule
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtY29uZmlnLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC0xNS1xdWlsbC0yL2NvbmZpZy9zcmMvcXVpbGwtY29uZmlnLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUU3RCxPQUFPLEVBQWUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTs7QUFFM0U7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBbUI7UUFDaEMsT0FBTztZQUNMLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsa0JBQWtCO29CQUN2QyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDdEIsQ0FBQTtJQUNILENBQUM7O2tGQVBVLGlCQUFpQjttRUFBakIsaUJBQWlCOzt1RkFBakIsaUJBQWlCO2NBRDdCLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbmltcG9ydCB7IFF1aWxsQ29uZmlnLCBRVUlMTF9DT05GSUdfVE9LRU4gfSBmcm9tICcuL3F1aWxsLWVkaXRvci5pbnRlcmZhY2VzJ1xuXG4vKipcbiAqIFRoaXMgYE5nTW9kdWxlYCBwcm92aWRlcyBhIGdsb2JhbCBRdWlsbCBjb25maWcgb24gdGhlIHJvb3QgbGV2ZWwsIGUuZy4sIGluIGBBcHBNb2R1bGVgLlxuICogQnV0IHRoaXMgZWxpbWluYXRlcyB0aGUgbmVlZCB0byBpbXBvcnQgdGhlIGVudGlyZSBgbmd4LTE1LXF1aWxsLTJgIGxpYnJhcnkgaW50byB0aGUgbWFpbiBidW5kbGUuXG4gKiBUaGUgYHF1aWxsLWVkaXRvcmAgaXRzZWxmIG1heSBiZSByZW5kZXJlZCBpbiBhbnkgbGF6eS1sb2FkZWQgbW9kdWxlLCBidXQgaW1wb3J0aW5nIGBRdWlsbE1vZHVsZWBcbiAqIGludG8gdGhlIGBBcHBNb2R1bGVgIHdpbGwgYnVuZGxlIHRoZSBgbmd4LTE1LXF1aWxsLTJgIGludG8gdGhlIHZlbmRvci5cbiAqL1xuQE5nTW9kdWxlKClcbmV4cG9ydCBjbGFzcyBRdWlsbENvbmZpZ01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogUXVpbGxDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFF1aWxsQ29uZmlnTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBRdWlsbENvbmZpZ01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogUVVJTExfQ09ORklHX1RPS0VOLFxuICAgICAgICB1c2VWYWx1ZTogY29uZmlnIH1dLFxuICAgIH1cbiAgfVxufVxuIl19