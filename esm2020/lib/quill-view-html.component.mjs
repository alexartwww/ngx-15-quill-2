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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtdmlldy1odG1sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9zcmMvbGliL3F1aWxsLXZpZXctaHRtbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBWSxNQUFNLDJCQUEyQixDQUFBO0FBR2xFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssRUFHTCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUE7QUFDdEIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFBOzs7OztBQW1COUMsTUFBTSxPQUFPLHNCQUFzQjtJQVFqQyxZQUNnQyxTQUF1QixFQUMzQyxPQUFxQjtRQURELGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDM0MsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQVR4QixZQUFPLEdBQUcsRUFBRSxDQUFBO1FBSXJCLGNBQVMsR0FBYSxFQUFFLENBQUE7UUFDeEIsZUFBVSxHQUFHLFNBQVMsQ0FBQTtJQUtuQixDQUFDO0lBRUosV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNqQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1RyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sS0FBSyxzQkFBc0IsQ0FBQTtTQUNwRDthQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7WUFDNUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLEtBQUssc0JBQXNCLENBQUE7U0FDcEQ7UUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUE7WUFDNUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUE7WUFFaEgsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUN0RjtJQUNILENBQUM7OzRGQTNCVSxzQkFBc0IsdUJBU3ZCLFlBQVk7eUVBVFgsc0JBQXNCO1FBUmpDLDhCQUFpRDtRQUMvQyx5QkFDTTtRQUNSLGlCQUFNOztRQUhvQix3Q0FBc0I7UUFDdkIsZUFBdUI7UUFBdkIsNERBQXVCO3dCQUt0QyxZQUFZO3VGQUVYLHNCQUFzQjtjQWpCbEMsU0FBUztnQ0FDTyxpQkFBaUIsQ0FBQyxJQUFJLFlBQzNCLGlCQUFpQixZQU1qQjs7Ozs7Q0FLWCxjQUNhLElBQUksV0FDUCxDQUFDLFlBQVksQ0FBQzs7c0JBV3BCLE1BQU07dUJBQUMsWUFBWTttREFSYixPQUFPO2tCQUFmLEtBQUs7WUFDRyxLQUFLO2tCQUFiLEtBQUs7WUFDRyxRQUFRO2tCQUFoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5pbXBvcnQgeyBRdWlsbFNlcnZpY2UgfSBmcm9tICcuL3F1aWxsLnNlcnZpY2UnXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJ1xuXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc2VsZWN0b3I6ICdxdWlsbC12aWV3LWh0bWwnLFxuICBzdHlsZXM6IFtgXG4ucWwtY29udGFpbmVyLm5neC1xdWlsbC12aWV3LWh0bWwge1xuICBib3JkZXI6IDA7XG59XG5gXSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInFsLWNvbnRhaW5lclwiIFtuZ0NsYXNzXT1cInRoZW1lQ2xhc3NcIj5cbiAgICA8ZGl2IGNsYXNzPVwicWwtZWRpdG9yXCIgW2lubmVySFRNTF09XCJpbm5lckhUTUxcIj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBRdWlsbFZpZXdIVE1MQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgY29udGVudCA9ICcnXG4gIEBJbnB1dCgpIHRoZW1lPzogc3RyaW5nXG4gIEBJbnB1dCgpIHNhbml0aXplPzogYm9vbGVhblxuXG4gIGlubmVySFRNTDogU2FmZUh0bWwgPSAnJ1xuICB0aGVtZUNsYXNzID0gJ3FsLXNub3cnXG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChEb21TYW5pdGl6ZXIpIHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgcHJvdGVjdGVkIHNlcnZpY2U6IFF1aWxsU2VydmljZVxuICApIHt9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLnRoZW1lKSB7XG4gICAgICBjb25zdCB0aGVtZSA9IGNoYW5nZXMudGhlbWUuY3VycmVudFZhbHVlIHx8ICh0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lID8gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA6ICdzbm93JylcbiAgICAgIHRoaXMudGhlbWVDbGFzcyA9IGBxbC0ke3RoZW1lfSBuZ3gtcXVpbGwtdmlldy1odG1sYFxuICAgIH0gZWxzZSBpZiAoIXRoaXMudGhlbWUpIHtcbiAgICAgIGNvbnN0IHRoZW1lID0gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA/IHRoaXMuc2VydmljZS5jb25maWcudGhlbWUgOiAnc25vdydcbiAgICAgIHRoaXMudGhlbWVDbGFzcyA9IGBxbC0ke3RoZW1lfSBuZ3gtcXVpbGwtdmlldy1odG1sYFxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5jb250ZW50KSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gY2hhbmdlcy5jb250ZW50LmN1cnJlbnRWYWx1ZVxuICAgICAgY29uc3Qgc2FuaXRpemUgPSBbdHJ1ZSwgZmFsc2VdLmluY2x1ZGVzKHRoaXMuc2FuaXRpemUpID8gdGhpcy5zYW5pdGl6ZSA6ICh0aGlzLnNlcnZpY2UuY29uZmlnLnNhbml0aXplIHx8IGZhbHNlKVxuXG4gICAgICB0aGlzLmlubmVySFRNTCA9IHNhbml0aXplID8gY29udGVudCA6IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKGNvbnRlbnQpXG4gICAgfVxuICB9XG59XG4iXX0=