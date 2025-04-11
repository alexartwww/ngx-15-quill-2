import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Optional } from '@angular/core';
import { defer, firstValueFrom, forkJoin, from, isObservable, map, of, tap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { defaultModules, QUILL_CONFIG_TOKEN } from 'ngx-15-quill-2/config';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC0xNS1xdWlsbC0yL3NyYy9saWIvcXVpbGwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDMUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQVksUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ3RFLE9BQU8sRUFBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBYyxFQUFFLEVBQUUsR0FBRyxFQUFDLE1BQU0sTUFBTSxDQUFBO0FBQ2xHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUU1QyxPQUFPLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUE2QixNQUFNLHVCQUF1QixDQUFBOztBQUtyRyxNQUFNLE9BQU8sWUFBWTtJQW9EdkIsWUFDRSxRQUFrQixFQUM2QixNQUFtQjtRQUFuQixXQUFNLEdBQU4sTUFBTSxDQUFhO1FBbEQ1RCxXQUFNLEdBQW9CLEtBQUssQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZix5R0FBeUc7Z0JBQ3pHLGtIQUFrSDtnQkFDbEgscUdBQXFHO2dCQUNyRyxNQUFNLDRCQUE0QixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUE7Z0JBQ25FLDRDQUE0QztnQkFDNUMsNEJBQTRCO2dCQUM1QixlQUFlO2dCQUNmLG1IQUFtSDtnQkFDbkgsbUhBQW1IO2dCQUNuSCxtSEFBbUg7Z0JBQ25ILDRDQUE0QztnQkFDNUMsNEhBQTRIO2dCQUM1SCxtSUFBbUk7Z0JBQ25JLDJEQUEyRDtnQkFDM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJ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Q0FBQTtZQUVsRSxxRUFBcUU7WUFDckUsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNwQyxTQUFRO2FBQ1Q7WUFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRWhDLElBQUksWUFBWSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7Z0JBQ3JDLDBFQUEwRTtnQkFDMUUsb0ZBQW9GO2dCQUNwRixPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FDbkMsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLEVBQUU7b0JBQ3JCLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSw2QkFBNkIsQ0FBQyxDQUFBO2dCQUNyRSxDQUFDLENBQUMsQ0FDSCxDQUFDLENBQUE7YUFDSDtpQkFBTTtnQkFDTCxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRSw2QkFBNkIsQ0FBQyxDQUFBO2FBQ3pFO1NBQ0Y7UUFFRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEYsQ0FBQzs7d0VBeEhVLFlBQVksd0NBc0RELGtCQUFrQjtrRUF0RDdCLFlBQVksV0FBWixZQUFZLG1CQUZYLE1BQU07dUZBRVAsWUFBWTtjQUh4QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7O3NCQXVESSxRQUFROztzQkFBSSxNQUFNO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJ1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHtkZWZlciwgZmlyc3RWYWx1ZUZyb20sIGZvcmtKb2luLCBmcm9tLCBpc09ic2VydmFibGUsIG1hcCwgT2JzZXJ2YWJsZSwgb2YsIHRhcH0gZnJvbSAncnhqcydcbmltcG9ydCB7IHNoYXJlUmVwbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5cbmltcG9ydCB7IGRlZmF1bHRNb2R1bGVzLCBRVUlMTF9DT05GSUdfVE9LRU4sIFF1aWxsQ29uZmlnLCBDdXN0b21Nb2R1bGUgfSBmcm9tICduZ3gtMTUtcXVpbGwtMi9jb25maWcnXG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBRdWlsbFNlcnZpY2Uge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXG4gIHByaXZhdGUgUXVpbGwhOiBhbnlcbiAgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnRcbiAgcHJpdmF0ZSBxdWlsbCQ6IE9ic2VydmFibGU8YW55PiA9IGRlZmVyKGFzeW5jICgpID0+IHtcbiAgICBpZiAoIXRoaXMuUXVpbGwpIHtcbiAgICAgIC8vIFF1aWxsIGFkZHMgZXZlbnRzIGxpc3RlbmVycyBvbiBpbXBvcnQgaHR0cHM6Ly9naXRodWIuY29tL3F1aWxsanMvcXVpbGwvYmxvYi9kZXZlbG9wL2NvcmUvZW1pdHRlci5qcyNMOFxuICAgICAgLy8gV2UnZCB3YW50IHRvIHVzZSB0aGUgdW5wYXRjaGVkIGBhZGRFdmVudExpc3RlbmVyYCBtZXRob2QgdG8gaGF2ZSBhbGwgZXZlbnQgY2FsbGJhY2tzIHRvIGJlIHJ1biBvdXRzaWRlIG9mIHpvbmUuXG4gICAgICAvLyBXZSBkb24ndCBrbm93IHlldCBpZiB0aGUgYHpvbmUuanNgIGlzIHVzZWQgb3Igbm90LCBqdXN0IHNhdmUgdGhlIHZhbHVlIHRvIHJlc3RvcmUgaXQgYmFjayBmdXJ0aGVyLlxuICAgICAgY29uc3QgbWF5YmVQYXRjaGVkQWRkRXZlbnRMaXN0ZW5lciA9IHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgLy8gVGhlcmUncmUgMiB0eXBlcyBvZiBBbmd1bGFyIGFwcGxpY2F0aW9uczpcbiAgICAgIC8vIDEpIHpvbmUtZnVsbCAoYnkgZGVmYXVsdClcbiAgICAgIC8vIDIpIHpvbmUtbGVzc1xuICAgICAgLy8gVGhlIGRldmVsb3BlciBjYW4gYXZvaWQgaW1wb3J0aW5nIHRoZSBgem9uZS5qc2AgcGFja2FnZSBhbmQgdGVsbHMgQW5ndWxhciB0aGF0IGhlL3NoZSBpcyByZXNwb25zaWJsZSBmb3IgcnVubmluZ1xuICAgICAgLy8gdGhlIGNoYW5nZSBkZXRlY3Rpb24gYnkgaGltc2VsZi4gVGhpcyBpcyBkb25lIGJ5IFwibm9vcGluZ1wiIHRoZSB6b25lIHRocm91Z2ggYENvbXBpbGVyT3B0aW9uc2Agd2hlbiBib290c3RyYXBwaW5nXG4gICAgICAvLyB0aGUgcm9vdCBtb2R1bGUuIFdlIGZhbGxiYWNrIHRvIGBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyYCBpZiBgX196b25lX3N5bWJvbF9fYWRkRXZlbnRMaXN0ZW5lcmAgaXMgbm90IGRlZmluZWQsXG4gICAgICAvLyB0aGlzIG1lYW5zIHRoZSBgem9uZS5qc2AgaXMgbm90IGltcG9ydGVkLlxuICAgICAgLy8gVGhlIGBfX3pvbmVfc3ltYm9sX19hZGRFdmVudExpc3RlbmVyYCBpcyBiYXNpY2FsbHkgYSBuYXRpdmUgRE9NIEFQSSwgd2hpY2ggaXMgbm90IHBhdGNoZWQgYnkgem9uZS5qcywgdGh1cyBub3QgZXZlbiBnb2luZ1xuICAgICAgLy8gdGhyb3VnaCB0aGUgYHpvbmUuanNgIHRhc2sgbGlmZWN5Y2xlLiBZb3UgY2FuIGFsc28gYWNjZXNzIHRoZSBuYXRpdmUgRE9NIEFQSSBhcyBmb2xsb3dzIGB0YXJnZXRbWm9uZS5fX3N5bWJvbF9fKCdtZXRob2ROYW1lJyldYC5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvZG90LW5vdGF0aW9uXG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPSB0aGlzLmRvY3VtZW50WydfX3pvbmVfc3ltYm9sX19hZGRFdmVudExpc3RlbmVyJ10gfHwgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyXG4gICAgICBjb25zdCBxdWlsbEltcG9ydCA9IGF3YWl0IGltcG9ydCgncXVpbGwnKVxuICAgICAgdGhpcy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID0gbWF5YmVQYXRjaGVkQWRkRXZlbnRMaXN0ZW5lclxuXG4gICAgICB0aGlzLlF1aWxsID0gKFxuICAgICAgICBxdWlsbEltcG9ydC5kZWZhdWx0ID8gcXVpbGxJbXBvcnQuZGVmYXVsdCA6IHF1aWxsSW1wb3J0XG4gICAgICApIGFzIGFueVxuICAgIH1cblxuICAgIC8vIE9ubHkgcmVnaXN0ZXIgY3VzdG9tIG9wdGlvbnMgYW5kIG1vZHVsZXMgb25jZVxuICAgIHRoaXMuY29uZmlnLmN1c3RvbU9wdGlvbnM/LmZvckVhY2goKGN1c3RvbU9wdGlvbikgPT4ge1xuICAgICAgY29uc3QgbmV3Q3VzdG9tT3B0aW9uID0gdGhpcy5RdWlsbC5pbXBvcnQoY3VzdG9tT3B0aW9uLmltcG9ydClcbiAgICAgIG5ld0N1c3RvbU9wdGlvbi53aGl0ZWxpc3QgPSBjdXN0b21PcHRpb24ud2hpdGVsaXN0XG4gICAgICB0aGlzLlF1aWxsLnJlZ2lzdGVyKFxuICAgICAgICBuZXdDdXN0b21PcHRpb24sXG4gICAgICAgIHRydWUsXG4gICAgICAgIHRoaXMuY29uZmlnLnN1cHByZXNzR2xvYmFsUmVnaXN0ZXJXYXJuaW5nXG4gICAgICApXG4gICAgfSlcblxuICAgIHJldHVybiBmaXJzdFZhbHVlRnJvbSh0aGlzLnJlZ2lzdGVyQ3VzdG9tTW9kdWxlcyhcbiAgICAgIHRoaXMuUXVpbGwsXG4gICAgICB0aGlzLmNvbmZpZy5jdXN0b21Nb2R1bGVzLFxuICAgICAgdGhpcy5jb25maWcuc3VwcHJlc3NHbG9iYWxSZWdpc3Rlcldhcm5pbmdcbiAgICApKVxuICB9KS5waXBlKFxuICAgIHNoYXJlUmVwbGF5KHtcbiAgICAgIGJ1ZmZlclNpemU6IDEsXG4gICAgICByZWZDb3VudDogZmFsc2VcbiAgICB9KVxuICApXG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoUVVJTExfQ09ORklHX1RPS0VOKSBwdWJsaWMgY29uZmlnOiBRdWlsbENvbmZpZ1xuICApIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gaW5qZWN0b3IuZ2V0KERPQ1VNRU5UKVxuXG4gICAgaWYgKCF0aGlzLmNvbmZpZykge1xuICAgICAgdGhpcy5jb25maWcgPSB7IG1vZHVsZXM6IGRlZmF1bHRNb2R1bGVzIH1cbiAgICB9XG4gIH1cblxuICAvLyBBIGxpc3Qgb2YgY3VzdG9tIG1vZHVsZXMgdGhhdCBoYXZlIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLFxuICAvLyBzbyB3ZSBkb27igJl0IG5lZWQgdG8gYXdhaXQgdGhlaXIgaW1wbGVtZW50YXRpb24uXG4gIHByaXZhdGUgcmVnaXN0ZXJlZE1vZHVsZXMgPSBuZXcgU2V0PHN0cmluZz4oKVxuXG4gIGdldFF1aWxsKCkge1xuICAgIHJldHVybiB0aGlzLnF1aWxsJFxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBiZWZvcmVSZW5kZXIoUXVpbGw6IGFueSwgY3VzdG9tTW9kdWxlczogQ3VzdG9tTW9kdWxlW10gfCB1bmRlZmluZWQsIGJlZm9yZVJlbmRlciA9IHRoaXMuY29uZmlnLmJlZm9yZVJlbmRlcikge1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGVhY2ggdGltZSB0aGUgZWRpdG9yIG5lZWRzIHRvIGJlIHJlbmRlcmVkLFxuICAgIC8vIHNvIGl0IG9wZXJhdGVzIGluZGl2aWR1YWxseSBwZXIgY29tcG9uZW50LiBJZiBubyBjdXN0b20gbW9kdWxlIG5lZWRzIHRvIGJlXG4gICAgLy8gcmVnaXN0ZXJlZCBhbmQgbm8gYGJlZm9yZVJlbmRlcmAgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGl0IHdpbGwgZW1pdFxuICAgIC8vIGltbWVkaWF0ZWx5IGFuZCBwcm9jZWVkIHdpdGggdGhlIHJlbmRlcmluZy5cbiAgICBjb25zdCBzb3VyY2VzID0gW3RoaXMucmVnaXN0ZXJDdXN0b21Nb2R1bGVzKFF1aWxsLCBjdXN0b21Nb2R1bGVzKV1cbiAgICBpZiAoYmVmb3JlUmVuZGVyKSB7XG4gICAgICBzb3VyY2VzLnB1c2goZnJvbShiZWZvcmVSZW5kZXIoKSkpXG4gICAgfVxuICAgIHJldHVybiBmb3JrSm9pbihzb3VyY2VzKS5waXBlKG1hcCgoKSA9PiBRdWlsbCkpXG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgcmVnaXN0ZXJDdXN0b21Nb2R1bGVzKFxuICAgIFF1aWxsOiBhbnksXG4gICAgY3VzdG9tTW9kdWxlczogQ3VzdG9tTW9kdWxlW10gfCB1bmRlZmluZWQsXG4gICAgc3VwcHJlc3NHbG9iYWxSZWdpc3Rlcldhcm5pbmc/OiBib29sZWFuXG4gICkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjdXN0b21Nb2R1bGVzKSkge1xuICAgICAgcmV0dXJuIG9mKFF1aWxsKVxuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZXM6IE9ic2VydmFibGU8dW5rbm93bj5bXSA9IFtdXG5cbiAgICBmb3IgKGNvbnN0IGN1c3RvbU1vZHVsZSBvZiBjdXN0b21Nb2R1bGVzKSB7XG4gICAgICBjb25zdCB7IHBhdGgsIGltcGxlbWVudGF0aW9uOiBtYXliZUltcGxlbWVudGF0aW9uIH0gPSBjdXN0b21Nb2R1bGVcblxuICAgICAgLy8gSWYgdGhlIG1vZHVsZSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQsIHByb2NlZWQgdG8gdGhlIG5leHQgbW9kdWxlLi4uXG4gICAgICBpZiAodGhpcy5yZWdpc3RlcmVkTW9kdWxlcy5oYXMocGF0aCkpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWdpc3RlcmVkTW9kdWxlcy5hZGQocGF0aClcblxuICAgICAgaWYgKGlzT2JzZXJ2YWJsZShtYXliZUltcGxlbWVudGF0aW9uKSkge1xuICAgICAgICAvLyBJZiB0aGUgaW1wbGVtZW50YXRpb24gaXMgYW4gb2JzZXJ2YWJsZSwgd2Ugd2lsbCB3YWl0IGZvciBpdCB0byBsb2FkIGFuZFxuICAgICAgICAvLyB0aGVuIHJlZ2lzdGVyIGl0IHdpdGggUXVpbGwuIFRoZSBjYWxsZXIgd2lsbCB3YWl0IHVudGlsIHRoZSBtb2R1bGUgaXMgcmVnaXN0ZXJlZC5cbiAgICAgICAgc291cmNlcy5wdXNoKG1heWJlSW1wbGVtZW50YXRpb24ucGlwZShcbiAgICAgICAgICB0YXAoKGltcGxlbWVudGF0aW9uKSA9PiB7XG4gICAgICAgICAgICBRdWlsbC5yZWdpc3RlcihwYXRoLCBpbXBsZW1lbnRhdGlvbiwgc3VwcHJlc3NHbG9iYWxSZWdpc3Rlcldhcm5pbmcpXG4gICAgICAgICAgfSlcbiAgICAgICAgKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFF1aWxsLnJlZ2lzdGVyKHBhdGgsIG1heWJlSW1wbGVtZW50YXRpb24sIHN1cHByZXNzR2xvYmFsUmVnaXN0ZXJXYXJuaW5nKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2VzLmxlbmd0aCA+IDAgPyBmb3JrSm9pbihzb3VyY2VzKS5waXBlKG1hcCgoKSA9PiBRdWlsbCkpIDogb2YoUXVpbGwpXG4gIH1cbn1cbiJdfQ==