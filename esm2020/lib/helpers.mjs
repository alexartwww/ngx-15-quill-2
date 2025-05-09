import { Observable } from 'rxjs';
export const getFormat = (format, configFormat) => {
    const passedFormat = format || configFormat;
    return passedFormat || 'html';
};
export const raf$ = () => {
    return new Observable(subscriber => {
        const rafId = requestAnimationFrame(() => {
            subscriber.next();
            subscriber.complete();
        });
        return () => cancelAnimationFrame(rafId);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC0xNS1xdWlsbC0yL3NyYy9saWIvaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBRWpDLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQW9CLEVBQUUsWUFBMEIsRUFBZSxFQUFFO0lBQ3pGLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxZQUFZLENBQUE7SUFDM0MsT0FBTyxZQUFZLElBQUksTUFBTSxDQUFBO0FBQy9CLENBQUMsQ0FBQTtBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7SUFDdkIsT0FBTyxJQUFJLFVBQVUsQ0FBTyxVQUFVLENBQUMsRUFBRTtRQUN2QyxNQUFNLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7WUFDdkMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ2pCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUN2QixDQUFDLENBQUMsQ0FBQTtRQUVGLE9BQU8sR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDMUMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBRdWlsbEZvcm1hdCB9IGZyb20gJ25neC0xNS1xdWlsbC0yL2NvbmZpZydcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJ1xuXG5leHBvcnQgY29uc3QgZ2V0Rm9ybWF0ID0gKGZvcm1hdD86IFF1aWxsRm9ybWF0LCBjb25maWdGb3JtYXQ/OiBRdWlsbEZvcm1hdCk6IFF1aWxsRm9ybWF0ID0+IHtcbiAgY29uc3QgcGFzc2VkRm9ybWF0ID0gZm9ybWF0IHx8IGNvbmZpZ0Zvcm1hdFxuICByZXR1cm4gcGFzc2VkRm9ybWF0IHx8ICdodG1sJ1xufVxuXG5leHBvcnQgY29uc3QgcmFmJCA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPHZvaWQ+KHN1YnNjcmliZXIgPT4ge1xuICAgIGNvbnN0IHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHN1YnNjcmliZXIubmV4dCgpXG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKClcbiAgICB9KVxuXG4gICAgcmV0dXJuICgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKVxuICB9KVxufVxuIl19