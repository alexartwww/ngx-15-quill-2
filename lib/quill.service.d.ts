import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { QuillConfig, CustomModule } from 'ngx-quill/config';
import * as i0 from "@angular/core";
export declare class QuillService {
    config: QuillConfig;
    private Quill;
    private document;
    private quill$;
    constructor(injector: Injector, config: QuillConfig);
    private registeredModules;
    getQuill(): Observable<any>;
    /** @internal */
    beforeRender(Quill: any, customModules: CustomModule[] | undefined, beforeRender?: import("ngx-quill/config").QuillBeforeRender): Observable<any>;
    /** @internal */
    private registerCustomModules;
    static ɵfac: i0.ɵɵFactoryDeclaration<QuillService, [null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<QuillService>;
}
