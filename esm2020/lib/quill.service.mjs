import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Optional } from '@angular/core';
import { defer, firstValueFrom, forkJoin, from, isObservable, map, of, tap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { defaultModules, QUILL_CONFIG_TOKEN } from 'ngx-quill/config';
import * as i0 from "@angular/core";
export class QuillService {
    constructor(injector, config) {
        this.config = config;
        this.quill$ = defer(async () => {
            if (!this.Quill) {
                // Quill adds events listeners on import https://github.com/quilljs/quill/blob/develop/core/emitter.js#L8
                // We'd want to use the unpatched `addEventListener` method to have all event callbacks to be run outside of zone.
                // We don't know yet if the `zone.js` is used or not, just save the value to restore it back further.
                const maybePatchedAddEventListener = this.document.addEventListener;
                // There're 2 types of Angular applications:
                // 1) zone-full (by default)
                // 2) zone-less
                // The developer can avoid importing the `zone.js` package and tells Angular that he/she is responsible for running
                // the change detection by himself. This is done by "nooping" the zone through `CompilerOptions` when bootstrapping
                // the root module. We fallback to `document.addEventListener` if `__zone_symbol__addEventListener` is not defined,
                // this means the `zone.js` is not imported.
                // The `__zone_symbol__addEventListener` is basically a native DOM API, which is not patched by zone.js, thus not even going
                // through the `zone.js` task lifecycle. You can also access the native DOM API as follows `target[Zone.__symbol__('methodName')]`.
                // eslint-disable-next-line @typescript-eslint/dot-notation
                this.document.addEventListener = this.document['__zone_symbol__addEventListener'] || this.document.addEventListener;
                const quillImport = await import('quill');
                this.document.addEventListener = maybePatchedAddEventListener;
                this.Quill = (quillImport.default ? quillImport.default : quillImport);
            }
            // Only register custom options and modules once
            this.config.customOptions?.forEach((customOption) => {
                const newCustomOption = this.Quill.import(customOption.import);
                newCustomOption.whitelist = customOption.whitelist;
                this.Quill.register(newCustomOption, true, this.config.suppressGlobalRegisterWarning);
            });
            return firstValueFrom(this.registerCustomModules(this.Quill, this.config.customModules, this.config.suppressGlobalRegisterWarning));
        }).pipe(shareReplay({
            bufferSize: 1,
            refCount: false
        }));
        // A list of custom modules that have already been registered,
        // so we don’t need to await their implementation.
        this.registeredModules = new Set();
        this.document = injector.get(DOCUMENT);
        if (!this.config) {
            this.config = { modules: defaultModules };
        }
    }
    getQuill() {
        return this.quill$;
    }
    /** @internal */
    beforeRender(Quill, customModules, beforeRender = this.config.beforeRender) {
        // This function is called each time the editor needs to be rendered,
        // so it operates individually per component. If no custom module needs to be
        // registered and no `beforeRender` function is provided, it will emit
        // immediately and proceed with the rendering.
        const sources = [this.registerCustomModules(Quill, customModules)];
        if (beforeRender) {
            sources.push(from(beforeRender()));
        }
        return forkJoin(sources).pipe(map(() => Quill));
    }
    /** @internal */
    registerCustomModules(Quill, customModules, suppressGlobalRegisterWarning) {
        if (!Array.isArray(customModules)) {
            return of(Quill);
        }
        const sources = [];
        for (const customModule of customModules) {
            const { path, implementation: maybeImplementation } = customModule;
            // If the module is already registered, proceed to the next module...
            if (this.registeredModules.has(path)) {
                continue;
            }
            this.registeredModules.add(path);
            if (isObservable(maybeImplementation)) {
                // If the implementation is an observable, we will wait for it to load and
                // then register it with Quill. The caller will wait until the module is registered.
                sources.push(maybeImplementation.pipe(tap((implementation) => {
                    Quill.register(path, implementation, suppressGlobalRegisterWarning);
                })));
            }
            else {
                Quill.register(path, maybeImplementation, suppressGlobalRegisterWarning);
            }
        }
        return sources.length > 0 ? forkJoin(sources).pipe(map(() => Quill)) : of(Quill);
    }
}
QuillService.ɵfac = function QuillService_Factory(t) { return new (t || QuillService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(QUILL_CONFIG_TOKEN, 8)); };
QuillService.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: QuillService, factory: QuillService.ɵfac, providedIn: 'root' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], function () { return [{ type: i0.Injector }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [QUILL_CONFIG_TOKEN]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9zcmMvbGliL3F1aWxsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFZLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUN0RSxPQUFPLEVBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQWMsRUFBRSxFQUFFLEdBQUcsRUFBQyxNQUFNLE1BQU0sQ0FBQTtBQUNsRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFFNUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBNkIsTUFBTSxrQkFBa0IsQ0FBQTs7QUFLaEcsTUFBTSxPQUFPLFlBQVk7SUFvRHZCLFlBQ0UsUUFBa0IsRUFDNkIsTUFBbUI7UUFBbkIsV0FBTSxHQUFOLE1BQU0sQ0FBYTtRQWxENUQsV0FBTSxHQUFvQixLQUFLLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2YseUdBQXlHO2dCQUN6RyxrSEFBa0g7Z0JBQ2xILHFHQUFxRztnQkFDckcsTUFBTSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFBO2dCQUNuRSw0Q0FBNEM7Z0JBQzVDLDRCQUE0QjtnQkFDNUIsZUFBZTtnQkFDZixtSEFBbUg7Z0JBQ25ILG1IQUFtSDtnQkFDbkgsbUhBQW1IO2dCQUNuSCw0Q0FBNEM7Z0JBQzVDLDRIQUE0SDtnQkFDNUgsbUlBQW1JO2dCQUNuSSwyREFBMkQ7Z0JBQzNELElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFD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WUFFbEUscUVBQXFFO1lBQ3JFLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEMsU0FBUTthQUNUO1lBRUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUVoQyxJQUFJLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO2dCQUNyQywwRUFBMEU7Z0JBQzFFLG9GQUFvRjtnQkFDcEYsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQ25DLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO29CQUNyQixLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsNkJBQTZCLENBQUMsQ0FBQTtnQkFDckUsQ0FBQyxDQUFDLENBQ0gsQ0FBQyxDQUFBO2FBQ0g7aUJBQU07Z0JBQ0wsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsNkJBQTZCLENBQUMsQ0FBQTthQUN6RTtTQUNGO1FBRUQsT0FBTyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xGLENBQUM7O3dFQXhIVSxZQUFZLHdDQXNERCxrQkFBa0I7a0VBdEQ3QixZQUFZLFdBQVosWUFBWSxtQkFGWCxNQUFNO3VGQUVQLFlBQVk7Y0FIeEIsVUFBVTtlQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COztzQkF1REksUUFBUTs7c0JBQUksTUFBTTt1QkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbidcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCwgSW5qZWN0b3IsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7ZGVmZXIsIGZpcnN0VmFsdWVGcm9tLCBmb3JrSm9pbiwgZnJvbSwgaXNPYnNlcnZhYmxlLCBtYXAsIE9ic2VydmFibGUsIG9mLCB0YXB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBzaGFyZVJlcGxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuXG5pbXBvcnQgeyBkZWZhdWx0TW9kdWxlcywgUVVJTExfQ09ORklHX1RPS0VOLCBRdWlsbENvbmZpZywgQ3VzdG9tTW9kdWxlIH0gZnJvbSAnbmd4LXF1aWxsL2NvbmZpZydcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFF1aWxsU2VydmljZSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cbiAgcHJpdmF0ZSBRdWlsbCE6IGFueVxuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudFxuICBwcml2YXRlIHF1aWxsJDogT2JzZXJ2YWJsZTxhbnk+ID0gZGVmZXIoYXN5bmMgKCkgPT4ge1xuICAgIGlmICghdGhpcy5RdWlsbCkge1xuICAgICAgLy8gUXVpbGwgYWRkcyBldmVudHMgbGlzdGVuZXJzIG9uIGltcG9ydCBodHRwczovL2dpdGh1Yi5jb20vcXVpbGxqcy9xdWlsbC9ibG9iL2RldmVsb3AvY29yZS9lbWl0dGVyLmpzI0w4XG4gICAgICAvLyBXZSdkIHdhbnQgdG8gdXNlIHRoZSB1bnBhdGNoZWQgYGFkZEV2ZW50TGlzdGVuZXJgIG1ldGhvZCB0byBoYXZlIGFsbCBldmVudCBjYWxsYmFja3MgdG8gYmUgcnVuIG91dHNpZGUgb2Ygem9uZS5cbiAgICAgIC8vIFdlIGRvbid0IGtub3cgeWV0IGlmIHRoZSBgem9uZS5qc2AgaXMgdXNlZCBvciBub3QsIGp1c3Qgc2F2ZSB0aGUgdmFsdWUgdG8gcmVzdG9yZSBpdCBiYWNrIGZ1cnRoZXIuXG4gICAgICBjb25zdCBtYXliZVBhdGNoZWRBZGRFdmVudExpc3RlbmVyID0gdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyXG4gICAgICAvLyBUaGVyZSdyZSAyIHR5cGVzIG9mIEFuZ3VsYXIgYXBwbGljYXRpb25zOlxuICAgICAgLy8gMSkgem9uZS1mdWxsIChieSBkZWZhdWx0KVxuICAgICAgLy8gMikgem9uZS1sZXNzXG4gICAgICAvLyBUaGUgZGV2ZWxvcGVyIGNhbiBhdm9pZCBpbXBvcnRpbmcgdGhlIGB6b25lLmpzYCBwYWNrYWdlIGFuZCB0ZWxscyBBbmd1bGFyIHRoYXQgaGUvc2hlIGlzIHJlc3BvbnNpYmxlIGZvciBydW5uaW5nXG4gICAgICAvLyB0aGUgY2hhbmdlIGRldGVjdGlvbiBieSBoaW1zZWxmLiBUaGlzIGlzIGRvbmUgYnkgXCJub29waW5nXCIgdGhlIHpvbmUgdGhyb3VnaCBgQ29tcGlsZXJPcHRpb25zYCB3aGVuIGJvb3RzdHJhcHBpbmdcbiAgICAgIC8vIHRoZSByb290IG1vZHVsZS4gV2UgZmFsbGJhY2sgdG8gYGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXJgIGlmIGBfX3pvbmVfc3ltYm9sX19hZGRFdmVudExpc3RlbmVyYCBpcyBub3QgZGVmaW5lZCxcbiAgICAgIC8vIHRoaXMgbWVhbnMgdGhlIGB6b25lLmpzYCBpcyBub3QgaW1wb3J0ZWQuXG4gICAgICAvLyBUaGUgYF9fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXJgIGlzIGJhc2ljYWxseSBhIG5hdGl2ZSBET00gQVBJLCB3aGljaCBpcyBub3QgcGF0Y2hlZCBieSB6b25lLmpzLCB0aHVzIG5vdCBldmVuIGdvaW5nXG4gICAgICAvLyB0aHJvdWdoIHRoZSBgem9uZS5qc2AgdGFzayBsaWZlY3ljbGUuIFlvdSBjYW4gYWxzbyBhY2Nlc3MgdGhlIG5hdGl2ZSBET00gQVBJIGFzIGZvbGxvd3MgYHRhcmdldFtab25lLl9fc3ltYm9sX18oJ21ldGhvZE5hbWUnKV1gLlxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9kb3Qtbm90YXRpb25cbiAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9IHRoaXMuZG9jdW1lbnRbJ19fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXInXSB8fCB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgIGNvbnN0IHF1aWxsSW1wb3J0ID0gYXdhaXQgaW1wb3J0KCdxdWlsbCcpXG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPSBtYXliZVBhdGNoZWRBZGRFdmVudExpc3RlbmVyXG5cbiAgICAgIHRoaXMuUXVpbGwgPSAoXG4gICAgICAgIHF1aWxsSW1wb3J0LmRlZmF1bHQgPyBxdWlsbEltcG9ydC5kZWZhdWx0IDogcXVpbGxJbXBvcnRcbiAgICAgICkgYXMgYW55XG4gICAgfVxuXG4gICAgLy8gT25seSByZWdpc3RlciBjdXN0b20gb3B0aW9ucyBhbmQgbW9kdWxlcyBvbmNlXG4gICAgdGhpcy5jb25maWcuY3VzdG9tT3B0aW9ucz8uZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBuZXdDdXN0b21PcHRpb24gPSB0aGlzLlF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgbmV3Q3VzdG9tT3B0aW9uLndoaXRlbGlzdCA9IGN1c3RvbU9wdGlvbi53aGl0ZWxpc3RcbiAgICAgIHRoaXMuUXVpbGwucmVnaXN0ZXIoXG4gICAgICAgIG5ld0N1c3RvbU9wdGlvbixcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgdGhpcy5jb25maWcuc3VwcHJlc3NHbG9iYWxSZWdpc3Rlcldhcm5pbmdcbiAgICAgIClcbiAgICB9KVxuXG4gICAgcmV0dXJuIGZpcnN0VmFsdWVGcm9tKHRoaXMucmVnaXN0ZXJDdXN0b21Nb2R1bGVzKFxuICAgICAgdGhpcy5RdWlsbCxcbiAgICAgIHRoaXMuY29uZmlnLmN1c3RvbU1vZHVsZXMsXG4gICAgICB0aGlzLmNvbmZpZy5zdXBwcmVzc0dsb2JhbFJlZ2lzdGVyV2FybmluZ1xuICAgICkpXG4gIH0pLnBpcGUoXG4gICAgc2hhcmVSZXBsYXkoe1xuICAgICAgYnVmZmVyU2l6ZTogMSxcbiAgICAgIHJlZkNvdW50OiBmYWxzZVxuICAgIH0pXG4gIClcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChRVUlMTF9DT05GSUdfVE9LRU4pIHB1YmxpYyBjb25maWc6IFF1aWxsQ29uZmlnXG4gICkge1xuICAgIHRoaXMuZG9jdW1lbnQgPSBpbmplY3Rvci5nZXQoRE9DVU1FTlQpXG5cbiAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IHsgbW9kdWxlczogZGVmYXVsdE1vZHVsZXMgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEEgbGlzdCBvZiBjdXN0b20gbW9kdWxlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQsXG4gIC8vIHNvIHdlIGRvbuKAmXQgbmVlZCB0byBhd2FpdCB0aGVpciBpbXBsZW1lbnRhdGlvbi5cbiAgcHJpdmF0ZSByZWdpc3RlcmVkTW9kdWxlcyA9IG5ldyBTZXQ8c3RyaW5nPigpXG5cbiAgZ2V0UXVpbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVpbGwkXG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIGJlZm9yZVJlbmRlcihRdWlsbDogYW55LCBjdXN0b21Nb2R1bGVzOiBDdXN0b21Nb2R1bGVbXSB8IHVuZGVmaW5lZCwgYmVmb3JlUmVuZGVyID0gdGhpcy5jb25maWcuYmVmb3JlUmVuZGVyKSB7XG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZWFjaCB0aW1lIHRoZSBlZGl0b3IgbmVlZHMgdG8gYmUgcmVuZGVyZWQsXG4gICAgLy8gc28gaXQgb3BlcmF0ZXMgaW5kaXZpZHVhbGx5IHBlciBjb21wb25lbnQuIElmIG5vIGN1c3RvbSBtb2R1bGUgbmVlZHMgdG8gYmVcbiAgICAvLyByZWdpc3RlcmVkIGFuZCBubyBgYmVmb3JlUmVuZGVyYCBmdW5jdGlvbiBpcyBwcm92aWRlZCwgaXQgd2lsbCBlbWl0XG4gICAgLy8gaW1tZWRpYXRlbHkgYW5kIHByb2NlZWQgd2l0aCB0aGUgcmVuZGVyaW5nLlxuICAgIGNvbnN0IHNvdXJjZXMgPSBbdGhpcy5yZWdpc3RlckN1c3RvbU1vZHVsZXMoUXVpbGwsIGN1c3RvbU1vZHVsZXMpXVxuICAgIGlmIChiZWZvcmVSZW5kZXIpIHtcbiAgICAgIHNvdXJjZXMucHVzaChmcm9tKGJlZm9yZVJlbmRlcigpKSlcbiAgICB9XG4gICAgcmV0dXJuIGZvcmtKb2luKHNvdXJjZXMpLnBpcGUobWFwKCgpID0+IFF1aWxsKSlcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSByZWdpc3RlckN1c3RvbU1vZHVsZXMoXG4gICAgUXVpbGw6IGFueSxcbiAgICBjdXN0b21Nb2R1bGVzOiBDdXN0b21Nb2R1bGVbXSB8IHVuZGVmaW5lZCxcbiAgICBzdXBwcmVzc0dsb2JhbFJlZ2lzdGVyV2FybmluZz86IGJvb2xlYW5cbiAgKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGN1c3RvbU1vZHVsZXMpKSB7XG4gICAgICByZXR1cm4gb2YoUXVpbGwpXG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlczogT2JzZXJ2YWJsZTx1bmtub3duPltdID0gW11cblxuICAgIGZvciAoY29uc3QgY3VzdG9tTW9kdWxlIG9mIGN1c3RvbU1vZHVsZXMpIHtcbiAgICAgIGNvbnN0IHsgcGF0aCwgaW1wbGVtZW50YXRpb246IG1heWJlSW1wbGVtZW50YXRpb24gfSA9IGN1c3RvbU1vZHVsZVxuXG4gICAgICAvLyBJZiB0aGUgbW9kdWxlIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCwgcHJvY2VlZCB0byB0aGUgbmV4dCBtb2R1bGUuLi5cbiAgICAgIGlmICh0aGlzLnJlZ2lzdGVyZWRNb2R1bGVzLmhhcyhwYXRoKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyZWRNb2R1bGVzLmFkZChwYXRoKVxuXG4gICAgICBpZiAoaXNPYnNlcnZhYmxlKG1heWJlSW1wbGVtZW50YXRpb24pKSB7XG4gICAgICAgIC8vIElmIHRoZSBpbXBsZW1lbnRhdGlvbiBpcyBhbiBvYnNlcnZhYmxlLCB3ZSB3aWxsIHdhaXQgZm9yIGl0IHRvIGxvYWQgYW5kXG4gICAgICAgIC8vIHRoZW4gcmVnaXN0ZXIgaXQgd2l0aCBRdWlsbC4gVGhlIGNhbGxlciB3aWxsIHdhaXQgdW50aWwgdGhlIG1vZHVsZSBpcyByZWdpc3RlcmVkLlxuICAgICAgICBzb3VyY2VzLnB1c2gobWF5YmVJbXBsZW1lbnRhdGlvbi5waXBlKFxuICAgICAgICAgIHRhcCgoaW1wbGVtZW50YXRpb24pID0+IHtcbiAgICAgICAgICAgIFF1aWxsLnJlZ2lzdGVyKHBhdGgsIGltcGxlbWVudGF0aW9uLCBzdXBwcmVzc0dsb2JhbFJlZ2lzdGVyV2FybmluZylcbiAgICAgICAgICB9KVxuICAgICAgICApKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUXVpbGwucmVnaXN0ZXIocGF0aCwgbWF5YmVJbXBsZW1lbnRhdGlvbiwgc3VwcHJlc3NHbG9iYWxSZWdpc3Rlcldhcm5pbmcpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdXJjZXMubGVuZ3RoID4gMCA/IGZvcmtKb2luKHNvdXJjZXMpLnBpcGUobWFwKCgpID0+IFF1aWxsKSkgOiBvZihRdWlsbClcbiAgfVxufVxuIl19