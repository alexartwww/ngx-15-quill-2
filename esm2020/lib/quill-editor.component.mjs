var QuillEditorBase_1;
import { __decorate } from "tslib";
import { CommonModule, DOCUMENT, isPlatformServer } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Output, PLATFORM_ID, Renderer2, SecurityContext, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { defaultModules } from 'ngx-quill/config';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9zcmMvbGliL3F1aWxsLWVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLEVBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFBO0FBQ3hFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQU14RCxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUVOLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUNOLFdBQVcsRUFDWCxTQUFTLEVBQ1QsZUFBZSxFQUVmLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQTtBQUN0QixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQTtBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRXZELE9BQU8sRUFBd0IsYUFBYSxFQUFFLGlCQUFpQixFQUFhLE1BQU0sZ0JBQWdCLENBQUE7QUFFbEcsT0FBTyxFQUE4QixjQUFjLEVBQW1DLE1BQU0sa0JBQWtCLENBQUE7QUFJOUcsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxXQUFXLENBQUE7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzlDLE9BQU8sRUFBQyxZQUFZLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7Ozs7OztJQTBzQi9ELHlCQUFrRTs7O0lBSWxFLHlCQUFrRTs7OztBQXRxQi9ELElBQWUsZUFBZSx1QkFBOUIsTUFBZSxlQUFlO0lBcUVuQyxZQUNFLFFBQWtCLEVBQ1gs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SyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLG1FQUFtRTtnQkFDbkUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzthQUNwRDtTQUNGOztRQUdDLHFFQUFrRTtRQUNsRSxrQkFBK0Q7UUFDL0QscUJBQXlEO1FBQ3pELHFCQUErRDtRQUMvRCxxRUFBa0U7O1FBSjVELG9EQUErQjtRQUkvQixlQUErQjtRQUEvQixvREFBK0I7d0JBVTdCLFlBQVk7dUZBRVgsb0JBQW9CO2NBbENoQyxTQUFTO2dDQUNPLGlCQUFpQixDQUFDLFFBQVEsYUFDOUI7b0JBQ1Q7d0JBQ0UsS0FBSyxFQUFFLElBQUk7d0JBQ1gsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsbUVBQW1FO3dCQUNuRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQztxQkFDcEQ7b0JBQ0Q7d0JBQ0UsS0FBSyxFQUFFLElBQUk7d0JBQ1gsT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLG1FQUFtRTt3QkFDbkUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLENBQUM7cUJBQ3BEO2lCQUNGLFlBQ1MsY0FBYyxZQUNkOzs7Ozs7R0FNVCxjQVFXLElBQUksV0FDUCxDQUFDLFlBQVksQ0FBQzs7c0JBTXBCLE1BQU07dUJBQUMsVUFBVTs7c0JBQ2pCLE1BQU07dUJBQUMsaUJBQWlCOztzQkFDeEIsTUFBTTt1QkFBQyxZQUFZOztzQkFDbkIsTUFBTTt1QkFBQyxXQUFXOztzQkFDbEIsTUFBTTt1QkFBQyxTQUFTOztzQkFDaEIsTUFBTTt1QkFBQyxNQUFNOztzQkFDYixNQUFNO3VCQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbW1vbk1vZHVsZSwgRE9DVU1FTlQsIGlzUGxhdGZvcm1TZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbidcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXG5cbmltcG9ydCB0eXBlIFF1aWxsVHlwZSBmcm9tICdxdWlsbCdcbmltcG9ydCB0eXBlIHsgUXVpbGxPcHRpb25zIH0gZnJvbSAncXVpbGwnXG5pbXBvcnQgdHlwZSBEZWx0YVR5cGUgZnJvbSAncXVpbGwtZGVsdGEnXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IGZyb21FdmVudCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcydcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycydcblxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SLCBWYWxpZGF0b3IgfSBmcm9tICdAYW5ndWxhci9mb3JtcydcblxuaW1wb3J0IHsgQ3VzdG9tTW9kdWxlLCBDdXN0b21PcHRpb24sIGRlZmF1bHRNb2R1bGVzLCBRdWlsbEJlZm9yZVJlbmRlciwgUXVpbGxNb2R1bGVzIH0gZnJvbSAnbmd4LXF1aWxsL2NvbmZpZydcblxuaW1wb3J0IHR5cGUgSGlzdG9yeSBmcm9tICdxdWlsbC9tb2R1bGVzL2hpc3RvcnknXG5pbXBvcnQgdHlwZSBUb29sYmFyIGZyb20gJ3F1aWxsL21vZHVsZXMvdG9vbGJhcidcbmltcG9ydCB7IGdldEZvcm1hdCwgcmFmJCB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB7IFF1aWxsU2VydmljZSB9IGZyb20gJy4vcXVpbGwuc2VydmljZSdcbmltcG9ydCB7VW50aWxEZXN0cm95LCB1bnRpbERlc3Ryb3llZH0gZnJvbSBcIkBuZ25lYXQvdW50aWwtZGVzdHJveVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlIHtcbiAgaW5kZXg6IG51bWJlclxuICBsZW5ndGg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRlbnRDaGFuZ2Uge1xuICBjb250ZW50OiBEZWx0YVR5cGVcbiAgZGVsdGE6IERlbHRhVHlwZVxuICBlZGl0b3I6IFF1aWxsVHlwZVxuICBodG1sOiBzdHJpbmcgfCBudWxsXG4gIG9sZERlbHRhOiBEZWx0YVR5cGVcbiAgc291cmNlOiBzdHJpbmdcbiAgdGV4dDogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0aW9uQ2hhbmdlIHtcbiAgZWRpdG9yOiBRdWlsbFR5cGVcbiAgb2xkUmFuZ2U6IFJhbmdlIHwgbnVsbFxuICByYW5nZTogUmFuZ2UgfCBudWxsXG4gIHNvdXJjZTogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmx1ciB7XG4gIGVkaXRvcjogUXVpbGxUeXBlXG4gIHNvdXJjZTogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRm9jdXMge1xuICBlZGl0b3I6IFF1aWxsVHlwZVxuICBzb3VyY2U6IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBFZGl0b3JDaGFuZ2VDb250ZW50ID0gQ29udGVudENoYW5nZSAmIHsgZXZlbnQ6ICd0ZXh0LWNoYW5nZScgfVxuZXhwb3J0IHR5cGUgRWRpdG9yQ2hhbmdlU2VsZWN0aW9uID0gU2VsZWN0aW9uQ2hhbmdlICYgeyBldmVudDogJ3NlbGVjdGlvbi1jaGFuZ2UnIH1cblxuQFVudGlsRGVzdHJveSgpXG5ARGlyZWN0aXZlKClcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLWNsYXNzLXN1ZmZpeFxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFF1aWxsRWRpdG9yQmFzZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95LCBWYWxpZGF0b3Ige1xuICBASW5wdXQoKSBmb3JtYXQ/OiAnb2JqZWN0JyB8ICdodG1sJyB8ICd0ZXh0JyB8ICdqc29uJ1xuICBASW5wdXQoKSB0aGVtZT86IHN0cmluZ1xuICBASW5wdXQoKSBtb2R1bGVzPzogUXVpbGxNb2R1bGVzXG4gIEBJbnB1dCgpIGRlYnVnPzogJ3dhcm4nIHwgJ2xvZycgfCAnZXJyb3InIHwgZmFsc2VcbiAgQElucHV0KCkgcmVhZE9ubHk/OiBib29sZWFuXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyPzogc3RyaW5nXG4gIEBJbnB1dCgpIG1heExlbmd0aD86IG51bWJlclxuICBASW5wdXQoKSBtaW5MZW5ndGg/OiBudW1iZXJcbiAgQElucHV0KCkgcmVxdWlyZWQgPSBmYWxzZVxuICBASW5wdXQoKSBmb3JtYXRzPzogc3RyaW5nW10gfCBudWxsXG4gIEBJbnB1dCgpIGN1c3RvbVRvb2xiYXJQb3NpdGlvbjogJ3RvcCcgfCAnYm90dG9tJyA9ICd0b3AnXG4gIEBJbnB1dCgpIHNhbml0aXplPzogYm9vbGVhblxuICBASW5wdXQoKSBiZWZvcmVSZW5kZXI/OiBRdWlsbEJlZm9yZVJlbmRlclxuICBASW5wdXQoKSBzdHlsZXM6IGFueSA9IG51bGxcbiAgQElucHV0KCkgc3RyaWN0ID0gdHJ1ZVxuICBASW5wdXQoKSBzY3JvbGxpbmdDb250YWluZXI/OiBIVE1MRWxlbWVudCB8IHN0cmluZyB8IG51bGxcbiAgQElucHV0KCkgYm91bmRzPzogSFRNTEVsZW1lbnQgfCBzdHJpbmdcbiAgQElucHV0KCkgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9uW10gPSBbXVxuICBASW5wdXQoKSBjdXN0b21Nb2R1bGVzOiBDdXN0b21Nb2R1bGVbXSA9IFtdXG4gIEBJbnB1dCgpIHRyYWNrQ2hhbmdlcz86ICd1c2VyJyB8ICdhbGwnXG4gIEBJbnB1dCgpIHByZXNlcnZlV2hpdGVzcGFjZSA9IGZhbHNlXG4gIEBJbnB1dCgpIGNsYXNzZXM/OiBzdHJpbmdcbiAgQElucHV0KCkgdHJpbU9uVmFsaWRhdGlvbiA9IGZhbHNlXG4gIEBJbnB1dCgpIGxpbmtQbGFjZWhvbGRlcj86IHN0cmluZ1xuICBASW5wdXQoKSBjb21wYXJlVmFsdWVzID0gZmFsc2VcbiAgQElucHV0KCkgZmlsdGVyTnVsbCA9IGZhbHNlXG4gIEBJbnB1dCgpIGRlYm91bmNlVGltZT86IG51bWJlclxuICBASW5wdXQoKSByZWdpc3RyeTogUXVpbGxPcHRpb25zWydyZWdpc3RyeSddO1xuICAvKlxuICBodHRwczovL2dpdGh1Yi5jb20vS2lsbGVyQ29kZU1vbmtleS9uZ3gtcXVpbGwvaXNzdWVzLzEyNTcgLSBmaXggbnVsbCB2YWx1ZSBzZXRcblxuICBwcm92aWRlIGRlZmF1bHQgZW1wdHkgdmFsdWVcbiAgYnkgZGVmYXVsdCBudWxsXG5cbiAgZS5nLiBkZWZhdWx0RW1wdHlWYWx1ZT1cIlwiIC0gZW1wdHkgc3RyaW5nXG5cbiAgPHF1aWxsLWVkaXRvclxuICAgIGRlZmF1bHRFbXB0eVZhbHVlPVwiXCJcbiAgICBmb3JtQ29udHJvbE5hbWU9XCJtZXNzYWdlXCJcbiAgPjwvcXVpbGwtZWRpdG9yPlxuICAqL1xuICBASW5wdXQoKSBkZWZhdWx0RW1wdHlWYWx1ZTogYW55ID0gbnVsbDtcblxuICBAT3V0cHV0KCkgb25FZGl0b3JDcmVhdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxRdWlsbFR5cGU+KClcbiAgQE91dHB1dCgpIG9uRWRpdG9yQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8RWRpdG9yQ2hhbmdlQ29udGVudCB8IEVkaXRvckNoYW5nZVNlbGVjdGlvbj4oKVxuICBAT3V0cHV0KCkgb25Db250ZW50Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q29udGVudENoYW5nZT4oKVxuICBAT3V0cHV0KCkgb25TZWxlY3Rpb25DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxTZWxlY3Rpb25DaGFuZ2U+KClcbiAgQE91dHB1dCgpIG9uRm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPEZvY3VzPigpXG4gIEBPdXRwdXQoKSBvbkJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPEJsdXI+KClcbiAgQE91dHB1dCgpIG9uTmF0aXZlRm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPEZvY3VzPigpXG4gIEBPdXRwdXQoKSBvbk5hdGl2ZUJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPEJsdXI+KClcblxuICBxdWlsbEVkaXRvciE6IFF1aWxsVHlwZVxuICBlZGl0b3JFbGVtITogSFRNTEVsZW1lbnRcbiAgY29udGVudDogYW55XG4gIGRpc2FibGVkID0gZmFsc2UgLy8gdXNlZCB0byBzdG9yZSBpbml0aWFsIHZhbHVlIGJlZm9yZSBWaWV3SW5pdFxuXG4gIHB1YmxpYyBwcmVzZXJ2ZTpib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyB0b29sYmFyUG9zaXRpb246IHN0cmluZyA9ICd0b3AnO1xuXG4gIG9uTW9kZWxDaGFuZ2U6IChtb2RlbFZhbHVlPzogYW55KSA9PiB2b2lkXG4gIG9uTW9kZWxUb3VjaGVkOiAoKSA9PiB2b2lkXG4gIG9uVmFsaWRhdG9yQ2hhbmdlZDogKCkgPT4gdm9pZFxuXG4gIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbFxuICBwcml2YXRlIHF1aWxsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgcGxhdGZvcm1JZDogYW55LFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIHNlcnZpY2U6IFF1aWxsU2VydmljZVxuICApIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gaW5qZWN0b3IuZ2V0KERPQ1VNRU5UKVxuICB9XG5cbiAgc3RhdGljIG5vcm1hbGl6ZUNsYXNzTmFtZXMoY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGNsYXNzZXMudHJpbSgpLnNwbGl0KCcgJylcbiAgICByZXR1cm4gY2xhc3NMaXN0LnJlZHVjZSgocHJldjogc3RyaW5nW10sIGN1cjogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB0cmltbWVkID0gY3VyLnRyaW0oKVxuICAgICAgaWYgKHRyaW1tZWQpIHtcbiAgICAgICAgcHJldi5wdXNoKHRyaW1tZWQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2XG4gICAgfSwgW10pXG4gIH1cblxuICBASW5wdXQoKSB2YWx1ZUdldHRlciA9IChxdWlsbEVkaXRvcjogUXVpbGxUeXBlKTogc3RyaW5nIHwgYW55ID0+IHtcbiAgICBsZXQgaHRtbDogc3RyaW5nIHwgbnVsbCA9IHF1aWxsRWRpdG9yLmdldFNlbWFudGljSFRNTCgpXG4gICAgaWYgKHRoaXMuaXNFbXB0eVZhbHVlKGh0bWwpKSB7XG4gICAgICBodG1sID0gdGhpcy5kZWZhdWx0RW1wdHlWYWx1ZSgpXG4gICAgfVxuICAgIGxldCBtb2RlbFZhbHVlOiBzdHJpbmcgfCBEZWx0YVR5cGUgfCBudWxsID0gaHRtbFxuICAgIGNvbnN0IGZvcm1hdCA9IGdldEZvcm1hdCh0aGlzLmZvcm1hdCwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXQpXG5cbiAgICBpZiAoZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRUZXh0KClcbiAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRDb250ZW50cygpXG4gICAgfSBlbHNlIGlmIChmb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbW9kZWxWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHF1aWxsRWRpdG9yLmdldENvbnRlbnRzKCkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIG1vZGVsVmFsdWUgPSBxdWlsbEVkaXRvci5nZXRUZXh0KClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZWxWYWx1ZVxuICB9O1xuXG4gIEBJbnB1dCgpIHZhbHVlU2V0dGVyID0gKHF1aWxsRWRpdG9yOiBRdWlsbFR5cGUsIHZhbHVlOiBhbnkpOiBhbnkgPT4ge1xuICAgIGNvbnN0IGZvcm1hdCA9IGdldEZvcm1hdCh0aGlzLmZvcm1hdCwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXQpXG4gICAgaWYgKGZvcm1hdCA9PT0gJ2h0bWwnKSB7XG4gICAgICBjb25zdCBzYW5pdGl6ZSA9IFt0cnVlLCBmYWxzZV0uaW5jbHVkZXModGhpcy5zYW5pdGl6ZSkgPyB0aGlzLnNhbml0aXplIDogKHRoaXMuc2VydmljZS5jb25maWcuc2FuaXRpemUgfHwgZmFsc2UpXG4gICAgICBpZiAoc2FuaXRpemUpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmRvbVNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCwgdmFsdWUpXG4gICAgICB9XG4gICAgICByZXR1cm4gcXVpbGxFZGl0b3IuY2xpcGJvYXJkLmNvbnZlcnQoeyBodG1sOiB2YWx1ZSB9KVxuICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gW3sgaW5zZXJ0OiB2YWx1ZSB9XVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9O1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucHJlc2VydmUgPSB0aGlzLnByZXNlcnZlV2hpdGVzcGFjZTtcbiAgICB0aGlzLnRvb2xiYXJQb3NpdGlvbiA9IHRoaXMuY3VzdG9tVG9vbGJhclBvc2l0aW9uO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFRoZSBgcXVpbGwtZWRpdG9yYCBjb21wb25lbnQgbWlnaHQgYmUgZGVzdHJveWVkIGJlZm9yZSB0aGUgYHF1aWxsYCBjaHVuayBpcyBsb2FkZWQgYW5kIGl0cyBjb2RlIGlzIGV4ZWN1dGVkXG4gICAgLy8gdGhpcyB3aWxsIGxlYWQgdG8gcnVudGltZSBleGNlcHRpb25zLCBzaW5jZSB0aGUgY29kZSB3aWxsIGJlIGV4ZWN1dGVkIG9uIERPTSBub2RlcyB0aGF0IGRvbid0IGV4aXN0IHdpdGhpbiB0aGUgdHJlZS5cblxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24gPSB0aGlzLnNlcnZpY2UuZ2V0UXVpbGwoKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKFF1aWxsKSA9PiB0aGlzLnNlcnZpY2UuYmVmb3JlUmVuZGVyKFF1aWxsLCB0aGlzLmN1c3RvbU1vZHVsZXMsIHRoaXMuYmVmb3JlUmVuZGVyKSlcbiAgICApLnN1YnNjcmliZShRdWlsbCA9PiB7XG4gICAgICB0aGlzLmVkaXRvckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnW3F1aWxsLWVkaXRvci1lbGVtZW50XSdcbiAgICAgIClcblxuICAgICAgY29uc3QgdG9vbGJhckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnW3F1aWxsLWVkaXRvci10b29sYmFyXSdcbiAgICAgIClcbiAgICAgIGNvbnN0IG1vZHVsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm1vZHVsZXMgfHwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5tb2R1bGVzKVxuXG4gICAgICBpZiAodG9vbGJhckVsZW0pIHtcbiAgICAgICAgbW9kdWxlcy50b29sYmFyID0gdG9vbGJhckVsZW1cbiAgICAgIH0gZWxzZSBpZiAobW9kdWxlcy50b29sYmFyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbW9kdWxlcy50b29sYmFyID0gZGVmYXVsdE1vZHVsZXMudG9vbGJhclxuICAgICAgfVxuXG4gICAgICBsZXQgcGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyICE9PSB1bmRlZmluZWQgPyB0aGlzLnBsYWNlaG9sZGVyIDogdGhpcy5zZXJ2aWNlLmNvbmZpZy5wbGFjZWhvbGRlclxuICAgICAgaWYgKHBsYWNlaG9sZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGxhY2Vob2xkZXIgPSAnSW5zZXJ0IHRleHQgaGVyZSAuLi4nXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuc3R5bGVzKClcbiAgICAgIGlmIChzdHlsZXMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lZGl0b3JFbGVtLCBrZXksIHN0eWxlc1trZXldKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbGFzc2VzKSB7XG4gICAgICAgIHRoaXMuYWRkQ2xhc3Nlcyh0aGlzLmNsYXNzZXMpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VzdG9tT3B0aW9ucy5mb3JFYWNoKChjdXN0b21PcHRpb24pID0+IHtcbiAgICAgICAgY29uc3QgbmV3Q3VzdG9tT3B0aW9uID0gUXVpbGwuaW1wb3J0KGN1c3RvbU9wdGlvbi5pbXBvcnQpXG4gICAgICAgIG5ld0N1c3RvbU9wdGlvbi53aGl0ZWxpc3QgPSBjdXN0b21PcHRpb24ud2hpdGVsaXN0XG4gICAgICAgIFF1aWxsLnJlZ2lzdGVyKG5ld0N1c3RvbU9wdGlvbiwgdHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGxldCBib3VuZHMgPSB0aGlzLmJvdW5kcyAmJiB0aGlzLmJvdW5kcyA9PT0gJ3NlbGYnID8gdGhpcy5lZGl0b3JFbGVtIDogdGhpcy5ib3VuZHNcbiAgICAgIGlmICghYm91bmRzKSB7XG4gICAgICAgIGJvdW5kcyA9IHRoaXMuc2VydmljZS5jb25maWcuYm91bmRzID8gdGhpcy5zZXJ2aWNlLmNvbmZpZy5ib3VuZHMgOiB0aGlzLmRvY3VtZW50LmJvZHlcbiAgICAgIH1cblxuICAgICAgbGV0IGRlYnVnID0gdGhpcy5kZWJ1Z1xuICAgICAgaWYgKCFkZWJ1ZyAmJiBkZWJ1ZyAhPT0gZmFsc2UgJiYgdGhpcy5zZXJ2aWNlLmNvbmZpZy5kZWJ1Zykge1xuICAgICAgICBkZWJ1ZyA9IHRoaXMuc2VydmljZS5jb25maWcuZGVidWdcbiAgICAgIH1cblxuICAgICAgbGV0IHJlYWRPbmx5ID0gdGhpcy5yZWFkT25seVxuICAgICAgaWYgKCFyZWFkT25seSAmJiB0aGlzLnJlYWRPbmx5ICE9PSBmYWxzZSkge1xuICAgICAgICByZWFkT25seSA9IHRoaXMuc2VydmljZS5jb25maWcucmVhZE9ubHkgIT09IHVuZGVmaW5lZCA/IHRoaXMuc2VydmljZS5jb25maWcucmVhZE9ubHkgOiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgZm9ybWF0cyA9IHRoaXMuZm9ybWF0c1xuICAgICAgaWYgKCFmb3JtYXRzICYmIGZvcm1hdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmb3JtYXRzID0gdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXRzID8gWy4uLnRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0c10gOiAodGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXRzID09PSBudWxsID8gbnVsbCA6IHVuZGVmaW5lZClcbiAgICAgIH1cblxuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvciA9IG5ldyBRdWlsbCh0aGlzLmVkaXRvckVsZW0sIHtcbiAgICAgICAgICBib3VuZHMsXG4gICAgICAgICAgZGVidWcsXG4gICAgICAgICAgZm9ybWF0cyxcbiAgICAgICAgICBtb2R1bGVzLFxuICAgICAgICAgIHBsYWNlaG9sZGVyLFxuICAgICAgICAgIHJlYWRPbmx5LFxuICAgICAgICAgIHJlZ2lzdHJ5OiB0aGlzLnJlZ2lzdHJ5LFxuICAgICAgICAgIHRoZW1lOiB0aGlzLnRoZW1lIHx8ICh0aGlzLnNlcnZpY2UuY29uZmlnLnRoZW1lID8gdGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA6ICdzbm93JylcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAodGhpcy5vbk5hdGl2ZUJsdXIub2JzZXJ2ZWQpIHtcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcXVpbGxqcy9xdWlsbC9pc3N1ZXMvMjE4NiNpc3N1ZWNvbW1lbnQtNTMzNDAxMzI4XG4gICAgICAgICAgZnJvbUV2ZW50KHRoaXMucXVpbGxFZGl0b3Iuc2Nyb2xsLmRvbU5vZGUsICdibHVyJykucGlwZSh1bnRpbERlc3Ryb3llZCh0aGlzKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMub25OYXRpdmVCbHVyLm5leHQoe1xuICAgICAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsRWRpdG9yLFxuICAgICAgICAgICAgc291cmNlOiAnZG9tJ1xuICAgICAgICAgIH0pKVxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9xdWlsbGpzL3F1aWxsL2lzc3Vlcy8yMTg2I2lzc3VlY29tbWVudC04MDMyNTc1MzhcbiAgICAgICAgICBjb25zdCB0b29sYmFyID0gdGhpcy5xdWlsbEVkaXRvci5nZXRNb2R1bGUoJ3Rvb2xiYXInKSBhcyBUb29sYmFyXG4gICAgICAgICAgaWYgKHRvb2xiYXIuY29udGFpbmVyKSB7XG4gICAgICAgICAgICBmcm9tRXZlbnQodG9vbGJhci5jb250YWluZXIsICdtb3VzZWRvd24nKS5waXBlKHVudGlsRGVzdHJveWVkKHRoaXMpKS5zdWJzY3JpYmUoZSA9PiBlLnByZXZlbnREZWZhdWx0KCkpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub25OYXRpdmVGb2N1cy5vYnNlcnZlZCkge1xuICAgICAgICAgIGZyb21FdmVudCh0aGlzLnF1aWxsRWRpdG9yLnNjcm9sbC5kb21Ob2RlLCAnZm9jdXMnKS5waXBlKHVudGlsRGVzdHJveWVkKHRoaXMpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vbk5hdGl2ZUZvY3VzLm5leHQoe1xuICAgICAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsRWRpdG9yLFxuICAgICAgICAgICAgc291cmNlOiAnZG9tJ1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IG9wdGlvbmFsIGxpbmsgcGxhY2Vob2xkZXIsIFF1aWxsIGhhcyBubyBuYXRpdmUgQVBJIGZvciBpdCBzbyB1c2luZyB3b3JrYXJvdW5kXG4gICAgICAgIGlmICh0aGlzLmxpbmtQbGFjZWhvbGRlcikge1xuICAgICAgICAgIGNvbnN0IHRvb2x0aXAgPSAodGhpcy5xdWlsbEVkaXRvciBhcyBhbnkpPy50aGVtZT8udG9vbHRpcFxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gdG9vbHRpcD8ucm9vdD8ucXVlcnlTZWxlY3RvcignaW5wdXRbZGF0YS1saW5rXScpXG4gICAgICAgICAgaWYgKGlucHV0Py5kYXRhc2V0KSB7XG4gICAgICAgICAgICBpbnB1dC5kYXRhc2V0LmxpbmsgPSB0aGlzLmxpbmtQbGFjZWhvbGRlclxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICBjb25zdCBmb3JtYXQgPSBnZXRGb3JtYXQodGhpcy5mb3JtYXQsIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0KVxuXG4gICAgICAgIGlmIChmb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dCh0aGlzLmNvbnRlbnQsICdzaWxlbnQnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHZhbHVlU2V0dGVyID0gdGhpcy52YWx1ZVNldHRlcjtcbiAgICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIHRoaXMuY29udGVudClcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldENvbnRlbnRzKG5ld1ZhbHVlLCAnc2lsZW50JylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLnF1aWxsRWRpdG9yLmdldE1vZHVsZSgnaGlzdG9yeScpIGFzIEhpc3RvcnlcbiAgICAgICAgaGlzdG9yeS5jbGVhcigpXG4gICAgICB9XG5cbiAgICAgIC8vIGluaXRpYWxpemUgZGlzYWJsZWQgc3RhdHVzIGJhc2VkIG9uIHRoaXMuZGlzYWJsZWQgYXMgZGVmYXVsdCB2YWx1ZVxuICAgICAgdGhpcy5zZXREaXNhYmxlZFN0YXRlKClcblxuICAgICAgdGhpcy5hZGRRdWlsbEV2ZW50TGlzdGVuZXJzKClcblxuICAgICAgLy8gVGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRyaWdnZXJzIGNoYW5nZSBkZXRlY3Rpb24uIFRoZXJlJ3Mgbm8gc2Vuc2UgdG8gaW52b2tlIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBpZiBhbnlvbmUgaXNcbiAgICAgIC8vIGxpc3RlbmluZyB0byB0aGUgYG9uRWRpdG9yQ3JlYXRlZGAgZXZlbnQgaW5zaWRlIHRoZSB0ZW1wbGF0ZSwgZm9yIGluc3RhbmNlIGA8cXVpbGwtdmlldyAob25FZGl0b3JDcmVhdGVkKT1cIi4uLlwiPmAuXG4gICAgICBpZiAoIXRoaXMub25FZGl0b3JDcmVhdGVkLm9ic2VydmVkICYmICF0aGlzLm9uVmFsaWRhdG9yQ2hhbmdlZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHdpbGwgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCBgb25FZGl0b3JDcmVhdGVkYCB3aWxsIGFsc28gY2FsbCBgbWFya0RpcnR5KClgXG4gICAgICAvLyBpbnRlcm5hbGx5LCBzaW5jZSBBbmd1bGFyIHdyYXBzIHRlbXBsYXRlIGV2ZW50IGxpc3RlbmVycyBpbnRvIGBsaXN0ZW5lcmAgaW5zdHJ1Y3Rpb24uIFdlJ3JlIHVzaW5nIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYFxuICAgICAgLy8gdG8gcHJldmVudCB0aGUgZnJhbWUgZHJvcCBhbmQgYXZvaWQgYEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXJyb3JgIGVycm9yLlxuICAgICAgcmFmJCgpLnBpcGUodW50aWxEZXN0cm95ZWQodGhpcykpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9uVmFsaWRhdG9yQ2hhbmdlZCkge1xuICAgICAgICAgIHRoaXMub25WYWxpZGF0b3JDaGFuZ2VkKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uRWRpdG9yQ3JlYXRlZC5lbWl0KHRoaXMucXVpbGxFZGl0b3IpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyID0gKHJhbmdlOiBSYW5nZSB8IG51bGwsIG9sZFJhbmdlOiBSYW5nZSB8IG51bGwsIHNvdXJjZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgdHJhY2tDaGFuZ2VzID0gdGhpcy50cmFja0NoYW5nZXMgfHwgdGhpcy5zZXJ2aWNlLmNvbmZpZy50cmFja0NoYW5nZXNcbiAgICBjb25zdCBzaG91bGRUcmlnZ2VyT25Nb2RlbFRvdWNoZWQgPSAhcmFuZ2UgJiYgISF0aGlzLm9uTW9kZWxUb3VjaGVkICYmIChzb3VyY2UgPT09ICd1c2VyJyB8fCB0cmFja0NoYW5nZXMgJiYgdHJhY2tDaGFuZ2VzID09PSAnYWxsJylcblxuICAgIC8vIG9ubHkgZW1pdCBjaGFuZ2VzIHdoZW4gdGhlcmUncyBhbnkgbGlzdGVuZXJcbiAgICBpZiAoIXRoaXMub25CbHVyLm9ic2VydmVkICYmXG4gICAgICAhdGhpcy5vbkZvY3VzLm9ic2VydmVkICYmXG4gICAgICAhdGhpcy5vblNlbGVjdGlvbkNoYW5nZWQub2JzZXJ2ZWQgJiZcbiAgICAgICFzaG91bGRUcmlnZ2VyT25Nb2RlbFRvdWNoZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgaWYgKHJhbmdlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQoe1xuICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICBzb3VyY2VcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAob2xkUmFuZ2UgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQoe1xuICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICBzb3VyY2VcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5vblNlbGVjdGlvbkNoYW5nZWQuZW1pdCh7XG4gICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgb2xkUmFuZ2UsXG4gICAgICAgIHJhbmdlLFxuICAgICAgICBzb3VyY2VcbiAgICAgIH0pXG5cbiAgICAgIGlmIChzaG91bGRUcmlnZ2VyT25Nb2RlbFRvdWNoZWQpIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKClcbiAgICB9KVxuICB9XG5cbiAgdGV4dENoYW5nZUhhbmRsZXIgPSAoZGVsdGE6IERlbHRhVHlwZSwgb2xkRGVsdGE6IERlbHRhVHlwZSwgc291cmNlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyBlbWl0dGVkIGJ5IHVzZXIgaW50ZXJhY3Rpb25zXG4gICAgY29uc3QgdGV4dCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0VGV4dCgpXG4gICAgY29uc3QgY29udGVudCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKVxuXG4gICAgbGV0IGh0bWw6IHN0cmluZyB8IG51bGwgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFNlbWFudGljSFRNTCgpXG4gICAgaWYgKHRoaXMuaXNFbXB0eVZhbHVlKGh0bWwpKSB7XG4gICAgICBodG1sID0gdGhpcy5kZWZhdWx0RW1wdHlWYWx1ZSgpXG4gICAgfVxuXG4gICAgY29uc3QgdHJhY2tDaGFuZ2VzID0gdGhpcy50cmFja0NoYW5nZXMgfHwgdGhpcy5zZXJ2aWNlLmNvbmZpZy50cmFja0NoYW5nZXNcbiAgICBjb25zdCBzaG91bGRUcmlnZ2VyT25Nb2RlbENoYW5nZSA9IChzb3VyY2UgPT09ICd1c2VyJyB8fCB0cmFja0NoYW5nZXMgJiYgdHJhY2tDaGFuZ2VzID09PSAnYWxsJykgJiYgISF0aGlzLm9uTW9kZWxDaGFuZ2VcblxuICAgIC8vIG9ubHkgZW1pdCBjaGFuZ2VzIHdoZW4gdGhlcmUncyBhbnkgbGlzdGVuZXJcbiAgICBpZiAoIXRoaXMub25Db250ZW50Q2hhbmdlZC5vYnNlcnZlZCAmJiAhc2hvdWxkVHJpZ2dlck9uTW9kZWxDaGFuZ2UpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgaWYgKHNob3VsZFRyaWdnZXJPbk1vZGVsQ2hhbmdlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlR2V0dGVyID0gdGhpcy52YWx1ZUdldHRlcjtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKFxuICAgICAgICAgIHZhbHVlR2V0dGVyKHRoaXMucXVpbGxFZGl0b3IpXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2VkLmVtaXQoe1xuICAgICAgICBjb250ZW50LFxuICAgICAgICBkZWx0YSxcbiAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsRWRpdG9yLFxuICAgICAgICBodG1sLFxuICAgICAgICBvbGREZWx0YSxcbiAgICAgICAgc291cmNlLFxuICAgICAgICB0ZXh0XG4gICAgICB9KVxuXG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpXG4gICAgfSlcbiAgfVxuXG4gIGVkaXRvckNoYW5nZUhhbmRsZXIgPSAoXG4gICAgZXZlbnQ6ICd0ZXh0LWNoYW5nZScgfCAnc2VsZWN0aW9uLWNoYW5nZScsXG4gICAgY3VycmVudDogYW55IHwgUmFuZ2UgfCBudWxsLCBvbGQ6IGFueSB8IFJhbmdlIHwgbnVsbCwgc291cmNlOiBzdHJpbmdcbiAgKTogdm9pZCA9PiB7XG4gICAgLy8gb25seSBlbWl0IGNoYW5nZXMgd2hlbiB0aGVyZSdzIGFueSBsaXN0ZW5lclxuICAgIGlmICghdGhpcy5vbkVkaXRvckNoYW5nZWQub2JzZXJ2ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIG9ubHkgZW1pdCBjaGFuZ2VzIGVtaXR0ZWQgYnkgdXNlciBpbnRlcmFjdGlvbnNcbiAgICBpZiAoZXZlbnQgPT09ICd0ZXh0LWNoYW5nZScpIHtcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKVxuICAgICAgY29uc3QgY29udGVudCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKVxuXG4gICAgICBsZXQgaHRtbDogc3RyaW5nIHwgbnVsbCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0U2VtYW50aWNIVE1MKClcbiAgICAgIGlmICh0aGlzLmlzRW1wdHlWYWx1ZShodG1sKSkge1xuICAgICAgICBodG1sID0gdGhpcy5kZWZhdWx0RW1wdHlWYWx1ZSgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLm9uRWRpdG9yQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgIGRlbHRhOiBjdXJyZW50LFxuICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgICBldmVudCxcbiAgICAgICAgICBodG1sLFxuICAgICAgICAgIG9sZERlbHRhOiBvbGQsXG4gICAgICAgICAgc291cmNlLFxuICAgICAgICAgIHRleHRcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5vbkVkaXRvckNoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsRWRpdG9yLFxuICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgIG9sZFJhbmdlOiBvbGQsXG4gICAgICAgICAgcmFuZ2U6IGN1cnJlbnQsXG4gICAgICAgICAgc291cmNlXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRpc3Bvc2UoKVxuXG4gICAgdGhpcy5xdWlsbFN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKVxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24gPSBudWxsXG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2RvdC1ub3RhdGlvbiAqL1xuICAgIGlmIChjaGFuZ2VzLnJlYWRPbmx5KSB7XG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLmVuYWJsZSghY2hhbmdlcy5yZWFkT25seS5jdXJyZW50VmFsdWUpXG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLnJvb3QuZGF0YXNldC5wbGFjZWhvbGRlciA9XG4gICAgICAgIGNoYW5nZXMucGxhY2Vob2xkZXIuY3VycmVudFZhbHVlXG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLnN0eWxlcykge1xuICAgICAgY29uc3QgY3VycmVudFN0eWxpbmcgPSBjaGFuZ2VzLnN0eWxlcy5jdXJyZW50VmFsdWVcbiAgICAgIGNvbnN0IHByZXZpb3VzU3R5bGluZyA9IGNoYW5nZXMuc3R5bGVzLnByZXZpb3VzVmFsdWVcblxuICAgICAgaWYgKHByZXZpb3VzU3R5bGluZykge1xuICAgICAgICBPYmplY3Qua2V5cyhwcmV2aW91c1N0eWxpbmcpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50U3R5bGluZykge1xuICAgICAgICBPYmplY3Qua2V5cyhjdXJyZW50U3R5bGluZykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWRpdG9yRWxlbSwga2V5LCB0aGlzLnN0eWxlcygpW2tleV0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLmNsYXNzZXMpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gY2hhbmdlcy5jbGFzc2VzLmN1cnJlbnRWYWx1ZVxuICAgICAgY29uc3QgcHJldmlvdXNDbGFzc2VzID0gY2hhbmdlcy5jbGFzc2VzLnByZXZpb3VzVmFsdWVcblxuICAgICAgaWYgKHByZXZpb3VzQ2xhc3Nlcykge1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzZXMocHJldmlvdXNDbGFzc2VzKVxuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudENsYXNzZXMpIHtcbiAgICAgICAgdGhpcy5hZGRDbGFzc2VzKGN1cnJlbnRDbGFzc2VzKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBXZSdkIHdhbnQgdG8gcmUtYXBwbHkgZXZlbnQgbGlzdGVuZXJzIGlmIHRoZSBgZGVib3VuY2VUaW1lYCBiaW5kaW5nIGNoYW5nZXMgdG8gYXBwbHkgdGhlXG4gICAgLy8gYGRlYm91bmNlVGltZWAgb3BlcmF0b3Igb3IgdmljZS12ZXJzYSByZW1vdmUgaXQuXG4gICAgaWYgKGNoYW5nZXMuZGVib3VuY2VUaW1lKSB7XG4gICAgICB0aGlzLmFkZFF1aWxsRXZlbnRMaXN0ZW5lcnMoKVxuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIEB0eXBlc2NyaXB0LWVzbGludC9kb3Qtbm90YXRpb24gKi9cbiAgfVxuXG4gIGFkZENsYXNzZXMoY2xhc3NMaXN0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBRdWlsbEVkaXRvckJhc2Uubm9ybWFsaXplQ2xhc3NOYW1lcyhjbGFzc0xpc3QpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVkaXRvckVsZW0sIGMpXG4gICAgfSlcbiAgfVxuXG4gIHJlbW92ZUNsYXNzZXMoY2xhc3NMaXN0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBRdWlsbEVkaXRvckJhc2Uubm9ybWFsaXplQ2xhc3NOYW1lcyhjbGFzc0xpc3QpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVkaXRvckVsZW0sIGMpXG4gICAgfSlcbiAgfVxuXG4gIHdyaXRlVmFsdWUoY3VycmVudFZhbHVlOiBhbnkpIHtcblxuICAgIC8vIG9wdGlvbmFsIGZpeCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQ5ODhcbiAgICBpZiAodGhpcy5maWx0ZXJOdWxsICYmIGN1cnJlbnRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50ID0gY3VycmVudFZhbHVlXG5cbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGZvcm1hdCA9IGdldEZvcm1hdCh0aGlzLmZvcm1hdCwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXQpXG4gICAgY29uc3QgdmFsdWVTZXR0ZXIgPSB0aGlzLnZhbHVlU2V0dGVyO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWVTZXR0ZXIodGhpcy5xdWlsbEVkaXRvciwgY3VycmVudFZhbHVlKVxuXG4gICAgaWYgKHRoaXMuY29tcGFyZVZhbHVlcykge1xuICAgICAgY29uc3QgY3VycmVudEVkaXRvclZhbHVlID0gdGhpcy5xdWlsbEVkaXRvci5nZXRDb250ZW50cygpXG4gICAgICBpZiAoSlNPTi5zdHJpbmdpZnkoY3VycmVudEVkaXRvclZhbHVlKSA9PT0gSlNPTi5zdHJpbmdpZnkobmV3VmFsdWUpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjdXJyZW50VmFsdWUpIHtcbiAgICAgIGlmIChmb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQoY3VycmVudFZhbHVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhuZXdWYWx1ZSlcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnF1aWxsRWRpdG9yLnNldFRleHQoJycpXG5cbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbiA9IHRoaXMuZGlzYWJsZWQpOiB2b2lkIHtcbiAgICAvLyBzdG9yZSBpbml0aWFsIHZhbHVlIHRvIHNldCBhcHByb3ByaWF0ZSBkaXNhYmxlZCBzdGF0dXMgYWZ0ZXIgVmlld0luaXRcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZFxuICAgIGlmICh0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICBpZiAoaXNEaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLmRpc2FibGUoKVxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5yZWFkT25seSkge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3IuZW5hYmxlKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAobW9kZWxWYWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm5cbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuXG4gIH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vblZhbGlkYXRvckNoYW5nZWQgPSBmblxuICB9XG5cbiAgdmFsaWRhdGUoKSB7XG4gICAgaWYgKCF0aGlzLnF1aWxsRWRpdG9yKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGNvbnN0IGVycjoge1xuICAgICAgbWluTGVuZ3RoRXJyb3I/OiB7XG4gICAgICAgIGdpdmVuOiBudW1iZXJcbiAgICAgICAgbWluTGVuZ3RoOiBudW1iZXJcbiAgICAgIH1cbiAgICAgIG1heExlbmd0aEVycm9yPzoge1xuICAgICAgICBnaXZlbjogbnVtYmVyXG4gICAgICAgIG1heExlbmd0aDogbnVtYmVyXG4gICAgICB9XG4gICAgICByZXF1aXJlZEVycm9yPzogeyBlbXB0eTogYm9vbGVhbiB9XG4gICAgfSA9IHt9XG4gICAgbGV0IHZhbGlkID0gdHJ1ZVxuXG4gICAgY29uc3QgdGV4dCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0VGV4dCgpXG4gICAgLy8gdHJpbSB0ZXh0IGlmIHdhbnRlZCArIGhhbmRsZSBzcGVjaWFsIGNhc2UgdGhhdCBhbiBlbXB0eSBlZGl0b3IgY29udGFpbnMgYSBuZXcgbGluZVxuICAgIGNvbnN0IHRleHRMZW5ndGggPSB0aGlzLnRyaW1PblZhbGlkYXRpb24gPyB0ZXh0LnRyaW0oKS5sZW5ndGggOiAodGV4dC5sZW5ndGggPT09IDEgJiYgdGV4dC50cmltKCkubGVuZ3RoID09PSAwID8gMCA6IHRleHQubGVuZ3RoIC0gMSlcbiAgICBjb25zdCBkZWx0YU9wZXJhdGlvbnMgPSB0aGlzLnF1aWxsRWRpdG9yLmdldENvbnRlbnRzKCkub3BzXG4gICAgY29uc3Qgb25seUVtcHR5T3BlcmF0aW9uID0gISFkZWx0YU9wZXJhdGlvbnMgJiYgZGVsdGFPcGVyYXRpb25zLmxlbmd0aCA9PT0gMSAmJiBbJ1xcbicsICcnXS5pbmNsdWRlcyhkZWx0YU9wZXJhdGlvbnNbMF0uaW5zZXJ0Py50b1N0cmluZygpKVxuXG4gICAgaWYgKHRoaXMubWluTGVuZ3RoICYmIHRleHRMZW5ndGggJiYgdGV4dExlbmd0aCA8IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgICBlcnIubWluTGVuZ3RoRXJyb3IgPSB7XG4gICAgICAgIGdpdmVuOiB0ZXh0TGVuZ3RoLFxuICAgICAgICBtaW5MZW5ndGg6IHRoaXMubWluTGVuZ3RoXG4gICAgICB9XG5cbiAgICAgIHZhbGlkID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXhMZW5ndGggJiYgdGV4dExlbmd0aCA+IHRoaXMubWF4TGVuZ3RoKSB7XG4gICAgICBlcnIubWF4TGVuZ3RoRXJyb3IgPSB7XG4gICAgICAgIGdpdmVuOiB0ZXh0TGVuZ3RoLFxuICAgICAgICBtYXhMZW5ndGg6IHRoaXMubWF4TGVuZ3RoXG4gICAgICB9XG5cbiAgICAgIHZhbGlkID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXF1aXJlZCAmJiAhdGV4dExlbmd0aCAmJiBvbmx5RW1wdHlPcGVyYXRpb24pIHtcbiAgICAgIGVyci5yZXF1aXJlZEVycm9yID0ge1xuICAgICAgICBlbXB0eTogdHJ1ZVxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkID8gbnVsbCA6IGVyclxuICB9XG5cbiAgcHJpdmF0ZSBhZGRRdWlsbEV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcG9zZSgpXG5cbiAgICAvLyBXZSBoYXZlIHRvIGVudGVyIHRoZSBgPHJvb3Q+YCB6b25lIHdoZW4gYWRkaW5nIGV2ZW50IGxpc3RlbmVycywgc28gYGRlYm91bmNlVGltZWAgd2lsbCBzcGF3biB0aGVcbiAgICAvLyBgQXN5bmNBY3Rpb25gIHRoZXJlIHcvbyB0cmlnZ2VyaW5nIGNoYW5nZSBkZXRlY3Rpb25zLiBXZSBzdGlsbCByZS1lbnRlciB0aGUgQW5ndWxhcidzIHpvbmUgdGhyb3VnaFxuICAgIC8vIGB6b25lLnJ1bmAgd2hlbiB3ZSBlbWl0IGFuIGV2ZW50IHRvIHRoZSBwYXJlbnQgY29tcG9uZW50LlxuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKVxuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICAgIC8vIG1hcmsgbW9kZWwgYXMgdG91Y2hlZCBpZiBlZGl0b3IgbG9zdCBmb2N1c1xuICAgICAgICBmcm9tRXZlbnQodGhpcy5xdWlsbEVkaXRvciwgJ3NlbGVjdGlvbi1jaGFuZ2UnKS5zdWJzY3JpYmUoXG4gICAgICAgICAgKFtyYW5nZSwgb2xkUmFuZ2UsIHNvdXJjZV0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlSGFuZGxlcihyYW5nZSBhcyBhbnksIG9sZFJhbmdlIGFzIGFueSwgc291cmNlKVxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgKVxuXG4gICAgICAvLyBUaGUgYGZyb21FdmVudGAgc3VwcG9ydHMgcGFzc2luZyBKUXVlcnktc3R5bGUgZXZlbnQgdGFyZ2V0cywgdGhlIGVkaXRvciBoYXMgYG9uYCBhbmQgYG9mZmAgbWV0aG9kcyB3aGljaFxuICAgICAgLy8gd2lsbCBiZSBpbnZva2VkIHVwb24gc3Vic2NyaXB0aW9uIGFuZCB0ZWFyZG93bi5cbiAgICAgIGxldCB0ZXh0Q2hhbmdlJCA9IGZyb21FdmVudCh0aGlzLnF1aWxsRWRpdG9yLCAndGV4dC1jaGFuZ2UnKVxuICAgICAgbGV0IGVkaXRvckNoYW5nZSQgPSBmcm9tRXZlbnQodGhpcy5xdWlsbEVkaXRvciwgJ2VkaXRvci1jaGFuZ2UnKVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMuZGVib3VuY2VUaW1lID09PSAnbnVtYmVyJykge1xuICAgICAgICB0ZXh0Q2hhbmdlJCA9IHRleHRDaGFuZ2UkLnBpcGUoZGVib3VuY2VUaW1lKHRoaXMuZGVib3VuY2VUaW1lKSlcbiAgICAgICAgZWRpdG9yQ2hhbmdlJCA9IGVkaXRvckNoYW5nZSQucGlwZShkZWJvdW5jZVRpbWUodGhpcy5kZWJvdW5jZVRpbWUpKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICAgIC8vIHVwZGF0ZSBtb2RlbCBpZiB0ZXh0IGNoYW5nZXNcbiAgICAgICAgdGV4dENoYW5nZSQuc3Vic2NyaWJlKChbZGVsdGEsIG9sZERlbHRhLCBzb3VyY2VdKSA9PiB7XG4gICAgICAgICAgdGhpcy50ZXh0Q2hhbmdlSGFuZGxlcihkZWx0YSBhcyBhbnksIG9sZERlbHRhIGFzIGFueSwgc291cmNlKVxuICAgICAgICB9KVxuICAgICAgKVxuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICAgIC8vIHRyaWdnZXJlZCBpZiBzZWxlY3Rpb24gb3IgdGV4dCBjaGFuZ2VkXG4gICAgICAgIGVkaXRvckNoYW5nZSQuc3Vic2NyaWJlKChbZXZlbnQsIGN1cnJlbnQsIG9sZCwgc291cmNlXSkgPT4ge1xuICAgICAgICAgIHRoaXMuZWRpdG9yQ2hhbmdlSGFuZGxlcihldmVudCBhcyAndGV4dC1jaGFuZ2UnIHwgJ3NlbGVjdGlvbi1jaGFuZ2UnLCBjdXJyZW50LCBvbGQsIHNvdXJjZSlcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBkaXNwb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBudWxsXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpc0VtcHR5VmFsdWUoaHRtbDogc3RyaW5nIHwgbnVsbCkge1xuICAgIHJldHVybiBodG1sID09PSAnPHA+PC9wPicgfHwgaHRtbCA9PT0gJzxkaXY+PC9kaXY+JyB8fCBodG1sID09PSAnPHA+PGJyPjwvcD4nIHx8IGh0bWwgPT09ICc8ZGl2Pjxicj48L2Rpdj4nXG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11c2UtYmVmb3JlLWRlZmluZVxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUXVpbGxFZGl0b3JDb21wb25lbnQpXG4gICAgfSxcbiAgICB7XG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVzZS1iZWZvcmUtZGVmaW5lXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBRdWlsbEVkaXRvckNvbXBvbmVudClcbiAgICB9XG4gIF0sXG4gIHNlbGVjdG9yOiAncXVpbGwtZWRpdG9yJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0lmPVwidG9vbGJhclBvc2l0aW9uICE9PSAndG9wJ1wiIHF1aWxsLWVkaXRvci1lbGVtZW50PjwvZGl2PlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIlthYm92ZS1xdWlsbC1lZGl0b3ItdG9vbGJhcl1cIj48L25nLWNvbnRlbnQ+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW3F1aWxsLWVkaXRvci10b29sYmFyXVwiPjwvbmctY29udGVudD5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbYmVsb3ctcXVpbGwtZWRpdG9yLXRvb2xiYXJdXCI+PC9uZy1jb250ZW50PlxuICAgIDxkaXYgKm5nSWY9XCJ0b29sYmFyUG9zaXRpb24gPT09ICd0b3AnXCIgcXVpbGwtZWRpdG9yLWVsZW1lbnQ+PC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICA6aG9zdCB7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgfVxuICAgIGBcbiAgXSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxFZGl0b3JDb21wb25lbnQgZXh0ZW5kcyBRdWlsbEVkaXRvckJhc2Uge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBASW5qZWN0KEVsZW1lbnRSZWYpIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQEluamVjdChDaGFuZ2VEZXRlY3RvclJlZikgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoRG9tU2FuaXRpemVyKSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgQEluamVjdChSZW5kZXJlcjIpIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChOZ1pvbmUpIHpvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KFF1aWxsU2VydmljZSkgc2VydmljZTogUXVpbGxTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgaW5qZWN0b3IsXG4gICAgICBlbGVtZW50UmVmLFxuICAgICAgY2QsXG4gICAgICBkb21TYW5pdGl6ZXIsXG4gICAgICBwbGF0Zm9ybUlkLFxuICAgICAgcmVuZGVyZXIsXG4gICAgICB6b25lLFxuICAgICAgc2VydmljZVxuICAgIClcbiAgfVxuXG59XG4iXX0=