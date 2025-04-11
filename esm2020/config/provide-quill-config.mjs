import { makeEnvironmentProviders } from '@angular/core';
import { QUILL_CONFIG_TOKEN } from './quill-editor.interfaces';
/**
 * Provides Quill configuration at the root level:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideQuillConfig(...)]
 * });
 * ```
 */
export const provideQuillConfig = (config) => makeEnvironmentProviders([{ provide: QUILL_CONFIG_TOKEN,
        useValue: config }]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZS1xdWlsbC1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtcXVpbGwvY29uZmlnL3NyYy9wcm92aWRlLXF1aWxsLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXdCLHdCQUF3QixFQUFFLE1BQU0sZUFBZSxDQUFBO0FBRTlFLE9BQU8sRUFBRSxrQkFBa0IsRUFBZSxNQUFNLDJCQUEyQixDQUFBO0FBRTNFOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE1BQW1CLEVBQXdCLEVBQUUsQ0FDOUUsd0JBQXdCLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxrQkFBa0I7UUFDekQsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudmlyb25tZW50UHJvdmlkZXJzLCBtYWtlRW52aXJvbm1lbnRQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5pbXBvcnQgeyBRVUlMTF9DT05GSUdfVE9LRU4sIFF1aWxsQ29uZmlnIH0gZnJvbSAnLi9xdWlsbC1lZGl0b3IuaW50ZXJmYWNlcydcblxuLyoqXG4gKiBQcm92aWRlcyBRdWlsbCBjb25maWd1cmF0aW9uIGF0IHRoZSByb290IGxldmVsOlxuICogYGBgdHNcbiAqIGJvb3RzdHJhcEFwcGxpY2F0aW9uKEFwcENvbXBvbmVudCwge1xuICogICBwcm92aWRlcnM6IFtwcm92aWRlUXVpbGxDb25maWcoLi4uKV1cbiAqIH0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBwcm92aWRlUXVpbGxDb25maWcgPSAoY29uZmlnOiBRdWlsbENvbmZpZyk6IEVudmlyb25tZW50UHJvdmlkZXJzID0+XG4gIG1ha2VFbnZpcm9ubWVudFByb3ZpZGVycyhbeyBwcm92aWRlOiBRVUlMTF9DT05GSUdfVE9LRU4sXG51c2VWYWx1ZTogY29uZmlnIH1dKVxuIl19