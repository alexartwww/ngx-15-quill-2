import { InjectionToken } from '@angular/core';
import { defaultModules } from './quill-defaults';
export const QUILL_CONFIG_TOKEN = new InjectionToken('config', {
    providedIn: 'root',
    factory: () => ({ modules: defaultModules })
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpbGwtZWRpdG9yLmludGVyZmFjZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtcXVpbGwvY29uZmlnL3NyYy9xdWlsbC1lZGl0b3IuaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBRTlDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQXVGakQsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxjQUFjLENBQWMsUUFBUSxFQUFFO0lBQzFFLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDO0NBQzdDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuaW1wb3J0IHsgZGVmYXVsdE1vZHVsZXMgfSBmcm9tICcuL3F1aWxsLWRlZmF1bHRzJ1xuXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbU9wdGlvbiB7XG4gIGltcG9ydDogc3RyaW5nXG4gIHdoaXRlbGlzdDogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDdXN0b21Nb2R1bGUge1xuICAvLyBUaGUgYGltcGxlbWVudGF0aW9uYCBtYXkgYmUgYSBjdXN0b20gbW9kdWxlIGNvbnN0cnVjdG9yIG9yIGFuIE9ic2VydmFibGUgdGhhdCByZXNvbHZlcyB0b1xuICAvLyBhIGN1c3RvbSBtb2R1bGUgY29uc3RydWN0b3IgKGluIGNhc2UgeW91J2Qgd2FudCB0byBsb2FkIHlvdXIgY3VzdG9tIG1vZHVsZSBsYXppbHkpLlxuICAvLyBGb3IgaW5zdGFuY2UsIHRoZXNlIG9wdGlvbnMgYXJlIGFwcGxpY2FibGU6XG4gIC8vIGltcG9ydCBCbG90Rm9ybWF0dGVyIGZyb20gJ3F1aWxsLWJsb3QtZm9ybWF0dGVyJztcbiAgLy8gY3VzdG9tTW9kdWxlcyA9IFtcbiAgLy8gICB7IHBhdGg6ICdtb2R1bGVzL2Jsb3RGb3JtYXR0ZXInLCBpbXBsZW1lbnRhdGlvbjogQmxvdEZvcm1hdHRlciB9XG4gIC8vIF07XG4gIC8vIE9yOlxuICAvLyBjb25zdCBCbG90Rm9ybWF0dGVyJCA9IGRlZmVyKCgpID0+IGltcG9ydCgncXVpbGwtYmxvdC1mb3JtYXR0ZXInKS50aGVuKG0gPT4gbS5kZWZhdWx0KSlcbiAgLy8gY3VzdG9tTW9kdWxlcyA9IFtcbiAgLy8gICB7IHBhdGg6ICdtb2R1bGVzL2Jsb3RGb3JtYXR0ZXInLCBpbXBsZW1lbnRhdGlvbjogQmxvdEZvcm1hdHRlciQgfVxuICAvLyBdO1xuICBpbXBsZW1lbnRhdGlvbjogYW55XG4gIHBhdGg6IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBRdWlsbFRvb2xiYXJDb25maWcgPSBBcnJheTxBcnJheTwgc3RyaW5nIHwge1xuICBpbmRlbnQ/OiBzdHJpbmdcbiAgbGlzdD86IHN0cmluZ1xuICBkaXJlY3Rpb24/OiBzdHJpbmdcbiAgaGVhZGVyPzogbnVtYmVyIHwgQXJyYXk8Ym9vbGVhbiB8IG51bWJlcj5cbiAgY29sb3I/OiBzdHJpbmdbXSB8IHN0cmluZ1xuICBiYWNrZ3JvdW5kPzogc3RyaW5nW10gfCBzdHJpbmdcbiAgYWxpZ24/OiBzdHJpbmdbXSB8IHN0cmluZ1xuICBzY3JpcHQ/OiBzdHJpbmdcbiAgZm9udD86IHN0cmluZ1tdIHwgc3RyaW5nXG4gIHNpemU/OiBBcnJheTxib29sZWFuIHwgc3RyaW5nPlxufVxuPj5cblxuZXhwb3J0IGludGVyZmFjZSBRdWlsbE1vZHVsZXMge1xuICBba2V5OiBzdHJpbmddOiBhbnlcbiAgY2xpcGJvYXJkPzoge1xuICAgIG1hdGNoZXJzPzogYW55W11cbiAgICBtYXRjaFZpc3VhbD86IGJvb2xlYW5cbiAgfSB8IGJvb2xlYW5cbiAgaGlzdG9yeT86IHtcbiAgICBkZWxheT86IG51bWJlclxuICAgIG1heFN0YWNrPzogbnVtYmVyXG4gICAgdXNlck9ubHk/OiBib29sZWFuXG4gIH0gfCBib29sZWFuXG4gIGtleWJvYXJkPzoge1xuICAgIGJpbmRpbmdzPzogYW55XG4gIH0gfCBib29sZWFuXG4gIHN5bnRheD86IGJvb2xlYW4gfCB7IGhpZ2hsaWdodDogYW55IH1cbiAgdG9vbGJhcj86IFF1aWxsVG9vbGJhckNvbmZpZyB8IHN0cmluZyB8IHtcbiAgICBjb250YWluZXI/OiBzdHJpbmcgfCBzdHJpbmdbXSB8IFF1aWxsVG9vbGJhckNvbmZpZ1xuICAgIGhhbmRsZXJzPzoge1xuICAgICAgW2tleTogc3RyaW5nXTogYW55XG4gICAgfVxuICB9IHwgYm9vbGVhblxufVxuXG5leHBvcnQgdHlwZSBRdWlsbEZvcm1hdCA9ICdvYmplY3QnIHwgJ2pzb24nIHwgJ2h0bWwnIHwgJ3RleHQnXG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVpbGxDb25maWcge1xuICBib3VuZHM/OiBIVE1MRWxlbWVudCB8IHN0cmluZ1xuICBjdXN0b21Nb2R1bGVzPzogQ3VzdG9tTW9kdWxlW11cbiAgY3VzdG9tT3B0aW9ucz86IEN1c3RvbU9wdGlvbltdXG4gIHN1cHByZXNzR2xvYmFsUmVnaXN0ZXJXYXJuaW5nPzogYm9vbGVhblxuICBkZWJ1Zz86ICdlcnJvcicgfCAnd2FybicgfCAnbG9nJyB8IGZhbHNlXG4gIGZvcm1hdD86IFF1aWxsRm9ybWF0XG4gIGZvcm1hdHM/OiBzdHJpbmdbXVxuICBtb2R1bGVzPzogUXVpbGxNb2R1bGVzXG4gIHBsYWNlaG9sZGVyPzogc3RyaW5nXG4gIHJlYWRPbmx5PzogYm9vbGVhblxuICBzY3JvbGxpbmdDb250YWluZXI/OiBIVE1MRWxlbWVudCB8IHN0cmluZyB8IG51bGxcbiAgdGhlbWU/OiBzdHJpbmdcbiAgc3RyaWN0PzogYm9vbGVhblxuICAvLyBDdXN0b20gQ29uZmlnIHRvIHRyYWNrIGFsbCBjaGFuZ2VzIG9yIG9ubHkgY2hhbmdlcyBieSAndXNlcidcbiAgdHJhY2tDaGFuZ2VzPzogJ3VzZXInIHwgJ2FsbCdcbiAgLy8gcHJvdmlkZSBkZWZhdWx0IGVtcHR5IHZhbHVlXG4gIGRlZmF1bHRFbXB0eVZhbHVlPzogYW55XG4gIHNhbml0aXplPzogYm9vbGVhblxuICAvLyBBIGZ1bmN0aW9uLCB3aGljaCBpcyBleGVjdXRlZCBiZWZvcmUgdGhlIFF1aWxsIGVkaXRvciBpcyByZW5kZXJlZCwgdGhpcyBtaWdodCBiZSB1c2VmdWxcbiAgLy8gZm9yIGxhenktbG9hZGluZyBDU1MuXG4gIGJlZm9yZVJlbmRlcj86ICgpID0+IFByb21pc2U8dm9pZD5cbn1cblxuZXhwb3J0IGNvbnN0IFFVSUxMX0NPTkZJR19UT0tFTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxRdWlsbENvbmZpZz4oJ2NvbmZpZycsIHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICBmYWN0b3J5OiAoKSA9PiAoeyBtb2R1bGVzOiBkZWZhdWx0TW9kdWxlcyB9KVxufSlcbiJdfQ==