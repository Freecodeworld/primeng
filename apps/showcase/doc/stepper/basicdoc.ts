import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'basic-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>Stepper consists of a combination of <i>StepList</i>, <i>Step</i>, <i>StepPanels</i> and <i>StepPanel</i> components. The <i>value</i> property is essential for associating Step and StepPanel with each other.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-stepper [value]="1" class="basis-[50rem]">
                <p-step-list>
                    <p-step [value]="1">Header I</p-step>
                    <p-step [value]="2">Header II</p-step>
                    <p-step [value]="3">Header II</p-step>
                </p-step-list>
                <p-step-panels>
                    <p-step-panel [value]="1">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content I</div>
                            </div>
                            <div class="flex pt-6 justify-end">
                                <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(2)" />
                            </div>
                        </ng-template>
                    </p-step-panel>

                    <p-step-panel [value]="2">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content II</div>
                            </div>
                            <div class="flex pt-6 justify-between">
                                <p-button label="Back" severity="secondary" icon="pi pi-arrow-left" (onClick)="activateCallback(1)" />
                                <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(3)" />
                            </div>
                        </ng-template>
                    </p-step-panel>

                    <p-step-panel [value]="3">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                            </div>
                            <div class="flex pt-6 justify-start">
                                <p-button label="Back" icon="pi pi-arrow-left" iconPos="right" (onClick)="activateCallback(2)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                </p-step-panels>
            </p-stepper>
        </div>
        <app-code [code]="code" selector="stepper-basic-demo"></app-code>
    `
})
export class BasicDoc {
    code: Code = {
        basic: `<p-stepper [value]="1" class="basis-[50rem]">
    <p-step-list>
        <p-step [value]="1">Header I</p-step>
        <p-step [value]="2">Header II</p-step>
        <p-step [value]="3">Header II</p-step>
    </p-step-list>
    <p-step-panels>
        <p-step-panel [value]="1">
            <ng-template #content let-activateCallback="activateCallback">
                <div class="flex flex-col h-48">
                    <div
                        class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                    >
                        Content I
                    </div>
                </div>
                <div class="flex pt-6 justify-end">
                    <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(2)" />
                </div>
            </ng-template>
        </p-step-panel>

        <p-step-panel [value]="2">
            <ng-template #content let-activateCallback="activateCallback">
                <div class="flex flex-col h-48">
                    <div
                        class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                    >
                        Content II
                    </div>
                </div>
                <div class="flex pt-6 justify-between">
                    <p-button label="Back" severity="secondary" icon="pi pi-arrow-left" (onClick)="activateCallback(1)" />
                    <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(3)" />
                </div>
            </ng-template>
        </p-step-panel>

        <p-step-panel [value]="3">
            <ng-template #content let-activateCallback="activateCallback">
                <div class="flex flex-col h-48">
                    <div
                        class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                    >
                        Content III
                    </div>
                </div>
                <div class="flex pt-6 justify-start">
                    <p-button label="Back" icon="pi pi-arrow-left" iconPos="right" (onClick)="activateCallback(2)" />
                </div>
            </ng-template>
        </p-step-panel>
    </p-step-panels>
</p-stepper>`,

        html: `<div class="card flex justify-center">
    <p-stepper [value]="1" class="basis-[50rem]">
        <p-step-list>
            <p-step [value]="1">Header I</p-step>
            <p-step [value]="2">Header II</p-step>
            <p-step [value]="3">Header II</p-step>
        </p-step-list>
        <p-step-panels>
            <p-step-panel [value]="1">
                <ng-template #content let-activateCallback="activateCallback">
                    <div class="flex flex-col h-48">
                        <div
                            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                        >
                            Content I
                        </div>
                    </div>
                    <div class="flex pt-6 justify-end">
                        <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(2)" />
                    </div>
                </ng-template>
            </p-step-panel>

            <p-step-panel [value]="2">
                <ng-template #content let-activateCallback="activateCallback">
                    <div class="flex flex-col h-48">
                        <div
                            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                        >
                            Content II
                        </div>
                    </div>
                    <div class="flex pt-6 justify-between">
                        <p-button label="Back" severity="secondary" icon="pi pi-arrow-left" (onClick)="activateCallback(1)" />
                        <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(3)" />
                    </div>
                </ng-template>
            </p-step-panel>

            <p-step-panel [value]="3">
                <ng-template #content let-activateCallback="activateCallback">
                    <div class="flex flex-col h-48">
                        <div
                            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                        >
                            Content III
                        </div>
                    </div>
                    <div class="flex pt-6 justify-start">
                        <p-button label="Back" icon="pi pi-arrow-left" iconPos="right" (onClick)="activateCallback(2)" />
                    </div>
                </ng-template>
            </p-step-panel>
        </p-step-panels>
    </p-stepper>
</div>`,

        typescript: `import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

@Component({
    selector: 'stepper-basic-demo',
    templateUrl: './stepper-basic-demo.html',
    standalone: true,
    imports: [ButtonModule, StepperModule]
})
export class StepperBasicDemo {
}`
    };
}
