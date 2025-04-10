import { CommonModule, isPlatformServer } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewEncapsulation, SecurityContext } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { getFormat } from './helpers';
import * as i0 from "@angular/core";
import * as i1 from "./quill.service";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/common";
function QuillViewComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 1);
} }
function QuillViewComponent_pre_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "pre", 1);
} }
export class QuillViewComponent {
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
        this.preserveWhitespace = false;
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
    ngOnInit() {
        this.preserve = this.preserveWhitespace;
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
        this.quillSubscription = this.service.getQuill().pipe(mergeMap((Quill) => {
            const promises = [this.service.registerCustomModules(Quill, this.customModules)];
            const beforeRender = this.beforeRender ?? this.service.config.beforeRender;
            if (beforeRender) {
                promises.push(beforeRender());
            }
            return Promise.all(promises).then(() => Quill);
        })).subscribe(Quill => {
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
                formats = this.service.config.formats ?
                    Object.assign({}, this.service.config.formats) : (this.service.config.formats === null ? null : undefined);
            }
            const theme = this.theme || (this.service.config.theme ? this.service.config.theme : 'snow');
            this.editorElem = this.elementRef.nativeElement.querySelector('[quill-view-element]');
            this.zone.runOutsideAngular(() => {
                this.quillEditor = new Quill(this.editorElem, {
                    debug: debug,
                    formats: formats,
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
            if (!this.onEditorCreated.observers.length) {
                return;
            }
            // The `requestAnimationFrame` will trigger change detection and `onEditorCreated` will also call `markDirty()`
            // internally, since Angular wraps template event listeners into `listener` instruction. We're using the `requestAnimationFrame`
            // to prevent the frame drop and avoid `ExpressionChangedAfterItHasBeenCheckedError` error.
            requestAnimationFrame(() => {
                this.onEditorCreated.emit(this.quillEditor);
                this.onEditorCreated.complete();
            });
        });
    }
    ngOnDestroy() {
        this.quillSubscription?.unsubscribe();
        this.quillSubscription = null;
    }
}
QuillViewComponent.ɵfac = function QuillViewComponent_Factory(t) { return new (t || QuillViewComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i1.QuillService), i0.ɵɵdirectiveInject(i2.DomSanitizer), i0.ɵɵdirectiveInject(PLATFORM_ID)); };
QuillViewComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QuillViewComponent, selectors: [["quill-view"]], inputs: { format: "format", theme: "theme", modules: "modules", debug: "debug", formats: "formats", sanitize: "sanitize", beforeRender: "beforeRender", strict: "strict", content: "content", customModules: "customModules", customOptions: "customOptions", preserveWhitespace: "preserveWhitespace" }, outputs: { onEditorCreated: "onEditorCreated" }, standalone: true, features: [i0.ɵɵNgOnChangesFeature, i0.ɵɵStandaloneFeature], decls: 2, vars: 2, consts: [["quill-view-element", "", 4, "ngIf"], ["quill-view-element", ""]], template: function QuillViewComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵtemplate(0, QuillViewComponent_div_0_Template, 1, 0, "div", 0);
        i0.ɵɵtemplate(1, QuillViewComponent_pre_1_Template, 1, 0, "pre", 0);
    } if (rf & 2) {
        i0.ɵɵproperty("ngIf", !ctx.preserve);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.preserve);
    } }, dependencies: [CommonModule, i3.NgIf], styles: [".ql-container.ngx-quill-view{border:0}\n"], encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillViewComponent, [{
        type: Component,
        args: [{ encapsulation: ViewEncapsulation.None, selector: 'quill-view', template: `
<div quill-view-element *ngIf="!preserve"></div>
<pre quill-view-element *ngIf="preserve"></pre>
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
        }], preserveWhitespace: [{
            type: Input
        }], onEditorCreated: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtcXVpbGwvc3JjL2xpYi9xdWlsbC12aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFHaEUsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sV0FBVyxFQUdYLGlCQUFpQixFQUVqQixlQUFlLEVBR2hCLE1BQU0sZUFBZSxDQUFBO0FBRXRCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUl6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sV0FBVyxDQUFBOzs7Ozs7SUFhbkMseUJBQWdEOzs7SUFDaEQseUJBQStDOztBQUsvQyxNQUFNLE9BQU8sa0JBQWtCO0lBc0I3QixZQUNTLFVBQXNCLEVBQ25CLFFBQW1CLEVBQ25CLElBQVksRUFDWixPQUFxQixFQUNyQixZQUEwQixFQUNMLFVBQWU7UUFMdkMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQ3JCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ0wsZUFBVSxHQUFWLFVBQVUsQ0FBSztRQXBCdkMsV0FBTSxHQUFHLElBQUksQ0FBQTtRQUViLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQTtRQUNsQyxrQkFBYSxHQUFtQixFQUFFLENBQUE7UUFDbEMsdUJBQWtCLEdBQUcsS0FBSyxDQUFBO1FBRXpCLG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUE7UUFJMUQsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUVmLHNCQUFpQixHQUF3QixJQUFJLENB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QUFBO2dCQUMzQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFBO1lBQ2pDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsQ0FBQTtRQUNyQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0lBQy9CLENBQUM7O29GQS9JVSxrQkFBa0IsK01BNEJuQixXQUFXO3FFQTVCVixrQkFBa0I7UUFOL0IsbUVBQWdEO1FBQ2hELG1FQUErQzs7UUFEdEIsb0NBQWU7UUFDZixlQUFjO1FBQWQsbUNBQWM7d0JBRzNCLFlBQVk7dUZBRVgsa0JBQWtCO2NBZjlCLFNBQVM7Z0NBQ08saUJBQWlCLENBQUMsSUFBSSxZQUMzQixZQUFZLFlBTVo7OztDQUdYLGNBQ2EsSUFBSSxXQUNQLENBQUMsWUFBWSxDQUFDOztzQkE4QnBCLE1BQU07dUJBQUMsV0FBVzt3QkEzQlosTUFBTTtrQkFBZCxLQUFLO1lBQ0csS0FBSztrQkFBYixLQUFLO1lBQ0csT0FBTztrQkFBZixLQUFLO1lBQ0csS0FBSztrQkFBYixLQUFLO1lBQ0csT0FBTztrQkFBZixLQUFLO1lBQ0csUUFBUTtrQkFBaEIsS0FBSztZQUNHLFlBQVk7a0JBQXBCLEtBQUs7WUFDRyxNQUFNO2tCQUFkLEtBQUs7WUFDRyxPQUFPO2tCQUFmLEtBQUs7WUFDRyxhQUFhO2tCQUFyQixLQUFLO1lBQ0csYUFBYTtrQkFBckIsS0FBSztZQUNHLGtCQUFrQjtrQkFBMUIsS0FBSztZQUVJLGVBQWU7a0JBQXhCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5pbXBvcnQgUXVpbGxUeXBlIGZyb20gJ3F1aWxsJ1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBPbkNoYW5nZXMsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBOZ1pvbmUsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuXG5pbXBvcnQgeyBDdXN0b21PcHRpb24sIEN1c3RvbU1vZHVsZSwgUXVpbGxNb2R1bGVzIH0gZnJvbSAnbmd4LXF1aWxsL2NvbmZpZydcblxuaW1wb3J0IHtnZXRGb3JtYXR9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB7IFF1aWxsU2VydmljZSB9IGZyb20gJy4vcXVpbGwuc2VydmljZSdcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5cbkBDb21wb25lbnQoe1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzZWxlY3RvcjogJ3F1aWxsLXZpZXcnLFxuICBzdHlsZXM6IFtgXG4ucWwtY29udGFpbmVyLm5neC1xdWlsbC12aWV3IHtcbiAgYm9yZGVyOiAwO1xufVxuYF0sXG4gIHRlbXBsYXRlOiBgXG48ZGl2IHF1aWxsLXZpZXctZWxlbWVudCAqbmdJZj1cIiFwcmVzZXJ2ZVwiPjwvZGl2PlxuPHByZSBxdWlsbC12aWV3LWVsZW1lbnQgKm5nSWY9XCJwcmVzZXJ2ZVwiPjwvcHJlPlxuYCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGZvcm1hdD86ICdvYmplY3QnIHwgJ2h0bWwnIHwgJ3RleHQnIHwgJ2pzb24nXG4gIEBJbnB1dCgpIHRoZW1lPzogc3RyaW5nXG4gIEBJbnB1dCgpIG1vZHVsZXM/OiBRdWlsbE1vZHVsZXNcbiAgQElucHV0KCkgZGVidWc/OiAnd2FybicgfCAnbG9nJyB8ICdlcnJvcicgfCBmYWxzZVxuICBASW5wdXQoKSBmb3JtYXRzPzogc3RyaW5nW10gfCBudWxsXG4gIEBJbnB1dCgpIHNhbml0aXplPzogYm9vbGVhblxuICBASW5wdXQoKSBiZWZvcmVSZW5kZXI/OiAoKSA9PiBQcm9taXNlPHZvaWQ+XG4gIEBJbnB1dCgpIHN0cmljdCA9IHRydWVcbiAgQElucHV0KCkgY29udGVudDogYW55XG4gIEBJbnB1dCgpIGN1c3RvbU1vZHVsZXM6IEN1c3RvbU1vZHVsZVtdID0gW11cbiAgQElucHV0KCkgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9uW10gPSBbXVxuICBASW5wdXQoKSBwcmVzZXJ2ZVdoaXRlc3BhY2UgPSBmYWxzZVxuXG4gIEBPdXRwdXQoKSBvbkVkaXRvckNyZWF0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgcXVpbGxFZGl0b3IhOiBRdWlsbFR5cGVcbiAgZWRpdG9yRWxlbSE6IEhUTUxFbGVtZW50XG4gIHB1YmxpYyBwcmVzZXJ2ZSA9IGZhbHNlXG5cbiAgcHJpdmF0ZSBxdWlsbFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGxcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcm90ZWN0ZWQgem9uZTogTmdab25lLFxuICAgIHByb3RlY3RlZCBzZXJ2aWNlOiBRdWlsbFNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGRvbVNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByb3RlY3RlZCBwbGF0Zm9ybUlkOiBhbnksXG4gICkge31cblxuICB2YWx1ZVNldHRlciA9IChxdWlsbEVkaXRvcjogUXVpbGxUeXBlLCB2YWx1ZTogYW55KTogYW55ID0+IHtcbiAgICBjb25zdCBmb3JtYXQgPSBnZXRGb3JtYXQodGhpcy5mb3JtYXQsIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0KVxuICAgIGxldCBjb250ZW50ID0gdmFsdWVcbiAgICBpZiAoZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgIHF1aWxsRWRpdG9yLnNldFRleHQoY29udGVudClcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZvcm1hdCA9PT0gJ2h0bWwnKSB7XG4gICAgICAgIGNvbnN0IHNhbml0aXplID0gW3RydWUsIGZhbHNlXS5pbmNsdWRlcyh0aGlzLnNhbml0aXplKSA/IHRoaXMuc2FuaXRpemUgOiAodGhpcy5zZXJ2aWNlLmNvbmZpZy5zYW5pdGl6ZSB8fCBmYWxzZSlcbiAgICAgICAgaWYgKHNhbml0aXplKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmRvbVNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgY29udGVudCA9IHF1aWxsRWRpdG9yLmNsaXBib2FyZC5jb252ZXJ0KHZhbHVlKVxuICAgICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnRlbnQgPSBKU09OLnBhcnNlKHZhbHVlKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29udGVudCA9IFt7IGluc2VydDogdmFsdWUgfV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcXVpbGxFZGl0b3Iuc2V0Q29udGVudHMoY29udGVudClcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnByZXNlcnZlID0gdGhpcy5wcmVzZXJ2ZVdoaXRlc3BhY2VcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5jb250ZW50KSB7XG4gICAgICB0aGlzLnZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIGNoYW5nZXMuY29udGVudC5jdXJyZW50VmFsdWUpXG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24gPSB0aGlzLnNlcnZpY2UuZ2V0UXVpbGwoKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKFF1aWxsKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW3RoaXMuc2VydmljZS5yZWdpc3RlckN1c3RvbU1vZHVsZXMoUXVpbGwsIHRoaXMuY3VzdG9tTW9kdWxlcyldXG4gICAgICAgIGNvbnN0IGJlZm9yZVJlbmRlciA9IHRoaXMuYmVmb3JlUmVuZGVyID8/IHRoaXMuc2VydmljZS5jb25maWcuYmVmb3JlUmVuZGVyXG4gICAgICAgIGlmIChiZWZvcmVSZW5kZXIpIHtcbiAgICAgICAgICBwcm9taXNlcy5wdXNoKGJlZm9yZVJlbmRlcigpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiBRdWlsbClcbiAgICAgIH0pXG4gICAgKS5zdWJzY3JpYmUoUXVpbGwgPT4ge1xuICAgICAgY29uc3QgbW9kdWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubW9kdWxlcyB8fCB0aGlzLnNlcnZpY2UuY29uZmlnLm1vZHVsZXMpXG4gICAgICBtb2R1bGVzLnRvb2xiYXIgPSBmYWxzZVxuXG4gICAgICB0aGlzLmN1c3RvbU9wdGlvbnMuZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0N1c3RvbU9wdGlvbiA9IFF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgICBuZXdDdXN0b21PcHRpb24ud2hpdGVsaXN0ID0gY3VzdG9tT3B0aW9uLndoaXRlbGlzdFxuICAgICAgICBRdWlsbC5yZWdpc3RlcihuZXdDdXN0b21PcHRpb24sIHRydWUpXG4gICAgICB9KVxuXG4gICAgICBsZXQgZGVidWcgPSB0aGlzLmRlYnVnXG4gICAgICBpZiAoIWRlYnVnICYmIGRlYnVnICE9PSBmYWxzZSAmJiB0aGlzLnNlcnZpY2UuY29uZmlnLmRlYnVnKSB7XG4gICAgICAgIGRlYnVnID0gdGhpcy5zZXJ2aWNlLmNvbmZpZy5kZWJ1Z1xuICAgICAgfVxuXG4gICAgICBsZXQgZm9ybWF0cyA9IHRoaXMuZm9ybWF0c1xuICAgICAgaWYgKCFmb3JtYXRzICYmIGZvcm1hdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmb3JtYXRzID0gdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXRzID9cbiAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdHMpIDogKHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cyA9PT0gbnVsbCA/IG51bGwgOiB1bmRlZmluZWQpXG4gICAgICB9XG4gICAgICBjb25zdCB0aGVtZSA9IHRoaXMudGhlbWUgfHwgKHRoaXMuc2VydmljZS5jb25maWcudGhlbWUgPyB0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lIDogJ3Nub3cnKVxuXG4gICAgICB0aGlzLmVkaXRvckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnW3F1aWxsLXZpZXctZWxlbWVudF0nXG4gICAgICApIGFzIEhUTUxFbGVtZW50XG5cbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICAgICAgZGVidWc6IGRlYnVnIGFzIGFueSxcbiAgICAgICAgICBmb3JtYXRzOiBmb3JtYXRzIGFzIGFueSxcbiAgICAgICAgICBtb2R1bGVzLFxuICAgICAgICAgIHJlYWRPbmx5OiB0cnVlLFxuICAgICAgICAgIHN0cmljdDogdGhpcy5zdHJpY3QsXG4gICAgICAgICAgdGhlbWVcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lZGl0b3JFbGVtLCAnbmd4LXF1aWxsLXZpZXcnKVxuXG4gICAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICAgIHRoaXMudmFsdWVTZXR0ZXIodGhpcy5xdWlsbEVkaXRvciwgdGhpcy5jb250ZW50KVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgdHJpZ2dlcnMgY2hhbmdlIGRldGVjdGlvbi4gVGhlcmUncyBubyBzZW5zZSB0byBpbnZva2UgdGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGlmIGFueW9uZSBpc1xuICAgICAgLy8gbGlzdGVuaW5nIHRvIHRoZSBgb25FZGl0b3JDcmVhdGVkYCBldmVudCBpbnNpZGUgdGhlIHRlbXBsYXRlLCBmb3IgaW5zdGFuY2UgYDxxdWlsbC12aWV3IChvbkVkaXRvckNyZWF0ZWQpPVwiLi4uXCI+YC5cbiAgICAgIGlmICghdGhpcy5vbkVkaXRvckNyZWF0ZWQub2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHdpbGwgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCBgb25FZGl0b3JDcmVhdGVkYCB3aWxsIGFsc28gY2FsbCBgbWFya0RpcnR5KClgXG4gICAgICAvLyBpbnRlcm5hbGx5LCBzaW5jZSBBbmd1bGFyIHdyYXBzIHRlbXBsYXRlIGV2ZW50IGxpc3RlbmVycyBpbnRvIGBsaXN0ZW5lcmAgaW5zdHJ1Y3Rpb24uIFdlJ3JlIHVzaW5nIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYFxuICAgICAgLy8gdG8gcHJldmVudCB0aGUgZnJhbWUgZHJvcCBhbmQgYXZvaWQgYEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXJyb3JgIGVycm9yLlxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdGhpcy5vbkVkaXRvckNyZWF0ZWQuZW1pdCh0aGlzLnF1aWxsRWRpdG9yKVxuICAgICAgICB0aGlzLm9uRWRpdG9yQ3JlYXRlZC5jb21wbGV0ZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnF1aWxsU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpXG4gICAgdGhpcy5xdWlsbFN1YnNjcmlwdGlvbiA9IG51bGxcbiAgfVxufVxuIl19