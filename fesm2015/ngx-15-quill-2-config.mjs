import * as i0 from '@angular/core';
import { InjectionToken, NgModule, makeEnvironmentProviders } from '@angular/core';

const defaultModules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [
            { color: [] },
            { background: [] }
        ],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video'],
        ['table']
    ]
};

const QUILL_CONFIG_TOKEN = new InjectionToken('config', {
    providedIn: 'root',
    factory: () => ({ modules: defaultModules })
});

/**
 * This `NgModule` provides a global Quill config on the root level, e.g., in `AppModule`.
 * But this eliminates the need to import the entire `ngx-15-quill-2` library into the main bundle.
 * The `quill-editor` itself may be rendered in any lazy-loaded module, but importing `QuillModule`
 * into the `AppModule` will bundle the `ngx-15-quill-2` into the vendor.
 */
class QuillConfigModule {
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
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillConfigModule, [{
            type: NgModule
        }], null, null);
})();

/**
 * Provides Quill configuration at the root level:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideQuillConfig(...)]
 * });
 * ```
 */
const provideQuillConfig = (config) => makeEnvironmentProviders([{ provide: QUILL_CONFIG_TOKEN,
        useValue: config }]);

/*
 * Public API Surface of ngx-15-quill-2/config
 */

/**
 * Generated bundle index. Do not edit.
 */

export { QUILL_CONFIG_TOKEN, QuillConfigModule, defaultModules, provideQuillConfig };
//# sourceMappingURL=ngx-15-quill-2-config.mjs.map
//# sourceMappingURL=ngx-15-quill-2-config.mjs.map
