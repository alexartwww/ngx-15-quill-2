var QuillEditorBase_1;
import { __decorate } from "tslib";
import { CommonModule, DOCUMENT, isPlatformServer } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Output, PLATFORM_ID, Renderer2, SecurityContext, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { defaultModules } from 'ngx-15-quill-2/config';
import { getFormat, raf$ } from './helpers';
import { QuillService } from './quill.service';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "./quill.service";
import * as i3 from "@angular/common";
function QuillEditorComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 1);
} }
function QuillEditorComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 1);
} }
const _c0 = [[["", "above-quill-editor-toolbar", ""]], [["", "quill-editor-toolbar", ""]], [["", "below-quill-editor-toolbar", ""]]];
const _c1 = ["[above-quill-editor-toolbar]", "[quill-editor-toolbar]", "[below-quill-editor-toolbar]"];
let QuillEditorBase = QuillEditorBase_1 = class QuillEditorBase {
    constructor(injector, elementRef, cd, domSanitizer, platformId, renderer, zone, service) {
        this.elementRef = elementRef;
        this.cd = cd;
        this.domSanitizer = domSanitizer;
        this.platformId = platformId;
        this.renderer = renderer;
        this.zone = zone;
        this.service = service;
        this.required = false;
        this.customToolbarPosition = 'top';
        this.styles = null;
        this.strict = true;
        this.customOptions = [];
        this.customModules = [];
        this.preserveWhitespace = false;
        this.trimOnValidation = false;
        this.compareValues = false;
        this.filterNull = false;
        /*
        https://github.com/KillerCodeMonkey/ngx-quill/issues/1257 - fix null value set
      
        provide default empty value
        by default null
      
        e.g. defaultEmptyValue="" - empty string
      
        <quill-editor
          defaultEmptyValue=""
          formControlName="message"
        ></quill-editor>
        */
        this.defaultEmptyValue = null;
        this.onEditorCreated = new EventEmitter();
        this.onEditorChanged = new EventEmitter();
        this.onContentChanged = new EventEmitter();
        this.onSelectionChanged = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onNativeFocus = new EventEmitter();
        this.onNativeBlur = new EventEmitter();
        this.disabled = false; // used to store initial value before ViewInit
        this.preserve = false;
        this.toolbarPosition = 'top';
        this.subscription = null;
        this.quillSubscription = null;
        this.valueGetter = (quillEditor) => {
            let html = quillEditor.getSemanticHTML();
            if (this.isEmptyValue(html)) {
                html = this.defaultEmptyValue();
            }
            let modelValue = html;
            const format = getFormat(this.format, this.service.config.format);
            if (format === 'text') {
                modelValue = quillEditor.getText();
            }
            else if (format === 'object') {
                modelValue = quillEditor.getContents();
            }
            else if (format === 'json') {
                try {
                    modelValue = JSON.stringify(quillEditor.getContents());
                }
                catch (e) {
                    modelValue = quillEditor.getText();
                }
            }
            return modelValue;
        };
        this.valueSetter = (quillEditor, value) => {
            const format = getFormat(this.format, this.service.config.format);
            if (format === 'html') {
                const sanitize = [true, false].includes(this.sanitize) ? this.sanitize : (this.service.config.sanitize || false);
                if (sanitize) {
                    value = this.domSanitizer.sanitize(SecurityContext.HTML, value);
                }
                return quillEditor.clipboard.convert({ html: value });
            }
            else if (format === 'json') {
                try {
                    return JSON.parse(value);
                }
                catch (e) {
                    return [{ insert: value }];
                }
            }
            return value;
        };
        this.selectionChangeHandler = (range, oldRange, source) => {
            const trackChanges = this.trackChanges || this.service.config.trackChanges;
            const shouldTriggerOnModelTouched = !range && !!this.onModelTouched && (source === 'user' || trackChanges && trackChanges === 'all');
            // only emit changes when there's any listener
            if (!this.onBlur.observed &&
                !this.onFocus.observed &&
                !this.onSelectionChanged.observed &&
                !shouldTriggerOnModelTouched) {
                return;
            }
            this.zone.run(() => {
                if (range === null) {
                    this.onBlur.emit({
                        editor: this.quillEditor,
                        source
                    });
                }
                else if (oldRange === null) {
                    this.onFocus.emit({
                        editor: this.quillEditor,
                        source
                    });
                }
                this.onSelectionChanged.emit({
                    editor: this.quillEditor,
                    oldRange,
                    range,
                    source
                });
                if (shouldTriggerOnModelTouched) {
                    this.onModelTouched();
                }
                this.cd.markForCheck();
            });
        };
        this.textChangeHandler = (delta, oldDelta, source) => {
            // only emit changes emitted by user interactions
            const text = this.quillEditor.getText();
            const content = this.quillEditor.getContents();
            let html = this.quillEditor.getSemanticHTML();
            if (this.isEmptyValue(html)) {
                html = this.defaultEmptyValue();
            }
            const trackChanges = this.trackChanges || this.service.config.trackChanges;
            const shouldTriggerOnModelChange = (source === 'user' || trackChanges && trackChanges === 'all') && !!this.onModelChange;
            // only emit changes when there's any listener
            if (!this.onContentChanged.observed && !shouldTriggerOnModelChange) {
                return;
            }
            this.zone.run(() => {
                if (shouldTriggerOnModelChange) {
                    const valueGetter = this.valueGetter;
                    this.onModelChange(valueGetter(this.quillEditor));
                }
                this.onContentChanged.emit({
                    content,
                    delta,
                    editor: this.quillEditor,
                    html,
                    oldDelta,
                    source,
                    text
                });
                this.cd.markForCheck();
            });
        };
        this.editorChangeHandler = (event, current, old, source) => {
            // only emit changes when there's any listener
            if (!this.onEditorChanged.observed) {
                return;
            }
            // only emit changes emitted by user interactions
            if (event === 'text-change') {
                const text = this.quillEditor.getText();
                const content = this.quillEditor.getContents();
                let html = this.quillEditor.getSemanticHTML();
                if (this.isEmptyValue(html)) {
                    html = this.defaultEmptyValue();
                }
                this.zone.run(() => {
                    this.onEditorChanged.emit({
                        content,
                        delta: current,
                        editor: this.quillEditor,
                        event,
                        html,
                        oldDelta: old,
                        source,
                        text
                    });
                    this.cd.markForCheck();
                });
            }
            else {
                this.zone.run(() => {
                    this.onEditorChanged.emit({
                        editor: this.quillEditor,
                        event,
                        oldRange: old,
                        range: current,
                        source
                    });
                    this.cd.markForCheck();
                });
            }
        };
        this.document = injector.get(DOCUMENT);
    }
    static normalizeClassNames(classes) {
        const classList = classes.trim().split(' ');
        return classList.reduce((prev, cur) => {
            const trimmed = cur.trim();
            if (trimmed) {
                prev.push(trimmed);
            }
            return prev;
        }, []);
    }
    ngOnInit() {
        this.preserve = this.preserveWhitespace;
        this.toolbarPosition = this.customToolbarPosition;
    }
    ngAfterViewInit() {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        // The `quill-editor` component might be destroyed before the `quill` chunk is loaded and its code is executed
        // this will lead to runtime exceptions, since the code will be executed on DOM nodes that don't exist within the tree.
        this.quillSubscription = this.service.getQuill().pipe(mergeMap((Quill) => this.service.beforeRender(Quill, this.customModules, this.beforeRender))).subscribe(Quill => {
            this.editorElem = this.elementRef.nativeElement.querySelector('[quill-editor-element]');
            const toolbarElem = this.elementRef.nativeElement.querySelector('[quill-editor-toolbar]');
            const modules = Object.assign({}, this.modules || this.service.config.modules);
            if (toolbarElem) {
                modules.toolbar = toolbarElem;
            }
            else if (modules.toolbar === undefined) {
                modules.toolbar = defaultModules.toolbar;
            }
            let placeholder = this.placeholder !== undefined ? this.placeholder : this.service.config.placeholder;
            if (placeholder === undefined) {
                placeholder = 'Insert text here ...';
            }
            const styles = this.styles;
            if (styles) {
                Object.keys(styles).forEach((key) => {
                    this.renderer.setStyle(this.editorElem, key, styles[key]);
                });
            }
            if (this.classes) {
                this.addClasses(this.classes);
            }
            this.customOptions.forEach((customOption) => {
                const newCustomOption = Quill.import(customOption.import);
                newCustomOption.whitelist = customOption.whitelist;
                Quill.register(newCustomOption, true);
            });
            let bounds = this.bounds && this.bounds === 'self' ? this.editorElem : this.bounds;
            if (!bounds) {
                bounds = this.service.config.bounds ? this.service.config.bounds : this.document.body;
            }
            let debug = this.debug;
            if (!debug && debug !== false && this.service.config.debug) {
                debug = this.service.config.debug;
            }
            let readOnly = this.readOnly;
            if (!readOnly && this.readOnly !== false) {
                readOnly = this.service.config.readOnly !== undefined ? this.service.config.readOnly : false;
            }
            let formats = this.formats;
            if (!formats && formats === undefined) {
                formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined);
            }
            this.zone.runOutsideAngular(() => {
                this.quillEditor = new Quill(this.editorElem, {
                    bounds,
                    debug,
                    formats,
                    modules,
                    placeholder,
                    readOnly,
                    registry: this.registry,
                    theme: this.theme || (this.service.config.theme ? this.service.config.theme : 'snow')
                });
                if (this.onNativeBlur.observed) {
                    // https://github.com/quilljs/quill/issues/2186#issuecomment-533401328
                    fromEvent(this.quillEditor.scroll.domNode, 'blur').pipe(untilDestroyed(this)).subscribe(() => this.onNativeBlur.next({
                        editor: this.quillEditor,
                        source: 'dom'
                    }));
                    // https://github.com/quilljs/quill/issues/2186#issuecomment-803257538
                    const toolbar = this.quillEditor.getModule('toolbar');
                    if (toolbar.container) {
                        fromEvent(toolbar.container, 'mousedown').pipe(untilDestroyed(this)).subscribe(e => e.preventDefault());
                    }
                }
                if (this.onNativeFocus.observed) {
                    fromEvent(this.quillEditor.scroll.domNode, 'focus').pipe(untilDestroyed(this)).subscribe(() => this.onNativeFocus.next({
                        editor: this.quillEditor,
                        source: 'dom'
                    }));
                }
                // Set optional link placeholder, Quill has no native API for it so using workaround
                if (this.linkPlaceholder) {
                    const tooltip = this.quillEditor?.theme?.tooltip;
                    const input = tooltip?.root?.querySelector('input[data-link]');
                    if (input?.dataset) {
                        input.dataset.link = this.linkPlaceholder;
                    }
                }
            });
            if (this.content) {
                const format = getFormat(this.format, this.service.config.format);
                if (format === 'text') {
                    this.quillEditor.setText(this.content, 'silent');
                }
                else {
                    const valueSetter = this.valueSetter;
                    const newValue = valueSetter(this.quillEditor, this.content);
                    this.quillEditor.setContents(newValue, 'silent');
                }
                const history = this.quillEditor.getModule('history');
                history.clear();
            }
            // initialize disabled status based on this.disabled as default value
            this.setDisabledState();
            this.addQuillEventListeners();
            // The `requestAnimationFrame` triggers change detection. There's no sense to invoke the `requestAnimationFrame` if anyone is
            // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
            if (!this.onEditorCreated.observed && !this.onValidatorChanged) {
                return;
            }
            // The `requestAnimationFrame` will trigger change detection and `onEditorCreated` will also call `markDirty()`
            // internally, since Angular wraps template event listeners into `listener` instruction. We're using the `requestAnimationFrame`
            // to prevent the frame drop and avoid `ExpressionChangedAfterItHasBeenCheckedError` error.
            raf$().pipe(untilDestroyed(this)).subscribe(() => {
                if (this.onValidatorChanged) {
                    this.onValidatorChanged();
                }
                this.onEditorCreated.emit(this.quillEditor);
            });
        });
    }
    ngOnDestroy() {
        this.dispose();
        this.quillSubscription?.unsubscribe();
        this.quillSubscription = null;
    }
    ngOnChanges(changes) {
        if (!this.quillEditor) {
            return;
        }
        /* eslint-disable @typescript-eslint/dot-notation */
        if (changes.readOnly) {
            this.quillEditor.enable(!changes.readOnly.currentValue);
        }
        if (changes.placeholder) {
            this.quillEditor.root.dataset.placeholder =
                changes.placeholder.currentValue;
        }
        if (changes.styles) {
            const currentStyling = changes.styles.currentValue;
            const previousStyling = changes.styles.previousValue;
            if (previousStyling) {
                Object.keys(previousStyling).forEach((key) => {
                    this.renderer.removeStyle(this.editorElem, key);
                });
            }
            if (currentStyling) {
                Object.keys(currentStyling).forEach((key) => {
                    this.renderer.setStyle(this.editorElem, key, this.styles[key]);
                });
            }
        }
        if (changes.classes) {
            const currentClasses = changes.classes.currentValue;
            const previousClasses = changes.classes.previousValue;
            if (previousClasses) {
                this.removeClasses(previousClasses);
            }
            if (currentClasses) {
                this.addClasses(currentClasses);
            }
        }
        // We'd want to re-apply event listeners if the `debounceTime` binding changes to apply the
        // `debounceTime` operator or vice-versa remove it.
        if (changes.debounceTime) {
            this.addQuillEventListeners();
        }
        /* eslint-enable @typescript-eslint/dot-notation */
    }
    addClasses(classList) {
        QuillEditorBase_1.normalizeClassNames(classList).forEach((c) => {
            this.renderer.addClass(this.editorElem, c);
        });
    }
    removeClasses(classList) {
        QuillEditorBase_1.normalizeClassNames(classList).forEach((c) => {
            this.renderer.removeClass(this.editorElem, c);
        });
    }
    writeValue(currentValue) {
        // optional fix for https://github.com/angular/angular/issues/14988
        if (this.filterNull && currentValue === null) {
            return;
        }
        this.content = currentValue;
        if (!this.quillEditor) {
            return;
        }
        const format = getFormat(this.format, this.service.config.format);
        const valueSetter = this.valueSetter;
        const newValue = valueSetter(this.quillEditor, currentValue);
        if (this.compareValues) {
            const currentEditorValue = this.quillEditor.getContents();
            if (JSON.stringify(currentEditorValue) === JSON.stringify(newValue)) {
                return;
            }
        }
        if (currentValue) {
            if (format === 'text') {
                this.quillEditor.setText(currentValue);
            }
            else {
                this.quillEditor.setContents(newValue);
            }
            return;
        }
        this.quillEditor.setText('');
    }
    setDisabledState(isDisabled = this.disabled) {
        // store initial value to set appropriate disabled status after ViewInit
        this.disabled = isDisabled;
        if (this.quillEditor) {
            if (isDisabled) {
                this.quillEditor.disable();
                this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'disabled');
            }
            else {
                if (!this.readOnly) {
                    this.quillEditor.enable();
                }
                this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
            }
        }
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    registerOnValidatorChange(fn) {
        this.onValidatorChanged = fn;
    }
    validate() {
        if (!this.quillEditor) {
            return null;
        }
        const err = {};
        let valid = true;
        const text = this.quillEditor.getText();
        // trim text if wanted + handle special case that an empty editor contains a new line
        const textLength = this.trimOnValidation ? text.trim().length : (text.length === 1 && text.trim().length === 0 ? 0 : text.length - 1);
        const deltaOperations = this.quillEditor.getContents().ops;
        const onlyEmptyOperation = !!deltaOperations && deltaOperations.length === 1 && ['\n', ''].includes(deltaOperations[0].insert?.toString());
        if (this.minLength && textLength && textLength < this.minLength) {
            err.minLengthError = {
                given: textLength,
                minLength: this.minLength
            };
            valid = false;
        }
        if (this.maxLength && textLength > this.maxLength) {
            err.maxLengthError = {
                given: textLength,
                maxLength: this.maxLength
            };
            valid = false;
        }
        if (this.required && !textLength && onlyEmptyOperation) {
            err.requiredError = {
                empty: true
            };
            valid = false;
        }
        return valid ? null : err;
    }
    addQuillEventListeners() {
        this.dispose();
        // We have to enter the `<root>` zone when adding event listeners, so `debounceTime` will spawn the
        // `AsyncAction` there w/o triggering change detections. We still re-enter the Angular's zone through
        // `zone.run` when we emit an event to the parent component.
        this.zone.runOutsideAngular(() => {
            this.subscription = new Subscription();
            this.subscription.add(
            // mark model as touched if editor lost focus
            fromEvent(this.quillEditor, 'selection-change').subscribe(([range, oldRange, source]) => {
                this.selectionChangeHandler(range, oldRange, source);
            }));
            // The `fromEvent` supports passing JQuery-style event targets, the editor has `on` and `off` methods which
            // will be invoked upon subscription and teardown.
            let textChange$ = fromEvent(this.quillEditor, 'text-change');
            let editorChange$ = fromEvent(this.quillEditor, 'editor-change');
            if (typeof this.debounceTime === 'number') {
                textChange$ = textChange$.pipe(debounceTime(this.debounceTime));
                editorChange$ = editorChange$.pipe(debounceTime(this.debounceTime));
            }
            this.subscription.add(
            // update model if text changes
            textChange$.subscribe(([delta, oldDelta, source]) => {
                this.textChangeHandler(delta, oldDelta, source);
            }));
            this.subscription.add(
            // triggered if selection or text changed
            editorChange$.subscribe(([event, current, old, source]) => {
                this.editorChangeHandler(event, current, old, source);
            }));
        });
    }
    dispose() {
        if (this.subscription !== null) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
    isEmptyValue(html) {
        return html === '<p></p>' || html === '<div></div>' || html === '<p><br></p>' || html === '<div><br></div>';
    }
};
QuillEditorBase.ɵfac = function QuillEditorBase_Factory(t) { return new (t || QuillEditorBase)(i0.ɵɵdirectiveInject(i0.Injector), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.ChangeDetectorRef), i0.ɵɵdirectiveInject(i1.DomSanitizer), i0.ɵɵdirectiveInject(PLATFORM_ID), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i2.QuillService)); };
QuillEditorBase.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QuillEditorBase, inputs: { format: "format", theme: "theme", modules: "modules", debug: "debug", readOnly: "readOnly", placeholder: "placeholder", maxLength: "maxLength", minLength: "minLength", required: "required", formats: "formats", customToolbarPosition: "customToolbarPosition", sanitize: "sanitize", beforeRender: "beforeRender", styles: "styles", strict: "strict", scrollingContainer: "scrollingContainer", bounds: "bounds", customOptions: "customOptions", customModules: "customModules", trackChanges: "trackChanges", preserveWhitespace: "preserveWhitespace", classes: "classes", trimOnValidation: "trimOnValidation", linkPlaceholder: "linkPlaceholder", compareValues: "compareValues", filterNull: "filterNull", debounceTime: "debounceTime", registry: "registry", defaultEmptyValue: "defaultEmptyValue", valueGetter: "valueGetter", valueSetter: "valueSetter" }, outputs: { onEditorCreated: "onEditorCreated", onEditorChanged: "onEditorChanged", onContentChanged: "onContentChanged", onSelectionChanged: "onSelectionChanged", onFocus: "onFocus", onBlur: "onBlur", onNativeFocus: "onNativeFocus", onNativeBlur: "onNativeBlur" }, features: [i0.ɵɵNgOnChangesFeature] });
QuillEditorBase = QuillEditorBase_1 = __decorate([
    UntilDestroy()
], QuillEditorBase);
export { QuillEditorBase };
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillEditorBase, [{
        type: Directive
    }], function () { return [{ type: i0.Injector }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.DomSanitizer }, { type: undefined, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i2.QuillService }]; }, { format: [{
            type: Input
        }], theme: [{
            type: Input
        }], modules: [{
            type: Input
        }], debug: [{
            type: Input
        }], readOnly: [{
            type: Input
        }], placeholder: [{
            type: Input
        }], maxLength: [{
            type: Input
        }], minLength: [{
            type: Input
        }], required: [{
            type: Input
        }], formats: [{
            type: Input
        }], customToolbarPosition: [{
            type: Input
        }], sanitize: [{
            type: Input
        }], beforeRender: [{
            type: Input
        }], styles: [{
            type: Input
        }], strict: [{
            type: Input
        }], scrollingContainer: [{
            type: Input
        }], bounds: [{
            type: Input
        }], customOptions: [{
            type: Input
        }], customModules: [{
            type: Input
        }], trackChanges: [{
            type: Input
        }], preserveWhitespace: [{
            type: Input
        }], classes: [{
            type: Input
        }], trimOnValidation: [{
            type: Input
        }], linkPlaceholder: [{
            type: Input
        }], compareValues: [{
            type: Input
        }], filterNull: [{
            type: Input
        }], debounceTime: [{
            type: Input
        }], registry: [{
            type: Input
        }], defaultEmptyValue: [{
            type: Input
        }], onEditorCreated: [{
            type: Output
        }], onEditorChanged: [{
            type: Output
        }], onContentChanged: [{
            type: Output
        }], onSelectionChanged: [{
            type: Output
        }], onFocus: [{
            type: Output
        }], onBlur: [{
            type: Output
        }], onNativeFocus: [{
            type: Output
        }], onNativeBlur: [{
            type: Output
        }], valueGetter: [{
            type: Input
        }], valueSetter: [{
            type: Input
        }] }); })();
export class QuillEditorComponent extends QuillEditorBase {
    constructor(injector, elementRef, cd, domSanitizer, platformId, renderer, zone, service) {
        super(injector, elementRef, cd, domSanitizer, platformId, renderer, zone, service);
    }
}
QuillEditorComponent.ɵfac = function QuillEditorComponent_Factory(t) { return new (t || QuillEditorComponent)(i0.ɵɵdirectiveInject(i0.Injector), i0.ɵɵdirectiveInject(ElementRef), i0.ɵɵdirectiveInject(ChangeDetectorRef), i0.ɵɵdirectiveInject(DomSanitizer), i0.ɵɵdirectiveInject(PLATFORM_ID), i0.ɵɵdirectiveInject(Renderer2), i0.ɵɵdirectiveInject(NgZone), i0.ɵɵdirectiveInject(QuillService)); };
QuillEditorComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QuillEditorComponent, selectors: [["quill-editor"]], standalone: true, features: [i0.ɵɵProvidersFeature([
            {
                multi: true,
                provide: NG_VALUE_ACCESSOR,
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                useExisting: forwardRef(() => QuillEditorComponent)
            },
            {
                multi: true,
                provide: NG_VALIDATORS,
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                useExisting: forwardRef(() => QuillEditorComponent)
            }
        ]), i0.ɵɵInheritDefinitionFeature, i0.ɵɵStandaloneFeature], ngContentSelectors: _c1, decls: 5, vars: 2, consts: [["quill-editor-element", "", 4, "ngIf"], ["quill-editor-element", ""]], template: function QuillEditorComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef(_c0);
        i0.ɵɵtemplate(0, QuillEditorComponent_div_0_Template, 1, 0, "div", 0);
        i0.ɵɵprojection(1);
        i0.ɵɵprojection(2, 1);
        i0.ɵɵprojection(3, 2);
        i0.ɵɵtemplate(4, QuillEditorComponent_div_4_Template, 1, 0, "div", 0);
    } if (rf & 2) {
        i0.ɵɵproperty("ngIf", ctx.toolbarPosition !== "top");
        i0.ɵɵadvance(4);
        i0.ɵɵproperty("ngIf", ctx.toolbarPosition === "top");
    } }, dependencies: [CommonModule, i3.NgIf], styles: ["[_nghost-%COMP%]{display:inline-block}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillEditorComponent, [{
        type: Component,
        args: [{ encapsulation: ViewEncapsulation.Emulated, providers: [
                    {
                        multi: true,
                        provide: NG_VALUE_ACCESSOR,
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        useExisting: forwardRef(() => QuillEditorComponent)
                    },
                    {
                        multi: true,
                        provide: NG_VALIDATORS,
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        useExisting: forwardRef(() => QuillEditorComponent)
                    }
                ], selector: 'quill-editor', template: `
    <div *ngIf="toolbarPosition !== 'top'" quill-editor-element></div>
    <ng-content select="[above-quill-editor-toolbar]"></ng-content>
    <ng-content select="[quill-editor-toolbar]"></ng-content>
    <ng-content select="[below-quill-editor-toolbar]"></ng-content>
    <div *ngIf="toolbarPosition === 'top'" quill-editor-element></div>
  `, standalone: true, imports: [CommonModule], styles: [":host{display:inline-block}\n"] }]
    }], function () { return [{ type: i0.Injector }, { type: i0.ElementRef, decorators: [{
                type: Inject,
                args: [ElementRef]
            }] }, { type: i0.ChangeDetectorRef, decorators: [{
                type: Inject,
                args: [ChangeDetectorRef]
            }] }, { type: i1.DomSanitizer, decorators: [{
                type: Inject,
                args: [DomSanitizer]
            }] }, { type: undefined, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: i0.Renderer2, decorators: [{
                type: Inject,
                args: [Renderer2]
            }] }, { type: i0.NgZone, decorators: [{
                type: Inject,
                args: [NgZone]
            }] }, { type: i2.QuillService, decorators: [{
                type: Inject,
                args: [QuillService]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC0xNS1xdWlsbC0yL3NyYy9saWIvcXVpbGwtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFDLE1BQU0saUJBQWlCLENBQUE7QUFDeEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBTXhELE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBRU4sS0FBSyxFQUNMLE1BQU0sRUFJTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxlQUFlLEVBRWYsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFBO0FBQ3RCLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFFdkQsT0FBTyxFQUF3QixhQUFhLEVBQUUsaUJBQWlCLEVBQWEsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVsRyxPQUFPLEVBQThCLGNBQWMsRUFBbUMsTUFBTSx1QkFBdUIsQ0FBQTtBQUluSCxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDOUMsT0FBTyxFQUFDLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7O0lBMHNCL0QseUJBQWtFOzs7SUFJbEUseUJBQWtFOzs7O0FBdHFCL0QsSUFBZSxlQUFlLHVCQUE5QixNQUFlLGVBQWU7SUFxRW5DLFlBQ0UsUUFBa0Is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RSxJQUFJO2dCQUNYLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixtRUFBbUU7Z0JBQ25FLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUM7YUFDcEQ7U0FDRjs7UUFHQyxxRUFBa0U7UUFDbEUsa0JBQStEO1FBQy9ELHFCQUF5RDtRQUN6RCxxQkFBK0Q7UUFDL0QscUVBQWtFOztRQUo1RCxvREFBK0I7UUFJL0IsZUFBK0I7UUFBL0Isb0RBQStCO3dCQVU3QixZQUFZO3VGQUVYLG9CQUFvQjtjQWxDaEMsU0FBUztnQ0FDTyxpQkFBaUIsQ0FBQyxRQUFRLGFBQzlCO29CQUNUO3dCQUNFLEtBQUssRUFBRSxJQUFJO3dCQUNYLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLG1FQUFtRTt3QkFDbkUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLENBQUM7cUJBQ3BEO29CQUNEO3dCQUNFLEtBQUssRUFBRSxJQUFJO3dCQUNYLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixtRUFBbUU7d0JBQ25FLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLHFCQUFxQixDQUFDO3FCQUNwRDtpQkFDRixZQUNTLGNBQWMsWUFDZDs7Ozs7O0dBTVQsY0FRVyxJQUFJLFdBQ1AsQ0FBQyxZQUFZLENBQUM7O3NCQU1wQixNQUFNO3VCQUFDLFVBQVU7O3NCQUNqQixNQUFNO3VCQUFDLGlCQUFpQjs7c0JBQ3hCLE1BQU07dUJBQUMsWUFBWTs7c0JBQ25CLE1BQU07dUJBQUMsV0FBVzs7c0JBQ2xCLE1BQU07dUJBQUMsU0FBUzs7c0JBQ2hCLE1BQU07dUJBQUMsTUFBTTs7c0JBQ2IsTUFBTTt1QkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21tb25Nb2R1bGUsIERPQ1VNRU5ULCBpc1BsYXRmb3JtU2VydmVyfSBmcm9tICdAYW5ndWxhci9jb21tb24nXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJ1xuXG5pbXBvcnQgdHlwZSBRdWlsbFR5cGUgZnJvbSAncXVpbGwnXG5pbXBvcnQgdHlwZSB7IFF1aWxsT3B0aW9ucyB9IGZyb20gJ3F1aWxsJ1xuaW1wb3J0IHR5cGUgRGVsdGFUeXBlIGZyb20gJ3F1aWxsLWRlbHRhJ1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBTZWN1cml0eUNvbnRleHQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5cbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxJREFUT1JTLCBOR19WQUxVRV9BQ0NFU1NPUiwgVmFsaWRhdG9yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnXG5cbmltcG9ydCB7IEN1c3RvbU1vZHVsZSwgQ3VzdG9tT3B0aW9uLCBkZWZhdWx0TW9kdWxlcywgUXVpbGxCZWZvcmVSZW5kZXIsIFF1aWxsTW9kdWxlcyB9IGZyb20gJ25neC0xNS1xdWlsbC0yL2NvbmZpZydcblxuaW1wb3J0IHR5cGUgSGlzdG9yeSBmcm9tICdxdWlsbC9tb2R1bGVzL2hpc3RvcnknXG5pbXBvcnQgdHlwZSBUb29sYmFyIGZyb20gJ3F1aWxsL21vZHVsZXMvdG9vbGJhcidcbmltcG9ydCB7IGdldEZvcm1hdCwgcmFmJCB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB7IFF1aWxsU2VydmljZSB9IGZyb20gJy4vcXVpbGwuc2VydmljZSdcbmltcG9ydCB7VW50aWxEZXN0cm95LCB1bnRpbERlc3Ryb3llZH0gZnJvbSBcIkBuZ25lYXQvdW50aWwtZGVzdHJveVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlIHtcbiAgaW5kZXg6IG51bWJlclxuICBsZW5ndGg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRlbnRDaGFuZ2Uge1xuICBjb250ZW50OiBEZWx0YVR5cGVcbiAgZGVsdGE6IERlbHRhVHlwZVxuICBlZGl0b3I6IFF1aWxsVHlwZVxuICBodG1sOiBzdHJpbmcgfCBudWxsXG4gIG9sZERlbHRhOiBEZWx0YVR5cGVcbiAgc291cmNlOiBzdHJpbmdcbiAgdGV4dDogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0aW9uQ2hhbmdlIHtcbiAgZWRpdG9yOiBRdWlsbFR5cGVcbiAgb2xkUmFuZ2U6IFJhbmdlIHwgbnVsbFxuICByYW5nZTogUmFuZ2UgfCBudWxsXG4gIHNvdXJjZTogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmx1ciB7XG4gIGVkaXRvcjogUXVpbGxUeXBlXG4gIHNvdXJjZTogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRm9jdXMge1xuICBlZGl0b3I6IFF1aWxsVHlwZVxuICBzb3VyY2U6IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBFZGl0b3JDaGFuZ2VDb250ZW50ID0gQ29udGVudENoYW5nZSAmIHsgZXZlbnQ6ICd0ZXh0LWNoYW5nZScgfVxuZXhwb3J0IHR5cGUgRWRpdG9yQ2hhbmdlU2VsZWN0aW9uID0gU2VsZWN0aW9uQ2hhbmdlICYgeyBldmVudDogJ3NlbGVjdGlvbi1jaGFuZ2UnIH1cblxuQFVudGlsRGVzdHJveSgpXG5ARGlyZWN0aXZlKClcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLWNsYXNzLXN1ZmZpeFxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFF1aWxsRWRpdG9yQmFzZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95LCBWYWxpZGF0b3Ige1xuICBASW5wdXQoKSBmb3JtYXQ/OiAnb2JqZWN0JyB8ICdodG1sJyB8ICd0ZXh0JyB8ICdqc29uJ1xuICBASW5wdXQoKSB0aGVtZT86IHN0cmluZ1xuICBASW5wdXQoKSBtb2R1bGVzPzogUXVpbGxNb2R1bGVzXG4gIEBJbnB1dCgpIGRlYnVnPzogJ3dhcm4nIHwgJ2xvZycgfCAnZXJyb3InIHwgZmFsc2VcbiAgQElucHV0KCkgcmVhZE9ubHk/OiBib29sZWFuXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyPzogc3RyaW5nXG4gIEBJbnB1dCgpIG1heExlbmd0aD86IG51bWJlclxuICBASW5wdXQoKSBtaW5MZW5ndGg/OiBudW1iZXJcbiAgQElucHV0KCkgcmVxdWlyZWQgPSBmYWxzZVxuICBASW5wdXQoKSBmb3JtYXRzPzogc3RyaW5nW10gfCBudWxsXG4gIEBJbnB1dCgpIGN1c3RvbVRvb2xiYXJQb3NpdGlvbjogJ3RvcCcgfCAnYm90dG9tJyA9ICd0b3AnXG4gIEBJbnB1dCgpIHNhbml0aXplPzogYm9vbGVhblxuICBASW5wdXQoKSBiZWZvcmVSZW5kZXI/OiBRdWlsbEJlZm9yZVJlbmRlclxuICBASW5wdXQoKSBzdHlsZXM6IGFueSA9IG51bGxcbiAgQElucHV0KCkgc3RyaWN0ID0gdHJ1ZVxuICBASW5wdXQoKSBzY3JvbGxpbmdDb250YWluZXI/OiBIVE1MRWxlbWVudCB8IHN0cmluZyB8IG51bGxcbiAgQElucHV0KCkgYm91bmRzPzogSFRNTEVsZW1lbnQgfCBzdHJpbmdcbiAgQElucHV0KCkgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9uW10gPSBbXVxuICBASW5wdXQoKSBjdXN0b21Nb2R1bGVzOiBDdXN0b21Nb2R1bGVbXSA9IFtdXG4gIEBJbnB1dCgpIHRyYWNrQ2hhbmdlcz86ICd1c2VyJyB8ICdhbGwnXG4gIEBJbnB1dCgpIHByZXNlcnZlV2hpdGVzcGFjZSA9IGZhbHNlXG4gIEBJbnB1dCgpIGNsYXNzZXM/OiBzdHJpbmdcbiAgQElucHV0KCkgdHJpbU9uVmFsaWRhdGlvbiA9IGZhbHNlXG4gIEBJbnB1dCgpIGxpbmtQbGFjZWhvbGRlcj86IHN0cmluZ1xuICBASW5wdXQoKSBjb21wYXJlVmFsdWVzID0gZmFsc2VcbiAgQElucHV0KCkgZmlsdGVyTnVsbCA9IGZhbHNlXG4gIEBJbnB1dCgpIGRlYm91bmNlVGltZT86IG51bWJlclxuICBASW5wdXQoKSByZWdpc3RyeTogUXVpbGxPcHRpb25zWydyZWdpc3RyeSddO1xuICAvKlxuICBodHRwczovL2dpdGh1Yi5jb20vS2lsbGVyQ29kZU1vbmtleS9uZ3gtcXVpbGwvaXNzdWVzLzEyNTcgLSBmaXggbnVsbCB2YWx1ZSBzZXRcblxuICBwcm92aWRlIGRlZmF1bHQgZW1wdHkgdmFsdWVcbiAgYnkgZGVmYXVsdCBudWxsXG5cbiAgZS5nLiBkZWZhdWx0RW1wdHlWYWx1ZT1cIlwiIC0gZW1wdHkgc3RyaW5nXG5cbiAgPHF1aWxsLWVkaXRvclxuICAgIGRlZmF1bHRFbXB0eVZhbHVlPVwiXCJcbiAgICBmb3JtQ29udHJvbE5hbWU9XCJtZXNzYWdlXCJcbiAgPjwvcXVpbGwtZWRpdG9yPlxuICAqL1xuICBASW5wdXQoKSBkZWZhdWx0RW1wdHlWYWx1ZTogYW55ID0gbnVsbDtcblxuICBAT3V0cHV0KCkgb25FZGl0b3JDcmVhdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxRdWlsbFR5cGU+KClcbiAgQE91dHB1dCgpIG9uRWRpdG9yQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8RWRpdG9yQ2hhbmdlQ29udGVudCB8IEVkaXRvckNoYW5nZVNlbGVjdGlvbj4oKVxuICBAT3V0cHV0KCkgb25Db250ZW50Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q29udGVudENoYW5nZT4oKVxuICBAT3V0cHV0KCkgb25TZWxlY3Rpb25DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxTZWxlY3Rpb25DaGFuZ2U+KClcbiAgQE91dHB1dCgpIG9uRm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPEZvY3VzPigpXG4gIEBPdXRwdXQoKSBvbkJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPEJsdXI+KClcbiAgQE91dHB1dCgpIG9uTmF0aXZlRm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPEZvY3VzPigpXG4gIEBPdXRwdXQoKSBvbk5hdGl2ZUJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPEJsdXI+KClcblxuICBxdWlsbEVkaXRvciE6IFF1aWxsVHlwZVxuICBlZGl0b3JFbGVtITogSFRNTEVsZW1lbnRcbiAgY29udGVudDogYW55XG4gIGRpc2FibGVkID0gZmFsc2UgLy8gdXNlZCB0byBzdG9yZSBpbml0aWFsIHZhbHVlIGJlZm9yZSBWaWV3SW5pdFxuXG4gIHB1YmxpYyBwcmVzZXJ2ZTpib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyB0b29sYmFyUG9zaXRpb246IHN0cmluZyA9ICd0b3AnO1xuXG4gIG9uTW9kZWxDaGFuZ2U6IChtb2RlbFZhbHVlPzogYW55KSA9PiB2b2lkXG4gIG9uTW9kZWxUb3VjaGVkOiAoKSA9PiB2b2lkXG4gIG9uVmFsaWRhdG9yQ2hhbmdlZDogKCkgPT4gdm9pZFxuXG4gIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbFxuICBwcml2YXRlIHF1aWxsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgcGxhdGZvcm1JZDogYW55LFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIHNlcnZpY2U6IFF1aWxsU2VydmljZVxuICApIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gaW5qZWN0b3IuZ2V0KERPQ1VNRU5UKVxuICB9XG5cbiAgc3RhdGljIG5vcm1hbGl6ZUNsYXNzTmFtZXMoY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGNsYXNzZXMudHJpbSgpLnNwbGl0KCcgJylcbiAgICByZXR1cm4gY2xhc3NMaXN0LnJlZHVjZSgocHJldjogc3RyaW5nW10sIGN1cjogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB0cmltbWVkID0gY3VyLnRyaW0oKVxuICAgICAgaWYgKHRyaW1tZWQpIHtcbiAgICAgICAgcHJldi5wdXNoKHRyaW1tZWQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2XG4gICAgfSwgW10pXG4gIH1cblxuICBASW5wdXQoKSB2YWx1ZUdldHRlciA9IChxdWlsbEVkaXRvcjogUXVpbGxUeXBlKTogc3RyaW5nIHwgYW55ID0+IHtcbiAgICBsZXQgaHRtbDogc3RyaW5nIHwgbnVsbCA9IHF1aWxsRWRpdG9yLmdldFNlbWFudGljSFRNTCgpXG4gICAgaWYgKHRoaXMuaXNFbXB0eVZhbHVlKGh0bWwpKSB7XG4gICAgICBodG1sID0gdGhpcy5kZWZhdWx0RW1wdHlWYWx1ZSgpXG4gICAgfVxuICAgIGxldCBtb2RlbFZhbHVlOiBzdHJpbmcgfCBEZWx0YVR5cGUgfCBudWxsID0gaHRtbFxuICAgIGNvbnN0IGZvcm1hdCA9IGdldEZvcm1hdCh0aGlzLmZvcm1hdCwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXQpXG5cbiAgICBpZiAoZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRUZXh0KClcbiAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRDb250ZW50cygpXG4gICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbW9kZWxWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHF1aWxsRWRpdG9yLmdldENvbnRlbnRzKCkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRUZXh0KClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWxWYWx1ZVxuICB9O1xuXG4gIEBJbnB1dCgpIHZhbHVlU2V0dGVyID0gKHF1aWxsRWRpdG9yOiBRdWlsbFR5cGUsIHZhbHVlOiBhbnkpOiBhbnkgPT4ge1xuICAgIGNvbnN0IGZvcm1hdCA9IGdldEZvcm1hdCh0aGlzLmZvcm1hdCwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXQpXG4gICAgaWYgKGZvcm1hdCA9PT0gJ2h0bWwnKSB7XG4gICAgICBjb25zdCBzYW5pdGl6ZSA9IFt0cnVlLCBmYWxzZV0uaW5jbHVkZXModGhpcy5zYW5pdGl6ZSkgPyB0aGlzLnNhbml0aXplIDogKHRoaXMuc2VydmljZS5jb25maWcuc2FuaXRpemUgfHwgZmFsc2UpXG4gICAgICBpZiAoc2FuaXRpemUpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmRvbVNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgdmFsdWUpXG4gICAgICB9XG4gICAgICByZXR1cm4gcXVpbGxFZGl0b3IuY2xpcGJvYXJkLmNvbnZlcnQoeyBodG1sOiB2YWx1ZSB9KVxuICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gW3sgaW5zZXJ0OiB2YWx1ZSB9XVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9O1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucHJlc2VydmUgPSB0aGlzLnByZXNlcnZlV2hpdGVzcGFjZTtcbiAgICB0aGlzLnRvb2xiYXJQb3NpdGlvbiA9IHRoaXMuY3VzdG9tVG9vbGJhclBvc2l0aW9uO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFRoZSBgcXVpbGwtZWRpdG9yYCBjb21wb25lbnQgbWlnaHQgYmUgZGVzdHJveWVkIGJlZm9yZSB0aGUgYHF1aWxsYCBjaHVuayBpcyBsb2FkZWQgYW5kIGl0cyBjb2RlIGlzIGV4ZWN1dGVkXG4gICAgLy8gdGhpcyB3aWxsIGxlYWQgdG8gcnVudGltZSBleGNlcHRpb25zLCBzaW5jZSB0aGUgY29kZSB3aWxsIGJlIGV4ZWN1dGVkIG9uIERPTSBub2RlcyB0aGF0IGRvbid0IGV4aXN0IHdpdGhpbiB0aGUgdHJlZS5cblxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24gPSB0aGlzLnNlcnZpY2UuZ2V0UXVpbGwoKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKFF1aWxsKSA9PiB0aGlzLnNlcnZpY2UuYmVmb3JlUmVuZGVyKFF1aWxsLCB0aGlzLmN1c3RvbU1vZHVsZXMsIHRoaXMuYmVmb3JlUmVuZGVyKSlcbiAgICApLnN1YnNjcmliZShRdWlsbCA9PiB7XG4gICAgICB0aGlzLmVkaXRvckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnW3F1aWxsLWVkaXRvci1lbGVtZW50XSdcbiAgICAgIClcblxuICAgICAgY29uc3QgdG9vbGJhckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnW3F1aWxsLWVkaXRvci10b29sYmFyXSdcbiAgICAgIClcbiAgICAgIGNvbnN0IG1vZHVsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm1vZHVsZXMgfHwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5tb2R1bGVzKVxuXG4gICAgICBpZiAodG9vbGJhckVsZW0pIHtcbiAgICAgICAgbW9kdWxlcy50b29sYmFyID0gdG9vbGJhckVsZW1cbiAgICAgIH0gZWxzZSBpZiAobW9kdWxlcy50b29sYmFyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbW9kdWxlcy50b29sYmFyID0gZGVmYXVsdE1vZHVsZXMudG9vbGJhclxuICAgICAgfVxuXG4gICAgICBsZXQgcGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyICE9PSB1bmRlZmluZWQgPyB0aGlzLnBsYWNlaG9sZGVyIDogdGhpcy5zZXJ2aWNlLmNvbmZpZy5wbGFjZWhvbGRlclxuICAgICAgaWYgKHBsYWNlaG9sZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGxhY2Vob2xkZXIgPSAnSW5zZXJ0IHRleHQgaGVyZSAuLi4nXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuc3R5bGVzXG4gICAgICBpZiAoc3R5bGVzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWRpdG9yRWxlbSwga2V5LCBzdHlsZXNba2V5XSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xhc3Nlcykge1xuICAgICAgICB0aGlzLmFkZENsYXNzZXModGhpcy5jbGFzc2VzKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1c3RvbU9wdGlvbnMuZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0N1c3RvbU9wdGlvbiA9IFF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgICBuZXdDdXN0b21PcHRpb24ud2hpdGVsaXN0ID0gY3VzdG9tT3B0aW9uLndoaXRlbGlzdFxuICAgICAgICBRdWlsbC5yZWdpc3RlcihuZXdDdXN0b21PcHRpb24sIHRydWUpXG4gICAgICB9KVxuXG4gICAgICBsZXQgYm91bmRzID0gdGhpcy5ib3VuZHMgJiYgdGhpcy5ib3VuZHMgPT09ICdzZWxmJyA/IHRoaXMuZWRpdG9yRWxlbSA6IHRoaXMuYm91bmRzXG4gICAgICBpZiAoIWJvdW5kcykge1xuICAgICAgICBib3VuZHMgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmJvdW5kcyA/IHRoaXMuc2VydmljZS5jb25maWcuYm91bmRzIDogdGhpcy5kb2N1bWVudC5ib2R5XG4gICAgICB9XG5cbiAgICAgIGxldCBkZWJ1ZyA9IHRoaXMuZGVidWdcbiAgICAgIGlmICghZGVidWcgJiYgZGVidWcgIT09IGZhbHNlICYmIHRoaXMuc2VydmljZS5jb25maWcuZGVidWcpIHtcbiAgICAgICAgZGVidWcgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmRlYnVnXG4gICAgICB9XG5cbiAgICAgIGxldCByZWFkT25seSA9IHRoaXMucmVhZE9ubHlcbiAgICAgIGlmICghcmVhZE9ubHkgJiYgdGhpcy5yZWFkT25seSAhPT0gZmFsc2UpIHtcbiAgICAgICAgcmVhZE9ubHkgPSB0aGlzLnNlcnZpY2UuY29uZmlnLnJlYWRPbmx5ICE9PSB1bmRlZmluZWQgPyB0aGlzLnNlcnZpY2UuY29uZmlnLnJlYWRPbmx5IDogZmFsc2VcbiAgICAgIH1cblxuICAgICAgbGV0IGZvcm1hdHMgPSB0aGlzLmZvcm1hdHNcbiAgICAgIGlmICghZm9ybWF0cyAmJiBmb3JtYXRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZm9ybWF0cyA9IHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cyA/IFsuLi50aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdHNdIDogKHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cyA9PT0gbnVsbCA/IG51bGwgOiB1bmRlZmluZWQpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICAgICAgYm91bmRzLFxuICAgICAgICAgIGRlYnVnLFxuICAgICAgICAgIGZvcm1hdHMsXG4gICAgICAgICAgbW9kdWxlcyxcbiAgICAgICAgICBwbGFjZWhvbGRlcixcbiAgICAgICAgICByZWFkT25seSxcbiAgICAgICAgICByZWdpc3RyeTogdGhpcy5yZWdpc3RyeSxcbiAgICAgICAgICB0aGVtZTogdGhpcy50aGVtZSB8fCAodGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA/IHRoaXMuc2VydmljZS5jb25maWcudGhlbWUgOiAnc25vdycpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHRoaXMub25OYXRpdmVCbHVyLm9ic2VydmVkKSB7XG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3F1aWxsanMvcXVpbGwvaXNzdWVzLzIxODYjaXNzdWVjb21tZW50LTUzMzQwMTMyOFxuICAgICAgICAgIGZyb21FdmVudCh0aGlzLnF1aWxsRWRpdG9yLnNjcm9sbC5kb21Ob2RlLCAnYmx1cicpLnBpcGUodW50aWxEZXN0cm95ZWQodGhpcykpLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9uTmF0aXZlQmx1ci5uZXh0KHtcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICAgIHNvdXJjZTogJ2RvbSdcbiAgICAgICAgICB9KSlcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcXVpbGxqcy9xdWlsbC9pc3N1ZXMvMjE4NiNpc3N1ZWNvbW1lbnQtODAzMjU3NTM4XG4gICAgICAgICAgY29uc3QgdG9vbGJhciA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0TW9kdWxlKCd0b29sYmFyJykgYXMgVG9vbGJhclxuICAgICAgICAgIGlmICh0b29sYmFyLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgZnJvbUV2ZW50KHRvb2xiYXIuY29udGFpbmVyLCAnbW91c2Vkb3duJykucGlwZSh1bnRpbERlc3Ryb3llZCh0aGlzKSkuc3Vic2NyaWJlKGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uTmF0aXZlRm9jdXMub2JzZXJ2ZWQpIHtcbiAgICAgICAgICBmcm9tRXZlbnQodGhpcy5xdWlsbEVkaXRvci5zY3JvbGwuZG9tTm9kZSwgJ2ZvY3VzJykucGlwZSh1bnRpbERlc3Ryb3llZCh0aGlzKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMub25OYXRpdmVGb2N1cy5uZXh0KHtcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICAgIHNvdXJjZTogJ2RvbSdcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBvcHRpb25hbCBsaW5rIHBsYWNlaG9sZGVyLCBRdWlsbCBoYXMgbm8gbmF0aXZlIEFQSSBmb3IgaXQgc28gdXNpbmcgd29ya2Fyb3VuZFxuICAgICAgICBpZiAodGhpcy5saW5rUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICBjb25zdCB0b29sdGlwID0gKHRoaXMucXVpbGxFZGl0b3IgYXMgYW55KT8udGhlbWU/LnRvb2x0aXBcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IHRvb2x0aXA/LnJvb3Q/LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2RhdGEtbGlua10nKVxuICAgICAgICAgIGlmIChpbnB1dD8uZGF0YXNldCkge1xuICAgICAgICAgICAgaW5wdXQuZGF0YXNldC5saW5rID0gdGhpcy5saW5rUGxhY2Vob2xkZXJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gZ2V0Rm9ybWF0KHRoaXMuZm9ybWF0LCB0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdClcblxuICAgICAgICBpZiAoZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQodGhpcy5jb250ZW50LCAnc2lsZW50JylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZVNldHRlciA9IHRoaXMudmFsdWVTZXR0ZXI7XG4gICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZVNldHRlcih0aGlzLnF1aWxsRWRpdG9yLCB0aGlzLmNvbnRlbnQpXG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhuZXdWYWx1ZSwgJ3NpbGVudCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRNb2R1bGUoJ2hpc3RvcnknKSBhcyBIaXN0b3J5XG4gICAgICAgIGhpc3RvcnkuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICAvLyBpbml0aWFsaXplIGRpc2FibGVkIHN0YXR1cyBiYXNlZCBvbiB0aGlzLmRpc2FibGVkIGFzIGRlZmF1bHQgdmFsdWVcbiAgICAgIHRoaXMuc2V0RGlzYWJsZWRTdGF0ZSgpXG5cbiAgICAgIHRoaXMuYWRkUXVpbGxFdmVudExpc3RlbmVycygpXG5cbiAgICAgIC8vIFRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB0cmlnZ2VycyBjaGFuZ2UgZGV0ZWN0aW9uLiBUaGVyZSdzIG5vIHNlbnNlIHRvIGludm9rZSB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgaWYgYW55b25lIGlzXG4gICAgICAvLyBsaXN0ZW5pbmcgdG8gdGhlIGBvbkVkaXRvckNyZWF0ZWRgIGV2ZW50IGluc2lkZSB0aGUgdGVtcGxhdGUsIGZvciBpbnN0YW5jZSBgPHF1aWxsLXZpZXcgKG9uRWRpdG9yQ3JlYXRlZCk9XCIuLi5cIj5gLlxuICAgICAgaWYgKCF0aGlzLm9uRWRpdG9yQ3JlYXRlZC5vYnNlcnZlZCAmJiAhdGhpcy5vblZhbGlkYXRvckNoYW5nZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB3aWxsIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBhbmQgYG9uRWRpdG9yQ3JlYXRlZGAgd2lsbCBhbHNvIGNhbGwgYG1hcmtEaXJ0eSgpYFxuICAgICAgLy8gaW50ZXJuYWxseSwgc2luY2UgQW5ndWxhciB3cmFwcyB0ZW1wbGF0ZSBldmVudCBsaXN0ZW5lcnMgaW50byBgbGlzdGVuZXJgIGluc3RydWN0aW9uLiBXZSdyZSB1c2luZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWBcbiAgICAgIC8vIHRvIHByZXZlbnQgdGhlIGZyYW1lIGRyb3AgYW5kIGF2b2lkIGBFeHByZXNzaW9uQ2hhbmdlZEFmdGVySXRIYXNCZWVuQ2hlY2tlZEVycm9yYCBlcnJvci5cbiAgICAgIHJhZiQoKS5waXBlKHVudGlsRGVzdHJveWVkKHRoaXMpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vblZhbGlkYXRvckNoYW5nZWQpIHtcbiAgICAgICAgICB0aGlzLm9uVmFsaWRhdG9yQ2hhbmdlZCgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vbkVkaXRvckNyZWF0ZWQuZW1pdCh0aGlzLnF1aWxsRWRpdG9yKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlciA9IChyYW5nZTogUmFuZ2UgfCBudWxsLCBvbGRSYW5nZTogUmFuZ2UgfCBudWxsLCBzb3VyY2U6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHRyYWNrQ2hhbmdlcyA9IHRoaXMudHJhY2tDaGFuZ2VzIHx8IHRoaXMuc2VydmljZS5jb25maWcudHJhY2tDaGFuZ2VzXG4gICAgY29uc3Qgc2hvdWxkVHJpZ2dlck9uTW9kZWxUb3VjaGVkID0gIXJhbmdlICYmICEhdGhpcy5vbk1vZGVsVG91Y2hlZCAmJiAoc291cmNlID09PSAndXNlcicgfHwgdHJhY2tDaGFuZ2VzICYmIHRyYWNrQ2hhbmdlcyA9PT0gJ2FsbCcpXG5cbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyB3aGVuIHRoZXJlJ3MgYW55IGxpc3RlbmVyXG4gICAgaWYgKCF0aGlzLm9uQmx1ci5vYnNlcnZlZCAmJlxuICAgICAgIXRoaXMub25Gb2N1cy5vYnNlcnZlZCAmJlxuICAgICAgIXRoaXMub25TZWxlY3Rpb25DaGFuZ2VkLm9ic2VydmVkICYmXG4gICAgICAhc2hvdWxkVHJpZ2dlck9uTW9kZWxUb3VjaGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIGlmIChyYW5nZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9uQmx1ci5lbWl0KHtcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgc291cmNlXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKG9sZFJhbmdlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMub25Gb2N1cy5lbWl0KHtcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgc291cmNlXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25TZWxlY3Rpb25DaGFuZ2VkLmVtaXQoe1xuICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgIG9sZFJhbmdlLFxuICAgICAgICByYW5nZSxcbiAgICAgICAgc291cmNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoc2hvdWxkVHJpZ2dlck9uTW9kZWxUb3VjaGVkKSB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpXG4gICAgfSlcbiAgfVxuXG4gIHRleHRDaGFuZ2VIYW5kbGVyID0gKGRlbHRhOiBEZWx0YVR5cGUsIG9sZERlbHRhOiBEZWx0YVR5cGUsIHNvdXJjZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgLy8gb25seSBlbWl0IGNoYW5nZXMgZW1pdHRlZCBieSB1c2VyIGludGVyYWN0aW9uc1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKVxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldENvbnRlbnRzKClcblxuICAgIGxldCBodG1sOiBzdHJpbmcgfCBudWxsID0gdGhpcy5xdWlsbEVkaXRvci5nZXRTZW1hbnRpY0hUTUwoKVxuICAgIGlmICh0aGlzLmlzRW1wdHlWYWx1ZShodG1sKSkge1xuICAgICAgaHRtbCA9IHRoaXMuZGVmYXVsdEVtcHR5VmFsdWUoKVxuICAgIH1cblxuICAgIGNvbnN0IHRyYWNrQ2hhbmdlcyA9IHRoaXMudHJhY2tDaGFuZ2VzIHx8IHRoaXMuc2VydmljZS5jb25maWcudHJhY2tDaGFuZ2VzXG4gICAgY29uc3Qgc2hvdWxkVHJpZ2dlck9uTW9kZWxDaGFuZ2UgPSAoc291cmNlID09PSAndXNlcicgfHwgdHJhY2tDaGFuZ2VzICYmIHRyYWNrQ2hhbmdlcyA9PT0gJ2FsbCcpICYmICEhdGhpcy5vbk1vZGVsQ2hhbmdlXG5cbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyB3aGVuIHRoZXJlJ3MgYW55IGxpc3RlbmVyXG4gICAgaWYgKCF0aGlzLm9uQ29udGVudENoYW5nZWQub2JzZXJ2ZWQgJiYgIXNob3VsZFRyaWdnZXJPbk1vZGVsQ2hhbmdlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIGlmIChzaG91bGRUcmlnZ2VyT25Nb2RlbENoYW5nZSkge1xuICAgICAgICBjb25zdCB2YWx1ZUdldHRlciA9IHRoaXMudmFsdWVHZXR0ZXI7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZShcbiAgICAgICAgICB2YWx1ZUdldHRlcih0aGlzLnF1aWxsRWRpdG9yKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlZC5lbWl0KHtcbiAgICAgICAgY29udGVudCxcbiAgICAgICAgZGVsdGEsXG4gICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgaHRtbCxcbiAgICAgICAgb2xkRGVsdGEsXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgdGV4dFxuICAgICAgfSlcblxuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKVxuICAgIH0pXG4gIH1cblxuICBlZGl0b3JDaGFuZ2VIYW5kbGVyID0gKFxuICAgIGV2ZW50OiAndGV4dC1jaGFuZ2UnIHwgJ3NlbGVjdGlvbi1jaGFuZ2UnLFxuICAgIGN1cnJlbnQ6IGFueSB8IFJhbmdlIHwgbnVsbCwgb2xkOiBhbnkgfCBSYW5nZSB8IG51bGwsIHNvdXJjZTogc3RyaW5nXG4gICk6IHZvaWQgPT4ge1xuICAgIC8vIG9ubHkgZW1pdCBjaGFuZ2VzIHdoZW4gdGhlcmUncyBhbnkgbGlzdGVuZXJcbiAgICBpZiAoIXRoaXMub25FZGl0b3JDaGFuZ2VkLm9ic2VydmVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyBlbWl0dGVkIGJ5IHVzZXIgaW50ZXJhY3Rpb25zXG4gICAgaWYgKGV2ZW50ID09PSAndGV4dC1jaGFuZ2UnKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRUZXh0KClcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldENvbnRlbnRzKClcblxuICAgICAgbGV0IGh0bWw6IHN0cmluZyB8IG51bGwgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFNlbWFudGljSFRNTCgpXG4gICAgICBpZiAodGhpcy5pc0VtcHR5VmFsdWUoaHRtbCkpIHtcbiAgICAgICAgaHRtbCA9IHRoaXMuZGVmYXVsdEVtcHR5VmFsdWUoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5vbkVkaXRvckNoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgY29udGVudCxcbiAgICAgICAgICBkZWx0YTogY3VycmVudCxcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgaHRtbCxcbiAgICAgICAgICBvbGREZWx0YTogb2xkLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB0ZXh0XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMub25FZGl0b3JDaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICBldmVudCxcbiAgICAgICAgICBvbGRSYW5nZTogb2xkLFxuICAgICAgICAgIHJhbmdlOiBjdXJyZW50LFxuICAgICAgICAgIHNvdXJjZVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kaXNwb3NlKClcblxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKClcbiAgICB0aGlzLnF1aWxsU3Vic2NyaXB0aW9uID0gbnVsbFxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9kb3Qtbm90YXRpb24gKi9cbiAgICBpZiAoY2hhbmdlcy5yZWFkT25seSkge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5lbmFibGUoIWNoYW5nZXMucmVhZE9ubHkuY3VycmVudFZhbHVlKVxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5yb290LmRhdGFzZXQucGxhY2Vob2xkZXIgPVxuICAgICAgICBjaGFuZ2VzLnBsYWNlaG9sZGVyLmN1cnJlbnRWYWx1ZVxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5zdHlsZXMpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTdHlsaW5nID0gY2hhbmdlcy5zdHlsZXMuY3VycmVudFZhbHVlXG4gICAgICBjb25zdCBwcmV2aW91c1N0eWxpbmcgPSBjaGFuZ2VzLnN0eWxlcy5wcmV2aW91c1ZhbHVlXG5cbiAgICAgIGlmIChwcmV2aW91c1N0eWxpbmcpIHtcbiAgICAgICAgT2JqZWN0LmtleXMocHJldmlvdXNTdHlsaW5nKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5lZGl0b3JFbGVtLCBrZXkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFN0eWxpbmcpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudFN0eWxpbmcpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSwgdGhpcy5zdHlsZXNba2V5XSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNoYW5nZXMuY2xhc3Nlcykge1xuICAgICAgY29uc3QgY3VycmVudENsYXNzZXMgPSBjaGFuZ2VzLmNsYXNzZXMuY3VycmVudFZhbHVlXG4gICAgICBjb25zdCBwcmV2aW91c0NsYXNzZXMgPSBjaGFuZ2VzLmNsYXNzZXMucHJldmlvdXNWYWx1ZVxuXG4gICAgICBpZiAocHJldmlvdXNDbGFzc2VzKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2xhc3NlcyhwcmV2aW91c0NsYXNzZXMpXG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50Q2xhc3Nlcykge1xuICAgICAgICB0aGlzLmFkZENsYXNzZXMoY3VycmVudENsYXNzZXMpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIFdlJ2Qgd2FudCB0byByZS1hcHBseSBldmVudCBsaXN0ZW5lcnMgaWYgdGhlIGBkZWJvdW5jZVRpbWVgIGJpbmRpbmcgY2hhbmdlcyB0byBhcHBseSB0aGVcbiAgICAvLyBgZGVib3VuY2VUaW1lYCBvcGVyYXRvciBvciB2aWNlLXZlcnNhIHJlbW92ZSBpdC5cbiAgICBpZiAoY2hhbmdlcy5kZWJvdW5jZVRpbWUpIHtcbiAgICAgIHRoaXMuYWRkUXVpbGxFdmVudExpc3RlbmVycygpXG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgQHR5cGVzY3JpcHQtZXNsaW50L2RvdC1ub3RhdGlvbiAqL1xuICB9XG5cbiAgYWRkQ2xhc3NlcyhjbGFzc0xpc3Q6IHN0cmluZyk6IHZvaWQge1xuICAgIFF1aWxsRWRpdG9yQmFzZS5ub3JtYWxpemVDbGFzc05hbWVzKGNsYXNzTGlzdCkuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWRpdG9yRWxlbSwgYylcbiAgICB9KVxuICB9XG5cbiAgcmVtb3ZlQ2xhc3NlcyhjbGFzc0xpc3Q6IHN0cmluZyk6IHZvaWQge1xuICAgIFF1aWxsRWRpdG9yQmFzZS5ub3JtYWxpemVDbGFzc05hbWVzKGNsYXNzTGlzdCkuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWRpdG9yRWxlbSwgYylcbiAgICB9KVxuICB9XG5cbiAgd3JpdGVWYWx1ZShjdXJyZW50VmFsdWU6IGFueSkge1xuXG4gICAgLy8gb3B0aW9uYWwgZml4IGZvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNDk4OFxuICAgIGlmICh0aGlzLmZpbHRlck51bGwgJiYgY3VycmVudFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmNvbnRlbnQgPSBjdXJyZW50VmFsdWVcblxuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZm9ybWF0ID0gZ2V0Rm9ybWF0KHRoaXMuZm9ybWF0LCB0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdClcbiAgICBjb25zdCB2YWx1ZVNldHRlciA9IHRoaXMudmFsdWVTZXR0ZXI7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZVNldHRlcih0aGlzLnF1aWxsRWRpdG9yLCBjdXJyZW50VmFsdWUpXG5cbiAgICBpZiAodGhpcy5jb21wYXJlVmFsdWVzKSB7XG4gICAgICBjb25zdCBjdXJyZW50RWRpdG9yVmFsdWUgPSB0aGlzLnF1aWxsRWRpdG9yLmdldENvbnRlbnRzKClcbiAgICAgIGlmIChKU09OLnN0cmluZ2lmeShjdXJyZW50RWRpdG9yVmFsdWUpID09PSBKU09OLnN0cmluZ2lmeShuZXdWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRWYWx1ZSkge1xuICAgICAgaWYgKGZvcm1hdCA9PT0gJ3RleHQnKSB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dChjdXJyZW50VmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldENvbnRlbnRzKG5ld1ZhbHVlKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dCgnJylcblxuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuID0gdGhpcy5kaXNhYmxlZCk6IHZvaWQge1xuICAgIC8vIHN0b3JlIGluaXRpYWwgdmFsdWUgdG8gc2V0IGFwcHJvcHJpYXRlIGRpc2FibGVkIHN0YXR1cyBhZnRlciBWaWV3SW5pdFxuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkXG4gICAgaWYgKHRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIGlmIChpc0Rpc2FibGVkKSB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3IuZGlzYWJsZSgpXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlYWRPbmx5KSB7XG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5lbmFibGUoKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChtb2RlbFZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmblxuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm5cbiAgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uVmFsaWRhdG9yQ2hhbmdlZCA9IGZuXG4gIH1cblxuICB2YWxpZGF0ZSgpIHtcbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgY29uc3QgZXJyOiB7XG4gICAgICBtaW5MZW5ndGhFcnJvcj86IHtcbiAgICAgICAgZ2l2ZW46IG51bWJlclxuICAgICAgICBtaW5MZW5ndGg6IG51bWJlclxuICAgICAgfVxuICAgICAgbWF4TGVuZ3RoRXJyb3I/OiB7XG4gICAgICAgIGdpdmVuOiBudW1iZXJcbiAgICAgICAgbWF4TGVuZ3RoOiBudW1iZXJcbiAgICAgIH1cbiAgICAgIHJlcXVpcmVkRXJyb3I/OiB7IGVtcHR5OiBib29sZWFuIH1cbiAgICB9ID0ge31cbiAgICBsZXQgdmFsaWQgPSB0cnVlXG5cbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRUZXh0KClcbiAgICAvLyB0cmltIHRleHQgaWYgd2FudGVkICsgaGFuZGxlIHNwZWNpYWwgY2FzZSB0aGF0IGFuIGVtcHR5IGVkaXRvciBjb250YWlucyBhIG5ldyBsaW5lXG4gICAgY29uc3QgdGV4dExlbmd0aCA9IHRoaXMudHJpbU9uVmFsaWRhdGlvbiA/IHRleHQudHJpbSgpLmxlbmd0aCA6ICh0ZXh0Lmxlbmd0aCA9PT0gMSAmJiB0ZXh0LnRyaW0oKS5sZW5ndGggPT09IDAgPyAwIDogdGV4dC5sZW5ndGggLSAxKVxuICAgIGNvbnN0IGRlbHRhT3BlcmF0aW9ucyA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKS5vcHNcbiAgICBjb25zdCBvbmx5RW1wdHlPcGVyYXRpb24gPSAhIWRlbHRhT3BlcmF0aW9ucyAmJiBkZWx0YU9wZXJhdGlvbnMubGVuZ3RoID09PSAxICYmIFsnXFxuJywgJyddLmluY2x1ZGVzKGRlbHRhT3BlcmF0aW9uc1swXS5pbnNlcnQ/LnRvU3RyaW5nKCkpXG5cbiAgICBpZiAodGhpcy5taW5MZW5ndGggJiYgdGV4dExlbmd0aCAmJiB0ZXh0TGVuZ3RoIDwgdGhpcy5taW5MZW5ndGgpIHtcbiAgICAgIGVyci5taW5MZW5ndGhFcnJvciA9IHtcbiAgICAgICAgZ2l2ZW46IHRleHRMZW5ndGgsXG4gICAgICAgIG1pbkxlbmd0aDogdGhpcy5taW5MZW5ndGhcbiAgICAgIH1cblxuICAgICAgdmFsaWQgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1heExlbmd0aCAmJiB0ZXh0TGVuZ3RoID4gdGhpcy5tYXhMZW5ndGgpIHtcbiAgICAgIGVyci5tYXhMZW5ndGhFcnJvciA9IHtcbiAgICAgICAgZ2l2ZW46IHRleHRMZW5ndGgsXG4gICAgICAgIG1heExlbmd0aDogdGhpcy5tYXhMZW5ndGhcbiAgICAgIH1cblxuICAgICAgdmFsaWQgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJlcXVpcmVkICYmICF0ZXh0TGVuZ3RoICYmIG9ubHlFbXB0eU9wZXJhdGlvbikge1xuICAgICAgZXJyLnJlcXVpcmVkRXJyb3IgPSB7XG4gICAgICAgIGVtcHR5OiB0cnVlXG4gICAgICB9XG5cbiAgICAgIHZhbGlkID0gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWQgPyBudWxsIDogZXJyXG4gIH1cblxuICBwcml2YXRlIGFkZFF1aWxsRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwb3NlKClcblxuICAgIC8vIFdlIGhhdmUgdG8gZW50ZXIgdGhlIGA8cm9vdD5gIHpvbmUgd2hlbiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLCBzbyBgZGVib3VuY2VUaW1lYCB3aWxsIHNwYXduIHRoZVxuICAgIC8vIGBBc3luY0FjdGlvbmAgdGhlcmUgdy9vIHRyaWdnZXJpbmcgY2hhbmdlIGRldGVjdGlvbnMuIFdlIHN0aWxsIHJlLWVudGVyIHRoZSBBbmd1bGFyJ3Mgem9uZSB0aHJvdWdoXG4gICAgLy8gYHpvbmUucnVuYCB3aGVuIHdlIGVtaXQgYW4gZXZlbnQgdG8gdGhlIHBhcmVudCBjb21wb25lbnQuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpXG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgICAgLy8gbWFyayBtb2RlbCBhcyB0b3VjaGVkIGlmIGVkaXRvciBsb3N0IGZvY3VzXG4gICAgICAgIGZyb21FdmVudCh0aGlzLnF1aWxsRWRpdG9yLCAnc2VsZWN0aW9uLWNoYW5nZScpLnN1YnNjcmliZShcbiAgICAgICAgICAoW3JhbmdlLCBvbGRSYW5nZSwgc291cmNlXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VIYW5kbGVyKHJhbmdlIGFzIGFueSwgb2xkUmFuZ2UgYXMgYW55LCBzb3VyY2UpXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICApXG5cbiAgICAgIC8vIFRoZSBgZnJvbUV2ZW50YCBzdXBwb3J0cyBwYXNzaW5nIEpRdWVyeS1zdHlsZSBldmVudCB0YXJnZXRzLCB0aGUgZWRpdG9yIGhhcyBgb25gIGFuZCBgb2ZmYCBtZXRob2RzIHdoaWNoXG4gICAgICAvLyB3aWxsIGJlIGludm9rZWQgdXBvbiBzdWJzY3JpcHRpb24gYW5kIHRlYXJkb3duLlxuICAgICAgbGV0IHRleHRDaGFuZ2UkID0gZnJvbUV2ZW50KHRoaXMucXVpbGxFZGl0b3IsICd0ZXh0LWNoYW5nZScpXG4gICAgICBsZXQgZWRpdG9yQ2hhbmdlJCA9IGZyb21FdmVudCh0aGlzLnF1aWxsRWRpdG9yLCAnZWRpdG9yLWNoYW5nZScpXG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5kZWJvdW5jZVRpbWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRleHRDaGFuZ2UkID0gdGV4dENoYW5nZSQucGlwZShkZWJvdW5jZVRpbWUodGhpcy5kZWJvdW5jZVRpbWUpKVxuICAgICAgICBlZGl0b3JDaGFuZ2UkID0gZWRpdG9yQ2hhbmdlJC5waXBlKGRlYm91bmNlVGltZSh0aGlzLmRlYm91bmNlVGltZSkpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgICAgLy8gdXBkYXRlIG1vZGVsIGlmIHRleHQgY2hhbmdlc1xuICAgICAgICB0ZXh0Q2hhbmdlJC5zdWJzY3JpYmUoKFtkZWx0YSwgb2xkRGVsdGEsIHNvdXJjZV0pID0+IHtcbiAgICAgICAgICB0aGlzLnRleHRDaGFuZ2VIYW5kbGVyKGRlbHRhIGFzIGFueSwgb2xkRGVsdGEgYXMgYW55LCBzb3VyY2UpXG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgICAgLy8gdHJpZ2dlcmVkIGlmIHNlbGVjdGlvbiBvciB0ZXh0IGNoYW5nZWRcbiAgICAgICAgZWRpdG9yQ2hhbmdlJC5zdWJzY3JpYmUoKFtldmVudCwgY3VycmVudCwgb2xkLCBzb3VyY2VdKSA9PiB7XG4gICAgICAgICAgdGhpcy5lZGl0b3JDaGFuZ2VIYW5kbGVyKGV2ZW50IGFzICd0ZXh0LWNoYW5nZScgfCAnc2VsZWN0aW9uLWNoYW5nZScsIGN1cnJlbnQsIG9sZCwgc291cmNlKVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICBwcml2YXRlIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG51bGxcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzRW1wdHlWYWx1ZShodG1sOiBzdHJpbmcgfCBudWxsKSB7XG4gICAgcmV0dXJuIGh0bWwgPT09ICc8cD48L3A+JyB8fCBodG1sID09PSAnPGRpdj48L2Rpdj4nIHx8IGh0bWwgPT09ICc8cD48YnI+PC9wPicgfHwgaHRtbCA9PT0gJzxkaXY+PGJyPjwvZGl2PidcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uRW11bGF0ZWQsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVzZS1iZWZvcmUtZGVmaW5lXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBRdWlsbEVkaXRvckNvbXBvbmVudClcbiAgICB9LFxuICAgIHtcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFF1aWxsRWRpdG9yQ29tcG9uZW50KVxuICAgIH1cbiAgXSxcbiAgc2VsZWN0b3I6ICdxdWlsbC1lZGl0b3InLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgKm5nSWY9XCJ0b29sYmFyUG9zaXRpb24gIT09ICd0b3AnXCIgcXVpbGwtZWRpdG9yLWVsZW1lbnQ+PC9kaXY+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2Fib3ZlLXF1aWxsLWVkaXRvci10b29sYmFyXVwiPjwvbmctY29udGVudD5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbcXVpbGwtZWRpdG9yLXRvb2xiYXJdXCI+PC9uZy1jb250ZW50PlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltiZWxvdy1xdWlsbC1lZGl0b3ItdG9vbGJhcl1cIj48L25nLWNvbnRlbnQ+XG4gICAgPGRpdiAqbmdJZj1cInRvb2xiYXJQb3NpdGlvbiA9PT0gJ3RvcCdcIiBxdWlsbC1lZGl0b3ItZWxlbWVudD48L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgIDpob3N0IHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICB9XG4gICAgYFxuICBdLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBRdWlsbEVkaXRvckNvbXBvbmVudCBleHRlbmRzIFF1aWxsRWRpdG9yQmFzZSB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBJbmplY3QoRWxlbWVudFJlZikgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBASW5qZWN0KENoYW5nZURldGVjdG9yUmVmKSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChEb21TYW5pdGl6ZXIpIGRvbVNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IGFueSxcbiAgICBASW5qZWN0KFJlbmRlcmVyMikgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBASW5qZWN0KE5nWm9uZSkgem9uZTogTmdab25lLFxuICAgIEBJbmplY3QoUXVpbGxTZXJ2aWNlKSBzZXJ2aWNlOiBRdWlsbFNlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoXG4gICAgICBpbmplY3RvcixcbiAgICAgIGVsZW1lbnRSZWYsXG4gICAgICBjZCxcbiAgICAgIGRvbVNhbml0aXplcixcbiAgICAgIHBsYXRmb3JtSWQsXG4gICAgICByZW5kZXJlcixcbiAgICAgIHpvbmUsXG4gICAgICBzZXJ2aWNlXG4gICAgKVxuICB9XG5cbn1cbiJdfQ==