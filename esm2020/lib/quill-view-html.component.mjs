import { DomSanitizer } from '@angular/platform-browser';
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./quill.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/platform-browser";
export class QuillViewHTMLComponent {
    constructor(sanitizer, service) {
        this.sanitizer = sanitizer;
        this.service = service;
        this.content = '';
        this.innerHTML = '';
        this.themeClass = 'ql-snow';
    }
    ngOnChanges(changes) {
        if (changes.theme) {
            const theme = changes.theme.currentValue || (this.service.config.theme ? this.service.config.theme : 'snow');
            this.themeClass = `ql-${theme} ngx-quill-view-html`;
        }
        else if (!this.theme) {
            const theme = this.service.config.theme ? this.service.config.theme : 'snow';
            this.themeClass = `ql-${theme} ngx-quill-view-html`;
        }
        if (changes.content) {
            const content = changes.content.currentValue;
            const sanitize = [true, false].includes(this.sanitize) ? this.sanitize : (this.service.config.sanitize || false);
            this.innerHTML = sanitize ? content : this.sanitizer.bypassSecurityTrustHtml(content);
        }
    }
}
QuillViewHTMLComponent.ɵfac = function QuillViewHTMLComponent_Factory(t) { return new (t || QuillViewHTMLComponent)(i0.ɵɵdirectiveInject(DomSanitizer), i0.ɵɵdirectiveInject(i1.QuillService)); };
QuillViewHTMLComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QuillViewHTMLComponent, selectors: [["quill-view-html"]], inputs: { content: "content", theme: "theme", sanitize: "sanitize" }, standalone: true, features: [i0.ɵɵNgOnChangesFeature, i0.ɵɵStandaloneFeature], decls: 2, vars: 2, consts: [[1, "ql-container", 3, "ngClass"], [1, "ql-editor", 3, "innerHTML"]], template: function QuillViewHTMLComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵelement(1, "div", 1);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("ngClass", ctx.themeClass);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("innerHTML", ctx.innerHTML, i0.ɵɵsanitizeHtml);
    } }, dependencies: [CommonModule, i2.NgClass], styles: [".ql-container.ngx-quill-view-html{border:0}\n"], encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillViewHTMLComponent, [{
        type: Component,
        args: [{ encapsulation: ViewEncapsulation.None, selector: 'quill-view-html', template: `
  <div class="ql-container" [ngClass]="themeClass">
    <div class="ql-editor" [innerHTML]="innerHTML">
    </div>
  </div>
`, standalone: true, imports: [CommonModule], styles: [".ql-container.ngx-quill-view-html{border:0}\n"] }]
    }], function () { return [{ type: i3.DomSanitizer, decorators: [{
                type: Inject,
                args: [DomSanitizer]
            }] }, { type: i1.QuillService }]; }, { content: [{
            type: Input
        }], theme: [{
            type: Input
        }], sanitize: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtdmlldy1odG1sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC0xNS1xdWlsbC0yL3NyYy9saWIvcXVpbGwtdmlldy1odG1sLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFZLE1BQU0sMkJBQTJCLENBQUE7QUFHbEUsT0FBTyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sS0FBSyxFQUdMLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQTtBQUN0QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUE7Ozs7O0FBbUI5QyxNQUFNLE9BQU8sc0JBQXNCO0lBUWpDLFlBQ2dDLFNBQXVCLEVBQzNDLE9BQXFCO1FBREQsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUMzQyxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBVHhCLFlBQU8sR0FBRyxFQUFFLENBQUE7UUFJckIsY0FBUyxHQUFhLEVBQUUsQ0FBQTtRQUN4QixlQUFVLEdBQUcsU0FBUyxDQUFBO0lBS25CLENBQUM7SUFFSixXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVHLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxLQUFLLHNCQUFzQixDQUFBO1NBQ3BEO2FBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtZQUM1RSxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sS0FBSyxzQkFBc0IsQ0FBQTtTQUNwRDtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNuQixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQTtZQUM1QyxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQTtZQUVoSCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3RGO0lBQ0gsQ0FBQzs7NEZBM0JVLHNCQUFzQix1QkFTdkIsWUFBWTt5RUFUWCxzQkFBc0I7UUFSakMsOEJBQWlEO1FBQy9DLHlCQUNNO1FBQ1IsaUJBQU07O1FBSG9CLHdDQUFzQjtRQUN2QixlQUF1QjtRQUF2Qiw0REFBdUI7d0JBS3RDLFlBQVk7dUZBRVgsc0JBQXNCO2NBakJsQyxTQUFTO2dDQUNPLGlCQUFpQixDQUFDLElBQUksWUFDM0IsaUJBQWlCLFlBTWpCOzs7OztDQUtYLGNBQ2EsSUFBSSxXQUNQLENBQUMsWUFBWSxDQUFDOztzQkFXcEIsTUFBTTt1QkFBQyxZQUFZO21EQVJiLE9BQU87a0JBQWYsS0FBSztZQUNHLEtBQUs7a0JBQWIsS0FBSztZQUNHLFFBQVE7a0JBQWhCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlcidcbmltcG9ydCB7IFF1aWxsU2VydmljZSB9IGZyb20gJy4vcXVpbGwuc2VydmljZSdcblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5cbkBDb21wb25lbnQoe1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzZWxlY3RvcjogJ3F1aWxsLXZpZXctaHRtbCcsXG4gIHN0eWxlczogW2Bcbi5xbC1jb250YWluZXIubmd4LXF1aWxsLXZpZXctaHRtbCB7XG4gIGJvcmRlcjogMDtcbn1cbmBdLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwicWwtY29udGFpbmVyXCIgW25nQ2xhc3NdPVwidGhlbWVDbGFzc1wiPlxuICAgIDxkaXYgY2xhc3M9XCJxbC1lZGl0b3JcIiBbaW5uZXJIVE1MXT1cImlubmVySFRNTFwiPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbmAsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIFF1aWxsVmlld0hUTUxDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBjb250ZW50ID0gJydcbiAgQElucHV0KCkgdGhlbWU/OiBzdHJpbmdcbiAgQElucHV0KCkgc2FuaXRpemU/OiBib29sZWFuXG5cbiAgaW5uZXJIVE1MOiBTYWZlSHRtbCA9ICcnXG4gIHRoZW1lQ2xhc3MgPSAncWwtc25vdydcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERvbVNhbml0aXplcikgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBwcm90ZWN0ZWQgc2VydmljZTogUXVpbGxTZXJ2aWNlXG4gICkge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMudGhlbWUpIHtcbiAgICAgIGNvbnN0IHRoZW1lID0gY2hhbmdlcy50aGVtZS5jdXJyZW50VmFsdWUgfHwgKHRoaXMuc2VydmljZS5jb25maWcudGhlbWUgPyB0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lIDogJ3Nub3cnKVxuICAgICAgdGhpcy50aGVtZUNsYXNzID0gYHFsLSR7dGhlbWV9IG5neC1xdWlsbC12aWV3LWh0bWxgXG4gICAgfSBlbHNlIGlmICghdGhpcy50aGVtZSkge1xuICAgICAgY29uc3QgdGhlbWUgPSB0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lID8gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA6ICdzbm93J1xuICAgICAgdGhpcy50aGVtZUNsYXNzID0gYHFsLSR7dGhlbWV9IG5neC1xdWlsbC12aWV3LWh0bWxgXG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLmNvbnRlbnQpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBjaGFuZ2VzLmNvbnRlbnQuY3VycmVudFZhbHVlXG4gICAgICBjb25zdCBzYW5pdGl6ZSA9IFt0cnVlLCBmYWxzZV0uaW5jbHVkZXModGhpcy5zYW5pdGl6ZSkgPyB0aGlzLnNhbml0aXplIDogKHRoaXMuc2VydmljZS5jb25maWcuc2FuaXRpemUgfHwgZmFsc2UpXG5cbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gc2FuaXRpemUgPyBjb250ZW50IDogdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoY29udGVudClcbiAgICB9XG4gIH1cbn1cbiJdfQ==