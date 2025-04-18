import { InjectionToken } from '@angular/core';
import type { QuillOptions } from 'quill';
import type { Observable } from 'rxjs';
export interface CustomOption {
    import: string;
    whitelist: any[];
}
export interface CustomModule {
    implementation: any;
    path: string;
}
export declare type QuillToolbarConfig = (string | {
    indent?: string;
    list?: string;
    direction?: string;
    header?: number | (boolean | number)[];
    color?: string[] | string;
    background?: string[] | string;
    align?: string[] | string;
    script?: string;
    font?: string[] | string;
    size?: (boolean | string)[];
} | Record<string, string | number | boolean | (boolean | string | number)[]>)[][];
export interface QuillModules {
    [key: string]: any;
    clipboard?: {
        matchers?: any[];
        matchVisual?: boolean;
    } | boolean;
    history?: {
        delay?: number;
        maxStack?: number;
        userOnly?: boolean;
    } | boolean;
    keyboard?: {
        bindings?: any;
    } | boolean;
    syntax?: boolean | {
        hljs: any;
    };
    table?: boolean | Record<string, unknown>;
    toolbar?: QuillToolbarConfig | string | {
        container?: string | string[] | QuillToolbarConfig;
        handlers?: Record<string, any>;
    } | boolean;
}
export declare type QuillFormat = 'object' | 'json' | 'html' | 'text';
export declare type QuillBeforeRender = (() => Promise<any>) | (() => Observable<any>);
export interface QuillConfig {
    bounds?: HTMLElement | string;
    customModules?: CustomModule[];
    customOptions?: CustomOption[];
    suppressGlobalRegisterWarning?: boolean;
    debug?: 'error' | 'warn' | 'log' | false;
    format?: QuillFormat;
    formats?: string[];
    modules?: QuillModules;
    placeholder?: string;
    readOnly?: boolean;
    registry?: QuillOptions['registry'];
    theme?: string;
    trackChanges?: 'user' | 'all';
    defaultEmptyValue?: any;
    sanitize?: boolean;
    beforeRender?: QuillBeforeRender;
}
export declare const QUILL_CONFIG_TOKEN: InjectionToken<QuillConfig>;
