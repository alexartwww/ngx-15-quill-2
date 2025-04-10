import { DOCUMENT, isPlatformServer, CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Output, PLATFORM_ID, Renderer2, SecurityContext, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { defaultModules } from 'ngx-quill/config';
import { getFormat } from './helpers';
import { QuillService } from './quill.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "./quill.service";
import * as i3 from "@angular/common";
function QuillEditorComponent_ng_container_0_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 2);
} }
function QuillEditorComponent_ng_container_0_pre_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "pre", 2);
} }
function QuillEditorComponent_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, QuillEditorComponent_ng_container_0_div_1_Template, 1, 0, "div", 1);
    i0.ɵɵtemplate(2, QuillEditorComponent_ng_container_0_pre_2_Template, 1, 0, "pre", 1);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", !ctx_r0.preserve);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", ctx_r0.preserve);
} }
function QuillEditorComponent_ng_container_2_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 2);
} }
function QuillEditorComponent_ng_container_2_pre_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "pre", 2);
} }
function QuillEditorComponent_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, QuillEditorComponent_ng_container_2_div_1_Template, 1, 0, "div", 1);
    i0.ɵɵtemplate(2, QuillEditorComponent_ng_container_2_pre_2_Template, 1, 0, "pre", 1);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", !ctx_r1.preserve);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", ctx_r1.preserve);
} }
const _c0 = [[["", "quill-editor-toolbar", ""]]];
const _c1 = ["[quill-editor-toolbar]"];
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class QuillEditorBase {
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
        this.disabled = false; // used to store initial value before ViewInit
        this.preserve = false;
        this.toolbarPosition = 'top';
        this.subscription = null;
        this.quillSubscription = null;
        this.valueGetter = (quillEditor, editorElement) => {
            let html = editorElement.querySelector('.ql-editor').innerHTML;
            if (html === '<p><br></p>' || html === '<div><br></div>') {
                html = this.defaultEmptyValue;
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
                return quillEditor.clipboard.convert(value);
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
            const shouldTriggerOnModelTouched = !range && !!this.onModelTouched;
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
            let html = this.editorElem.querySelector('.ql-editor').innerHTML;
            if (html === '<p><br></p>' || html === '<div><br></div>') {
                html = this.defaultEmptyValue;
            }
            const trackChanges = this.trackChanges || this.service.config.trackChanges;
            const shouldTriggerOnModelChange = (source === 'user' || trackChanges && trackChanges === 'all') && !!this.onModelChange;
            // only emit changes when there's any listener
            if (!this.onContentChanged.observed && !shouldTriggerOnModelChange) {
                return;
            }
            this.zone.run(() => {
                if (shouldTriggerOnModelChange) {
                    this.onModelChange(this.valueGetter(this.quillEditor, this.editorElem));
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
        // eslint-disable-next-line max-len
        this.editorChangeHandler = (event, current, old, source) => {
            // only emit changes when there's any listener
            if (!this.onEditorChanged.observed) {
                return;
            }
            // only emit changes emitted by user interactions
            if (event === 'text-change') {
                const text = this.quillEditor.getText();
                const content = this.quillEditor.getContents();
                let html = this.editorElem.querySelector('.ql-editor').innerHTML;
                if (html === '<p><br></p>' || html === '<div><br></div>') {
                    html = this.defaultEmptyValue;
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
        this.quillSubscription = this.service.getQuill().pipe(mergeMap((Quill) => {
            const promises = [this.service.registerCustomModules(Quill, this.customModules)];
            const beforeRender = this.beforeRender ?? this.service.config.beforeRender;
            if (beforeRender) {
                promises.push(beforeRender());
            }
            return Promise.all(promises).then(() => Quill);
        })).subscribe(Quill => {
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
            if (this.styles) {
                Object.keys(this.styles).forEach((key) => {
                    this.renderer.setStyle(this.editorElem, key, this.styles[key]);
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
            let defaultEmptyValue = this.defaultEmptyValue;
            if (this.service.config.hasOwnProperty('defaultEmptyValue')) {
                defaultEmptyValue = this.service.config.defaultEmptyValue;
            }
            let scrollingContainer = this.scrollingContainer;
            if (!scrollingContainer && this.scrollingContainer !== null) {
                scrollingContainer =
                    this.service.config.scrollingContainer === null
                        || this.service.config.scrollingContainer ? this.service.config.scrollingContainer : null;
            }
            let formats = this.formats;
            if (!formats && formats === undefined) {
                formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined);
            }
            this.zone.runOutsideAngular(() => {
                this.quillEditor = new Quill(this.editorElem, {
                    bounds,
                    debug: debug,
                    formats: formats,
                    modules,
                    placeholder,
                    readOnly,
                    defaultEmptyValue,
                    scrollingContainer: scrollingContainer,
                    strict: this.strict,
                    theme: this.theme || (this.service.config.theme ? this.service.config.theme : 'snow')
                });
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
                    const newValue = this.valueSetter(this.quillEditor, this.content);
                    this.quillEditor.setContents(newValue, 'silent');
                }
                this.quillEditor.history.clear();
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
            requestAnimationFrame(() => {
                if (this.onValidatorChanged) {
                    this.onValidatorChanged();
                }
                this.onEditorCreated.emit(this.quillEditor);
                this.onEditorCreated.complete();
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
        if (changes.defaultEmptyValue) {
            this.quillEditor.root.dataset.defaultEmptyValue =
                changes.defaultEmptyValue.currentValue;
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
        QuillEditorBase.normalizeClassNames(classList).forEach((c) => {
            this.renderer.addClass(this.editorElem, c);
        });
    }
    removeClasses(classList) {
        QuillEditorBase.normalizeClassNames(classList).forEach((c) => {
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
        const newValue = this.valueSetter(this.quillEditor, currentValue);
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
        const onlyEmptyOperation = deltaOperations && deltaOperations.length === 1 && ['\n', ''].includes(String(deltaOperations[0].insert));
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
}
QuillEditorBase.ɵfac = function QuillEditorBase_Factory(t) { return new (t || QuillEditorBase)(i0.ɵɵdirectiveInject(i0.Injector), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.ChangeDetectorRef), i0.ɵɵdirectiveInject(i1.DomSanitizer), i0.ɵɵdirectiveInject(PLATFORM_ID), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i2.QuillService)); };
QuillEditorBase.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QuillEditorBase, inputs: { format: "format", theme: "theme", modules: "modules", debug: "debug", readOnly: "readOnly", placeholder: "placeholder", maxLength: "maxLength", minLength: "minLength", required: "required", formats: "formats", customToolbarPosition: "customToolbarPosition", sanitize: "sanitize", beforeRender: "beforeRender", styles: "styles", strict: "strict", scrollingContainer: "scrollingContainer", bounds: "bounds", customOptions: "customOptions", customModules: "customModules", trackChanges: "trackChanges", preserveWhitespace: "preserveWhitespace", classes: "classes", trimOnValidation: "trimOnValidation", linkPlaceholder: "linkPlaceholder", compareValues: "compareValues", filterNull: "filterNull", debounceTime: "debounceTime", defaultEmptyValue: "defaultEmptyValue", valueGetter: "valueGetter", valueSetter: "valueSetter" }, outputs: { onEditorCreated: "onEditorCreated", onEditorChanged: "onEditorChanged", onContentChanged: "onContentChanged", onSelectionChanged: "onSelectionChanged", onFocus: "onFocus", onBlur: "onBlur" }, features: [i0.ɵɵNgOnChangesFeature] });
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
        ]), i0.ɵɵInheritDefinitionFeature, i0.ɵɵStandaloneFeature], ngContentSelectors: _c1, decls: 3, vars: 2, consts: [[4, "ngIf"], ["quill-editor-element", "", 4, "ngIf"], ["quill-editor-element", ""]], template: function QuillEditorComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef(_c0);
        i0.ɵɵtemplate(0, QuillEditorComponent_ng_container_0_Template, 3, 2, "ng-container", 0);
        i0.ɵɵprojection(1);
        i0.ɵɵtemplate(2, QuillEditorComponent_ng_container_2_Template, 3, 2, "ng-container", 0);
    } if (rf & 2) {
        i0.ɵɵproperty("ngIf", ctx.toolbarPosition !== "top");
        i0.ɵɵadvance(2);
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
  <ng-container *ngIf="toolbarPosition !== 'top'">
    <div quill-editor-element *ngIf="!preserve"></div>
    <pre quill-editor-element *ngIf="preserve"></pre>
  </ng-container>
  <ng-content select="[quill-editor-toolbar]"></ng-content>
  <ng-container *ngIf="toolbarPosition === 'top'">
    <div quill-editor-element *ngIf="!preserve"></div>
    <pre quill-editor-element *ngIf="preserve"></pre>
  </ng-container>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1xdWlsbC9zcmMvbGliL3F1aWxsLWVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUFJeEQsT0FBTyxFQUVMLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFFTixLQUFLLEVBQ0wsTUFBTSxFQUlOLE1BQU0sRUFDTixXQUFXLEVBQ1gsU0FBUyxFQUNULGVBQWUsRUFFZixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUE7QUFDdEIsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUE7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUV2RCxPQUFPLEVBQXdCLGFBQWEsRUFBRSxpQkFBaUIsRUFBYSxNQUFNLGdCQUFnQixDQUFBO0FBRWxHLE9BQU8sRUFBRSxjQUFjLEVBQTRDLE1BQU0sa0JBQWtCLENBQUE7QUFFM0YsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUNyQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUE7Ozs7OztJQXFzQjFDLHlCQUFrRDs7O0lBQ2xELHlCQUFpRDs7O0lBRm5ELDZCQUFnRDtJQUM5QyxvRkFBa0Q7SUFDbEQsb0ZBQWlEO0lBQ25ELDBCQUFlOzs7SUFGYyxlQUFlO0lBQWYsdUNBQWU7SUFDZixlQUFjO0lBQWQsc0NBQWM7OztJQUl6Qyx5QkFBa0Q7OztJQUNsRCx5QkFBaUQ7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RSxVQUFVLENBQUMsR0FBRyxFQUFFLHFCQUFxQixDQUFDO3FCQUNwRDtvQkFDRDt3QkFDRSxLQUFLLEVBQUUsSUFBSTt3QkFDWCxPQUFPLEVBQUUsYUFBYTt3QkFDdEIsbUVBQW1FO3dCQUNuRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQztxQkFDcEQ7aUJBQ0YsWUFDUyxjQUFjLFlBQ2Q7Ozs7Ozs7Ozs7Q0FVWCxjQVFhLElBQUksV0FDUCxDQUFDLFlBQVksQ0FBQzs7c0JBTXBCLE1BQU07dUJBQUMsVUFBVTs7c0JBQ2pCLE1BQU07dUJBQUMsaUJBQWlCOztzQkFDeEIsTUFBTTt1QkFBQyxZQUFZOztzQkFDbkIsTUFBTTt1QkFBQyxXQUFXOztzQkFDbEIsTUFBTTt1QkFBQyxTQUFTOztzQkFDaEIsTUFBTTt1QkFBQyxNQUFNOztzQkFDYixNQUFNO3VCQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybVNlcnZlciwgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJ1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlcidcblxuaW1wb3J0IFF1aWxsVHlwZSwgeyBEZWx0YSB9IGZyb20gJ3F1aWxsJ1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBTZWN1cml0eUNvbnRleHQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnXG5cbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxJREFUT1JTLCBOR19WQUxVRV9BQ0NFU1NPUiwgVmFsaWRhdG9yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnXG5cbmltcG9ydCB7IGRlZmF1bHRNb2R1bGVzLCBRdWlsbE1vZHVsZXMsIEN1c3RvbU9wdGlvbiwgQ3VzdG9tTW9kdWxlIH0gZnJvbSAnbmd4LXF1aWxsL2NvbmZpZydcblxuaW1wb3J0IHsgZ2V0Rm9ybWF0IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHsgUXVpbGxTZXJ2aWNlIH0gZnJvbSAnLi9xdWlsbC5zZXJ2aWNlJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlIHtcbiAgaW5kZXg6IG51bWJlclxuICBsZW5ndGg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRlbnRDaGFuZ2Uge1xuICBjb250ZW50OiBhbnlcbiAgZGVsdGE6IERlbHRhXG4gIGVkaXRvcjogUXVpbGxUeXBlXG4gIGh0bWw6IHN0cmluZyB8IG51bGxcbiAgb2xkRGVsdGE6IERlbHRhXG4gIHNvdXJjZTogc3RyaW5nXG4gIHRleHQ6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlbGVjdGlvbkNoYW5nZSB7XG4gIGVkaXRvcjogUXVpbGxUeXBlXG4gIG9sZFJhbmdlOiBSYW5nZSB8IG51bGxcbiAgcmFuZ2U6IFJhbmdlIHwgbnVsbFxuICBzb3VyY2U6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsdXIge1xuICBlZGl0b3I6IFF1aWxsVHlwZVxuICBzb3VyY2U6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZvY3VzIHtcbiAgZWRpdG9yOiBRdWlsbFR5cGVcbiAgc291cmNlOiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgRWRpdG9yQ2hhbmdlQ29udGVudCA9IENvbnRlbnRDaGFuZ2UgJiB7IGV2ZW50OiAndGV4dC1jaGFuZ2UnIH1cbmV4cG9ydCB0eXBlIEVkaXRvckNoYW5nZVNlbGVjdGlvbiA9IFNlbGVjdGlvbkNoYW5nZSAmIHsgZXZlbnQ6ICdzZWxlY3Rpb24tY2hhbmdlJyB9XG5cbkBEaXJlY3RpdmUoKVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtY2xhc3Mtc3VmZml4XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUXVpbGxFZGl0b3JCYXNlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3ksIFZhbGlkYXRvciB7XG4gIEBJbnB1dCgpIGZvcm1hdD86ICdvYmplY3QnIHwgJ2h0bWwnIHwgJ3RleHQnIHwgJ2pzb24nXG4gIEBJbnB1dCgpIHRoZW1lPzogc3RyaW5nXG4gIEBJbnB1dCgpIG1vZHVsZXM/OiBRdWlsbE1vZHVsZXNcbiAgQElucHV0KCkgZGVidWc/OiAnd2FybicgfCAnbG9nJyB8ICdlcnJvcicgfCBmYWxzZVxuICBASW5wdXQoKSByZWFkT25seT86IGJvb2xlYW5cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI/OiBzdHJpbmdcbiAgQElucHV0KCkgbWF4TGVuZ3RoPzogbnVtYmVyXG4gIEBJbnB1dCgpIG1pbkxlbmd0aD86IG51bWJlclxuICBASW5wdXQoKSByZXF1aXJlZCA9IGZhbHNlXG4gIEBJbnB1dCgpIGZvcm1hdHM/OiBzdHJpbmdbXSB8IG51bGxcbiAgQElucHV0KCkgY3VzdG9tVG9vbGJhclBvc2l0aW9uOiAndG9wJyB8ICdib3R0b20nID0gJ3RvcCdcbiAgQElucHV0KCkgc2FuaXRpemU/OiBib29sZWFuXG4gIEBJbnB1dCgpIGJlZm9yZVJlbmRlcj86ICgpID0+IFByb21pc2U8dm9pZD5cbiAgQElucHV0KCkgc3R5bGVzOiBhbnkgPSBudWxsXG4gIEBJbnB1dCgpIHN0cmljdCA9IHRydWVcbiAgQElucHV0KCkgc2Nyb2xsaW5nQ29udGFpbmVyPzogSFRNTEVsZW1lbnQgfCBzdHJpbmcgfCBudWxsXG4gIEBJbnB1dCgpIGJvdW5kcz86IEhUTUxFbGVtZW50IHwgc3RyaW5nXG4gIEBJbnB1dCgpIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbltdID0gW11cbiAgQElucHV0KCkgY3VzdG9tTW9kdWxlczogQ3VzdG9tTW9kdWxlW10gPSBbXVxuICBASW5wdXQoKSB0cmFja0NoYW5nZXM/OiAndXNlcicgfCAnYWxsJ1xuICBASW5wdXQoKSBwcmVzZXJ2ZVdoaXRlc3BhY2UgPSBmYWxzZVxuICBASW5wdXQoKSBjbGFzc2VzPzogc3RyaW5nXG4gIEBJbnB1dCgpIHRyaW1PblZhbGlkYXRpb24gPSBmYWxzZVxuICBASW5wdXQoKSBsaW5rUGxhY2Vob2xkZXI/OiBzdHJpbmdcbiAgQElucHV0KCkgY29tcGFyZVZhbHVlcyA9IGZhbHNlXG4gIEBJbnB1dCgpIGZpbHRlck51bGwgPSBmYWxzZVxuICBASW5wdXQoKSBkZWJvdW5jZVRpbWU/OiBudW1iZXJcbiAgLypcbiAgaHR0cHM6Ly9naXRodWIuY29tL0tpbGxlckNvZGVNb25rZXkvbmd4LXF1aWxsL2lzc3Vlcy8xMjU3IC0gZml4IG51bGwgdmFsdWUgc2V0XG5cbiAgcHJvdmlkZSBkZWZhdWx0IGVtcHR5IHZhbHVlXG4gIGJ5IGRlZmF1bHQgbnVsbFxuXG4gIGUuZy4gZGVmYXVsdEVtcHR5VmFsdWU9XCJcIiAtIGVtcHR5IHN0cmluZ1xuXG4gIDxxdWlsbC1lZGl0b3JcbiAgICBkZWZhdWx0RW1wdHlWYWx1ZT1cIlwiXG4gICAgZm9ybUNvbnRyb2xOYW1lPVwibWVzc2FnZVwiXG4gID48L3F1aWxsLWVkaXRvcj5cbiAgKi9cbiAgQElucHV0KCkgZGVmYXVsdEVtcHR5VmFsdWU/OiBhbnkgPSBudWxsXG5cbiAgQE91dHB1dCgpIG9uRWRpdG9yQ3JlYXRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQE91dHB1dCgpIG9uRWRpdG9yQ2hhbmdlZDogRXZlbnRFbWl0dGVyPEVkaXRvckNoYW5nZUNvbnRlbnQgfCBFZGl0b3JDaGFuZ2VTZWxlY3Rpb24+ID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gIEBPdXRwdXQoKSBvbkNvbnRlbnRDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8Q29udGVudENoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQE91dHB1dCgpIG9uU2VsZWN0aW9uQ2hhbmdlZDogRXZlbnRFbWl0dGVyPFNlbGVjdGlvbkNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQE91dHB1dCgpIG9uRm9jdXM6IEV2ZW50RW1pdHRlcjxGb2N1cz4gPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgQE91dHB1dCgpIG9uQmx1cjogRXZlbnRFbWl0dGVyPEJsdXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgcXVpbGxFZGl0b3IhOiBRdWlsbFR5cGVcbiAgZWRpdG9yRWxlbSE6IEhUTUxFbGVtZW50XG4gIGNvbnRlbnQ6IGFueVxuICBkaXNhYmxlZCA9IGZhbHNlIC8vIHVzZWQgdG8gc3RvcmUgaW5pdGlhbCB2YWx1ZSBiZWZvcmUgVmlld0luaXRcbiAgcHJlc2VydmUgPSBmYWxzZVxuICB0b29sYmFyUG9zaXRpb24gPSAndG9wJ1xuXG4gIG9uTW9kZWxDaGFuZ2U6IChtb2RlbFZhbHVlPzogYW55KSA9PiB2b2lkXG4gIG9uTW9kZWxUb3VjaGVkOiAoKSA9PiB2b2lkXG4gIG9uVmFsaWRhdG9yQ2hhbmdlZDogKCkgPT4gdm9pZFxuXG4gIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbFxuICBwcml2YXRlIHF1aWxsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgcGxhdGZvcm1JZDogYW55LFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIHNlcnZpY2U6IFF1aWxsU2VydmljZVxuICApIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gaW5qZWN0b3IuZ2V0KERPQ1VNRU5UKVxuICB9XG5cbiAgc3RhdGljIG5vcm1hbGl6ZUNsYXNzTmFtZXMoY2xhc3Nlczogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGNsYXNzZXMudHJpbSgpLnNwbGl0KCcgJylcbiAgICByZXR1cm4gY2xhc3NMaXN0LnJlZHVjZSgocHJldjogc3RyaW5nW10sIGN1cjogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB0cmltbWVkID0gY3VyLnRyaW0oKVxuICAgICAgaWYgKHRyaW1tZWQpIHtcbiAgICAgICAgcHJldi5wdXNoKHRyaW1tZWQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2XG4gICAgfSwgW10pXG4gIH1cblxuICBASW5wdXQoKVxuICB2YWx1ZUdldHRlciA9IChxdWlsbEVkaXRvcjogUXVpbGxUeXBlLCBlZGl0b3JFbGVtZW50OiBIVE1MRWxlbWVudCk6IHN0cmluZyB8IGFueSA9PiB7XG4gICAgbGV0IGh0bWw6IHN0cmluZyB8IG51bGwgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xbC1lZGl0b3InKSEuaW5uZXJIVE1MXG4gICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicgfHwgaHRtbCA9PT0gJzxkaXY+PGJyPjwvZGl2PicpIHtcbiAgICAgIGh0bWwgPSB0aGlzLmRlZmF1bHRFbXB0eVZhbHVlXG4gICAgfVxuICAgIGxldCBtb2RlbFZhbHVlOiBzdHJpbmcgfCBEZWx0YSB8IG51bGwgPSBodG1sXG4gICAgY29uc3QgZm9ybWF0ID0gZ2V0Rm9ybWF0KHRoaXMuZm9ybWF0LCB0aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdClcblxuICAgIGlmIChmb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgbW9kZWxWYWx1ZSA9IHF1aWxsRWRpdG9yLmdldFRleHQoKVxuICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnb2JqZWN0Jykge1xuICAgICAgbW9kZWxWYWx1ZSA9IHF1aWxsRWRpdG9yLmdldENvbnRlbnRzKClcbiAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2pzb24nKSB7XG4gICAgICB0cnkge1xuICAgICAgICBtb2RlbFZhbHVlID0gSlNPTi5zdHJpbmdpZnkocXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbW9kZWxWYWx1ZSA9IHF1aWxsRWRpdG9yLmdldFRleHQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2RlbFZhbHVlXG4gIH1cblxuICBASW5wdXQoKVxuICB2YWx1ZVNldHRlciA9IChxdWlsbEVkaXRvcjogUXVpbGxUeXBlLCB2YWx1ZTogYW55KTogYW55ID0+IHtcbiAgICBjb25zdCBmb3JtYXQgPSBnZXRGb3JtYXQodGhpcy5mb3JtYXQsIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0KVxuICAgIGlmIChmb3JtYXQgPT09ICdodG1sJykge1xuICAgICAgY29uc3Qgc2FuaXRpemUgPSBbdHJ1ZSwgZmFsc2VdLmluY2x1ZGVzKHRoaXMuc2FuaXRpemUpID8gdGhpcy5zYW5pdGl6ZSA6ICh0aGlzLnNlcnZpY2UuY29uZmlnLnNhbml0aXplIHx8IGZhbHNlKVxuICAgICAgaWYgKHNhbml0aXplKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5kb21TYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHZhbHVlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHF1aWxsRWRpdG9yLmNsaXBib2FyZC5jb252ZXJ0KHZhbHVlKVxuICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnanNvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gW3sgaW5zZXJ0OiB2YWx1ZSB9XVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wcmVzZXJ2ZSA9IHRoaXMucHJlc2VydmVXaGl0ZXNwYWNlXG4gICAgdGhpcy50b29sYmFyUG9zaXRpb24gPSB0aGlzLmN1c3RvbVRvb2xiYXJQb3NpdGlvblxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFRoZSBgcXVpbGwtZWRpdG9yYCBjb21wb25lbnQgbWlnaHQgYmUgZGVzdHJveWVkIGJlZm9yZSB0aGUgYHF1aWxsYCBjaHVuayBpcyBsb2FkZWQgYW5kIGl0cyBjb2RlIGlzIGV4ZWN1dGVkXG4gICAgLy8gdGhpcyB3aWxsIGxlYWQgdG8gcnVudGltZSBleGNlcHRpb25zLCBzaW5jZSB0aGUgY29kZSB3aWxsIGJlIGV4ZWN1dGVkIG9uIERPTSBub2RlcyB0aGF0IGRvbid0IGV4aXN0IHdpdGhpbiB0aGUgdHJlZS5cblxuICAgIHRoaXMucXVpbGxTdWJzY3JpcHRpb24gPSB0aGlzLnNlcnZpY2UuZ2V0UXVpbGwoKS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKFF1aWxsKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW3RoaXMuc2VydmljZS5yZWdpc3RlckN1c3RvbU1vZHVsZXMoUXVpbGwsIHRoaXMuY3VzdG9tTW9kdWxlcyldXG4gICAgICAgIGNvbnN0IGJlZm9yZVJlbmRlciA9IHRoaXMuYmVmb3JlUmVuZGVyID8/IHRoaXMuc2VydmljZS5jb25maWcuYmVmb3JlUmVuZGVyXG4gICAgICAgIGlmIChiZWZvcmVSZW5kZXIpIHtcbiAgICAgICAgICBwcm9taXNlcy5wdXNoKGJlZm9yZVJlbmRlcigpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiBRdWlsbClcbiAgICAgIH0pXG4gICAgKS5zdWJzY3JpYmUoUXVpbGwgPT4ge1xuICAgICAgdGhpcy5lZGl0b3JFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJ1txdWlsbC1lZGl0b3ItZWxlbWVudF0nXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRvb2xiYXJFbGVtID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJ1txdWlsbC1lZGl0b3ItdG9vbGJhcl0nXG4gICAgICApXG4gICAgICBjb25zdCBtb2R1bGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5tb2R1bGVzIHx8IHRoaXMuc2VydmljZS5jb25maWcubW9kdWxlcylcblxuICAgICAgaWYgKHRvb2xiYXJFbGVtKSB7XG4gICAgICAgIG1vZHVsZXMudG9vbGJhciA9IHRvb2xiYXJFbGVtXG4gICAgICB9IGVsc2UgaWYgKG1vZHVsZXMudG9vbGJhciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1vZHVsZXMudG9vbGJhciA9IGRlZmF1bHRNb2R1bGVzLnRvb2xiYXJcbiAgICAgIH1cblxuICAgICAgbGV0IHBsYWNlaG9sZGVyID0gdGhpcy5wbGFjZWhvbGRlciAhPT0gdW5kZWZpbmVkID8gdGhpcy5wbGFjZWhvbGRlciA6IHRoaXMuc2VydmljZS5jb25maWcucGxhY2Vob2xkZXJcbiAgICAgIGlmIChwbGFjZWhvbGRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBsYWNlaG9sZGVyID0gJ0luc2VydCB0ZXh0IGhlcmUgLi4uJ1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdHlsZXMpIHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5zdHlsZXMpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVkaXRvckVsZW0sIGtleSwgdGhpcy5zdHlsZXNba2V5XSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xhc3Nlcykge1xuICAgICAgICB0aGlzLmFkZENsYXNzZXModGhpcy5jbGFzc2VzKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1c3RvbU9wdGlvbnMuZm9yRWFjaCgoY3VzdG9tT3B0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0N1c3RvbU9wdGlvbiA9IFF1aWxsLmltcG9ydChjdXN0b21PcHRpb24uaW1wb3J0KVxuICAgICAgICBuZXdDdXN0b21PcHRpb24ud2hpdGVsaXN0ID0gY3VzdG9tT3B0aW9uLndoaXRlbGlzdFxuICAgICAgICBRdWlsbC5yZWdpc3RlcihuZXdDdXN0b21PcHRpb24sIHRydWUpXG4gICAgICB9KVxuXG4gICAgICBsZXQgYm91bmRzID0gdGhpcy5ib3VuZHMgJiYgdGhpcy5ib3VuZHMgPT09ICdzZWxmJyA/IHRoaXMuZWRpdG9yRWxlbSA6IHRoaXMuYm91bmRzXG4gICAgICBpZiAoIWJvdW5kcykge1xuICAgICAgICBib3VuZHMgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmJvdW5kcyA/IHRoaXMuc2VydmljZS5jb25maWcuYm91bmRzIDogdGhpcy5kb2N1bWVudC5ib2R5XG4gICAgICB9XG5cbiAgICAgIGxldCBkZWJ1ZyA9IHRoaXMuZGVidWdcbiAgICAgIGlmICghZGVidWcgJiYgZGVidWcgIT09IGZhbHNlICYmIHRoaXMuc2VydmljZS5jb25maWcuZGVidWcpIHtcbiAgICAgICAgZGVidWcgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmRlYnVnXG4gICAgICB9XG5cbiAgICAgIGxldCByZWFkT25seSA9IHRoaXMucmVhZE9ubHlcbiAgICAgIGlmICghcmVhZE9ubHkgJiYgdGhpcy5yZWFkT25seSAhPT0gZmFsc2UpIHtcbiAgICAgICAgcmVhZE9ubHkgPSB0aGlzLnNlcnZpY2UuY29uZmlnLnJlYWRPbmx5ICE9PSB1bmRlZmluZWQgPyB0aGlzLnNlcnZpY2UuY29uZmlnLnJlYWRPbmx5IDogZmFsc2VcbiAgICAgIH1cblxuICAgICAgbGV0IGRlZmF1bHRFbXB0eVZhbHVlID0gdGhpcy5kZWZhdWx0RW1wdHlWYWx1ZVxuICAgICAgaWYgKHRoaXMuc2VydmljZS5jb25maWcuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHRFbXB0eVZhbHVlJykpIHtcbiAgICAgICAgZGVmYXVsdEVtcHR5VmFsdWUgPSB0aGlzLnNlcnZpY2UuY29uZmlnLmRlZmF1bHRFbXB0eVZhbHVlXG4gICAgICB9XG5cbiAgICAgIGxldCBzY3JvbGxpbmdDb250YWluZXIgPSB0aGlzLnNjcm9sbGluZ0NvbnRhaW5lclxuICAgICAgaWYgKCFzY3JvbGxpbmdDb250YWluZXIgJiYgdGhpcy5zY3JvbGxpbmdDb250YWluZXIgIT09IG51bGwpIHtcbiAgICAgICAgc2Nyb2xsaW5nQ29udGFpbmVyID1cbiAgICAgICAgICB0aGlzLnNlcnZpY2UuY29uZmlnLnNjcm9sbGluZ0NvbnRhaW5lciA9PT0gbnVsbFxuICAgICAgICAgICAgfHwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5zY3JvbGxpbmdDb250YWluZXIgPyB0aGlzLnNlcnZpY2UuY29uZmlnLnNjcm9sbGluZ0NvbnRhaW5lciA6IG51bGxcbiAgICAgIH1cblxuICAgICAgbGV0IGZvcm1hdHMgPSB0aGlzLmZvcm1hdHNcbiAgICAgIGlmICghZm9ybWF0cyAmJiBmb3JtYXRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZm9ybWF0cyA9IHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cyA/IFsuLi50aGlzLnNlcnZpY2UuY29uZmlnLmZvcm1hdHNdIDogKHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0cyA9PT0gbnVsbCA/IG51bGwgOiB1bmRlZmluZWQpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICAgICAgYm91bmRzLFxuICAgICAgICAgIGRlYnVnOiBkZWJ1ZyBhcyBhbnksXG4gICAgICAgICAgZm9ybWF0czogZm9ybWF0cyBhcyBhbnksXG4gICAgICAgICAgbW9kdWxlcyxcbiAgICAgICAgICBwbGFjZWhvbGRlcixcbiAgICAgICAgICByZWFkT25seSxcbiAgICAgICAgICBkZWZhdWx0RW1wdHlWYWx1ZSxcbiAgICAgICAgICBzY3JvbGxpbmdDb250YWluZXI6IHNjcm9sbGluZ0NvbnRhaW5lciBhcyBhbnksXG4gICAgICAgICAgc3RyaWN0OiB0aGlzLnN0cmljdCxcbiAgICAgICAgICB0aGVtZTogdGhpcy50aGVtZSB8fCAodGhpcy5zZXJ2aWNlLmNvbmZpZy50aGVtZSA/IHRoaXMuc2VydmljZS5jb25maWcudGhlbWUgOiAnc25vdycpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gU2V0IG9wdGlvbmFsIGxpbmsgcGxhY2Vob2xkZXIsIFF1aWxsIGhhcyBubyBuYXRpdmUgQVBJIGZvciBpdCBzbyB1c2luZyB3b3JrYXJvdW5kXG4gICAgICAgIGlmICh0aGlzLmxpbmtQbGFjZWhvbGRlcikge1xuICAgICAgICAgIGNvbnN0IHRvb2x0aXAgPSAodGhpcy5xdWlsbEVkaXRvciBhcyBhbnkpPy50aGVtZT8udG9vbHRpcFxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gdG9vbHRpcD8ucm9vdD8ucXVlcnlTZWxlY3RvcignaW5wdXRbZGF0YS1saW5rXScpXG4gICAgICAgICAgaWYgKGlucHV0Py5kYXRhc2V0KSB7XG4gICAgICAgICAgICBpbnB1dC5kYXRhc2V0LmxpbmsgPSB0aGlzLmxpbmtQbGFjZWhvbGRlclxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgaWYgKHRoaXMuY29udGVudCkge1xuICAgICAgICBjb25zdCBmb3JtYXQgPSBnZXRGb3JtYXQodGhpcy5mb3JtYXQsIHRoaXMuc2VydmljZS5jb25maWcuZm9ybWF0KVxuXG4gICAgICAgIGlmIChmb3JtYXQgPT09ICd0ZXh0Jykge1xuICAgICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0VGV4dCh0aGlzLmNvbnRlbnQsICdzaWxlbnQnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZVNldHRlcih0aGlzLnF1aWxsRWRpdG9yLCB0aGlzLmNvbnRlbnQpXG4gICAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRDb250ZW50cyhuZXdWYWx1ZSwgJ3NpbGVudCcpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLmhpc3RvcnkuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICAvLyBpbml0aWFsaXplIGRpc2FibGVkIHN0YXR1cyBiYXNlZCBvbiB0aGlzLmRpc2FibGVkIGFzIGRlZmF1bHQgdmFsdWVcbiAgICAgIHRoaXMuc2V0RGlzYWJsZWRTdGF0ZSgpXG5cbiAgICAgIHRoaXMuYWRkUXVpbGxFdmVudExpc3RlbmVycygpXG5cbiAgICAgIC8vIFRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB0cmlnZ2VycyBjaGFuZ2UgZGV0ZWN0aW9uLiBUaGVyZSdzIG5vIHNlbnNlIHRvIGludm9rZSB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgaWYgYW55b25lIGlzXG4gICAgICAvLyBsaXN0ZW5pbmcgdG8gdGhlIGBvbkVkaXRvckNyZWF0ZWRgIGV2ZW50IGluc2lkZSB0aGUgdGVtcGxhdGUsIGZvciBpbnN0YW5jZSBgPHF1aWxsLXZpZXcgKG9uRWRpdG9yQ3JlYXRlZCk9XCIuLi5cIj5gLlxuICAgICAgaWYgKCF0aGlzLm9uRWRpdG9yQ3JlYXRlZC5vYnNlcnZlZCAmJiAhdGhpcy5vblZhbGlkYXRvckNoYW5nZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB3aWxsIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBhbmQgYG9uRWRpdG9yQ3JlYXRlZGAgd2lsbCBhbHNvIGNhbGwgYG1hcmtEaXJ0eSgpYFxuICAgICAgLy8gaW50ZXJuYWxseSwgc2luY2UgQW5ndWxhciB3cmFwcyB0ZW1wbGF0ZSBldmVudCBsaXN0ZW5lcnMgaW50byBgbGlzdGVuZXJgIGluc3RydWN0aW9uLiBXZSdyZSB1c2luZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWBcbiAgICAgIC8vIHRvIHByZXZlbnQgdGhlIGZyYW1lIGRyb3AgYW5kIGF2b2lkIGBFeHByZXNzaW9uQ2hhbmdlZEFmdGVySXRIYXNCZWVuQ2hlY2tlZEVycm9yYCBlcnJvci5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9uVmFsaWRhdG9yQ2hhbmdlZCkge1xuICAgICAgICAgIHRoaXMub25WYWxpZGF0b3JDaGFuZ2VkKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uRWRpdG9yQ3JlYXRlZC5lbWl0KHRoaXMucXVpbGxFZGl0b3IpXG4gICAgICAgIHRoaXMub25FZGl0b3JDcmVhdGVkLmNvbXBsZXRlKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXIgPSAocmFuZ2U6IFJhbmdlIHwgbnVsbCwgb2xkUmFuZ2U6IFJhbmdlIHwgbnVsbCwgc291cmNlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBzaG91bGRUcmlnZ2VyT25Nb2RlbFRvdWNoZWQgPSAhcmFuZ2UgJiYgISF0aGlzLm9uTW9kZWxUb3VjaGVkXG5cbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyB3aGVuIHRoZXJlJ3MgYW55IGxpc3RlbmVyXG4gICAgaWYgKCF0aGlzLm9uQmx1ci5vYnNlcnZlZCAmJlxuICAgICAgIXRoaXMub25Gb2N1cy5vYnNlcnZlZCAmJlxuICAgICAgIXRoaXMub25TZWxlY3Rpb25DaGFuZ2VkLm9ic2VydmVkICYmXG4gICAgICAhc2hvdWxkVHJpZ2dlck9uTW9kZWxUb3VjaGVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIGlmIChyYW5nZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9uQmx1ci5lbWl0KHtcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgc291cmNlXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKG9sZFJhbmdlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMub25Gb2N1cy5lbWl0KHtcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgc291cmNlXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25TZWxlY3Rpb25DaGFuZ2VkLmVtaXQoe1xuICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgIG9sZFJhbmdlLFxuICAgICAgICByYW5nZSxcbiAgICAgICAgc291cmNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoc2hvdWxkVHJpZ2dlck9uTW9kZWxUb3VjaGVkKSB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpXG4gICAgfSlcbiAgfVxuXG4gIHRleHRDaGFuZ2VIYW5kbGVyID0gKGRlbHRhOiBEZWx0YSwgb2xkRGVsdGE6IERlbHRhLCBzb3VyY2U6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIC8vIG9ubHkgZW1pdCBjaGFuZ2VzIGVtaXR0ZWQgYnkgdXNlciBpbnRlcmFjdGlvbnNcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRUZXh0KClcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRDb250ZW50cygpXG5cbiAgICBsZXQgaHRtbDogc3RyaW5nIHwgbnVsbCA9IHRoaXMuZWRpdG9yRWxlbSEucXVlcnlTZWxlY3RvcignLnFsLWVkaXRvcicpIS5pbm5lckhUTUxcbiAgICBpZiAoaHRtbCA9PT0gJzxwPjxicj48L3A+JyB8fCBodG1sID09PSAnPGRpdj48YnI+PC9kaXY+Jykge1xuICAgICAgaHRtbCA9IHRoaXMuZGVmYXVsdEVtcHR5VmFsdWVcbiAgICB9XG5cbiAgICBjb25zdCB0cmFja0NoYW5nZXMgPSB0aGlzLnRyYWNrQ2hhbmdlcyB8fCB0aGlzLnNlcnZpY2UuY29uZmlnLnRyYWNrQ2hhbmdlc1xuICAgIGNvbnN0IHNob3VsZFRyaWdnZXJPbk1vZGVsQ2hhbmdlID0gKHNvdXJjZSA9PT0gJ3VzZXInIHx8IHRyYWNrQ2hhbmdlcyAmJiB0cmFja0NoYW5nZXMgPT09ICdhbGwnKSAmJiAhIXRoaXMub25Nb2RlbENoYW5nZVxuXG4gICAgLy8gb25seSBlbWl0IGNoYW5nZXMgd2hlbiB0aGVyZSdzIGFueSBsaXN0ZW5lclxuICAgIGlmICghdGhpcy5vbkNvbnRlbnRDaGFuZ2VkLm9ic2VydmVkICYmICFzaG91bGRUcmlnZ2VyT25Nb2RlbENoYW5nZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICBpZiAoc2hvdWxkVHJpZ2dlck9uTW9kZWxDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKFxuICAgICAgICAgIHRoaXMudmFsdWVHZXR0ZXIodGhpcy5xdWlsbEVkaXRvciwgdGhpcy5lZGl0b3JFbGVtISlcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9uQ29udGVudENoYW5nZWQuZW1pdCh7XG4gICAgICAgIGNvbnRlbnQsXG4gICAgICAgIGRlbHRhLFxuICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgIGh0bWwsXG4gICAgICAgIG9sZERlbHRhLFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIHRleHRcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKClcbiAgICB9KVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgZWRpdG9yQ2hhbmdlSGFuZGxlciA9IChcbiAgICBldmVudDogJ3RleHQtY2hhbmdlJyB8ICdzZWxlY3Rpb24tY2hhbmdlJyxcbiAgICBjdXJyZW50OiBhbnkgfCBSYW5nZSB8IG51bGwsIG9sZDogYW55IHwgUmFuZ2UgfCBudWxsLCBzb3VyY2U6IHN0cmluZ1xuICApOiB2b2lkID0+IHtcbiAgICAvLyBvbmx5IGVtaXQgY2hhbmdlcyB3aGVuIHRoZXJlJ3MgYW55IGxpc3RlbmVyXG4gICAgaWYgKCF0aGlzLm9uRWRpdG9yQ2hhbmdlZC5vYnNlcnZlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gb25seSBlbWl0IGNoYW5nZXMgZW1pdHRlZCBieSB1c2VyIGludGVyYWN0aW9uc1xuICAgIGlmIChldmVudCA9PT0gJ3RleHQtY2hhbmdlJykge1xuICAgICAgY29uc3QgdGV4dCA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5xdWlsbEVkaXRvci5nZXRDb250ZW50cygpXG5cbiAgICAgIGxldCBodG1sOiBzdHJpbmcgfCBudWxsID0gdGhpcy5lZGl0b3JFbGVtIS5xdWVyeVNlbGVjdG9yKCcucWwtZWRpdG9yJykhLmlubmVySFRNTFxuICAgICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicgfHwgaHRtbCA9PT0gJzxkaXY+PGJyPjwvZGl2PicpIHtcbiAgICAgICAgaHRtbCA9IHRoaXMuZGVmYXVsdEVtcHR5VmFsdWVcbiAgICAgIH1cblxuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMub25FZGl0b3JDaGFuZ2VkLmVtaXQoe1xuICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgZGVsdGE6IGN1cnJlbnQsXG4gICAgICAgICAgZWRpdG9yOiB0aGlzLnF1aWxsRWRpdG9yLFxuICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgb2xkRGVsdGE6IG9sZCxcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgdGV4dFxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLm9uRWRpdG9yQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgICBlZGl0b3I6IHRoaXMucXVpbGxFZGl0b3IsXG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgb2xkUmFuZ2U6IG9sZCxcbiAgICAgICAgICByYW5nZTogY3VycmVudCxcbiAgICAgICAgICBzb3VyY2VcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGlzcG9zZSgpXG5cbiAgICB0aGlzLnF1aWxsU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpXG4gICAgdGhpcy5xdWlsbFN1YnNjcmlwdGlvbiA9IG51bGxcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvZG90LW5vdGF0aW9uICovXG4gICAgaWYgKGNoYW5nZXMucmVhZE9ubHkpIHtcbiAgICAgIHRoaXMucXVpbGxFZGl0b3IuZW5hYmxlKCFjaGFuZ2VzLnJlYWRPbmx5LmN1cnJlbnRWYWx1ZSlcbiAgICB9XG4gICAgaWYgKGNoYW5nZXMucGxhY2Vob2xkZXIpIHtcbiAgICAgIHRoaXMucXVpbGxFZGl0b3Iucm9vdC5kYXRhc2V0LnBsYWNlaG9sZGVyID1cbiAgICAgICAgY2hhbmdlcy5wbGFjZWhvbGRlci5jdXJyZW50VmFsdWVcbiAgICB9XG4gICAgaWYgKGNoYW5nZXMuZGVmYXVsdEVtcHR5VmFsdWUpIHtcbiAgICAgIHRoaXMucXVpbGxFZGl0b3Iucm9vdC5kYXRhc2V0LmRlZmF1bHRFbXB0eVZhbHVlID1cbiAgICAgICAgY2hhbmdlcy5kZWZhdWx0RW1wdHlWYWx1ZS5jdXJyZW50VmFsdWVcbiAgICB9XG4gICAgaWYgKGNoYW5nZXMuc3R5bGVzKSB7XG4gICAgICBjb25zdCBjdXJyZW50U3R5bGluZyA9IGNoYW5nZXMuc3R5bGVzLmN1cnJlbnRWYWx1ZVxuICAgICAgY29uc3QgcHJldmlvdXNTdHlsaW5nID0gY2hhbmdlcy5zdHlsZXMucHJldmlvdXNWYWx1ZVxuXG4gICAgICBpZiAocHJldmlvdXNTdHlsaW5nKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHByZXZpb3VzU3R5bGluZykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZVN0eWxlKHRoaXMuZWRpdG9yRWxlbSwga2V5KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRTdHlsaW5nKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnRTdHlsaW5nKS5mb3JFYWNoKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lZGl0b3JFbGVtLCBrZXksIHRoaXMuc3R5bGVzW2tleV0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLmNsYXNzZXMpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRDbGFzc2VzID0gY2hhbmdlcy5jbGFzc2VzLmN1cnJlbnRWYWx1ZVxuICAgICAgY29uc3QgcHJldmlvdXNDbGFzc2VzID0gY2hhbmdlcy5jbGFzc2VzLnByZXZpb3VzVmFsdWVcblxuICAgICAgaWYgKHByZXZpb3VzQ2xhc3Nlcykge1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzZXMocHJldmlvdXNDbGFzc2VzKVxuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudENsYXNzZXMpIHtcbiAgICAgICAgdGhpcy5hZGRDbGFzc2VzKGN1cnJlbnRDbGFzc2VzKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBXZSdkIHdhbnQgdG8gcmUtYXBwbHkgZXZlbnQgbGlzdGVuZXJzIGlmIHRoZSBgZGVib3VuY2VUaW1lYCBiaW5kaW5nIGNoYW5nZXMgdG8gYXBwbHkgdGhlXG4gICAgLy8gYGRlYm91bmNlVGltZWAgb3BlcmF0b3Igb3IgdmljZS12ZXJzYSByZW1vdmUgaXQuXG4gICAgaWYgKGNoYW5nZXMuZGVib3VuY2VUaW1lKSB7XG4gICAgICB0aGlzLmFkZFF1aWxsRXZlbnRMaXN0ZW5lcnMoKVxuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIEB0eXBlc2NyaXB0LWVzbGludC9kb3Qtbm90YXRpb24gKi9cbiAgfVxuXG4gIGFkZENsYXNzZXMoY2xhc3NMaXN0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBRdWlsbEVkaXRvckJhc2Uubm9ybWFsaXplQ2xhc3NOYW1lcyhjbGFzc0xpc3QpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVkaXRvckVsZW0sIGMpXG4gICAgfSlcbiAgfVxuXG4gIHJlbW92ZUNsYXNzZXMoY2xhc3NMaXN0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBRdWlsbEVkaXRvckJhc2Uubm9ybWFsaXplQ2xhc3NOYW1lcyhjbGFzc0xpc3QpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVkaXRvckVsZW0sIGMpXG4gICAgfSlcbiAgfVxuXG4gIHdyaXRlVmFsdWUoY3VycmVudFZhbHVlOiBhbnkpIHtcblxuICAgIC8vIG9wdGlvbmFsIGZpeCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQ5ODhcbiAgICBpZiAodGhpcy5maWx0ZXJOdWxsICYmIGN1cnJlbnRWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50ID0gY3VycmVudFZhbHVlXG5cbiAgICBpZiAoIXRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGZvcm1hdCA9IGdldEZvcm1hdCh0aGlzLmZvcm1hdCwgdGhpcy5zZXJ2aWNlLmNvbmZpZy5mb3JtYXQpXG4gICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLnZhbHVlU2V0dGVyKHRoaXMucXVpbGxFZGl0b3IsIGN1cnJlbnRWYWx1ZSlcblxuICAgIGlmICh0aGlzLmNvbXBhcmVWYWx1ZXMpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRFZGl0b3JWYWx1ZSA9IHRoaXMucXVpbGxFZGl0b3IuZ2V0Q29udGVudHMoKVxuICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGN1cnJlbnRFZGl0b3JWYWx1ZSkgPT09IEpTT04uc3RyaW5naWZ5KG5ld1ZhbHVlKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFZhbHVlKSB7XG4gICAgICBpZiAoZm9ybWF0ID09PSAndGV4dCcpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KGN1cnJlbnRWYWx1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucXVpbGxFZGl0b3Iuc2V0Q29udGVudHMobmV3VmFsdWUpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KCcnKVxuXG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4gPSB0aGlzLmRpc2FibGVkKTogdm9pZCB7XG4gICAgLy8gc3RvcmUgaW5pdGlhbCB2YWx1ZSB0byBzZXQgYXBwcm9wcmlhdGUgZGlzYWJsZWQgc3RhdHVzIGFmdGVyIFZpZXdJbml0XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWRcbiAgICBpZiAodGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5kaXNhYmxlKClcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsICdkaXNhYmxlZCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXRoaXMucmVhZE9ubHkpIHtcbiAgICAgICAgICB0aGlzLnF1aWxsRWRpdG9yLmVuYWJsZSgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKG1vZGVsVmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuXG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmblxuICB9XG5cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMub25WYWxpZGF0b3JDaGFuZ2VkID0gZm5cbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgIGlmICghdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBlcnI6IHtcbiAgICAgIG1pbkxlbmd0aEVycm9yPzoge1xuICAgICAgICBnaXZlbjogbnVtYmVyXG4gICAgICAgIG1pbkxlbmd0aDogbnVtYmVyXG4gICAgICB9XG4gICAgICBtYXhMZW5ndGhFcnJvcj86IHtcbiAgICAgICAgZ2l2ZW46IG51bWJlclxuICAgICAgICBtYXhMZW5ndGg6IG51bWJlclxuICAgICAgfVxuICAgICAgcmVxdWlyZWRFcnJvcj86IHsgZW1wdHk6IGJvb2xlYW4gfVxuICAgIH0gPSB7fVxuICAgIGxldCB2YWxpZCA9IHRydWVcblxuICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKVxuICAgIC8vIHRyaW0gdGV4dCBpZiB3YW50ZWQgKyBoYW5kbGUgc3BlY2lhbCBjYXNlIHRoYXQgYW4gZW1wdHkgZWRpdG9yIGNvbnRhaW5zIGEgbmV3IGxpbmVcbiAgICBjb25zdCB0ZXh0TGVuZ3RoID0gdGhpcy50cmltT25WYWxpZGF0aW9uID8gdGV4dC50cmltKCkubGVuZ3RoIDogKHRleHQubGVuZ3RoID09PSAxICYmIHRleHQudHJpbSgpLmxlbmd0aCA9PT0gMCA/IDAgOiB0ZXh0Lmxlbmd0aCAtIDEpXG4gICAgY29uc3QgZGVsdGFPcGVyYXRpb25zID0gdGhpcy5xdWlsbEVkaXRvci5nZXRDb250ZW50cygpLm9wc1xuICAgIGNvbnN0IG9ubHlFbXB0eU9wZXJhdGlvbiA9IGRlbHRhT3BlcmF0aW9ucyAmJiBkZWx0YU9wZXJhdGlvbnMubGVuZ3RoID09PSAxICYmIFsnXFxuJywgJyddLmluY2x1ZGVzKFN0cmluZyhkZWx0YU9wZXJhdGlvbnNbMF0uaW5zZXJ0KSlcblxuICAgIGlmICh0aGlzLm1pbkxlbmd0aCAmJiB0ZXh0TGVuZ3RoICYmIHRleHRMZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xuICAgICAgZXJyLm1pbkxlbmd0aEVycm9yID0ge1xuICAgICAgICBnaXZlbjogdGV4dExlbmd0aCxcbiAgICAgICAgbWluTGVuZ3RoOiB0aGlzLm1pbkxlbmd0aFxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF4TGVuZ3RoICYmIHRleHRMZW5ndGggPiB0aGlzLm1heExlbmd0aCkge1xuICAgICAgZXJyLm1heExlbmd0aEVycm9yID0ge1xuICAgICAgICBnaXZlbjogdGV4dExlbmd0aCxcbiAgICAgICAgbWF4TGVuZ3RoOiB0aGlzLm1heExlbmd0aFxuICAgICAgfVxuXG4gICAgICB2YWxpZCA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVxdWlyZWQgJiYgIXRleHRMZW5ndGggJiYgb25seUVtcHR5T3BlcmF0aW9uKSB7XG4gICAgICBlcnIucmVxdWlyZWRFcnJvciA9IHtcbiAgICAgICAgZW1wdHk6IHRydWVcbiAgICAgIH1cblxuICAgICAgdmFsaWQgPSBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiB2YWxpZCA/IG51bGwgOiBlcnJcbiAgfVxuXG4gIHByaXZhdGUgYWRkUXVpbGxFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3Bvc2UoKVxuXG4gICAgLy8gV2UgaGF2ZSB0byBlbnRlciB0aGUgYDxyb290PmAgem9uZSB3aGVuIGFkZGluZyBldmVudCBsaXN0ZW5lcnMsIHNvIGBkZWJvdW5jZVRpbWVgIHdpbGwgc3Bhd24gdGhlXG4gICAgLy8gYEFzeW5jQWN0aW9uYCB0aGVyZSB3L28gdHJpZ2dlcmluZyBjaGFuZ2UgZGV0ZWN0aW9ucy4gV2Ugc3RpbGwgcmUtZW50ZXIgdGhlIEFuZ3VsYXIncyB6b25lIHRocm91Z2hcbiAgICAvLyBgem9uZS5ydW5gIHdoZW4gd2UgZW1pdCBhbiBldmVudCB0byB0aGUgcGFyZW50IGNvbXBvbmVudC5cbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKClcblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICAvLyBtYXJrIG1vZGVsIGFzIHRvdWNoZWQgaWYgZWRpdG9yIGxvc3QgZm9jdXNcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMucXVpbGxFZGl0b3IsICdzZWxlY3Rpb24tY2hhbmdlJykuc3Vic2NyaWJlKFxuICAgICAgICAgIChbcmFuZ2UsIG9sZFJhbmdlLCBzb3VyY2VdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZUhhbmRsZXIocmFuZ2UgYXMgYW55LCBvbGRSYW5nZSBhcyBhbnksIHNvdXJjZSlcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIClcblxuICAgICAgLy8gVGhlIGBmcm9tRXZlbnRgIHN1cHBvcnRzIHBhc3NpbmcgSlF1ZXJ5LXN0eWxlIGV2ZW50IHRhcmdldHMsIHRoZSBlZGl0b3IgaGFzIGBvbmAgYW5kIGBvZmZgIG1ldGhvZHMgd2hpY2hcbiAgICAgIC8vIHdpbGwgYmUgaW52b2tlZCB1cG9uIHN1YnNjcmlwdGlvbiBhbmQgdGVhcmRvd24uXG4gICAgICBsZXQgdGV4dENoYW5nZSQgPSBmcm9tRXZlbnQodGhpcy5xdWlsbEVkaXRvciwgJ3RleHQtY2hhbmdlJylcbiAgICAgIGxldCBlZGl0b3JDaGFuZ2UkID0gZnJvbUV2ZW50KHRoaXMucXVpbGxFZGl0b3IsICdlZGl0b3ItY2hhbmdlJylcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmRlYm91bmNlVGltZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGV4dENoYW5nZSQgPSB0ZXh0Q2hhbmdlJC5waXBlKGRlYm91bmNlVGltZSh0aGlzLmRlYm91bmNlVGltZSkpXG4gICAgICAgIGVkaXRvckNoYW5nZSQgPSBlZGl0b3JDaGFuZ2UkLnBpcGUoZGVib3VuY2VUaW1lKHRoaXMuZGVib3VuY2VUaW1lKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICAvLyB1cGRhdGUgbW9kZWwgaWYgdGV4dCBjaGFuZ2VzXG4gICAgICAgIHRleHRDaGFuZ2UkLnN1YnNjcmliZSgoW2RlbHRhLCBvbGREZWx0YSwgc291cmNlXSkgPT4ge1xuICAgICAgICAgIHRoaXMudGV4dENoYW5nZUhhbmRsZXIoZGVsdGEgYXMgYW55LCBvbGREZWx0YSBhcyBhbnksIHNvdXJjZSlcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICAvLyB0cmlnZ2VyZWQgaWYgc2VsZWN0aW9uIG9yIHRleHQgY2hhbmdlZFxuICAgICAgICBlZGl0b3JDaGFuZ2UkLnN1YnNjcmliZSgoW2V2ZW50LCBjdXJyZW50LCBvbGQsIHNvdXJjZV0pID0+IHtcbiAgICAgICAgICB0aGlzLmVkaXRvckNoYW5nZUhhbmRsZXIoZXZlbnQgYXMgJ3RleHQtY2hhbmdlJyB8ICdzZWxlY3Rpb24tY2hhbmdlJywgY3VycmVudCwgb2xkLCBzb3VyY2UpXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbnVsbFxuICAgIH1cbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uRW11bGF0ZWQsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVzZS1iZWZvcmUtZGVmaW5lXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBRdWlsbEVkaXRvckNvbXBvbmVudClcbiAgICB9LFxuICAgIHtcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFF1aWxsRWRpdG9yQ29tcG9uZW50KVxuICAgIH1cbiAgXSxcbiAgc2VsZWN0b3I6ICdxdWlsbC1lZGl0b3InLFxuICB0ZW1wbGF0ZTogYFxuICA8bmctY29udGFpbmVyICpuZ0lmPVwidG9vbGJhclBvc2l0aW9uICE9PSAndG9wJ1wiPlxuICAgIDxkaXYgcXVpbGwtZWRpdG9yLWVsZW1lbnQgKm5nSWY9XCIhcHJlc2VydmVcIj48L2Rpdj5cbiAgICA8cHJlIHF1aWxsLWVkaXRvci1lbGVtZW50ICpuZ0lmPVwicHJlc2VydmVcIj48L3ByZT5cbiAgPC9uZy1jb250YWluZXI+XG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIltxdWlsbC1lZGl0b3ItdG9vbGJhcl1cIj48L25nLWNvbnRlbnQ+XG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0b29sYmFyUG9zaXRpb24gPT09ICd0b3AnXCI+XG4gICAgPGRpdiBxdWlsbC1lZGl0b3ItZWxlbWVudCAqbmdJZj1cIiFwcmVzZXJ2ZVwiPjwvZGl2PlxuICAgIDxwcmUgcXVpbGwtZWRpdG9yLWVsZW1lbnQgKm5nSWY9XCJwcmVzZXJ2ZVwiPjwvcHJlPlxuICA8L25nLWNvbnRhaW5lcj5cbmAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICA6aG9zdCB7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgfVxuICAgIGBcbiAgXSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxFZGl0b3JDb21wb25lbnQgZXh0ZW5kcyBRdWlsbEVkaXRvckJhc2Uge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBASW5qZWN0KEVsZW1lbnRSZWYpIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQEluamVjdChDaGFuZ2VEZXRlY3RvclJlZikgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoRG9tU2FuaXRpemVyKSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgQEluamVjdChSZW5kZXJlcjIpIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChOZ1pvbmUpIHpvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KFF1aWxsU2VydmljZSkgc2VydmljZTogUXVpbGxTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgaW5qZWN0b3IsXG4gICAgICBlbGVtZW50UmVmLFxuICAgICAgY2QsXG4gICAgICBkb21TYW5pdGl6ZXIsXG4gICAgICBwbGF0Zm9ybUlkLFxuICAgICAgcmVuZGVyZXIsXG4gICAgICB6b25lLFxuICAgICAgc2VydmljZVxuICAgIClcbiAgfVxuXG59XG4iXX0=