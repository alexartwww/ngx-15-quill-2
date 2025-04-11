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
            if (this.content()) {
                this.valueSetter(this.quillEditor, this.content());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtMTUtcXVpbGwtMi9zcmMvbGliL3F1aWxsLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFHaEUsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sV0FBVyxFQUdYLGlCQUFpQixFQUVqQixlQUFlLEVBR2hCLE1BQU0sZUFBZSxDQUFBO0FBRXRCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUl6QyxPQUFPLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLFdBQVcsQ0FBQTtBQUd6QyxPQUFPLEVBQUMsWUFBWSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDOzs7O0FBaUI1RCxJQUFNLGtCQUFrQixHQUF4QixNQUFNLGtCQUFrQjtJQXFCN0IsWUFDUyxVQUFzQixFQUNuQixRQUFtQixFQUNuQixJQUFZLEVBQ1osT0FBcUIsRUFDckIsWUFBMEIsRUFDTCxVQUFlO1FBTHZDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUNMLGVBQVUsR0FBVixVQUFVLENBQUs7UUFuQnZDLFdBQU0sR0FBRyxJQUFJLENBQUE7UUFFYixrQkFBYSxHQUFtQixFQUFFLENBQUE7UUFDbEMsa0JBQWEsR0FBbUIsRUFBRSxDQUFBO1FBRWpDLG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUE7UUFJMUQsYUFBUSxHQUFHLEtBQUssQ0FBQTtR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QWQ5QixTQUFTO2dDQUNPLGlCQUFpQixDQUFDLElBQUksWUFDM0IsWUFBWSxZQU1aOztDQUVYLGNBQ2EsSUFBSSxXQUNQLENBQUMsWUFBWSxDQUFDOztzQkE2QnBCLE1BQU07dUJBQUMsV0FBVzt3QkExQlosTUFBTTtrQkFBZCxLQUFLO1lBQ0csS0FBSztrQkFBYixLQUFLO1lBQ0csT0FBTztrQkFBZixLQUFLO1lBQ0csS0FBSztrQkFBYixLQUFLO1lBQ0csT0FBTztrQkFBZixLQUFLO1lBQ0csUUFBUTtrQkFBaEIsS0FBSztZQUNHLFlBQVk7a0JBQXBCLEtBQUs7WUFDRyxNQUFNO2tCQUFkLEtBQUs7WUFDRyxPQUFPO2tCQUFmLEtBQUs7WUFDRyxhQUFhO2tCQUFyQixLQUFLO1lBQ0csYUFBYTtrQkFBckIsS0FBSztZQUVJLGVBQWU7a0JBQXhCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5pbXBvcnQgUXVpbGxUeXBlIGZyb20gJ3F1aWxsJ1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBPbkNoYW5nZXMsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuXG5pbXBvcnQge0N1c3RvbU9wdGlvbiwgQ3VzdG9tTW9kdWxlLCBRdWlsbE1vZHVsZXMsIFF1aWxsQmVmb3JlUmVuZGVyfSBmcm9tICduZ3gtMTUtcXVpbGwtMi9jb25maWcnXG5cbmltcG9ydCB7Z2V0Rm9ybWF0LCByYWYkfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgeyBRdWlsbFNlcnZpY2UgfSBmcm9tICcuL3F1aWxsLnNlcnZpY2UnXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJ1xuaW1wb3J0IHtVbnRpbERlc3Ryb3ksIHVudGlsRGVzdHJveWVkfSBmcm9tIFwiQG5nbmVhdC91bnRpbC1kZXN0cm95XCI7XG5cbkBVbnRpbERlc3Ryb3koKVxuQENvbXBvbmVudCh7XG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHNlbGVjdG9yOiAncXVpbGwtdmlldycsXG4gIHN0eWxlczogW2Bcbi5xbC1jb250YWluZXIubmd4LXF1aWxsLXZpZXcge1xuICBib3JkZXI6IDA7XG59XG5gXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IHF1aWxsLXZpZXctZWxlbWVudD48L2Rpdj5cbmAsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIFF1aWxsVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgZm9ybWF0PzogJ29iamVjdCcgfCAnaHRtbCcgfCAndGV4dCcgfCAnanNvbidcbiAgQElucHV0KCkgdGhlbWU/OiBzdHJpbmdcbiAgQElucHV0KCkgbW9kdWxlcz86IFF1aWxsTW9kdWxlc1xuICBASW5wdXQoKSBkZWJ1Zz86ICd3YXJuJyB8ICdsb2cnIHwgJ2Vycm9yJyB8IGZhbHNlXG4gIEBJbnB1dCgpIGZvcm1hdHM/OiBzdHJpbmdbXSB8IG51bGxcbiAgQElucHV0KCkgc2FuaXRpemU/OiBib29sZWFuXG4gIEBJbnB1dCgpIGJlZm9yZVJlbmRlcj86IFF1aWxsQmVmb3JlUmVuZGVyXG4gIEBJbnB1dCgpIHN0cmljdCA9IHRydWVcbiAgQElucHV0KCkgY29udGVudDogYW55XG4gIEBJbnB1dCgpIGN1c3RvbU1vZHVsZXM6IEN1c3RvbU1vZHVsZVtdID0gW11cbiAgQElucHV0KCkgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9uW10gPSBbXVxuXG4gIEBPdXRwdXQoKSBvbkVkaXRvckNyZWF0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgcXVpbGxFZGl0b3IhOiBRdWlsbFR5cGVcbiAgZWRpdG9yRWxlbSE6IEhUTUxFbGVtZW50XG4gIHB1YmxpYyBwcmVzZXJ2ZSA9IGZhbHNlXG5cbiAgcHJpdmF0ZSBxdWlsbFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGxcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcm90ZWN0ZWQgem9uZTogTmdab25lLFxuICAgIHByb3RlY3RlZCBzZXJ2aWNlOiBRdWlsbFNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGRvbVNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByb3RlY3RlZCBwbGF0Zm9ybUlkOiBhbnksXG4gICkge31cblxuICB2YWx1ZVNldHRlciA9IChxdWlsbEVkaXRvcjogUXVpbGxUeXBlLCB2YWx1ZTogYW55KTogYW55ID0+IHtcbiAgICBjb25zdCBmb3JtYXQgPSBnZXRGb3JtYXQodGhpcy5mb3JtYXQsIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0KVxuICAgIGxldCBjb250ZW50ID0gdmFsdWVcbiAgICBpZiAoZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgIHF1aWxsRWRpdG9yLnNldFRleHQoY29udGVudClcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZvcm1hdCA9PT0gJ2h0bWwnKSB7XG4gICAgICAgIGNvbnN0IHNhbml0aXplID0gW3RydWUsIGZhbHNlXS5pbmNsdWRlcyh0aGlzLnNhbml0aXplKSA/IHRoaXMuc2FuaXRpemUgOiAodGhpcy5zZXJ2aWNlLmNvbmZpZy5zYW5pdGl6ZSB8fCBmYWxzZSlcbiAgICAgICAgaWYgKHNhbml0aXplKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRvbVNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgY29udGVudCA9IHF1aWxsRWRpdG9yLmNsaXBib2FyZC5jb252ZXJ0KHZhbHVlKVxuICAgICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnRlbnQgPSBKU09OLnBhcnNlKHZhbHVlKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29udGVudCA9IFt7IGluc2VydDogdmFsdWUgfV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcXVpbGxFZGl0b3Iuc2V0Q29udGVudHMoY29udGVudClcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCF0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKGNoYW5nZXMuY29udGVudCkge1xuICAgICAgdGhpcy52YWx1ZVNldHRlcih0aGlzLnF1aWxsRWRpdG9yLCBjaGFuZ2VzLmNvbnRlbnQuY3VycmVudFZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAoaXNQbGF0Zm9ybVNlcnZlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnF1aWxsU3Vic2NyaXB0aW9uID0gdGhpcy5zZXJ2aWNlLmdldFF1aWxsKCkucGlwZShcbiAgICAgIG1lcmdlTWFwKChRdWlsbCkgPT4gdGhpcy5zZXJ2aWNlLmJlZm9yZVJlbmRlcihRdWlsbCwgdGhpcy5jdXN0b21Nb2R1bGVzLCB0aGlzLmJlZm9yZVJlbmRlcikpXG4gICAgKS5zdWJzY3JpYmUoUXVpbGwgPT4ge1xuICAgICAgY29uc3QgbW9kdWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubW9kdWxlcyB8fCB0aGlzLnNlcnZpY2UuY29uZmlnLm1vZHVsZXMpXG4gICAgICBtb2R1bGVzLnRvb2xiYXIgPSBmYWxzZVxuXG4gICAgICB0aGlzLmN1c3RvbU9wdGlvbnMuZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0N1c3RvbU9wdGlvbiA9IFF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgICBuZXdDdXN0b21PcHRpb24ud2hpdGVsaXN0ID0gY3VzdG9tT3B0aW9uLndoaXRlbGlzdFxuICAgICAgICBRdWlsbC5yZWdpc3RlcihuZXdDdXN0b21PcHRpb24sIHRydWUpXG4gICAgICB9KVxuXG4gICAgICBsZXQgZGVidWcgPSB0aGlzLmRlYnVnXG4gICAgICBpZiAoIWRlYnVnICYmIGRlYnVnICE9PSBmYWxzZSAmJiB0aGlzLnNlcnZpY2UuY29uZmlnLmRlYnVnKSB7XG4gICAgICAgIGRlYnVnID0gdGhpcy5zZXJ2aWNlLmNvbmZpZy5kZWJ1Z1xuICAgICAgfVxuXG4gICAgICBsZXQgZm9ybWF0cyA9IHRoaXMuZm9ybWF0c1xuICAgICAgaWYgKCFmb3JtYXRzICYmIGZvcm1hdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmb3JtYXRzID0gdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXRzID8gWy4uLnRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0c10gOiAodGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXRzID09PSBudWxsID8gbnVsbCA6IHVuZGVmaW5lZClcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRoZW1lID0gdGhpcy50aGVtZSB8fCAodGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA/IHRoaXMuc2VydmljZS5jb25maWcudGhlbWUgOiAnc25vdycpXG5cbiAgICAgIHRoaXMuZWRpdG9yRWxlbSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICdbcXVpbGwtdmlldy1lbGVtZW50XSdcbiAgICAgICkgYXMgSFRNTEVsZW1lbnRcblxuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvciA9IG5ldyBRdWlsbCh0aGlzLmVkaXRvckVsZW0sIHtcbiAgICAgICAgICBkZWJ1ZyxcbiAgICAgICAgICBmb3JtYXRzLFxuICAgICAgICAgIG1vZHVsZXMsXG4gICAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgc3RyaWN0OiB0aGlzLnN0cmljdCxcbiAgICAgICAgICB0aGVtZVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVkaXRvckVsZW0sICduZ3gtcXVpbGwtdmlldycpXG5cbiAgICAgIGlmICh0aGlzLmNvbnRlbnQoKSkge1xuICAgICAgICB0aGlzLnZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIHRoaXMuY29udGVudCgpKVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgdHJpZ2dlcnMgY2hhbmdlIGRldGVjdGlvbi4gVGhlcmUncyBubyBzZW5zZSB0byBpbnZva2UgdGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGlmIGFueW9uZSBpc1xuICAgICAgLy8gbGlzdGVuaW5nIHRvIHRoZSBgb25FZGl0b3JDcmVhdGVkYCBldmVudCBpbnNpZGUgdGhlIHRlbXBsYXRlLCBmb3IgaW5zdGFuY2UgYDxxdWlsbC12aWV3IChvbkVkaXRvckNyZWF0ZWQpPVwiLi4uXCI+YC5cbiAgICAgIGlmICghdGhpcy5vbkVkaXRvckNyZWF0ZWQub2JzZXJ2ZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB3aWxsIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBhbmQgYG9uRWRpdG9yQ3JlYXRlZGAgd2lsbCBhbHNvIGNhbGwgYG1hcmtEaXJ0eSgpYFxuICAgICAgLy8gaW50ZXJuYWxseSwgc2luY2UgQW5ndWxhciB3cmFwcyB0ZW1wbGF0ZSBldmVudCBsaXN0ZW5lcnMgaW50byBgbGlzdGVuZXJgIGluc3RydWN0aW9uLiBXZSdyZSB1c2luZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWBcbiAgICAgIC8vIHRvIHByZXZlbnQgdGhlIGZyYW1lIGRyb3AgYW5kIGF2b2lkIGBFeHByZXNzaW9uQ2hhbmdlZEFmdGVySXRIYXNCZWVuQ2hlY2tlZEVycm9yYCBlcnJvci5cbiAgICAgIHJhZiQoKS5waXBlKHVudGlsRGVzdHJveWVkKHRoaXMpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uRWRpdG9yQ3JlYXRlZC5lbWl0KHRoaXMucXVpbGxFZGl0b3IpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnF1aWxsU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpXG4gICAgdGhpcy5xdWlsbFN1YnNjcmlwdGlvbiA9IG51bGxcbiAgfVxufVxuIl19