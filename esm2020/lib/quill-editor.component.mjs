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
            const styles = this.styles();
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
                    this.renderer.setStyle(this.editorElem, key, this.styles()[key]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC0xNS1xdWlsbC0yL3NyYy9saWIvcXVpbGwtZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFDLE1BQU0saUJBQWlCLENBQUE7QUFDeEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBTXhELE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBRU4sS0FBSyxFQUNMLE1BQU0sRUFJTixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxlQUFlLEVBRWYsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFBO0FBQ3RCLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFFdkQsT0FBTyxFQUF3QixhQUFhLEVBQUUsaUJBQWlCLEVBQWEsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVsRyxPQUFPLEVBQThCLGNBQWMsRUFBbUMsTUFBTSx1QkFBdUIsQ0FBQTtBQUluSCxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDOUMsT0FBTyxFQUFDLFlBQVksRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7O0lBMHNCL0QseUJBQWtFOzs7SUFJbEUseUJBQWtFOzs7O0FBdHFCL0QsSUFBZSxlQUFlLHVCQUE5QixNQUFlLGVBQWU7SUFxRW5DLFlBQ0UsUUFBa0Is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RSxLQUFLLEVBQUUsSUFBSTtnQkFDWCxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsbUVBQW1FO2dCQUNuRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2FBQ3BEO1NBQ0Y7O1FBR0MscUVBQWtFO1FBQ2xFLGtCQUErRDtRQUMvRCxxQkFBeUQ7UUFDekQscUJBQStEO1FBQy9ELHFFQUFrRTs7UUFKNUQsb0RBQStCO1FBSS9CLGVBQStCO1FBQS9CLG9EQUErQjt3QkFVN0IsWUFBWTt1RkFFWCxvQkFBb0I7Y0FsQ2hDLFNBQVM7Z0NBQ08saUJBQWlCLENBQUMsUUFBUSxhQUM5QjtvQkFDVDt3QkFDRSxLQUFLLEVBQUUsSUFBSTt3QkFDWCxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixtRUFBbUU7d0JBQ25FLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLHFCQUFxQixDQUFDO3FCQUNwRDtvQkFDRDt3QkFDRSxLQUFLLEVBQUUsSUFBSTt3QkFDWCxPQUFPLEVBQUUsYUFBYTt3QkFDdEIsbUVBQW1FO3dCQUNuRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQztxQkFDcEQ7aUJBQ0YsWUFDUyxjQUFjLFlBQ2Q7Ozs7OztHQU1ULGNBUVcsSUFBSSxXQUNQLENBQUMsWUFBWSxDQUFDOztzQkFNcEIsTUFBTTt1QkFBQyxVQUFVOztzQkFDakIsTUFBTTt1QkFBQyxpQkFBaUI7O3NCQUN4QixNQUFNO3VCQUFDLFlBQVk7O3NCQUNuQixNQUFNO3VCQUFDLFdBQVc7O3NCQUNsQixNQUFNO3VCQUFDLFNBQVM7O3NCQUNoQixNQUFNO3VCQUFDLE1BQU07O3NCQUNiLE1BQU07dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tbW9uTW9kdWxlLCBET0NVTUVOVCwgaXNQbGF0Zm9ybVNlcnZlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJ1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlcidcblxuaW1wb3J0IHR5cGUgUXVpbGxUeXBlIGZyb20gJ3F1aWxsJ1xuaW1wb3J0IHR5cGUgeyBRdWlsbE9wdGlvbnMgfSBmcm9tICdxdWlsbCdcbmltcG9ydCB0eXBlIERlbHRhVHlwZSBmcm9tICdxdWlsbC1kZWx0YSdcblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgU2VjdXJpdHlDb250ZXh0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJ1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuXG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMSURBVE9SUywgTkdfVkFMVUVfQUNDRVNTT1IsIFZhbGlkYXRvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJ1xuXG5pbXBvcnQgeyBDdXN0b21Nb2R1bGUsIEN1c3RvbU9wdGlvbiwgZGVmYXVsdE1vZHVsZXMsIFF1aWxsQmVmb3JlUmVuZGVyLCBRdWlsbE1vZHVsZXMgfSBmcm9tICduZ3gtMTUtcXVpbGwtMi9jb25maWcnXG5cbmltcG9ydCB0eXBlIEhpc3RvcnkgZnJvbSAncXVpbGwvbW9kdWxlcy9oaXN0b3J5J1xuaW1wb3J0IHR5cGUgVG9vbGJhciBmcm9tICdxdWlsbC9tb2R1bGVzL3Rvb2xiYXInXG5pbXBvcnQgeyBnZXRGb3JtYXQsIHJhZiQgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgeyBRdWlsbFNlcnZpY2UgfSBmcm9tICcuL3F1aWxsLnNlcnZpY2UnXG5pbXBvcnQge1VudGlsRGVzdHJveSwgdW50aWxEZXN0cm95ZWR9IGZyb20gXCJAbmduZWF0L3VudGlsLWRlc3Ryb3lcIjtcblxuZXhwb3J0IGludGVyZmFjZSBSYW5nZSB7XG4gIGluZGV4OiBudW1iZXJcbiAgbGVuZ3RoOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb250ZW50Q2hhbmdlIHtcbiAgY29udGVudDogRGVsdGFUeXBlXG4gIGRlbHRhOiBEZWx0YVR5cGVcbiAgZWRpdG9yOiBRdWlsbFR5cGVcbiAgaHRtbDogc3RyaW5nIHwgbnVsbFxuICBvbGREZWx0YTogRGVsdGFUeXBlXG4gIHNvdXJjZTogc3RyaW5nXG4gIHRleHQ6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlbGVjdGlvbkNoYW5nZSB7XG4gIGVkaXRvcjogUXVpbGxUeXBlXG4gIG9sZFJhbmdlOiBSYW5nZSB8IG51bGxcbiAgcmFuZ2U6IFJhbmdlIHwgbnVsbFxuICBzb3VyY2U6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsdXIge1xuICBlZGl0b3I6IFF1aWxsVHlwZVxuICBzb3VyY2U6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZvY3VzIHtcbiAgZWRpdG9yOiBRdWlsbFR5cGVcbiAgc291cmNlOiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgRWRpdG9yQ2hhbmdlQ29udGVudCA9IENvbnRlbnRDaGFuZ2UgJiB7IGV2ZW50OiAndGV4dC1jaGFuZ2UnIH1cbmV4cG9ydCB0eXBlIEVkaXRvckNoYW5nZVNlbGVjdGlvbiA9IFNlbGVjdGlvbkNoYW5nZSAmIHsgZXZlbnQ6ICdzZWxlY3Rpb24tY2hhbmdlJyB9XG5cbkBVbnRpbERlc3Ryb3koKVxuQERpcmVjdGl2ZSgpXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1jbGFzcy1zdWZmaXhcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBRdWlsbEVkaXRvckJhc2UgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSwgVmFsaWRhdG9yIHtcbiAgQElucHV0KCkgZm9ybWF0PzogJ29iamVjdCcgfCAnaHRtbCcgfCAndGV4dCcgfCAnanNvbidcbiAgQElucHV0KCkgdGhlbWU/OiBzdHJpbmdcbiAgQElucHV0KCkgbW9kdWxlcz86IFF1aWxsTW9kdWxlc1xuICBASW5wdXQoKSBkZWJ1Zz86ICd3YXJuJyB8ICdsb2cnIHwgJ2Vycm9yJyB8IGZhbHNlXG4gIEBJbnB1dCgpIHJlYWRPbmx5PzogYm9vbGVhblxuICBASW5wdXQoKSBwbGFjZWhvbGRlcj86IHN0cmluZ1xuICBASW5wdXQoKSBtYXhMZW5ndGg/OiBudW1iZXJcbiAgQElucHV0KCkgbWluTGVuZ3RoPzogbnVtYmVyXG4gIEBJbnB1dCgpIHJlcXVpcmVkID0gZmFsc2VcbiAgQElucHV0KCkgZm9ybWF0cz86IHN0cmluZ1tdIHwgbnVsbFxuICBASW5wdXQoKSBjdXN0b21Ub29sYmFyUG9zaXRpb246ICd0b3AnIHwgJ2JvdHRvbScgPSAndG9wJ1xuICBASW5wdXQoKSBzYW5pdGl6ZT86IGJvb2xlYW5cbiAgQElucHV0KCkgYmVmb3JlUmVuZGVyPzogUXVpbGxCZWZvcmVSZW5kZXJcbiAgQElucHV0KCkgc3R5bGVzOiBhbnkgPSBudWxsXG4gIEBJbnB1dCgpIHN0cmljdCA9IHRydWVcbiAgQElucHV0KCkgc2Nyb2xsaW5nQ29udGFpbmVyPzogSFRNTEVsZW1lbnQgfCBzdHJpbmcgfCBudWxsXG4gIEBJbnB1dCgpIGJvdW5kcz86IEhUTUxFbGVtZW50IHwgc3RyaW5nXG4gIEBJbnB1dCgpIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbltdID0gW11cbiAgQElucHV0KCkgY3VzdG9tTW9kdWxlczogQ3VzdG9tTW9kdWxlW10gPSBbXVxuICBASW5wdXQoKSB0cmFja0NoYW5nZXM/OiAndXNlcicgfCAnYWxsJ1xuICBASW5wdXQoKSBwcmVzZXJ2ZVdoaXRlc3BhY2UgPSBmYWxzZVxuICBASW5wdXQoKSBjbGFzc2VzPzogc3RyaW5nXG4gIEBJbnB1dCgpIHRyaW1PblZhbGlkYXRpb24gPSBmYWxzZVxuICBASW5wdXQoKSBsaW5rUGxhY2Vob2xkZXI/OiBzdHJpbmdcbiAgQElucHV0KCkgY29tcGFyZVZhbHVlcyA9IGZhbHNlXG4gIEBJbnB1dCgpIGZpbHRlck51bGwgPSBmYWxzZVxuICBASW5wdXQoKSBkZWJvdW5jZVRpbWU/OiBudW1iZXJcbiAgQElucHV0KCkgcmVnaXN0cnk6IFF1aWxsT3B0aW9uc1sncmVnaXN0cnknXTtcbiAgLypcbiAgaHR0cHM6Ly9naXRodWIuY29tL0tpbGxlckNvZGVNb25rZXkvbmd4LXF1aWxsL2lzc3Vlcy8xMjU3IC0gZml4IG51bGwgdmFsdWUgc2V0XG5cbiAgcHJvdmlkZSBkZWZhdWx0IGVtcHR5IHZhbHVlXG4gIGJ5IGRlZmF1bHQgbnVsbFxuXG4gIGUuZy4gZGVmYXVsdEVtcHR5VmFsdWU9XCJcIiAtIGVtcHR5IHN0cmluZ1xuXG4gIDxxdWlsbC1lZGl0b3JcbiAgICBkZWZhdWx0RW1wdHlWYWx1ZT1cIlwiXG4gICAgZm9ybUNvbnRyb2xOYW1lPVwibWVzc2FnZVwiXG4gID48L3F1aWxsLWVkaXRvcj5cbiAgKi9cbiAgQElucHV0KCkgZGVmYXVsdEVtcHR5VmFsdWU6IGFueSA9IG51bGw7XG5cbiAgQE91dHB1dCgpIG9uRWRpdG9yQ3JlYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8UXVpbGxUeXBlPigpXG4gIEBPdXRwdXQoKSBvbkVkaXRvckNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEVkaXRvckNoYW5nZUNvbnRlbnQgfCBFZGl0b3JDaGFuZ2VTZWxlY3Rpb24+KClcbiAgQE91dHB1dCgpIG9uQ29udGVudENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENvbnRlbnRDaGFuZ2U+KClcbiAgQE91dHB1dCgpIG9uU2VsZWN0aW9uQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8U2VsZWN0aW9uQ2hhbmdlPigpXG4gIEBPdXRwdXQoKSBvbkZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjxGb2N1cz4oKVxuICBAT3V0cHV0KCkgb25CbHVyID0gbmV3IEV2ZW50RW1pdHRlcjxCbHVyPigpXG4gIEBPdXRwdXQoKSBvbk5hdGl2ZUZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjxGb2N1cz4oKVxuICBAT3V0cHV0KCkgb25OYXRpdmVCbHVyID0gbmV3IEV2ZW50RW1pdHRlcjxCbHVyPigpXG5cbiAgcXVpbGxFZGl0b3IhOiBRdWlsbFR5cGVcbiAgZWRpdG9yRWxlbSE6IEhUTUxFbGVtZW50XG4gIGNvbnRlbnQ6IGFueVxuICBkaXNhYmxlZCA9IGZhbHNlIC8vIHVzZWQgdG8gc3RvcmUgaW5pdGlhbCB2YWx1ZSBiZWZvcmUgVmlld0luaXRcblxuICBwdWJsaWMgcHJlc2VydmU6Ym9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgdG9vbGJhclBvc2l0aW9uOiBzdHJpbmcgPSAndG9wJztcblxuICBvbk1vZGVsQ2hhbmdlOiAobW9kZWxWYWx1ZT86IGFueSkgPT4gdm9pZFxuICBvbk1vZGVsVG91Y2hlZDogKCkgPT4gdm9pZFxuICBvblZhbGlkYXRvckNoYW5nZWQ6ICgpID0+IHZvaWRcblxuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudFxuICBwcml2YXRlIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGxcbiAgcHJpdmF0ZSBxdWlsbFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGxcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJvdGVjdGVkIHBsYXRmb3JtSWQ6IGFueSxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcm90ZWN0ZWQgem9uZTogTmdab25lLFxuICAgIHByb3RlY3RlZCBzZXJ2aWNlOiBRdWlsbFNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5kb2N1bWVudCA9IGluamVjdG9yLmdldChET0NVTUVOVClcbiAgfVxuXG4gIHN0YXRpYyBub3JtYWxpemVDbGFzc05hbWVzKGNsYXNzZXM6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSBjbGFzc2VzLnRyaW0oKS5zcGxpdCgnICcpXG4gICAgcmV0dXJuIGNsYXNzTGlzdC5yZWR1Y2UoKHByZXY6IHN0cmluZ1tdLCBjdXI6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgdHJpbW1lZCA9IGN1ci50cmltKClcbiAgICAgIGlmICh0cmltbWVkKSB7XG4gICAgICAgIHByZXYucHVzaCh0cmltbWVkKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldlxuICAgIH0sIFtdKVxuICB9XG5cbiAgQElucHV0KCkgdmFsdWVHZXR0ZXIgPSAocXVpbGxFZGl0b3I6IFF1aWxsVHlwZSk6IHN0cmluZyB8IGFueSA9PiB7XG4gICAgbGV0IGh0bWw6IHN0cmluZyB8IG51bGwgPSBxdWlsbEVkaXRvci5nZXRTZW1hbnRpY0hUTUwoKVxuICAgIGlmICh0aGlzLmlzRW1wdHlWYWx1ZShodG1sKSkge1xuICAgICAgaHRtbCA9IHRoaXMuZGVmYXVsdEVtcHR5VmFsdWUoKVxuICAgIH1cbiAgICBsZXQgbW9kZWxWYWx1ZTogc3RyaW5nIHwgRGVsdGFUeXBlIHwgbnVsbCA9IGh0bWxcbiAgICBjb25zdCBmb3JtYXQgPSBnZXRGb3JtYXQodGhpcy5mb3JtYXQsIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0KVxuXG4gICAgaWYgKGZvcm1hdCA9PT0gJ3RleHQnKSB7XG4gICAgICBtb2RlbFZhbHVlID0gcXVpbGxFZGl0b3IuZ2V0VGV4dCgpXG4gICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdvYmplY3QnKSB7XG4gICAgICBtb2RlbFZhbHVlID0gcXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKVxuICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG1vZGVsVmFsdWUgPSBKU09OLnN0cmluZ2lmeShxdWlsbEVkaXRvci5nZXRDb250ZW50cygpKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBtb2RlbFZhbHVlID0gcXVpbGxFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGVsVmFsdWVcbiAgfTtcblxuICBASW5wdXQoKSB2YWx1ZVNldHRlciA9IChxdWlsbEVkaXRvcjogUXVpbGxUeXBlLCB2YWx1ZTogYW55KTogYW55ID0+IHtcbiAgICBjb25zdCBmb3JtYXQgPSBnZXRGb3JtYXQodGhpcy5mb3JtYXQsIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0KVxuICAgIGlmIChmb3JtYXQgPT09ICdodG1sJykge1xuICAgICAgY29uc3Qgc2FuaXRpemUgPSBbdHJ1ZSwgZmFsc2VdLmluY2x1ZGVzKHRoaXMuc2FuaXRpemUpID8gdGhpcy5zYW5pdGl6ZSA6ICh0aGlzLnNlcnZpY2UuY29uZmlnLnNhbml0aXplIHx8IGZhbHNlKVxuICAgICAgaWYgKHNhbml0aXplKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5kb21TYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHZhbHVlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHF1aWxsRWRpdG9yLmNsaXBib2FyZC5jb252ZXJ0KHsgaHRtbDogdmFsdWUgfSlcbiAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFt7IGluc2VydDogdmFsdWUgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVcbiAgfTtcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnByZXNlcnZlID0gdGhpcy5wcmVzZXJ2ZVdoaXRlc3BhY2U7XG4gICAgdGhpcy50b29sYmFyUG9zaXRpb24gPSB0aGlzLmN1c3RvbVRvb2xiYXJQb3NpdGlvbjtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAoaXNQbGF0Zm9ybVNlcnZlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBUaGUgYHF1aWxsLWVkaXRvcmAgY29tcG9uZW50IG1pZ2h0IGJlIGRlc3Ryb3llZCBiZWZvcmUgdGhlIGBxdWlsbGAgY2h1bmsgaXMgbG9hZGVkIGFuZCBpdHMgY29kZSBpcyBleGVjdXRlZFxuICAgIC8vIHRoaXMgd2lsbCBsZWFkIHRvIHJ1bnRpbWUgZXhjZXB0aW9ucywgc2luY2UgdGhlIGNvZGUgd2lsbCBiZSBleGVjdXRlZCBvbiBET00gbm9kZXMgdGhhdCBkb24ndCBleGlzdCB3aXRoaW4gdGhlIHRyZWUuXG5cbiAgICB0aGlzLnF1aWxsU3Vic2NyaXB0aW9uID0gdGhpcy5zZXJ2aWNlLmdldFF1aWxsKCkucGlwZShcbiAgICAgIG1lcmdlTWFwKChRdWlsbCkgPT4gdGhpcy5zZXJ2aWNlLmJlZm9yZVJlbmRlcihRdWlsbCwgdGhpcy5jdXN0b21Nb2R1bGVzLCB0aGlzLmJlZm9yZVJlbmRlcikpXG4gICAgKS5zdWJzY3JpYmUoUXVpbGwgPT4ge1xuICAgICAgdGhpcy5lZGl0b3JFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJ1txdWlsbC1lZGl0b3ItZWxlbWVudF0nXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRvb2xiYXJFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJ1txdWlsbC1lZGl0b3ItdG9vbGJhcl0nXG4gICAgICApXG4gICAgICBjb25zdCBtb2R1bGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5tb2R1bGVzIHx8IHRoaXMuc2VydmljZS5jb25maWcubW9kdWxlcylcblxuICAgICAgaWYgKHRvb2xiYXJFbGVtKSB7XG4gICAgICAgIG1vZHVsZXMudG9vbGJhciA9IHRvb2xiYXJFbGVtXG4gICAgICB9IGVsc2UgaWYgKG1vZHVsZXMudG9vbGJhciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1vZHVsZXMudG9vbGJhciA9IGRlZmF1bHRNb2R1bGVzLnRvb2xiYXJcbiAgICAgIH1cblxuICAgICAgbGV0IHBsYWNlaG9sZGVyID0gdGhpcy5wbGFjZWhvbGRlciAhPT0gdW5kZWZpbmVkID8gdGhpcy5wbGFjZWhvbGRlciA6IHRoaXMuc2VydmljZS5jb25maWcucGxhY2Vob2xkZXJcbiAgICAgIGlmIChwbGFjZWhvbGRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBsYWNlaG9sZGVyID0gJ0luc2VydCB0ZXh0IGhlcmUgLi4uJ1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdHlsZXMgPSB0aGlzLnN0eWxlcygpXG4gICAgICBpZiAoc3R5bGVzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWRpdG9yRWxlbSwga2V5LCBzdHlsZXNba2V5XSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xhc3Nlcykge1xuICAgICAgICB0aGlzLmFkZENsYXNzZXModGhpcy5jbGFzc2VzKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1c3RvbU9wdGlvbnMuZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0N1c3RvbU9wdGlvbiA9IFF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgICBuZXdDdXN0b21PcHRpb24ud2hpdGVsaXN0ID0gY3VzdG9tT3B0aW9uLndoaXRlbGlzdFxuICAgICAgICBRdWlsbC5yZWdpc3RlcihuZXdDdXN0b21PcHRpb24sIHRydWUpXG4gICAgICB9KVxuXG4gICAgICBsZXQgYm91bmRzID0gdGhpcy5ib3VuZHMgJiYgdGhpcy5ib3VuZHMgPT09ICdzZWxmJyA/IHRoaXMuZWRpdG9yRWxlbSA6IHRoaXMuYm91bmRzXG4gICAgICBpZiAoIWJvdW5kcykge1xuICAgICAgICBib3VuZHMgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmJvdW5kcyA/IHRoaXMuc2VydmljZS5jb25maWcuYm91bmRzIDogdGhpcy5kb2N1bWVudC5ib2R5XG4gICAgICB9XG5cbiAgICAgIGxldCBkZWJ1ZyA9IHRoaXMuZGVidWdcbiAgICAgIGlmICghZGVidWcgJiYgZGVidWcgIT09IGZhbHNlICYmIHRoaXMuc2VydmljZS5jb25maWcuZGVidWcpIHtcbiAgICAgICAgZGVidWcgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmRlYnVnXG4gICAgICB9XG5cbiAgICAgIGxldCByZWFkT25seSA9IHRoaXMucmVhZE9ubHlcbiAgICAgIGlmICghcmVhZE9ubHkgJiYgdGhpcy5yZWFkT25seSAhPT0gZmFsc2UpIHtcbiAgICAgICAgcmVhZE9ubHkgPSB0aGlzLnNlcnZpY2UuY29uZmlnLnJlYWRPbmx5ICE9PSB1bmRlZmluZWQgPyB0aGlzLnNlcnZpY2UuY29uZmlnLnJlYWRPbmx5IDogZmFsc2VcbiAgICAgIH1cblxuICAgICAgbGV0IGZvcm1hdHMgPSB0aGlzLmZvcm1hdHNcbiAgICAgIGlmICghZm9ybWF0cyAmJiBmb3JtYXRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZm9ybWF0cyA9IHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cyA/IFsuLi50aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdHNdIDogKHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cyA9PT0gbnVsbCA/IG51bGwgOiB1bmRlZmluZWQpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICAgICAgYm91bmRzLFxuICAgICAgICAgIGRlYnVnLFxuICAgICAgICAgIGZvcm1hdHMsXG4gICAgICAgICAgbW9kdWxlcyxcbiAgICAgICAgICBwbGFjZWhvbGRlcixcbiAgICAgICAgICByZWFkT25seSxcbiAgICAgICAgICByZWdpc3RyeTogdGhpcy5yZWdpc3RyeSxcbiAgICAgICAgICB0aGVtZTogdGhpcy50aGVtZSB8fCAodGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA/IHRoaXMuc2VydmljZS5jb25maWcudGhlbWUgOiAnc25vdycpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHRoaXMub25OYXRpdmVCbHVyLm9ic2VydmVkKSB7XG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3F1aWxsanMvcXVpbGwvaXNzdWVzLzIxODYjaXNzdWVjb21tZW50LTUzMzQwMTMyOFxuICAgICAgICAgIGZyb21FdmVudCh0aGlzLnF1aWxsRWRpdG9yLnNjcm9sbC5kb21Ob2RlLCAnYmx1cicpLnBpcGUodW50aWxEZXN0cm95ZWQodGhpcykpLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9uTmF0aXZlQmx1ci5uZXh0KHtcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICAgIHNvdXJjZTogJ2RvbSdcbiAgICAgICAgICB9KSlcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcXVpbGxqcy9xdWlsbC9pc3N1ZXMvMjE4NiNpc3N1ZWNvbW1lbnQtODAzMjU3NTM4XG4gICAgICAgICAgY29uc3QgdG9vbGJhciA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0TW9kdWxlKCd0b29sYmFyJykgYXMgVG9vbGJhclxuICAgICAgICAgIGlmICh0b29sYmFyLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgZnJvbUV2ZW50KHRvb2xiYXIuY29udGFpbmVyLCAnbW91c2Vkb3duJykucGlwZSh1bnRpbERlc3Ryb3llZCh0aGlzKSkuc3Vic2NyaWJlKGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9uTmF0aXZlRm9jdXMub2JzZXJ2ZWQpIHtcbiAgICAgICAgICBmcm9tRXZlbnQodGhpcy5xdWlsbEVkaXRvci5zY3JvbGwuZG9tTm9kZSwgJ2ZvY3VzJykucGlwZSh1bnRpbERlc3Ryb3llZCh0aGlzKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMub25OYXRpdmVGb2N1cy5uZXh0KHtcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICAgIHNvdXJjZTogJ2RvbSdcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBvcHRpb25hbCBsaW5rIHBsYWNlaG9sZGVyLCBRdWlsbCBoYXMgbm8gbmF0aXZlIEFQSSBmb3IgaXQgc28gdXNpbmcgd29ya2Fyb3VuZFxuICAgICAgICBpZiAodGhpcy5saW5rUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICBjb25zdCB0b29sdGlwID0gKHRoaXMucXVpbGxFZGl0b3IgYXMgYW55KT8udGhlbWU/LnRvb2x0aXBcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IHRvb2x0aXA/LnJvb3Q/LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2RhdGEtbGlua10nKVxuICAgICAgICAgIGlmIChpbnB1dD8uZGF0YXNldCkge1xuICAgICAgICAgICAgaW5wdXQuZGF0YXNldC5saW5rID0gdGhpcy5saW5rUGxhY2Vob2xkZXJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gZ2V0Rm9ybWF0KHRoaXMuZm9ybWF0LCB0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdClcblxuICAgICAgICBpZiAoZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQodGhpcy5jb250ZW50LCAnc2lsZW50JylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZVNldHRlciA9IHRoaXMudmFsdWVTZXR0ZXI7XG4gICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZVNldHRlcih0aGlzLnF1aWxsRWRpdG9yLCB0aGlzLmNvbnRlbnQpXG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhuZXdWYWx1ZSwgJ3NpbGVudCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRNb2R1bGUoJ2hpc3RvcnknKSBhcyBIaXN0b3J5XG4gICAgICAgIGhpc3RvcnkuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICAvLyBpbml0aWFsaXplIGRpc2FibGVkIHN0YXR1cyBiYXNlZCBvbiB0aGlzLmRpc2FibGVkIGFzIGRlZmF1bHQgdmFsdWVcbiAgICAgIHRoaXMuc2V0RGlzYWJsZWRTdGF0ZSgpXG5cbiAgICAgIHRoaXMuYWRkUXVpbGxFdmVudExpc3RlbmVycygpXG5cbiAgICAgIC8vIFRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB0cmlnZ2VycyBjaGFuZ2UgZGV0ZWN0aW9uLiBUaGVyZSdzIG5vIHNlbnNlIHRvIGludm9rZSB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgaWYgYW55b25lIGlzXG4gICAgICAvLyBsaXN0ZW5pbmcgdG8gdGhlIGBvbkVkaXRvckNyZWF0ZWRgIGV2ZW50IGluc2lkZSB0aGUgdGVtcGxhdGUsIGZvciBpbnN0YW5jZSBgPHF1aWxsLXZpZXcgKG9uRWRpdG9yQ3JlYXRlZCk9XCIuLi5cIj5gLlxuICAgICAgaWYgKCF0aGlzLm9uRWRpdG9yQ3JlYXRlZC5vYnNlcnZlZCAmJiAhdGhpcy5vblZhbGlkYXRvckNoYW5nZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB3aWxsIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBhbmQgYG9uRWRpdG9yQ3JlYXRlZGAgd2lsbCBhbHNvIGNhbGwgYG1hcmtEaXJ0eSgpYFxuICAgICAgLy8gaW50ZXJuYWxseSwgc2luY2UgQW5ndWxhciB3cmFwcyB0ZW1wbGF0ZSBldmVudCBsaXN0ZW5lcnMgaW50byBgbGlzdGVuZXJgIGluc3RydWN0aW9uLiBXZSdyZSB1c2luZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWBcbiAgICAgIC8vIHRvIHByZXZlbnQgdGhlIGZyYW1lIGRyb3AgYW5kIGF2b2lkIGBFeHByZXNzaW9uQ2hhbmdlZEFmdGVySXRIYXNCZWVuQ2hlY2tlZEVycm9yYCBlcnJvci5cbiAgICAgIHJhZiQoKS5waXBlKHVudGlsRGVzdHJveWVkKHRoaXMpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5vblZhbGlkYXRvckNoYW5nZWQpIHtcbiAgICAgICAgICB0aGlzLm9uVmFsaWRhdG9yQ2hhbmdlZCgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vbkVkaXRvckNyZWF0ZWQuZW1pdCh0aGlzLnF1aWxsRWRpdG9yKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlciA9IChyYW5nZTogUmFuZ2UgfCBudWxsLCBvbGRSYW5nZTogUmFuZ2UgfCBudWxsLCBzb3VyY2U6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHRyYWNrQ2hhbmdlcyA9IHRoaXMudHJhY2tDaGFuZ2VzIHx8IHRoaXMuc2VydmljZS5jb25maWcudHJhY2tDaGFuZ2VzXG4gICAgY29uc3Qgc2hvdWxkVHJpZ2dlck9uTW9kZWxUb3VjaGVkID0gIXJhbmdlICYmICEhdGhpcy5vbk1vZGVsVG91Y2hlZCAmJiAoc291cmNlID09PSAndXNlcicgfHwgdHJhY2tDaGFuZ2VzICYmIHRyYWNrQ2hhbmdlcyA9PT0gJ2FsbCcpXG5cbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyB3aGVuIHRoZXJlJ3MgYW55IGxpc3RlbmVyXG4gICAgaWYgKCF0aGlzLm9uQmx1ci5vYnNlcnZlZCAmJlxuICAgICAgIXRoaXMub25Gb2N1cy5vYnNlcnZlZCAmJlxuICAgICAgIXRoaXMub25TZWxlY3Rpb25DaGFuZ2VkLm9ic2VydmVkICYmXG4gICAgICAhc2hvdWxkVHJpZ2dlck9uTW9kZWxUb3VjaGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIGlmIChyYW5nZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9uQmx1ci5lbWl0KHtcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgc291cmNlXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKG9sZFJhbmdlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMub25Gb2N1cy5lbWl0KHtcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgc291cmNlXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25TZWxlY3Rpb25DaGFuZ2VkLmVtaXQoe1xuICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgIG9sZFJhbmdlLFxuICAgICAgICByYW5nZSxcbiAgICAgICAgc291cmNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoc2hvdWxkVHJpZ2dlck9uTW9kZWxUb3VjaGVkKSB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpXG4gICAgfSlcbiAgfVxuXG4gIHRleHRDaGFuZ2VIYW5kbGVyID0gKGRlbHRhOiBEZWx0YVR5cGUsIG9sZERlbHRhOiBEZWx0YVR5cGUsIHNvdXJjZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgLy8gb25seSBlbWl0IGNoYW5nZXMgZW1pdHRlZCBieSB1c2VyIGludGVyYWN0aW9uc1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKVxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldENvbnRlbnRzKClcblxuICAgIGxldCBodG1sOiBzdHJpbmcgfCBudWxsID0gdGhpcy5xdWlsbEVkaXRvci5nZXRTZW1hbnRpY0hUTUwoKVxuICAgIGlmICh0aGlzLmlzRW1wdHlWYWx1ZShodG1sKSkge1xuICAgICAgaHRtbCA9IHRoaXMuZGVmYXVsdEVtcHR5VmFsdWUoKVxuICAgIH1cblxuICAgIGNvbnN0IHRyYWNrQ2hhbmdlcyA9IHRoaXMudHJhY2tDaGFuZ2VzIHx8IHRoaXMuc2VydmljZS5jb25maWcudHJhY2tDaGFuZ2VzXG4gICAgY29uc3Qgc2hvdWxkVHJpZ2dlck9uTW9kZWxDaGFuZ2UgPSAoc291cmNlID09PSAndXNlcicgfHwgdHJhY2tDaGFuZ2VzICYmIHRyYWNrQ2hhbmdlcyA9PT0gJ2FsbCcpICYmICEhdGhpcy5vbk1vZGVsQ2hhbmdlXG5cbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyB3aGVuIHRoZXJlJ3MgYW55IGxpc3RlbmVyXG4gICAgaWYgKCF0aGlzLm9uQ29udGVudENoYW5nZWQub2JzZXJ2ZWQgJiYgIXNob3VsZFRyaWdnZXJPbk1vZGVsQ2hhbmdlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIGlmIChzaG91bGRUcmlnZ2VyT25Nb2RlbENoYW5nZSkge1xuICAgICAgICBjb25zdCB2YWx1ZUdldHRlciA9IHRoaXMudmFsdWVHZXR0ZXI7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZShcbiAgICAgICAgICB2YWx1ZUdldHRlcih0aGlzLnF1aWxsRWRpdG9yKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlZC5lbWl0KHtcbiAgICAgICAgY29udGVudCxcbiAgICAgICAgZGVsdGEsXG4gICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgaHRtbCxcbiAgICAgICAgb2xkRGVsdGEsXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgdGV4dFxuICAgICAgfSlcblxuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKVxuICAgIH0pXG4gIH1cblxuICBlZGl0b3JDaGFuZ2VIYW5kbGVyID0gKFxuICAgIGV2ZW50OiAndGV4dC1jaGFuZ2UnIHwgJ3NlbGVjdGlvbi1jaGFuZ2UnLFxuICAgIGN1cnJlbnQ6IGFueSB8IFJhbmdlIHwgbnVsbCwgb2xkOiBhbnkgfCBSYW5nZSB8IG51bGwsIHNvdXJjZTogc3RyaW5nXG4gICk6IHZvaWQgPT4ge1xuICAgIC8vIG9ubHkgZW1pdCBjaGFuZ2VzIHdoZW4gdGhlcmUncyBhbnkgbGlzdGVuZXJcbiAgICBpZiAoIXRoaXMub25FZGl0b3JDaGFuZ2VkLm9ic2VydmVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyBlbWl0dGVkIGJ5IHVzZXIgaW50ZXJhY3Rpb25zXG4gICAgaWYgKGV2ZW50ID09PSAndGV4dC1jaGFuZ2UnKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRUZXh0KClcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldENvbnRlbnRzKClcblxuICAgICAgbGV0IGh0bWw6IHN0cmluZyB8IG51bGwgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFNlbWFudGljSFRNTCgpXG4gICAgICBpZiAodGhpcy5pc0VtcHR5VmFsdWUoaHRtbCkpIHtcbiAgICAgICAgaHRtbCA9IHRoaXMuZGVmYXVsdEVtcHR5VmFsdWUoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5vbkVkaXRvckNoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgY29udGVudCxcbiAgICAgICAgICBkZWx0YTogY3VycmVudCxcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgaHRtbCxcbiAgICAgICAgICBvbGREZWx0YTogb2xkLFxuICAgICAgICAgIHNvdXJjZSxcbiAgICAgICAgICB0ZXh0XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMub25FZGl0b3JDaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICBldmVudCxcbiAgICAgICAgICBvbGRSYW5nZTogb2xkLFxuICAgICAgICAgIHJhbmdlOiBjdXJyZW50LFxuICAgICAgICAgIHNvdXJjZVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kaXNwb3NlKClcblxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKClcbiAgICB0aGlzLnF1aWxsU3Vic2NyaXB0aW9uID0gbnVsbFxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9kb3Qtbm90YXRpb24gKi9cbiAgICBpZiAoY2hhbmdlcy5yZWFkT25seSkge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5lbmFibGUoIWNoYW5nZXMucmVhZE9ubHkuY3VycmVudFZhbHVlKVxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5yb290LmRhdGFzZXQucGxhY2Vob2xkZXIgPVxuICAgICAgICBjaGFuZ2VzLnBsYWNlaG9sZGVyLmN1cnJlbnRWYWx1ZVxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5zdHlsZXMpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTdHlsaW5nID0gY2hhbmdlcy5zdHlsZXMuY3VycmVudFZhbHVlXG4gICAgICBjb25zdCBwcmV2aW91c1N0eWxpbmcgPSBjaGFuZ2VzLnN0eWxlcy5wcmV2aW91c1ZhbHVlXG5cbiAgICAgIGlmIChwcmV2aW91c1N0eWxpbmcpIHtcbiAgICAgICAgT2JqZWN0LmtleXMocHJldmlvdXNTdHlsaW5nKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5lZGl0b3JFbGVtLCBrZXkpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFN0eWxpbmcpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudFN0eWxpbmcpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSwgdGhpcy5zdHlsZXMoKVtrZXldKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5jbGFzc2VzKSB7XG4gICAgICBjb25zdCBjdXJyZW50Q2xhc3NlcyA9IGNoYW5nZXMuY2xhc3Nlcy5jdXJyZW50VmFsdWVcbiAgICAgIGNvbnN0IHByZXZpb3VzQ2xhc3NlcyA9IGNoYW5nZXMuY2xhc3Nlcy5wcmV2aW91c1ZhbHVlXG5cbiAgICAgIGlmIChwcmV2aW91c0NsYXNzZXMpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbGFzc2VzKHByZXZpb3VzQ2xhc3NlcylcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRDbGFzc2VzKSB7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3NlcyhjdXJyZW50Q2xhc3NlcylcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gV2UnZCB3YW50IHRvIHJlLWFwcGx5IGV2ZW50IGxpc3RlbmVycyBpZiB0aGUgYGRlYm91bmNlVGltZWAgYmluZGluZyBjaGFuZ2VzIHRvIGFwcGx5IHRoZVxuICAgIC8vIGBkZWJvdW5jZVRpbWVgIG9wZXJhdG9yIG9yIHZpY2UtdmVyc2EgcmVtb3ZlIGl0LlxuICAgIGlmIChjaGFuZ2VzLmRlYm91bmNlVGltZSkge1xuICAgICAgdGhpcy5hZGRRdWlsbEV2ZW50TGlzdGVuZXJzKClcbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvZG90LW5vdGF0aW9uICovXG4gIH1cblxuICBhZGRDbGFzc2VzKGNsYXNzTGlzdDogc3RyaW5nKTogdm9pZCB7XG4gICAgUXVpbGxFZGl0b3JCYXNlLm5vcm1hbGl6ZUNsYXNzTmFtZXMoY2xhc3NMaXN0KS5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lZGl0b3JFbGVtLCBjKVxuICAgIH0pXG4gIH1cblxuICByZW1vdmVDbGFzc2VzKGNsYXNzTGlzdDogc3RyaW5nKTogdm9pZCB7XG4gICAgUXVpbGxFZGl0b3JCYXNlLm5vcm1hbGl6ZUNsYXNzTmFtZXMoY2xhc3NMaXN0KS5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lZGl0b3JFbGVtLCBjKVxuICAgIH0pXG4gIH1cblxuICB3cml0ZVZhbHVlKGN1cnJlbnRWYWx1ZTogYW55KSB7XG5cbiAgICAvLyBvcHRpb25hbCBmaXggZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE0OTg4XG4gICAgaWYgKHRoaXMuZmlsdGVyTnVsbCAmJiBjdXJyZW50VmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuY29udGVudCA9IGN1cnJlbnRWYWx1ZVxuXG4gICAgaWYgKCF0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBmb3JtYXQgPSBnZXRGb3JtYXQodGhpcy5mb3JtYXQsIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0KVxuICAgIGNvbnN0IHZhbHVlU2V0dGVyID0gdGhpcy52YWx1ZVNldHRlcjtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIGN1cnJlbnRWYWx1ZSlcblxuICAgIGlmICh0aGlzLmNvbXBhcmVWYWx1ZXMpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRFZGl0b3JWYWx1ZSA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKVxuICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGN1cnJlbnRFZGl0b3JWYWx1ZSkgPT09IEpTT04uc3RyaW5naWZ5KG5ld1ZhbHVlKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFZhbHVlKSB7XG4gICAgICBpZiAoZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KGN1cnJlbnRWYWx1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0Q29udGVudHMobmV3VmFsdWUpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KCcnKVxuXG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4gPSB0aGlzLmRpc2FibGVkKTogdm9pZCB7XG4gICAgLy8gc3RvcmUgaW5pdGlhbCB2YWx1ZSB0byBzZXQgYXBwcm9wcmlhdGUgZGlzYWJsZWQgc3RhdHVzIGFmdGVyIFZpZXdJbml0XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWRcbiAgICBpZiAodGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5kaXNhYmxlKClcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsICdkaXNhYmxlZCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXRoaXMucmVhZE9ubHkpIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLmVuYWJsZSgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKG1vZGVsVmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuXG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmblxuICB9XG5cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMub25WYWxpZGF0b3JDaGFuZ2VkID0gZm5cbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBlcnI6IHtcbiAgICAgIG1pbkxlbmd0aEVycm9yPzoge1xuICAgICAgICBnaXZlbjogbnVtYmVyXG4gICAgICAgIG1pbkxlbmd0aDogbnVtYmVyXG4gICAgICB9XG4gICAgICBtYXhMZW5ndGhFcnJvcj86IHtcbiAgICAgICAgZ2l2ZW46IG51bWJlclxuICAgICAgICBtYXhMZW5ndGg6IG51bWJlclxuICAgICAgfVxuICAgICAgcmVxdWlyZWRFcnJvcj86IHsgZW1wdHk6IGJvb2xlYW4gfVxuICAgIH0gPSB7fVxuICAgIGxldCB2YWxpZCA9IHRydWVcblxuICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKVxuICAgIC8vIHRyaW0gdGV4dCBpZiB3YW50ZWQgKyBoYW5kbGUgc3BlY2lhbCBjYXNlIHRoYXQgYW4gZW1wdHkgZWRpdG9yIGNvbnRhaW5zIGEgbmV3IGxpbmVcbiAgICBjb25zdCB0ZXh0TGVuZ3RoID0gdGhpcy50cmltT25WYWxpZGF0aW9uID8gdGV4dC50cmltKCkubGVuZ3RoIDogKHRleHQubGVuZ3RoID09PSAxICYmIHRleHQudHJpbSgpLmxlbmd0aCA9PT0gMCA/IDAgOiB0ZXh0Lmxlbmd0aCAtIDEpXG4gICAgY29uc3QgZGVsdGFPcGVyYXRpb25zID0gdGhpcy5xdWlsbEVkaXRvci5nZXRDb250ZW50cygpLm9wc1xuICAgIGNvbnN0IG9ubHlFbXB0eU9wZXJhdGlvbiA9ICEhZGVsdGFPcGVyYXRpb25zICYmIGRlbHRhT3BlcmF0aW9ucy5sZW5ndGggPT09IDEgJiYgWydcXG4nLCAnJ10uaW5jbHVkZXMoZGVsdGFPcGVyYXRpb25zWzBdLmluc2VydD8udG9TdHJpbmcoKSlcblxuICAgIGlmICh0aGlzLm1pbkxlbmd0aCAmJiB0ZXh0TGVuZ3RoICYmIHRleHRMZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xuICAgICAgZXJyLm1pbkxlbmd0aEVycm9yID0ge1xuICAgICAgICBnaXZlbjogdGV4dExlbmd0aCxcbiAgICAgICAgbWluTGVuZ3RoOiB0aGlzLm1pbkxlbmd0aFxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF4TGVuZ3RoICYmIHRleHRMZW5ndGggPiB0aGlzLm1heExlbmd0aCkge1xuICAgICAgZXJyLm1heExlbmd0aEVycm9yID0ge1xuICAgICAgICBnaXZlbjogdGV4dExlbmd0aCxcbiAgICAgICAgbWF4TGVuZ3RoOiB0aGlzLm1heExlbmd0aFxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVxdWlyZWQgJiYgIXRleHRMZW5ndGggJiYgb25seUVtcHR5T3BlcmF0aW9uKSB7XG4gICAgICBlcnIucmVxdWlyZWRFcnJvciA9IHtcbiAgICAgICAgZW1wdHk6IHRydWVcbiAgICAgIH1cblxuICAgICAgdmFsaWQgPSBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiB2YWxpZCA/IG51bGwgOiBlcnJcbiAgfVxuXG4gIHByaXZhdGUgYWRkUXVpbGxFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3Bvc2UoKVxuXG4gICAgLy8gV2UgaGF2ZSB0byBlbnRlciB0aGUgYDxyb290PmAgem9uZSB3aGVuIGFkZGluZyBldmVudCBsaXN0ZW5lcnMsIHNvIGBkZWJvdW5jZVRpbWVgIHdpbGwgc3Bhd24gdGhlXG4gICAgLy8gYEFzeW5jQWN0aW9uYCB0aGVyZSB3L28gdHJpZ2dlcmluZyBjaGFuZ2UgZGV0ZWN0aW9ucy4gV2Ugc3RpbGwgcmUtZW50ZXIgdGhlIEFuZ3VsYXIncyB6b25lIHRocm91Z2hcbiAgICAvLyBgem9uZS5ydW5gIHdoZW4gd2UgZW1pdCBhbiBldmVudCB0byB0aGUgcGFyZW50IGNvbXBvbmVudC5cbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKClcblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICAvLyBtYXJrIG1vZGVsIGFzIHRvdWNoZWQgaWYgZWRpdG9yIGxvc3QgZm9jdXNcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMucXVpbGxFZGl0b3IsICdzZWxlY3Rpb24tY2hhbmdlJykuc3Vic2NyaWJlKFxuICAgICAgICAgIChbcmFuZ2UsIG9sZFJhbmdlLCBzb3VyY2VdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZUhhbmRsZXIocmFuZ2UgYXMgYW55LCBvbGRSYW5nZSBhcyBhbnksIHNvdXJjZSlcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIClcblxuICAgICAgLy8gVGhlIGBmcm9tRXZlbnRgIHN1cHBvcnRzIHBhc3NpbmcgSlF1ZXJ5LXN0eWxlIGV2ZW50IHRhcmdldHMsIHRoZSBlZGl0b3IgaGFzIGBvbmAgYW5kIGBvZmZgIG1ldGhvZHMgd2hpY2hcbiAgICAgIC8vIHdpbGwgYmUgaW52b2tlZCB1cG9uIHN1YnNjcmlwdGlvbiBhbmQgdGVhcmRvd24uXG4gICAgICBsZXQgdGV4dENoYW5nZSQgPSBmcm9tRXZlbnQodGhpcy5xdWlsbEVkaXRvciwgJ3RleHQtY2hhbmdlJylcbiAgICAgIGxldCBlZGl0b3JDaGFuZ2UkID0gZnJvbUV2ZW50KHRoaXMucXVpbGxFZGl0b3IsICdlZGl0b3ItY2hhbmdlJylcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmRlYm91bmNlVGltZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGV4dENoYW5nZSQgPSB0ZXh0Q2hhbmdlJC5waXBlKGRlYm91bmNlVGltZSh0aGlzLmRlYm91bmNlVGltZSkpXG4gICAgICAgIGVkaXRvckNoYW5nZSQgPSBlZGl0b3JDaGFuZ2UkLnBpcGUoZGVib3VuY2VUaW1lKHRoaXMuZGVib3VuY2VUaW1lKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICAvLyB1cGRhdGUgbW9kZWwgaWYgdGV4dCBjaGFuZ2VzXG4gICAgICAgIHRleHRDaGFuZ2UkLnN1YnNjcmliZSgoW2RlbHRhLCBvbGREZWx0YSwgc291cmNlXSkgPT4ge1xuICAgICAgICAgIHRoaXMudGV4dENoYW5nZUhhbmRsZXIoZGVsdGEgYXMgYW55LCBvbGREZWx0YSBhcyBhbnksIHNvdXJjZSlcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICAvLyB0cmlnZ2VyZWQgaWYgc2VsZWN0aW9uIG9yIHRleHQgY2hhbmdlZFxuICAgICAgICBlZGl0b3JDaGFuZ2UkLnN1YnNjcmliZSgoW2V2ZW50LCBjdXJyZW50LCBvbGQsIHNvdXJjZV0pID0+IHtcbiAgICAgICAgICB0aGlzLmVkaXRvckNoYW5nZUhhbmRsZXIoZXZlbnQgYXMgJ3RleHQtY2hhbmdlJyB8ICdzZWxlY3Rpb24tY2hhbmdlJywgY3VycmVudCwgb2xkLCBzb3VyY2UpXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNFbXB0eVZhbHVlKGh0bWw6IHN0cmluZyB8IG51bGwpIHtcbiAgICByZXR1cm4gaHRtbCA9PT0gJzxwPjwvcD4nIHx8IGh0bWwgPT09ICc8ZGl2PjwvZGl2PicgfHwgaHRtbCA9PT0gJzxwPjxicj48L3A+JyB8fCBodG1sID09PSAnPGRpdj48YnI+PC9kaXY+J1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZCxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFF1aWxsRWRpdG9yQ29tcG9uZW50KVxuICAgIH0sXG4gICAge1xuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11c2UtYmVmb3JlLWRlZmluZVxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUXVpbGxFZGl0b3JDb21wb25lbnQpXG4gICAgfVxuICBdLFxuICBzZWxlY3RvcjogJ3F1aWxsLWVkaXRvcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiAqbmdJZj1cInRvb2xiYXJQb3NpdGlvbiAhPT0gJ3RvcCdcIiBxdWlsbC1lZGl0b3ItZWxlbWVudD48L2Rpdj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbYWJvdmUtcXVpbGwtZWRpdG9yLXRvb2xiYXJdXCI+PC9uZy1jb250ZW50PlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltxdWlsbC1lZGl0b3ItdG9vbGJhcl1cIj48L25nLWNvbnRlbnQ+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2JlbG93LXF1aWxsLWVkaXRvci10b29sYmFyXVwiPjwvbmctY29udGVudD5cbiAgICA8ZGl2ICpuZ0lmPVwidG9vbGJhclBvc2l0aW9uID09PSAndG9wJ1wiIHF1aWxsLWVkaXRvci1lbGVtZW50PjwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgOmhvc3Qge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIH1cbiAgICBgXG4gIF0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIFF1aWxsRWRpdG9yQ29tcG9uZW50IGV4dGVuZHMgUXVpbGxFZGl0b3JCYXNlIHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQEluamVjdChFbGVtZW50UmVmKSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBJbmplY3QoQ2hhbmdlRGV0ZWN0b3JSZWYpIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KERvbVNhbml0aXplcikgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogYW55LFxuICAgIEBJbmplY3QoUmVuZGVyZXIyKSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBJbmplY3QoTmdab25lKSB6b25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChRdWlsbFNlcnZpY2UpIHNlcnZpY2U6IFF1aWxsU2VydmljZVxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIGluamVjdG9yLFxuICAgICAgZWxlbWVudFJlZixcbiAgICAgIGNkLFxuICAgICAgZG9tU2FuaXRpemVyLFxuICAgICAgcGxhdGZvcm1JZCxcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgem9uZSxcbiAgICAgIHNlcnZpY2VcbiAgICApXG4gIH1cblxufVxuIl19