import {trigger, transition, style, animate, query, stagger} from '@angular/animations';

export const fadeInAnimation = [
    trigger('fadeInAnimation', [
      transition(':enter', [ // each time the binding value changes
        query(':enter', [
          style({
            opacity: 0
          }),
          stagger(75, [
            animate('750ms', style({
              opacity: 1
            }))
          ])
        ], {optional: true})
      ])
    ])
  ];