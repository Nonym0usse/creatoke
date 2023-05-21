
import * as moment from 'moment';


//
// Utils

export class Utils {
    
    public static doc = document.documentElement;

    /**
     * Check for string value
     * @param str 
     * @returns 
     */
    public static isString(str: any): boolean {
        return (typeof str === 'string' || new String(str)) ? true : false;
    }

    /**
     * Convert string into number
     * @param str 
     * @returns {number}
     */
    public static getInt(str: any): number {
        return this.isString(str) ? parseInt(str) : str;
    }

    /**
     * Convert string into float number
     * @param str 
     * @returns {number}
     */
    public static getFloat(str: any): number {
        return this.isString(str) ? parseFloat(str) : str;
    }

    /**
     * Formate remote date into local date
     * @param str 
     * @returns {string}
     */
    public static localDate(str: string): string {
        return str ? moment(str, 'MM/DD/YYYY').format('ll') : str;
    }

    /**
     * Remove HTML tags from string
     * @param str 
     * @returns {string}
     */
    public static removeHtml(str: string): string {
        return str.replace(/<\/?[^>]+(>|$)/g, '');
    }
    
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