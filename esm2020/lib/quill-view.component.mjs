import { __decorate } from "tslib";
import { CommonModule, isPlatformServer } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewEncapsulation, SecurityContext } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { getFormat, raf$ } from './helpers';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import * as i0 from "@angular/core";
import * as i1 from "./quill.service";
import * as i2 from "@angular/platform-browser";
let QuillViewComponent = class QuillViewComponent {
    constructor(elementRef, renderer, zone, service, domSanitizer, platformId) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.zone = zone;
        this.service = service;
        this.domSanitizer = domSanitizer;
        this.platformId = platformId;
        this.strict = true;
        this.customModules = [];
        this.customOptions = [];
        this.onEditorCreated = new EventEmitter();
        this.preserve = false;
        this.quillSubscription = null;
        this.valueSetter = (quillEditor, value) => {
            const format = getFormat(this.format, this.service.config.format);
            let content = value;
            if (format === 'text') {
                quillEditor.setText(content);
            }
            else {
                if (format === 'html') {
                    const sanitize = [true, false].includes(this.sanitize) ? this.sanitize : (this.service.config.sanitize || false);
                    if (sanitize) {
                        value = this.domSanitizer.sanitize(SecurityContext.HTML, value);
                    }
                    content = quillEditor.clipboard.convert(value);
                }
                else if (format === 'json') {
                    try {
                        content = JSON.parse(value);
                    }
                    catch (e) {
                        content = [{ insert: value }];
                    }
                }
                quillEditor.setContents(content);
            }
        };
    }
    ngOnChanges(changes) {
        if (!this.quillEditor) {
            return;
        }
        if (changes.content) {
            this.valueSetter(this.quillEditor, changes.content.currentValue);
        }
    }
    ngAfterViewInit() {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        this.quillSubscription = this.service.getQuill().pipe(mergeMap((Quill) => this.service.beforeRender(Quill, this.customModules, this.beforeRender))).subscribe(Quill => {
            const modules = Object.assign({}, this.modules || this.service.config.modules);
            modules.toolbar = false;
            this.customOptions.forEach((customOption) => {
                const newCustomOption = Quill.import(customOption.import);
                newCustomOption.whitelist = customOption.whitelist;
                Quill.register(newCustomOption, true);
            });
            let debug = this.debug;
            if (!debug && debug !== false && this.service.config.debug) {
                debug = this.service.config.debug;
            }
            let formats = this.formats;
            if (!formats && formats === undefined) {
                formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined);
            }
            const theme = this.theme || (this.service.config.theme ? this.service.config.theme : 'snow');
            this.editorElem = this.elementRef.nativeElement.querySelector('[quill-view-element]');
            this.zone.runOutsideAngular(() => {
                this.quillEditor = new Quill(this.editorElem, {
                    debug,
                    formats,
                    modules,
                    readOnly: true,
                    strict: this.strict,
                    theme
                });
            });
            this.renderer.addClass(this.editorElem, 'ngx-quill-view');
            if (this.content) {
                this.valueSetter(this.quillEditor, this.content);
            }
            // The `requestAnimationFrame` triggers change detection. There's no sense to invoke the `requestAnimationFrame` if anyone is
            // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
            if (!this.onEditorCreated.observed) {
                return;
            }
            // The `requestAnimationFrame` will trigger change detection and `onEditorCreated` will also call `markDirty()`
            // internally, since Angular wraps template event listeners into `listener` instruction. We're using the `requestAnimationFrame`
            // to prevent the frame drop and avoid `ExpressionChangedAfterItHasBeenCheckedError` error.
            raf$().pipe(untilDestroyed(this)).subscribe(() => {
                this.onEditorCreated.emit(this.quillEditor);
            });
        });
    }
    ngOnDestroy() {
        this.quillSubscription?.unsubscribe();
        this.quillSubscription = null;
    }
};
QuillViewComponent.ɵfac = function QuillViewComponent_Factory(t) { return new (t || QuillViewComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i1.QuillService), i0.ɵɵdirectiveInject(i2.DomSanitizer), i0.ɵɵdirectiveInject(PLATFORM_ID)); };
QuillViewComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QuillViewComponent, selectors: [["quill-view"]], inputs: { format: "format", theme: "theme", modules: "modules", debug: "debug", formats: "formats", sanitize: "sanitize", beforeRender: "beforeRender", strict: "strict", content: "content", customModules: "customModules", customOptions: "customOptions" }, outputs: { onEditorCreated: "onEditorCreated" }, standalone: true, features: [i0.ɵɵNgOnChangesFeature, i0.ɵɵStandaloneFeature], decls: 1, vars: 0, consts: [["quill-view-element", ""]], template: function QuillViewComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelement(0, "div", 0);
    } }, dependencies: [CommonModule], styles: [".ql-container.ngx-quill-view{border:0}\n"], encapsulation: 2 });
QuillViewComponent = __decorate([
    UntilDestroy()
], QuillViewComponent);
export { QuillViewComponent };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillViewComponent, [{
        type: Component,
        args: [{ encapsulation: ViewEncapsulation.None, selector: 'quill-view', template: `
    <div quill-view-element></div>
`, standalone: true, imports: [CommonModule], styles: [".ql-container.ngx-quill-view{border:0}\n"] }]
    }], function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i1.QuillService }, { type: i2.DomSanitizer }, { type: undefined, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }]; }, { format: [{
            type: Input
        }], theme: [{
            type: Input
        }], modules: [{
            type: Input
        }], debug: [{
            type: Input
        }], formats: [{
            type: Input
        }], sanitize: [{
            type: Input
        }], beforeRender: [{
            type: Input
        }], strict: [{
            type: Input
        }], content: [{
            type: Input
        }], customModules: [{
            type: Input
        }], customOptions: [{
            type: Input
        }], onEditorCreated: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtMTUtcXVpbGwtMi9zcmMvbGliL3F1aWxsLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFHaEUsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sV0FBVyxFQUdYLGlCQUFpQixFQUVqQixlQUFlLEVBR2hCLE1BQU0sZUFBZSxDQUFBO0FBRXRCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUl6QyxPQUFPLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLFdBQVcsQ0FBQTtBQUd6QyxPQUFPLEVBQUMsWUFBWSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDOzs7O0FBaUI1RCxJQUFNLGtCQUFrQixHQUF4QixNQUFNLGtCQUFrQjtJQXFCN0IsWUFDUyxVQUFzQixFQUNuQixRQUFtQixFQUNuQixJQUFZLEVBQ1osT0FBcUIsRUFDckIsWUFBMEIsRUFDTCxVQUFlO1FBTHZDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUNMLGVBQVUsR0FBVixVQUFVLENBQUs7UUFuQnZDLFdBQU0sR0FBRyxJQUFJLENBQUE7UUFFYixrQkFBYSxHQUFtQixFQUFFLENBQUE7UUFDbEMsa0JBQWEsR0FBbUIsRUFBRSxDQUFBO1FBRWpDLG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUE7UUFJMUQsYUFBUSxHQUFHLEtBQUssQ0FBQTtR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Z0NBQ08saUJBQWlCLENBQUMsSUFBSSxZQUMzQixZQUFZLFlBTVo7O0NBRVgsY0FDYSxJQUFJLFdBQ1AsQ0FBQyxZQUFZLENBQUM7O3NCQTZCcEIsTUFBTTt1QkFBQyxXQUFXO3dCQTFCWixNQUFNO2tCQUFkLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUs7WUFDRyxPQUFPO2tCQUFmLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUs7WUFDRyxPQUFPO2tCQUFmLEtBQUs7WUFDRyxRQUFRO2tCQUFoQixLQUFLO1lBQ0csWUFBWTtrQkFBcEIsS0FBSztZQUNHLE1BQU07a0JBQWQsS0FBSztZQUNHLE9BQU87a0JBQWYsS0FBSztZQUNHLGFBQWE7a0JBQXJCLEtBQUs7WUFDRyxhQUFhO2tCQUFyQixLQUFLO1lBRUksZUFBZTtrQkFBeEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSwgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbidcbmltcG9ydCBRdWlsbFR5cGUgZnJvbSAncXVpbGwnXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIE9uQ2hhbmdlcyxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbiAgU2VjdXJpdHlDb250ZXh0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcydcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5cbmltcG9ydCB7Q3VzdG9tT3B0aW9uLCBDdXN0b21Nb2R1bGUsIFF1aWxsTW9kdWxlcywgUXVpbGxCZWZvcmVSZW5kZXJ9IGZyb20gJ25neC0xNS1xdWlsbC0yL2NvbmZpZydcblxuaW1wb3J0IHtnZXRGb3JtYXQsIHJhZiR9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB7IFF1aWxsU2VydmljZSB9IGZyb20gJy4vcXVpbGwuc2VydmljZSdcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5pbXBvcnQge1VudGlsRGVzdHJveSwgdW50aWxEZXN0cm95ZWR9IGZyb20gXCJAbmduZWF0L3VudGlsLWRlc3Ryb3lcIjtcblxuQFVudGlsRGVzdHJveSgpXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc2VsZWN0b3I6ICdxdWlsbC12aWV3JyxcbiAgc3R5bGVzOiBbYFxuLnFsLWNvbnRhaW5lci5uZ3gtcXVpbGwtdmlldyB7XG4gIGJvcmRlcjogMDtcbn1cbmBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgcXVpbGwtdmlldy1lbGVtZW50PjwvZGl2PlxuYCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBmb3JtYXQ/OiAnb2JqZWN0JyB8ICdodG1sJyB8ICd0ZXh0JyB8ICdqc29uJ1xuICBASW5wdXQoKSB0aGVtZT86IHN0cmluZ1xuICBASW5wdXQoKSBtb2R1bGVzPzogUXVpbGxNb2R1bGVzXG4gIEBJbnB1dCgpIGRlYnVnPzogJ3dhcm4nIHwgJ2xvZycgfCAnZXJyb3InIHwgZmFsc2VcbiAgQElucHV0KCkgZm9ybWF0cz86IHN0cmluZ1tdIHwgbnVsbFxuICBASW5wdXQoKSBzYW5pdGl6ZT86IGJvb2xlYW5cbiAgQElucHV0KCkgYmVmb3JlUmVuZGVyPzogUXVpbGxCZWZvcmVSZW5kZXJcbiAgQElucHV0KCkgc3RyaWN0ID0gdHJ1ZVxuICBASW5wdXQoKSBjb250ZW50OiBhbnlcbiAgQElucHV0KCkgY3VzdG9tTW9kdWxlczogQ3VzdG9tTW9kdWxlW10gPSBbXVxuICBASW5wdXQoKSBjdXN0b21PcHRpb25zOiBDdXN0b21PcHRpb25bXSA9IFtdXG5cbiAgQE91dHB1dCgpIG9uRWRpdG9yQ3JlYXRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBxdWlsbEVkaXRvciE6IFF1aWxsVHlwZVxuICBlZGl0b3JFbGVtITogSFRNTEVsZW1lbnRcbiAgcHVibGljIHByZXNlcnZlID0gZmFsc2VcblxuICBwcml2YXRlIHF1aWxsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIHNlcnZpY2U6IFF1aWxsU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJvdGVjdGVkIHBsYXRmb3JtSWQ6IGFueSxcbiAgKSB7fVxuXG4gIHZhbHVlU2V0dGVyID0gKHF1aWxsRWRpdG9yOiBRdWlsbFR5cGUsIHZhbHVlOiBhbnkpOiBhbnkgPT4ge1xuICAgIGNvbnN0IGZvcm1hdCA9IGdldEZvcm1hdCh0aGlzLmZvcm1hdCwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXQpXG4gICAgbGV0IGNvbnRlbnQgPSB2YWx1ZVxuICAgIGlmIChmb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgcXVpbGxFZGl0b3Iuc2V0VGV4dChjb250ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZm9ybWF0ID09PSAnaHRtbCcpIHtcbiAgICAgICAgY29uc3Qgc2FuaXRpemUgPSBbdHJ1ZSwgZmFsc2VdLmluY2x1ZGVzKHRoaXMuc2FuaXRpemUpID8gdGhpcy5zYW5pdGl6ZSA6ICh0aGlzLnNlcnZpY2UuY29uZmlnLnNhbml0aXplIHx8IGZhbHNlKVxuICAgICAgICBpZiAoc2FuaXRpemUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZG9tU2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBjb250ZW50ID0gcXVpbGxFZGl0b3IuY2xpcGJvYXJkLmNvbnZlcnQodmFsdWUpXG4gICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29udGVudCA9IEpTT04ucGFyc2UodmFsdWUpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb250ZW50ID0gW3sgaW5zZXJ0OiB2YWx1ZSB9XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBxdWlsbEVkaXRvci5zZXRDb250ZW50cyhjb250ZW50KVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5jb250ZW50KSB7XG4gICAgICB0aGlzLnZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIGNoYW5nZXMuY29udGVudC5jdXJyZW50VmFsdWUpXG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24gPSB0aGlzLnNlcnZpY2UuZ2V0UXVpbGwoKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKFF1aWxsKSA9PiB0aGlzLnNlcnZpY2UuYmVmb3JlUmVuZGVyKFF1aWxsLCB0aGlzLmN1c3RvbU1vZHVsZXMsIHRoaXMuYmVmb3JlUmVuZGVyKSlcbiAgICApLnN1YnNjcmliZShRdWlsbCA9PiB7XG4gICAgICBjb25zdCBtb2R1bGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5tb2R1bGVzIHx8IHRoaXMuc2VydmljZS5jb25maWcubW9kdWxlcylcbiAgICAgIG1vZHVsZXMudG9vbGJhciA9IGZhbHNlXG5cbiAgICAgIHRoaXMuY3VzdG9tT3B0aW9ucy5mb3JFYWNoKChjdXN0b21PcHRpb24pID0+IHtcbiAgICAgICAgY29uc3QgbmV3Q3VzdG9tT3B0aW9uID0gUXVpbGwuaW1wb3J0KGN1c3RvbU9wdGlvbi5pbXBvcnQpXG4gICAgICAgIG5ld0N1c3RvbU9wdGlvbi53aGl0ZWxpc3QgPSBjdXN0b21PcHRpb24ud2hpdGVsaXN0XG4gICAgICAgIFF1aWxsLnJlZ2lzdGVyKG5ld0N1c3RvbU9wdGlvbiwgdHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGxldCBkZWJ1ZyA9IHRoaXMuZGVidWdcbiAgICAgIGlmICghZGVidWcgJiYgZGVidWcgIT09IGZhbHNlICYmIHRoaXMuc2VydmljZS5jb25maWcuZGVidWcpIHtcbiAgICAgICAgZGVidWcgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmRlYnVnXG4gICAgICB9XG5cbiAgICAgIGxldCBmb3JtYXRzID0gdGhpcy5mb3JtYXRzXG4gICAgICBpZiAoIWZvcm1hdHMgJiYgZm9ybWF0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZvcm1hdHMgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdHMgPyBbLi4udGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXRzXSA6ICh0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdHMgPT09IG51bGwgPyBudWxsIDogdW5kZWZpbmVkKVxuICAgICAgfVxuICAgICAgY29uc3QgdGhlbWUgPSB0aGlzLnRoZW1lIHx8ICh0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lID8gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA6ICdzbm93JylcblxuICAgICAgdGhpcy5lZGl0b3JFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJ1txdWlsbC12aWV3LWVsZW1lbnRdJ1xuICAgICAgKSBhcyBIVE1MRWxlbWVudFxuXG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yID0gbmV3IFF1aWxsKHRoaXMuZWRpdG9yRWxlbSwge1xuICAgICAgICAgIGRlYnVnLFxuICAgICAgICAgIGZvcm1hdHMsXG4gICAgICAgICAgbW9kdWxlcyxcbiAgICAgICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgICAgICBzdHJpY3Q6IHRoaXMuc3RyaWN0LFxuICAgICAgICAgIHRoZW1lXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWRpdG9yRWxlbSwgJ25neC1xdWlsbC12aWV3JylcblxuICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICB0aGlzLnZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIHRoaXMuY29udGVudClcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRyaWdnZXJzIGNoYW5nZSBkZXRlY3Rpb24uIFRoZXJlJ3Mgbm8gc2Vuc2UgdG8gaW52b2tlIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBpZiBhbnlvbmUgaXNcbiAgICAgIC8vIGxpc3RlbmluZyB0byB0aGUgYG9uRWRpdG9yQ3JlYXRlZGAgZXZlbnQgaW5zaWRlIHRoZSB0ZW1wbGF0ZSwgZm9yIGluc3RhbmNlIGA8cXVpbGwtdmlldyAob25FZGl0b3JDcmVhdGVkKT1cIi4uLlwiPmAuXG4gICAgICBpZiAoIXRoaXMub25FZGl0b3JDcmVhdGVkLm9ic2VydmVkKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgd2lsbCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24gYW5kIGBvbkVkaXRvckNyZWF0ZWRgIHdpbGwgYWxzbyBjYWxsIGBtYXJrRGlydHkoKWBcbiAgICAgIC8vIGludGVybmFsbHksIHNpbmNlIEFuZ3VsYXIgd3JhcHMgdGVtcGxhdGUgZXZlbnQgbGlzdGVuZXJzIGludG8gYGxpc3RlbmVyYCBpbnN0cnVjdGlvbi4gV2UncmUgdXNpbmcgdGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgXG4gICAgICAvLyB0byBwcmV2ZW50IHRoZSBmcmFtZSBkcm9wIGFuZCBhdm9pZCBgRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFcnJvcmAgZXJyb3IuXG4gICAgICByYWYkKCkucGlwZSh1bnRpbERlc3Ryb3llZCh0aGlzKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5vbkVkaXRvckNyZWF0ZWQuZW1pdCh0aGlzLnF1aWxsRWRpdG9yKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5xdWlsbFN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKVxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24gPSBudWxsXG4gIH1cbn1cbiJdfQ==