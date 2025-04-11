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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtcXVpbGwvc3JjL2xpYi9xdWlsbC12aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBR2hFLE9BQU8sRUFFTCxTQUFTLEVBRVQsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFdBQVcsRUFHWCxpQkFBaUIsRUFFakIsZUFBZSxFQUdoQixNQUFNLGVBQWUsQ0FBQTtBQUV0QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFJekMsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxXQUFXLENBQUE7QUFHekMsT0FBTyxFQUFDLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7OztBQWlCNUQsSUFBTSxrQkFBa0IsR0FBeEIsTUFBTSxrQkFBa0I7SUFxQjdCLFlBQ1MsVUFBc0IsRUFDbkIsUUFBbUIsRUFDbkIsSUFBWSxFQUNaLE9BQXFCLEVBQ3JCLFlBQTBCLEVBQ0wsVUFBZTtRQUx2QyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDTCxlQUFVLEdBQVYsVUFBVSxDQUFLO1FBbkJ2QyxXQUFNLEdBQUcsSUFBSSxDQUFBO1FBRWIsa0JBQWEsR0FBbUIsRUFBRSxDQUFBO1FBQ2xDLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQTtRQUVqQyxvQkFBZSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFBO1FBSTFELGFBQVEsR0FBRyxLQUFLLENBQUE7UUFFZixzQkFBaUIsR0FBd0IsSUFBSSxDQUFBO1FBV3JELGdCQUFXLEdBQUcsQ0FBQyxXQUFzQixFQUFFLEtBQVUsRUFBTyxFQUFFO1lBQ3hELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2pFLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQTtZQUNuQixJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7Z0JBQ3JCLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDN0I7aUJBQU07Z0JBQ0wsSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFO29CQUNyQixNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQTtvQkFDaEgsSUFBSSxRQUFRLEVBQUU7d0JBQ1osS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7cUJBQ2hFO29CQUNELE9BQU8sR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtpQkFDL0M7cUJBQU0sSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFO29CQUM1QixJQUFJO3dCQUNGLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO3FCQUM1QjtvQkFBQyxPQUFPLENBQUMsRUFBRTt3QkFDVixPQUFPLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO3FCQUM5QjtpQkFDRjtnQkFDRCxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ2pDO1FBQ0gsQ0FBQyxDQUFBO0lBdkJFLENBQUM7SUF5QkosV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE9BQU07U0FDUDtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtTQUNqRTtJQUNILENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDckMsT0FBTTtTQUNQO1FBRUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUNuRCxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUM3RixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNsQixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzlFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO1lBRXZCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQUU7Z0JBQzFDLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUN6RCxlQUFlLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUE7Z0JBQ2xELEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQ3ZDLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtZQUN0QixJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUMxRCxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO2FBQ2xDO1lBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtZQUMxQixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQ3JDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQ3JJO1lBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUU1RixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FDM0Qsc0JBQXNCLENBQ1IsQ0FBQTtZQUVoQixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUM1QyxLQUFLO29CQUNMLE9BQU87b0JBQ1AsT0FBTztvQkFDUCxRQUFRLEVBQUUsSUFBSTtvQkFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLEtBQUs7aUJBQ04sQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7WUFFRixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUE7WUFFekQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTthQUNuRDtZQUVELDZIQUE2SDtZQUM3SCxxSEFBcUg7WUFDckgsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFO2dCQUNsQyxPQUFNO2FBQ1A7WUFFRCwrR0FBK0c7WUFDL0csZ0lBQWdJO1lBQ2hJLDJGQUEyRjtZQUMzRixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQzdDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsQ0FBQTtRQUNyQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO0lBQy9CLENBQUM7O29GQWpJVSxrQkFBa0IsK01BMkJuQixXQUFXO3FFQTNCVixrQkFBa0I7UUFMM0IseUJBQThCO3dCQUd0QixZQUFZO0FBRVgsa0JBQWtCO0lBZjlCLFlBQVksRUFBRTtHQWVGLGtCQUFrQixDQWtJOUI7U0FsSVksa0JBQWtCO3VGQUFsQixrQkFBa0I7Y0FkOUIsU0FBUztnQ0FDTyxpQkFBaUIsQ0FBQyxJQUFJLFlBQzNCLFlBQVksWUFNWjs7Q0FFWCxjQUNhLElBQUksV0FDUCxDQUFDLFlBQVksQ0FBQzs7c0JBNkJwQixNQUFNO3VCQUFDLFdBQVc7d0JBMUJaLE1BQU07a0JBQWQsS0FBSztZQUNHLEtBQUs7a0JBQWIsS0FBSztZQUNHLE9BQU87a0JBQWYsS0FBSztZQUNHLEtBQUs7a0JBQWIsS0FBSztZQUNHLE9BQU87a0JBQWYsS0FBSztZQUNHLFFBQVE7a0JBQWhCLEtBQUs7WUFDRyxZQUFZO2tCQUFwQixLQUFLO1lBQ0csTUFBTTtrQkFBZCxLQUFLO1lBQ0csT0FBTztrQkFBZixLQUFLO1lBQ0csYUFBYTtrQkFBckIsS0FBSztZQUNHLGFBQWE7a0JBQXJCLEtBQUs7WUFFSSxlQUFlO2tCQUF4QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJ1xuaW1wb3J0IFF1aWxsVHlwZSBmcm9tICdxdWlsbCdcblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgT25DaGFuZ2VzLFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lLFxuICBTZWN1cml0eUNvbnRleHQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJ1xuaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycydcblxuaW1wb3J0IHtDdXN0b21PcHRpb24sIEN1c3RvbU1vZHVsZSwgUXVpbGxNb2R1bGVzLCBRdWlsbEJlZm9yZVJlbmRlcn0gZnJvbSAnbmd4LXF1aWxsL2NvbmZpZydcblxuaW1wb3J0IHtnZXRGb3JtYXQsIHJhZiR9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB7IFF1aWxsU2VydmljZSB9IGZyb20gJy4vcXVpbGwuc2VydmljZSdcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5pbXBvcnQge1VudGlsRGVzdHJveSwgdW50aWxEZXN0cm95ZWR9IGZyb20gXCJAbmduZWF0L3VudGlsLWRlc3Ryb3lcIjtcblxuQFVudGlsRGVzdHJveSgpXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc2VsZWN0b3I6ICdxdWlsbC12aWV3JyxcbiAgc3R5bGVzOiBbYFxuLnFsLWNvbnRhaW5lci5uZ3gtcXVpbGwtdmlldyB7XG4gIGJvcmRlcjogMDtcbn1cbmBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgcXVpbGwtdmlldy1lbGVtZW50PjwvZGl2PlxuYCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBmb3JtYXQ/OiAnb2JqZWN0JyB8ICdodG1sJyB8ICd0ZXh0JyB8ICdqc29uJ1xuICBASW5wdXQoKSB0aGVtZT86IHN0cmluZ1xuICBASW5wdXQoKSBtb2R1bGVzPzogUXVpbGxNb2R1bGVzXG4gIEBJbnB1dCgpIGRlYnVnPzogJ3dhcm4nIHwgJ2xvZycgfCAnZXJyb3InIHwgZmFsc2VcbiAgQElucHV0KCkgZm9ybWF0cz86IHN0cmluZ1tdIHwgbnVsbFxuICBASW5wdXQoKSBzYW5pdGl6ZT86IGJvb2xlYW5cbiAgQElucHV0KCkgYmVmb3JlUmVuZGVyPzogUXVpbGxCZWZvcmVSZW5kZXJcbiAgQElucHV0KCkgc3RyaWN0ID0gdHJ1ZVxuICBASW5wdXQoKSBjb250ZW50OiBhbnlcbiAgQElucHV0KCkgY3VzdG9tTW9kdWxlczogQ3VzdG9tTW9kdWxlW10gPSBbXVxuICBASW5wdXQoKSBjdXN0b21PcHRpb25zOiBDdXN0b21PcHRpb25bXSA9IFtdXG5cbiAgQE91dHB1dCgpIG9uRWRpdG9yQ3JlYXRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBxdWlsbEVkaXRvciE6IFF1aWxsVHlwZVxuICBlZGl0b3JFbGVtITogSFRNTEVsZW1lbnRcbiAgcHVibGljIHByZXNlcnZlID0gZmFsc2VcblxuICBwcml2YXRlIHF1aWxsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIHNlcnZpY2U6IFF1aWxsU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJvdGVjdGVkIHBsYXRmb3JtSWQ6IGFueSxcbiAgKSB7fVxuXG4gIHZhbHVlU2V0dGVyID0gKHF1aWxsRWRpdG9yOiBRdWlsbFR5cGUsIHZhbHVlOiBhbnkpOiBhbnkgPT4ge1xuICAgIGNvbnN0IGZvcm1hdCA9IGdldEZvcm1hdCh0aGlzLmZvcm1hdCwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXQpXG4gICAgbGV0IGNvbnRlbnQgPSB2YWx1ZVxuICAgIGlmIChmb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgcXVpbGxFZGl0b3Iuc2V0VGV4dChjb250ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZm9ybWF0ID09PSAnaHRtbCcpIHtcbiAgICAgICAgY29uc3Qgc2FuaXRpemUgPSBbdHJ1ZSwgZmFsc2VdLmluY2x1ZGVzKHRoaXMuc2FuaXRpemUpID8gdGhpcy5zYW5pdGl6ZSA6ICh0aGlzLnNlcnZpY2UuY29uZmlnLnNhbml0aXplIHx8IGZhbHNlKVxuICAgICAgICBpZiAoc2FuaXRpemUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZG9tU2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBjb250ZW50ID0gcXVpbGxFZGl0b3IuY2xpcGJvYXJkLmNvbnZlcnQodmFsdWUpXG4gICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29udGVudCA9IEpTT04ucGFyc2UodmFsdWUpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb250ZW50ID0gW3sgaW5zZXJ0OiB2YWx1ZSB9XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBxdWlsbEVkaXRvci5zZXRDb250ZW50cyhjb250ZW50KVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5jb250ZW50KSB7XG4gICAgICB0aGlzLnZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIGNoYW5nZXMuY29udGVudC5jdXJyZW50VmFsdWUpXG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24gPSB0aGlzLnNlcnZpY2UuZ2V0UXVpbGwoKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKFF1aWxsKSA9PiB0aGlzLnNlcnZpY2UuYmVmb3JlUmVuZGVyKFF1aWxsLCB0aGlzLmN1c3RvbU1vZHVsZXMsIHRoaXMuYmVmb3JlUmVuZGVyKSlcbiAgICApLnN1YnNjcmliZShRdWlsbCA9PiB7XG4gICAgICBjb25zdCBtb2R1bGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5tb2R1bGVzIHx8IHRoaXMuc2VydmljZS5jb25maWcubW9kdWxlcylcbiAgICAgIG1vZHVsZXMudG9vbGJhciA9IGZhbHNlXG5cbiAgICAgIHRoaXMuY3VzdG9tT3B0aW9ucy5mb3JFYWNoKChjdXN0b21PcHRpb24pID0+IHtcbiAgICAgICAgY29uc3QgbmV3Q3VzdG9tT3B0aW9uID0gUXVpbGwuaW1wb3J0KGN1c3RvbU9wdGlvbi5pbXBvcnQpXG4gICAgICAgIG5ld0N1c3RvbU9wdGlvbi53aGl0ZWxpc3QgPSBjdXN0b21PcHRpb24ud2hpdGVsaXN0XG4gICAgICAgIFF1aWxsLnJlZ2lzdGVyKG5ld0N1c3RvbU9wdGlvbiwgdHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGxldCBkZWJ1ZyA9IHRoaXMuZGVidWdcbiAgICAgIGlmICghZGVidWcgJiYgZGVidWcgIT09IGZhbHNlICYmIHRoaXMuc2VydmljZS5jb25maWcuZGVidWcpIHtcbiAgICAgICAgZGVidWcgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmRlYnVnXG4gICAgICB9XG5cbiAgICAgIGxldCBmb3JtYXRzID0gdGhpcy5mb3JtYXRzXG4gICAgICBpZiAoIWZvcm1hdHMgJiYgZm9ybWF0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZvcm1hdHMgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdHMgPyBbLi4udGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXRzXSA6ICh0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdHMgPT09IG51bGwgPyBudWxsIDogdW5kZWZpbmVkKVxuICAgICAgfVxuICAgICAgY29uc3QgdGhlbWUgPSB0aGlzLnRoZW1lIHx8ICh0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lID8gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA6ICdzbm93JylcblxuICAgICAgdGhpcy5lZGl0b3JFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJ1txdWlsbC12aWV3LWVsZW1lbnRdJ1xuICAgICAgKSBhcyBIVE1MRWxlbWVudFxuXG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yID0gbmV3IFF1aWxsKHRoaXMuZWRpdG9yRWxlbSwge1xuICAgICAgICAgIGRlYnVnLFxuICAgICAgICAgIGZvcm1hdHMsXG4gICAgICAgICAgbW9kdWxlcyxcbiAgICAgICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgICAgICBzdHJpY3Q6IHRoaXMuc3RyaWN0LFxuICAgICAgICAgIHRoZW1lXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWRpdG9yRWxlbSwgJ25neC1xdWlsbC12aWV3JylcblxuICAgICAgaWYgKHRoaXMuY29udGVudCgpKSB7XG4gICAgICAgIHRoaXMudmFsdWVTZXR0ZXIodGhpcy5xdWlsbEVkaXRvciwgdGhpcy5jb250ZW50KCkpXG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB0cmlnZ2VycyBjaGFuZ2UgZGV0ZWN0aW9uLiBUaGVyZSdzIG5vIHNlbnNlIHRvIGludm9rZSB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgaWYgYW55b25lIGlzXG4gICAgICAvLyBsaXN0ZW5pbmcgdG8gdGhlIGBvbkVkaXRvckNyZWF0ZWRgIGV2ZW50IGluc2lkZSB0aGUgdGVtcGxhdGUsIGZvciBpbnN0YW5jZSBgPHF1aWxsLXZpZXcgKG9uRWRpdG9yQ3JlYXRlZCk9XCIuLi5cIj5gLlxuICAgICAgaWYgKCF0aGlzLm9uRWRpdG9yQ3JlYXRlZC5vYnNlcnZlZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHdpbGwgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCBgb25FZGl0b3JDcmVhdGVkYCB3aWxsIGFsc28gY2FsbCBgbWFya0RpcnR5KClgXG4gICAgICAvLyBpbnRlcm5hbGx5LCBzaW5jZSBBbmd1bGFyIHdyYXBzIHRlbXBsYXRlIGV2ZW50IGxpc3RlbmVycyBpbnRvIGBsaXN0ZW5lcmAgaW5zdHJ1Y3Rpb24uIFdlJ3JlIHVzaW5nIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYFxuICAgICAgLy8gdG8gcHJldmVudCB0aGUgZnJhbWUgZHJvcCBhbmQgYXZvaWQgYEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXJyb3JgIGVycm9yLlxuICAgICAgcmFmJCgpLnBpcGUodW50aWxEZXN0cm95ZWQodGhpcykpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMub25FZGl0b3JDcmVhdGVkLmVtaXQodGhpcy5xdWlsbEVkaXRvcilcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKClcbiAgICB0aGlzLnF1aWxsU3Vic2NyaXB0aW9uID0gbnVsbFxuICB9XG59XG4iXX0=