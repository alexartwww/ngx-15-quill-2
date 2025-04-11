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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtY29uZmlnLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9jb25maWcvc3JjL3F1aWxsLWNvbmZpZy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFFN0QsT0FBTyxFQUFlLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUE7O0FBRTNFOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQW1CO1FBQ2hDLE9BQU87WUFDTCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGtCQUFrQjtvQkFDdkMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDO1NBQ3RCLENBQUE7SUFDSCxDQUFDOztrRkFQVSxpQkFBaUI7bUVBQWpCLGlCQUFpQjs7dUZBQWpCLGlCQUFpQjtjQUQ3QixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5pbXBvcnQgeyBRdWlsbENvbmZpZywgUVVJTExfQ09ORklHX1RPS0VOIH0gZnJvbSAnLi9xdWlsbC1lZGl0b3IuaW50ZXJmYWNlcydcblxuLyoqXG4gKiBUaGlzIGBOZ01vZHVsZWAgcHJvdmlkZXMgYSBnbG9iYWwgUXVpbGwgY29uZmlnIG9uIHRoZSByb290IGxldmVsLCBlLmcuLCBpbiBgQXBwTW9kdWxlYC5cbiAqIEJ1dCB0aGlzIGVsaW1pbmF0ZXMgdGhlIG5lZWQgdG8gaW1wb3J0IHRoZSBlbnRpcmUgYG5neC1xdWlsbGAgbGlicmFyeSBpbnRvIHRoZSBtYWluIGJ1bmRsZS5cbiAqIFRoZSBgcXVpbGwtZWRpdG9yYCBpdHNlbGYgbWF5IGJlIHJlbmRlcmVkIGluIGFueSBsYXp5LWxvYWRlZCBtb2R1bGUsIGJ1dCBpbXBvcnRpbmcgYFF1aWxsTW9kdWxlYFxuICogaW50byB0aGUgYEFwcE1vZHVsZWAgd2lsbCBidW5kbGUgdGhlIGBuZ3gtcXVpbGxgIGludG8gdGhlIHZlbmRvci5cbiAqL1xuQE5nTW9kdWxlKClcbmV4cG9ydCBjbGFzcyBRdWlsbENvbmZpZ01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogUXVpbGxDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFF1aWxsQ29uZmlnTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBRdWlsbENvbmZpZ01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogUVVJTExfQ09ORklHX1RPS0VOLFxuICAgICAgICB1c2VWYWx1ZTogY29uZmlnIH1dLFxuICAgIH1cbiAgfVxufVxuIl19