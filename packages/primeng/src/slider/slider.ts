import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, HostListener, inject, input, Input, NgModule, NgZone, numberAttribute, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { addClass, getWindowScrollLeft, getWindowScrollTop, isRTL, removeClass } from '@primeuix/utils';
import { SharedModule } from 'primeng/api';
import { AutoFocus } from 'primeng/autofocus';
import { Nullable, VoidListener } from 'primeng/ts-helpers';
import { SliderChangeEvent, SliderSlideEndEvent } from './slider.interface';
import { SliderStyle } from './style/sliderstyle';
import { BaseEditableHolder } from 'primeng/baseeditableholder';

export const SLIDER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Slider),
    multi: true
};
/**
 * Slider is a component to provide input with a drag handle.
 * @group Components
 */
@Component({
    selector: 'p-slider',
    standalone: true,
    imports: [CommonModule, AutoFocus, SharedModule],
    template: `
        <span
            *ngIf="range && orientation == 'horizontal'"
            [class]="cx('range')"
            [ngStyle]="{
                position: 'absolute',
                'inset-inline-start': offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%',
                width: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%'
            }"
            [attr.data-pc-section]="'range'"
        ></span>
        <span
            *ngIf="range && orientation == 'vertical'"
            [class]="cx('range')"
            [ngStyle]="{
                position: 'absolute',
                bottom: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%',
                height: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%'
            }"
            [attr.data-pc-section]="'range'"
        ></span>
        <span *ngIf="!range && orientation == 'vertical'" [class]="cx('range')" [attr.data-pc-section]="'range'" [ngStyle]="{ position: 'absolute', height: handleValue + '%' }"></span>
        <span *ngIf="!range && orientation == 'horizontal'" [class]="cx('range')" [attr.data-pc-section]="'range'" [ngStyle]="{ position: 'absolute', width: handleValue + '%' }"></span>
        <span
            *ngIf="!range"
            #sliderHandle
            [class]="cx('handle')"
            [style.transition]="dragging ? 'none' : null"
            [ngStyle]="{
                position: 'absolute',
                'inset-inline-start': orientation == 'horizontal' ? handleValue + '%' : null,
                bottom: orientation == 'vertical' ? handleValue + '%' : null
            }"
            (touchstart)="onDragStart($event)"
            (touchmove)="onDrag($event)"
            (touchend)="onDragEnd($event)"
            (mousedown)="onMouseDown($event)"
            (keydown)="onKeyDown($event)"
            [attr.tabindex]="disabled() ? null : tabindex"
            role="slider"
            [attr.aria-valuemin]="min"
            [attr.aria-valuenow]="value"
            [attr.aria-valuemax]="max"
            [attr.aria-labelledby]="ariaLabelledBy"
            [attr.aria-label]="ariaLabel"
            [attr.aria-orientation]="orientation"
            [attr.data-pc-section]="'handle'"
            [pAutoFocus]="autofocus"
        ></span>
        <span
            *ngIf="range"
            #sliderHandleStart
            [style.transition]="dragging ? 'none' : null"
            [class]="cn(cx('handle'), handleIndex == 0 && 'p-slider-handle-active')"
            [ngStyle]="{ position: 'absolute', 'inset-inline-start': rangeStartLeft, bottom: rangeStartBottom }"
            (keydown)="onKeyDown($event, 0)"
            (mousedown)="onMouseDown($event, 0)"
            (touchstart)="onDragStart($event, 0)"
            (touchmove)="onDrag($event)"
            (touchend)="onDragEnd($event)"
            [attr.tabindex]="disabled() ? null : tabindex"
            role="slider"
            [attr.aria-valuemin]="min"
            [attr.aria-valuenow]="value ? value[0] : null"
            [attr.aria-valuemax]="max"
            [attr.aria-labelledby]="ariaLabelledBy"
            [attr.aria-label]="ariaLabel"
            [attr.aria-orientation]="orientation"
            [attr.data-pc-section]="'startHandler'"
            [pAutoFocus]="autofocus"
        ></span>
        <span
            *ngIf="range"
            #sliderHandleEnd
            [style.transition]="dragging ? 'none' : null"
            [class]="cn(cx('handle'), handleIndex == 1 && 'p-slider-handle-active')"
            [ngStyle]="{ position: 'absolute', 'inset-inline-start': rangeEndLeft, bottom: rangeEndBottom }"
            (keydown)="onKeyDown($event, 1)"
            (mousedown)="onMouseDown($event, 1)"
            (touchstart)="onDragStart($event, 1)"
            (touchmove)="onDrag($event)"
            (touchend)="onDragEnd($event)"
            [attr.tabindex]="disabled() ? null : tabindex"
            role="slider"
            [attr.aria-valuemin]="min"
            [attr.aria-valuenow]="value ? value[1] : null"
            [attr.aria-valuemax]="max"
            [attr.aria-labelledby]="ariaLabelledBy"
            [attr.aria-label]="ariaLabel"
            [attr.aria-orientation]="orientation"
            [attr.data-pc-section]="'endHandler'"
        ></span>
    `,
    providers: [SLIDER_VALUE_ACCESSOR, SliderStyle],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.data-pc-name]': "'slider'",
        '[attr.data-pc-section]': "'root'",
        '[class]': "cn(cx('root'), styleClass)"
    }
})
export class Slider extends BaseEditableHolder implements OnDestroy, ControlValueAccessor {
    /**
     * When enabled, displays an animation on click of the slider bar.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) animate: boolean | undefined;
    /**
     * Mininum boundary value.
     * @group Props
     */
    @Input({ transform: numberAttribute }) min: number = 0;
    /**
     * Maximum boundary value.
     * @group Props
     */
    @Input({ transform: numberAttribute }) max: number = 100;
    /**
     * Orientation of the slider.
     * @group Props
     */
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
    /**
     * Step factor to increment/decrement the value.
     * @group Props
     */
    @Input({ transform: numberAttribute }) step: number | undefined;
    /**
     * When specified, allows two boundary values to be picked.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) range: boolean | undefined;
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    @Input() ariaLabel: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    @Input() ariaLabelledBy: string | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    @Input({ transform: numberAttribute }) tabindex: number = 0;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) autofocus: boolean | undefined;
    /**
     * Callback to invoke on value change.
     * @param {SliderChangeEvent} event - Custom value change event.
     * @group Emits
     */
    @Output() onChange: EventEmitter<SliderChangeEvent> = new EventEmitter<SliderChangeEvent>();
    /**
     * Callback to invoke when slide ended.
     * @param {SliderSlideEndEvent} event - Custom slide end event.
     * @group Emits
     */
    @Output() onSlideEnd: EventEmitter<SliderSlideEndEvent> = new EventEmitter<SliderSlideEndEvent>();

    @ViewChild('sliderHandle') sliderHandle: Nullable<ElementRef>;

    @ViewChild('sliderHandleStart') sliderHandleStart: Nullable<ElementRef>;

    @ViewChild('sliderHandleEnd') sliderHandleEnd: Nullable<ElementRef>;

    _componentStyle = inject(SliderStyle);

    public value: Nullable<number>;

    public values: Nullable<number[]>;

    public handleValue: Nullable<number>;

    public handleValues: number[] = [];

    diff: Nullable<number>;

    offset: Nullable<number>;

    bottom: Nullable<number>;

    public onModelChange: Function = () => {};

    public onModelTouched: Function = () => {};

    public dragging: Nullable<boolean>;

    public dragListener: VoidListener;

    public mouseupListener: VoidListener;

    public initX: Nullable<number>;

    public initY: Nullable<number>;

    public barWidth: Nullable<number>;

    public barHeight: Nullable<number>;

    public sliderHandleClick: Nullable<boolean>;

    public handleIndex: number = 0;

    public startHandleValue: any;

    public startx: Nullable<number>;

    public starty: Nullable<number>;

    private ngZone = inject(NgZone);

    @HostListener('click', ['$event'])
    onHostClick(event: MouseEvent) {
        this.onBarClick(event);
    }

    onMouseDown(event: Event, index?: number) {
        if (this.disabled()) {
            return;
        }

        this.dragging = true;
        this.updateDomData();
        this.sliderHandleClick = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        } else {
            (this.handleIndex as any) = index;
        }

        this.bindDragListeners();
        (event.target as HTMLInputElement).focus();
        event.preventDefault();

        if (this.animate) {
            removeClass(this.el.nativeElement, 'p-slider-animate');
        }
    }

    onDragStart(event: TouchEvent, index?: number) {
        if (this.disabled()) {
            return;
        }

        var touchobj = event.changedTouches[0];
        this.startHandleValue = this.range ? this.handleValues[index as number] : this.handleValue;
        this.dragging = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        } else {
            this.handleIndex = index as number;
        }

        if (this.orientation === 'horizontal') {
            this.startx = parseInt((touchobj as any).clientX, 10);
            this.barWidth = this.el.nativeElement.offsetWidth;
        } else {
            this.starty = parseInt((touchobj as any).clientY, 10);
            this.barHeight = this.el.nativeElement.offsetHeight;
        }

        if (this.animate) {
            removeClass(this.el.nativeElement, 'p-slider-animate');
        }

        event.preventDefault();
    }

    onDrag(event: TouchEvent) {
        if (this.disabled()) {
            return;
        }

        var touchobj = event.changedTouches[0],
            handleValue = 0;

        if (this.orientation === 'horizontal') {
            handleValue = Math.floor(((parseInt((touchobj as any).clientX, 10) - (this.startx as number)) * 100) / (this.barWidth as number)) + this.startHandleValue;
        } else {
            handleValue = Math.floor((((this.starty as number) - parseInt((touchobj as any).clientY, 10)) * 100) / (this.barHeight as number)) + this.startHandleValue;
        }

        this.setValueFromHandle(event, handleValue);

        event.preventDefault();
    }

    onDragEnd(event: TouchEvent) {
        if (this.disabled()) {
            return;
        }

        this.dragging = false;

        if (this.range) this.onSlideEnd.emit({ originalEvent: event, values: this.values as number[] });
        else this.onSlideEnd.emit({ originalEvent: event, value: this.value as number });

        if (this.animate) {
            addClass(this.el.nativeElement, 'p-slider-animate');
        }

        event.preventDefault();
    }

    onBarClick(event: Event) {
        if (this.disabled()) {
            return;
        }

        if (!this.sliderHandleClick) {
            this.updateDomData();
            this.handleChange(event);

            if (this.range) this.onSlideEnd.emit({ originalEvent: event, values: this.values as number[] });
            else this.onSlideEnd.emit({ originalEvent: event, value: this.value as number });
        }

        this.sliderHandleClick = false;
    }

    onKeyDown(event: any, index?) {
        this.handleIndex = index;

        switch (event.code) {
            case 'ArrowDown':
            case 'ArrowLeft':
                this.decrementValue(event, index);
                event.preventDefault();
                break;

            case 'ArrowUp':
            case 'ArrowRight':
                this.incrementValue(event, index);
                event.preventDefault();
                break;

            case 'PageDown':
                this.decrementValue(event, index, true);
                event.preventDefault();
                break;

            case 'PageUp':
                this.incrementValue(event, index, true);
                event.preventDefault();
                break;

            case 'Home':
                this.updateValue(this.min, event);
                event.preventDefault();
                break;

            case 'End':
                this.updateValue(this.max, event);
                event.preventDefault();
                break;

            default:
                break;
        }
    }

    decrementValue(event, index, pageKey = false) {
        let newValue;

        if (this.range) {
            if (this.step) newValue = this.values[index] - this.step;
            else newValue = this.values[index] - 1;
        } else {
            if (this.step) newValue = this.value - this.step;
            else if (!this.step && pageKey) newValue = this.value - 10;
            else newValue = this.value - 1;
        }

        this.updateValue(newValue, event);
        event.preventDefault();
    }

    incrementValue(event, index, pageKey = false) {
        let newValue;

        if (this.range) {
            if (this.step) newValue = this.values[index] + this.step;
            else newValue = this.values[index] + 1;
        } else {
            if (this.step) newValue = this.value + this.step;
            else if (!this.step && pageKey) newValue = this.value + 10;
            else newValue = this.value + 1;
        }

        this.updateValue(newValue, event);
        event.preventDefault();
    }

    handleChange(event: Event) {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
    }

    bindDragListeners() {
        if (isPlatformBrowser(this.platformId)) {
            this.ngZone.runOutsideAngular(() => {
                const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

                if (!this.dragListener) {
                    this.dragListener = this.renderer.listen(documentTarget, 'mousemove', (event) => {
                        if (this.dragging) {
                            this.ngZone.run(() => {
                                this.handleChange(event);
                            });
                        }
                    });
                }

                if (!this.mouseupListener) {
                    this.mouseupListener = this.renderer.listen(documentTarget, 'mouseup', (event) => {
                        if (this.dragging) {
                            this.dragging = false;
                            this.ngZone.run(() => {
                                if (this.range) this.onSlideEnd.emit({ originalEvent: event, values: this.values as number[] });
                                else this.onSlideEnd.emit({ originalEvent: event, value: this.value as number });

                                if (this.animate) {
                                    addClass(this.el.nativeElement, 'p-slider-animate');
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    unbindDragListeners() {
        if (this.dragListener) {
            this.dragListener();
            this.dragListener = null;
        }

        if (this.mouseupListener) {
            this.mouseupListener();
            this.mouseupListener = null;
        }
    }

    setValueFromHandle(event: Event, handleValue: any) {
        let newValue = this.getValueFromHandle(handleValue);

        if (this.range) {
            if (this.step) {
                this.handleStepChange(newValue, (this.values as any)[this.handleIndex]);
            } else {
                this.handleValues[this.handleIndex] = handleValue;
                this.updateValue(newValue, event);
            }
        } else {
            if (this.step) {
                this.handleStepChange(newValue, this.value as any);
            } else {
                this.handleValue = handleValue;
                this.updateValue(newValue, event);
            }
        }

        this.cd.markForCheck();
    }

    handleStepChange(newValue: number, oldValue: number) {
        let diff = newValue - oldValue;
        let val = oldValue;
        let _step = this.step as number;

        if (diff < 0) {
            val = oldValue + Math.ceil(newValue / _step - oldValue / _step) * _step;
        } else if (diff > 0) {
            val = oldValue + Math.floor(newValue / _step - oldValue / _step) * _step;
        }

        this.updateValue(val);
        this.updateHandleValue();
    }

    writeValue(value: any): void {
        if (this.range) this.values = value || [0, 0];
        else this.value = value || 0;

        this.updateHandleValue();
        this.updateDiffAndOffset();
        this.cd.markForCheck();
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    get rangeStartLeft() {
        if (!this.isVertical()) return this.handleValues[0] > 100 ? 100 + '%' : this.handleValues[0] + '%';
        return null;
    }

    get rangeStartBottom() {
        return this.isVertical() ? this.handleValues[0] + '%' : 'auto';
    }

    get rangeEndLeft() {
        return this.isVertical() ? null : this.handleValues[1] + '%';
    }

    get rangeEndBottom() {
        return this.isVertical() ? this.handleValues[1] + '%' : 'auto';
    }

    isVertical(): boolean {
        return this.orientation === 'vertical';
    }

    updateDomData(): void {
        let rect = this.el.nativeElement.getBoundingClientRect();
        this.initX = rect.left + getWindowScrollLeft();
        this.initY = rect.top + getWindowScrollTop();
        this.barWidth = this.el.nativeElement.offsetWidth;
        this.barHeight = this.el.nativeElement.offsetHeight;
    }

    calculateHandleValue(event: Event): number {
        if (this.orientation === 'horizontal') {
            if (isRTL(this.el.nativeElement)) {
                return (((this.initX as number) + (this.barWidth as number) - (event as MouseEvent).pageX) * 100) / (this.barWidth as number);
            } else {
                return (((event as MouseEvent).pageX - (this.initX as number)) * 100) / (this.barWidth as number);
            }
        } else {
            return (((this.initY as number) + (this.barHeight as number) - (event as MouseEvent).pageY) * 100) / (this.barHeight as number);
        }
    }

    updateHandleValue(): void {
        if (this.range) {
            this.handleValues[0] = (((this.values as number[])[0] < this.min ? 0 : (this.values as number[])[0] - this.min) * 100) / (this.max - this.min);
            this.handleValues[1] = (((this.values as number[])[1] > this.max ? 100 : (this.values as number[])[1] - this.min) * 100) / (this.max - this.min);
        } else {
            if ((this.value as number) < this.min) this.handleValue = 0;
            else if ((this.value as number) > this.max) this.handleValue = 100;
            else this.handleValue = (((this.value as number) - this.min) * 100) / (this.max - this.min);
        }

        if (this.step) {
            this.updateDiffAndOffset();
        }
    }

    updateDiffAndOffset(): void {
        this.diff = this.getDiff();
        this.offset = this.getOffset();
    }

    getDiff(): number {
        return Math.abs(this.handleValues[0] - this.handleValues[1]);
    }

    getOffset(): number {
        return Math.min(this.handleValues[0], this.handleValues[1]);
    }

    updateValue(val: number, event?: Event): void {
        if (this.range) {
            let value = val;

            if (this.handleIndex == 0) {
                if (value < this.min) {
                    value = this.min;
                    this.handleValues[0] = 0;
                } else if (value > (this.values as number[])[1]) {
                    if (value > this.max) {
                        value = this.max;
                        this.handleValues[0] = 100;
                    }
                }
                this.sliderHandleStart?.nativeElement.focus();
            } else {
                if (value > this.max) {
                    value = this.max;
                    this.handleValues[1] = 100;
                    this.offset = this.handleValues[1];
                } else if (value < this.min) {
                    value = this.min;
                    this.handleValues[1] = 0;
                } else if (value < (this.values as number[])[0]) {
                    this.offset = this.handleValues[1];
                }
                this.sliderHandleEnd?.nativeElement.focus();
            }

            if (this.step) {
                this.updateHandleValue();
            } else {
                this.updateDiffAndOffset();
            }

            (this.values as number[])[this.handleIndex] = this.getNormalizedValue(value);
            let newValues = [this.minVal, this.maxVal];
            this.onModelChange(newValues);
            this.onChange.emit({ event: event as Event, values: this.values as number[] });
        } else {
            if (val < this.min) {
                val = this.min;
                this.handleValue = 0;
            } else if (val > this.max) {
                val = this.max;
                this.handleValue = 100;
            }

            this.value = this.getNormalizedValue(val);

            this.onModelChange(this.value);
            this.onChange.emit({ event: event as Event, value: this.value });
            this.sliderHandle?.nativeElement.focus();
        }
        this.updateHandleValue();
    }

    getValueFromHandle(handleValue: number): number {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    }

    getDecimalsCount(value: number): number {
        if (value && Math.floor(value) !== value) return value.toString().split('.')[1].length || 0;
        return 0;
    }

    getNormalizedValue(val: number): number {
        let decimalsCount = this.getDecimalsCount(this.step as number);
        if (decimalsCount > 0) {
            return +parseFloat(val.toString()).toFixed(decimalsCount);
        } else {
            return Math.floor(val);
        }
    }

    ngOnDestroy() {
        this.unbindDragListeners();
        super.ngOnDestroy();
    }

    get minVal() {
        return Math.min((this.values as number[])[1], (this.values as number[])[0]);
    }
    get maxVal() {
        return Math.max((this.values as number[])[1], (this.values as number[])[0]);
    }
}

@NgModule({
    imports: [Slider, SharedModule],
    exports: [Slider, SharedModule]
})
export class SliderModule {}
