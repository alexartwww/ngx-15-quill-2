import { defaultModules, QUILL_CONFIG_TOKEN } from 'ngx-15-quill-2/config';
export * from 'ngx-15-quill-2/config';
import * as i0 from '@angular/core';
import { Injectable, Optional, Inject, EventEmitter, SecurityContext, PLATFORM_ID, Directive, Input, Output, ElementRef, ChangeDetectorRef, Renderer2, NgZone, forwardRef, Component, ViewEncapsulation, NgModule } from '@angular/core';
import { __awaiter, __decorate } from 'tslib';
import * as i3 from '@angular/common';
import { DOCUMENT, isPlatformServer, CommonModule } from '@angular/common';
import * as i1 from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, defer, firstValueFrom, from, forkJoin, map, of, isObservable, tap, fromEvent, Subscription } from 'rxjs';
import { shareReplay, mergeMap, debounceTime } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

const getFormat = (format, configFormat) => {
    const passedFormat = format || configFormat;
    return passedFormat || 'html';
};
const raf$ = () => {
    return new Observable(subscriber => {
        const rafId = requestAnimationFrame(() => {
            subscriber.next();
            subscriber.complete();
        });
        return () => cancelAnimationFrame(rafId);
    });
};

class QuillService {
    constructor(injector, config) {
        this.config = config;
        this.quill$ = defer(() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.Quill) {
                // Quill adds events listeners on import https://github.com/quilljs/quill/blob/develop/core/emitter.js#L8
                // We'd want to use the unpatched `addEventListener` method to have all event callbacks to be run outside of zone.
                // We don't know yet if the `zone.js` is used or not, just save the value to restore it back further.
                const maybePatchedAddEventListener = this.document.addEventListener;
                // There're 2 types of Angular applications:
                // 1) zone-full (by default)
                // 2) zone-less
                // The developer can avoid importing the `zone.js` package and tells Angular that he/she is responsible for running
                // the change detection by himself. This is done by "nooping" the zone through `CompilerOptions` when bootstrapping
                // the root module. We fallback to `document.addEventListener` if `__zone_symbol__addEventListener` is not defined,
                // this means the `zone.js` is not imported.
                // The `__zone_symbol__addEventListener` is basically a native DOM API, which is not patched by zone.js, thus not even going
                // through the `zone.js` task lifecycle. You can also access the native DOM API as follows `target[Zone.__symbol__('methodName')]`.
                // eslint-disable-next-line @typescript-eslint/dot-notation
                this.document.addEventListener = this.document['__zone_symbol__addEventListener'] || this.document.addEventListener;
                const quillImport = yield import('quill');
                this.document.addEventListener = maybePatchedAddEventListener;
                this.Quill = (quillImport.default ? quillImport.default : quillImport);
            }
            // Only register custom options and modules once
            (_a = this.config.customOptions) === null || _a === void 0 ? void 0 : _a.forEach((customOption) => {
                const newCustomOption = this.Quill.import(customOption.import);
                newCustomOption.whitelist = customOption.whitelist;
                this.Quill.register(newCustomOption, true, this.config.suppressGlobalRegisterWarning);
            });
            return firstValueFrom(this.registerCustomModules(this.Quill, this.config.customModules, this.config.suppressGlobalRegisterWarning));
        })).pipe(shareReplay({
            bufferSize: 1,
            refCount: false
        }));
        // A list of custom modules that have already been registered,
        // so we don’t need to await their implementation.
        this.registeredModules = new Set();
        this.document = injector.get(DOCUMENT);
        if (!this.config) {
            this.config = { modules: defaultModules };
        }
    }
    getQuill() {
        return this.quill$;
    }
    /** @internal */
    beforeRender(Quill, customModules, beforeRender = this.config.beforeRender) {
        // This function is called each time the editor needs to be rendered,
        // so it operates individually per component. If no custom module needs to be
        // registered and no `beforeRender` function is provided, it will emit
        // immediately and proceed with the rendering.
        const sources = [this.registerCustomModules(Quill, customModules)];
        if (beforeRender) {
            sources.push(from(beforeRender()));
        }
        return forkJoin(sources).pipe(map(() => Quill));
    }
    /** @internal */
    registerCustomModules(Quill, customModules, suppressGlobalRegisterWarning) {
        if (!Array.isArray(customModules)) {
            return of(Quill);
        }
        const sources = [];
        for (const customModule of customModules) {
            const { path, implementation: maybeImplementation } = customModule;
            // If the module is already registered, proceed to the next module...
            if (this.registeredModules.has(path)) {
                continue;
            }
            this.registeredModules.add(path);
            if (isObservable(maybeImplementation)) {
                // If the implementation is an observable, we will wait for it to load and
                // then register it with Quill. The caller will wait until the module is registered.
                sources.push(maybeImplementation.pipe(tap((implementation) => {
                    Quill.register(path, implementation, suppressGlobalRegisterWarning);
                })));
            }
            else {
                Quill.register(path, maybeImplementation, suppressGlobalRegisterWarning);
            }
        }
        return sources.length > 0 ? forkJoin(sources).pipe(map(() => Quill)) : of(Quill);
    }
}
QuillService.ɵfac = function QuillService_Factory(t) { return new (t || QuillService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(QUILL_CONFIG_TOKEN, 8)); };
QuillService.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: QuillService, factory: QuillService.ɵfac, providedIn: 'root' });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillService, [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], function () {
        return [{ type: i0.Injector }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [QUILL_CONFIG_TOKEN]
                    }] }];
    }, null);
})();

var QuillEditorBase_1;
function QuillEditorComponent_div_0_Template(rf, ctx) {
    if (rf & 1) {
        i0.ɵɵelement(0, "div", 1);
    }
}
function QuillEditorComponent_div_4_Template(rf, ctx) {
    if (rf & 1) {
        i0.ɵɵelement(0, "div", 1);
    }
}
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
                var _a, _b, _c;
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
                    const tooltip = (_b = (_a = this.quillEditor) === null || _a === void 0 ? void 0 : _a.theme) === null || _b === void 0 ? void 0 : _b.tooltip;
                    const input = (_c = tooltip === null || tooltip === void 0 ? void 0 : tooltip.root) === null || _c === void 0 ? void 0 : _c.querySelector('input[data-link]');
                    if (input === null || input === void 0 ? void 0 : input.dataset) {
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
        var _a;
        this.dispose();
        (_a = this.quillSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
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
        var _a;
        if (!this.quillEditor) {
            return null;
        }
        const err = {};
        let valid = true;
        const text = this.quillEditor.getText();
        // trim text if wanted + handle special case that an empty editor contains a new line
        const textLength = this.trimOnValidation ? text.trim().length : (text.length === 1 && text.trim().length === 0 ? 0 : text.length - 1);
        const deltaOperations = this.quillEditor.getContents().ops;
        const onlyEmptyOperation = !!deltaOperations && deltaOperations.length === 1 && ['\n', ''].includes((_a = deltaOperations[0].insert) === null || _a === void 0 ? void 0 : _a.toString());
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
QuillEditorBase.ɵfac = function QuillEditorBase_Factory(t) { return new (t || QuillEditorBase)(i0.ɵɵdirectiveInject(i0.Injector), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.ChangeDetectorRef), i0.ɵɵdirectiveInject(i1.DomSanitizer), i0.ɵɵdirectiveInject(PLATFORM_ID), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(QuillService)); };
QuillEditorBase.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: QuillEditorBase, inputs: { format: "format", theme: "theme", modules: "modules", debug: "debug", readOnly: "readOnly", placeholder: "placeholder", maxLength: "maxLength", minLength: "minLength", required: "required", formats: "formats", customToolbarPosition: "customToolbarPosition", sanitize: "sanitize", beforeRender: "beforeRender", styles: "styles", strict: "strict", scrollingContainer: "scrollingContainer", bounds: "bounds", customOptions: "customOptions", customModules: "customModules", trackChanges: "trackChanges", preserveWhitespace: "preserveWhitespace", classes: "classes", trimOnValidation: "trimOnValidation", linkPlaceholder: "linkPlaceholder", compareValues: "compareValues", filterNull: "filterNull", debounceTime: "debounceTime", registry: "registry", defaultEmptyValue: "defaultEmptyValue", valueGetter: "valueGetter", valueSetter: "valueSetter" }, outputs: { onEditorCreated: "onEditorCreated", onEditorChanged: "onEditorChanged", onContentChanged: "onContentChanged", onSelectionChanged: "onSelectionChanged", onFocus: "onFocus", onBlur: "onBlur", onNativeFocus: "onNativeFocus", onNativeBlur: "onNativeBlur" }, features: [i0.ɵɵNgOnChangesFeature] });
QuillEditorBase = QuillEditorBase_1 = __decorate([
    UntilDestroy()
], QuillEditorBase);
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillEditorBase, [{
            type: Directive
        }], function () {
        return [{ type: i0.Injector }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.DomSanitizer }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: QuillService }];
    }, { format: [{
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
            }] });
})();
class QuillEditorComponent extends QuillEditorBase {
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
        ]), i0.ɵɵInheritDefinitionFeature, i0.ɵɵStandaloneFeature], ngContentSelectors: _c1, decls: 5, vars: 2, consts: [["quill-editor-element", "", 4, "ngIf"], ["quill-editor-element", ""]], template: function QuillEditorComponent_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵtemplate(0, QuillEditorComponent_div_0_Template, 1, 0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵprojection(2, 1);
            i0.ɵɵprojection(3, 2);
            i0.ɵɵtemplate(4, QuillEditorComponent_div_4_Template, 1, 0, "div", 0);
        }
        if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.toolbarPosition !== "top");
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.toolbarPosition === "top");
        }
    }, dependencies: [CommonModule, i3.NgIf], styles: ["[_nghost-%COMP%]{display:inline-block}"] });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillEditorComponent, [{
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
        }], function () {
        return [{ type: i0.Injector }, { type: i0.ElementRef, decorators: [{
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
                    }] }, { type: QuillService, decorators: [{
                        type: Inject,
                        args: [QuillService]
                    }] }];
    }, null);
})();

class QuillViewHTMLComponent {
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
QuillViewHTMLComponent.ɵfac = function QuillViewHTMLComponent_Factory(t) { return new (t || QuillViewHTMLComponent)(i0.ɵɵdirectiveInject(DomSanitizer), i0.ɵɵdirectiveInject(QuillService)); };
QuillViewHTMLComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QuillViewHTMLComponent, selectors: [["quill-view-html"]], inputs: { content: "content", theme: "theme", sanitize: "sanitize" }, standalone: true, features: [i0.ɵɵNgOnChangesFeature, i0.ɵɵStandaloneFeature], decls: 2, vars: 2, consts: [[1, "ql-container", 3, "ngClass"], [1, "ql-editor", 3, "innerHTML"]], template: function QuillViewHTMLComponent_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵelement(1, "div", 1);
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            i0.ɵɵproperty("ngClass", ctx.themeClass);
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("innerHTML", ctx.innerHTML, i0.ɵɵsanitizeHtml);
        }
    }, dependencies: [CommonModule, i3.NgClass], styles: [".ql-container.ngx-quill-view-html{border:0}\n"], encapsulation: 2 });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillViewHTMLComponent, [{
            type: Component,
            args: [{ encapsulation: ViewEncapsulation.None, selector: 'quill-view-html', template: `
  <div class="ql-container" [ngClass]="themeClass">
    <div class="ql-editor" [innerHTML]="innerHTML">
    </div>
  </div>
`, standalone: true, imports: [CommonModule], styles: [".ql-container.ngx-quill-view-html{border:0}\n"] }]
        }], function () {
        return [{ type: i1.DomSanitizer, decorators: [{
                        type: Inject,
                        args: [DomSanitizer]
                    }] }, { type: QuillService }];
    }, { content: [{
                type: Input
            }], theme: [{
                type: Input
            }], sanitize: [{
                type: Input
            }] });
})();

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
        var _a;
        (_a = this.quillSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this.quillSubscription = null;
    }
};
QuillViewComponent.ɵfac = function QuillViewComponent_Factory(t) { return new (t || QuillViewComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(QuillService), i0.ɵɵdirectiveInject(i1.DomSanitizer), i0.ɵɵdirectiveInject(PLATFORM_ID)); };
QuillViewComponent.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QuillViewComponent, selectors: [["quill-view"]], inputs: { format: "format", theme: "theme", modules: "modules", debug: "debug", formats: "formats", sanitize: "sanitize", beforeRender: "beforeRender", strict: "strict", content: "content", customModules: "customModules", customOptions: "customOptions" }, outputs: { onEditorCreated: "onEditorCreated" }, standalone: true, features: [i0.ɵɵNgOnChangesFeature, i0.ɵɵStandaloneFeature], decls: 1, vars: 0, consts: [["quill-view-element", ""]], template: function QuillViewComponent_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelement(0, "div", 0);
        }
    }, dependencies: [CommonModule], styles: [".ql-container.ngx-quill-view{border:0}\n"], encapsulation: 2 });
QuillViewComponent = __decorate([
    UntilDestroy()
], QuillViewComponent);
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillViewComponent, [{
            type: Component,
            args: [{ encapsulation: ViewEncapsulation.None, selector: 'quill-view', template: `
    <div quill-view-element></div>
`, standalone: true, imports: [CommonModule], styles: [".ql-container.ngx-quill-view{border:0}\n"] }]
        }], function () {
        return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: QuillService }, { type: i1.DomSanitizer }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }];
    }, { format: [{
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
            }] });
})();

class QuillModule {
    static forRoot(config) {
        return {
            ngModule: QuillModule,
            providers: [
                {
                    provide: QUILL_CONFIG_TOKEN,
                    useValue: config
                }
            ]
        };
    }
}
QuillModule.ɵfac = function QuillModule_Factory(t) { return new (t || QuillModule)(); };
QuillModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: QuillModule });
QuillModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent] });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuillModule, [{
            type: NgModule,
            args: [{
                    imports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
                    exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
                }]
        }], null, null);
})();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(QuillModule, { imports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent], exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent] }); })();

/*
 * Public API Surface of ngx-15-quill-2
 */

/**
 * Generated bundle index. Do not edit.
 */

export { QuillEditorBase, QuillEditorComponent, QuillModule, QuillService, QuillViewComponent, QuillViewHTMLComponent };
//# sourceMappingURL=ngx-15-quill-2.mjs.map
//# sourceMappingURL=ngx-15-quill-2.mjs.map
