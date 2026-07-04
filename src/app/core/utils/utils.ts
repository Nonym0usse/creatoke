
//
// Utils

export class Utils {

    public static doc = document.documentElement;

    /**
     * CSS variable value
     * @param name
     * @returns {string}
     */
    public static getCSSVarValue(name: string): string {
        let hex = getComputedStyle(this.doc).getPropertyValue('--bs-' + name);
        if (hex && hex.length > 0) {
            hex = hex.trim();
        }

        return hex;
    }

    /**
     * Add class on element
     * @param el
     * @param className
     */
    public static addClass(el: any, className: any): void {
        if (!this.hasClass(el, className) ) {
            el.className += (el.className ? ' ' : '') + className;
        }
    }

    /**
     * Check element has class
     * @param el
     * @param className
     * @returns {boolean}
     */
    public static hasClass(el: any, className: any): boolean {
        return el.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
    }

    /**
     * Remove class from element
     * @param el
     * @param className
     */
    public static removeClass(el: any, className: any): void {
        const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

}
