import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Optional } from '@angular/core';
import { defer, firstValueFrom, isObservable } from 'rxjs';
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
            return await this.registerCustomModules(this.Quill, this.config.customModules, this.config.suppressGlobalRegisterWarning);
        }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
        this.document = injector.get(DOCUMENT);
        if (!this.config) {
            this.config = { modules: defaultModules };
        }
    }
    getQuill() {
        return this.quill$;
    }
    /**
     * Marked as internal so it won't be available for `ngx-quill` consumers, this is only
     * internal method to be used within the library.
     *
     * @internal
     */
    async registerCustomModules(Quill, customModules, suppressGlobalRegisterWarning) {
        if (Array.isArray(customModules)) {
            // eslint-disable-next-line prefer-const
            for (let { implementation, path } of customModules) {
                // The `implementation` might be an observable that resolves the actual implementation,
                // e.g. if it should be lazy loaded.
                if (isObservable(implementation)) {
                    implementation = await firstValueFrom(implementation);
                }
                Quill.register(path, implementation, suppressGlobalRegisterWarning);
            }
        }
        // Return `Quill` constructor so we'll be able to re-use its return value except of using
        // `map` operators, etc.
        return Quill;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9zcmMvbGliL3F1aWxsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFZLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUN0RSxPQUFPLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQWMsTUFBTSxNQUFNLENBQUE7QUFDdEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRTVDLE9BQU8sRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQTZCLE1BQU0sa0JBQWtCLENBQUE7O0FBS2hHLE1BQU0sT0FBTyxZQUFZO0lBK0N2QixZQUNFLFFBQWtCLEVBQzZCLE1BQW1CO1FBQW5CLFdBQU0sR0FBTixNQUFNLENBQWE7UUE3QzVELFdBQU0sR0FBb0IsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNmLHlHQUF5RztnQkFDekcsa0hBQWtIO2dCQUNsSCxxR0FBcUc7Z0JBQ3JHLE1BQU0sNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQTtnQkFDbkUsNENBQTRDO2dCQUM1Qyw0QkFBNEI7Z0JBQzVCLGVBQWU7Z0JBQ2YsbUhBQW1IO2dCQUNuSCxtSEFBbUg7Z0JBQ25ILG1IQUFtSDtnQkFDbkgsNENBQTRDO2dCQUM1Qyw0SEFBNEg7Z0JBQzVILG1JQUFtSTtnQkFDbkksMkRBQTJEO2dCQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFBO2dCQUNuSCxNQUFNLFdBQVcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyw0QkFBNEIsQ0FBQTtnQkFFN0QsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUNYLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FDakQsQ0FBQTthQUNUO1lBRUQsZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUNsRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQzlELGVBQWUsQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQTtnQkFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQ2pCLGVBQWUsRUFDZixJQUFJLEVBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FDMUMsQ0FBQTtZQUNILENBQUMsQ0FBQyxDQUFBO1lBRUYsT0FBTyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FDckMsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FDMUMsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFNckQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXRDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUE7U0FDMUM7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtJQUNwQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDRixLQUFLLENBQUMscUJBQXFCLENBQzFCLEtBQVUsRUFDVixhQUF5QyxFQUN6Qyw2QkFBdUM7UUFFdkMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ2hDLHdDQUF3QztZQUN4QyxLQUFLLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksYUFBYSxFQUFFO2dCQUNsRCx1RkFBdUY7Z0JBQ3ZGLG9DQUFvQztnQkFDcEMsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLEVBQUU7b0JBQ2hDLGNBQWMsR0FBRyxNQUFNLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQTtpQkFDdEQ7Z0JBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLDZCQUE2QixDQUFDLENBQUE7YUFDcEU7U0FDRjtRQUVELHlGQUF5RjtRQUN6Rix3QkFBd0I7UUFDeEIsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDOzt3RUF4RlUsWUFBWSx3Q0FpREQsa0JBQWtCO2tFQWpEN0IsWUFBWSxXQUFaLFlBQVksbUJBRlgsTUFBTTt1RkFFUCxZQUFZO2NBSHhCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7c0JBa0RJLFFBQVE7O3NCQUFJLE1BQU07dUJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QsIEluamVjdG9yLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBkZWZlciwgZmlyc3RWYWx1ZUZyb20sIGlzT2JzZXJ2YWJsZSwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBzaGFyZVJlcGxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuXG5pbXBvcnQgeyBkZWZhdWx0TW9kdWxlcywgUVVJTExfQ09ORklHX1RPS0VOLCBRdWlsbENvbmZpZywgQ3VzdG9tTW9kdWxlIH0gZnJvbSAnbmd4LXF1aWxsL2NvbmZpZydcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFF1aWxsU2VydmljZSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cbiAgcHJpdmF0ZSBRdWlsbCE6IGFueVxuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudFxuICBwcml2YXRlIHF1aWxsJDogT2JzZXJ2YWJsZTxhbnk+ID0gZGVmZXIoYXN5bmMgKCkgPT4ge1xuICAgIGlmICghdGhpcy5RdWlsbCkge1xuICAgICAgLy8gUXVpbGwgYWRkcyBldmVudHMgbGlzdGVuZXJzIG9uIGltcG9ydCBodHRwczovL2dpdGh1Yi5jb20vcXVpbGxqcy9xdWlsbC9ibG9iL2RldmVsb3AvY29yZS9lbWl0dGVyLmpzI0w4XG4gICAgICAvLyBXZSdkIHdhbnQgdG8gdXNlIHRoZSB1bnBhdGNoZWQgYGFkZEV2ZW50TGlzdGVuZXJgIG1ldGhvZCB0byBoYXZlIGFsbCBldmVudCBjYWxsYmFja3MgdG8gYmUgcnVuIG91dHNpZGUgb2Ygem9uZS5cbiAgICAgIC8vIFdlIGRvbid0IGtub3cgeWV0IGlmIHRoZSBgem9uZS5qc2AgaXMgdXNlZCBvciBub3QsIGp1c3Qgc2F2ZSB0aGUgdmFsdWUgdG8gcmVzdG9yZSBpdCBiYWNrIGZ1cnRoZXIuXG4gICAgICBjb25zdCBtYXliZVBhdGNoZWRBZGRFdmVudExpc3RlbmVyID0gdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyXG4gICAgICAvLyBUaGVyZSdyZSAyIHR5cGVzIG9mIEFuZ3VsYXIgYXBwbGljYXRpb25zOlxuICAgICAgLy8gMSkgem9uZS1mdWxsIChieSBkZWZhdWx0KVxuICAgICAgLy8gMikgem9uZS1sZXNzXG4gICAgICAvLyBUaGUgZGV2ZWxvcGVyIGNhbiBhdm9pZCBpbXBvcnRpbmcgdGhlIGB6b25lLmpzYCBwYWNrYWdlIGFuZCB0ZWxscyBBbmd1bGFyIHRoYXQgaGUvc2hlIGlzIHJlc3BvbnNpYmxlIGZvciBydW5uaW5nXG4gICAgICAvLyB0aGUgY2hhbmdlIGRldGVjdGlvbiBieSBoaW1zZWxmLiBUaGlzIGlzIGRvbmUgYnkgXCJub29waW5nXCIgdGhlIHpvbmUgdGhyb3VnaCBgQ29tcGlsZXJPcHRpb25zYCB3aGVuIGJvb3RzdHJhcHBpbmdcbiAgICAgIC8vIHRoZSByb290IG1vZHVsZS4gV2UgZmFsbGJhY2sgdG8gYGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXJgIGlmIGBfX3pvbmVfc3ltYm9sX19hZGRFdmVudExpc3RlbmVyYCBpcyBub3QgZGVmaW5lZCxcbiAgICAgIC8vIHRoaXMgbWVhbnMgdGhlIGB6b25lLmpzYCBpcyBub3QgaW1wb3J0ZWQuXG4gICAgICAvLyBUaGUgYF9fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXJgIGlzIGJhc2ljYWxseSBhIG5hdGl2ZSBET00gQVBJLCB3aGljaCBpcyBub3QgcGF0Y2hlZCBieSB6b25lLmpzLCB0aHVzIG5vdCBldmVuIGdvaW5nXG4gICAgICAvLyB0aHJvdWdoIHRoZSBgem9uZS5qc2AgdGFzayBsaWZlY3ljbGUuIFlvdSBjYW4gYWxzbyBhY2Nlc3MgdGhlIG5hdGl2ZSBET00gQVBJIGFzIGZvbGxvd3MgYHRhcmdldFtab25lLl9fc3ltYm9sX18oJ21ldGhvZE5hbWUnKV1gLlxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9kb3Qtbm90YXRpb25cbiAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9IHRoaXMuZG9jdW1lbnRbJ19fem9uZV9zeW1ib2xfX2FkZEV2ZW50TGlzdGVuZXInXSB8fCB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgIGNvbnN0IHF1aWxsSW1wb3J0ID0gYXdhaXQgaW1wb3J0KCdxdWlsbCcpXG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPSBtYXliZVBhdGNoZWRBZGRFdmVudExpc3RlbmVyXG5cbiAgICAgIHRoaXMuUXVpbGwgPSAoXG4gICAgICAgIHF1aWxsSW1wb3J0LmRlZmF1bHQgPyBxdWlsbEltcG9ydC5kZWZhdWx0IDogcXVpbGxJbXBvcnRcbiAgICAgICkgYXMgYW55XG4gICAgfVxuXG4gICAgLy8gT25seSByZWdpc3RlciBjdXN0b20gb3B0aW9ucyBhbmQgbW9kdWxlcyBvbmNlXG4gICAgdGhpcy5jb25maWcuY3VzdG9tT3B0aW9ucz8uZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBuZXdDdXN0b21PcHRpb24gPSB0aGlzLlF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgbmV3Q3VzdG9tT3B0aW9uLndoaXRlbGlzdCA9IGN1c3RvbU9wdGlvbi53aGl0ZWxpc3RcbiAgICAgIHRoaXMuUXVpbGwucmVnaXN0ZXIoXG4gICAgICAgIG5ld0N1c3RvbU9wdGlvbixcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgdGhpcy5jb25maWcuc3VwcHJlc3NHbG9iYWxSZWdpc3Rlcldhcm5pbmdcbiAgICAgIClcbiAgICB9KVxuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucmVnaXN0ZXJDdXN0b21Nb2R1bGVzKFxuICAgICAgdGhpcy5RdWlsbCxcbiAgICAgIHRoaXMuY29uZmlnLmN1c3RvbU1vZHVsZXMsXG4gICAgICB0aGlzLmNvbmZpZy5zdXBwcmVzc0dsb2JhbFJlZ2lzdGVyV2FybmluZ1xuICAgIClcbiAgfSkucGlwZShzaGFyZVJlcGxheSh7IGJ1ZmZlclNpemU6IDEsIHJlZkNvdW50OiB0cnVlIH0pKVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFFVSUxMX0NPTkZJR19UT0tFTikgcHVibGljIGNvbmZpZzogUXVpbGxDb25maWdcbiAgKSB7XG4gICAgdGhpcy5kb2N1bWVudCA9IGluamVjdG9yLmdldChET0NVTUVOVClcblxuICAgIGlmICghdGhpcy5jb25maWcpIHtcbiAgICAgIHRoaXMuY29uZmlnID0geyBtb2R1bGVzOiBkZWZhdWx0TW9kdWxlcyB9XG4gICAgfVxuICB9XG5cbiAgZ2V0UXVpbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVpbGwkXG4gIH1cblxuICAvKipcbiAgICogTWFya2VkIGFzIGludGVybmFsIHNvIGl0IHdvbid0IGJlIGF2YWlsYWJsZSBmb3IgYG5neC1xdWlsbGAgY29uc3VtZXJzLCB0aGlzIGlzIG9ubHlcbiAgICogaW50ZXJuYWwgbWV0aG9kIHRvIGJlIHVzZWQgd2l0aGluIHRoZSBsaWJyYXJ5LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gICBhc3luYyByZWdpc3RlckN1c3RvbU1vZHVsZXMoXG4gICAgUXVpbGw6IGFueSxcbiAgICBjdXN0b21Nb2R1bGVzOiBDdXN0b21Nb2R1bGVbXSB8IHVuZGVmaW5lZCxcbiAgICBzdXBwcmVzc0dsb2JhbFJlZ2lzdGVyV2FybmluZz86IGJvb2xlYW5cbiAgKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjdXN0b21Nb2R1bGVzKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICAgICAgZm9yIChsZXQgeyBpbXBsZW1lbnRhdGlvbiwgcGF0aCB9IG9mIGN1c3RvbU1vZHVsZXMpIHtcbiAgICAgICAgLy8gVGhlIGBpbXBsZW1lbnRhdGlvbmAgbWlnaHQgYmUgYW4gb2JzZXJ2YWJsZSB0aGF0IHJlc29sdmVzIHRoZSBhY3R1YWwgaW1wbGVtZW50YXRpb24sXG4gICAgICAgIC8vIGUuZy4gaWYgaXQgc2hvdWxkIGJlIGxhenkgbG9hZGVkLlxuICAgICAgICBpZiAoaXNPYnNlcnZhYmxlKGltcGxlbWVudGF0aW9uKSkge1xuICAgICAgICAgIGltcGxlbWVudGF0aW9uID0gYXdhaXQgZmlyc3RWYWx1ZUZyb20oaW1wbGVtZW50YXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgUXVpbGwucmVnaXN0ZXIocGF0aCwgaW1wbGVtZW50YXRpb24sIHN1cHByZXNzR2xvYmFsUmVnaXN0ZXJXYXJuaW5nKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBgUXVpbGxgIGNvbnN0cnVjdG9yIHNvIHdlJ2xsIGJlIGFibGUgdG8gcmUtdXNlIGl0cyByZXR1cm4gdmFsdWUgZXhjZXB0IG9mIHVzaW5nXG4gICAgLy8gYG1hcGAgb3BlcmF0b3JzLCBldGMuXG4gICAgcmV0dXJuIFF1aWxsXG4gIH1cbn1cbiJdfQ==