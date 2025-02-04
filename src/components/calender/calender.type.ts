import { PropsBase, PropsSingleRequired } from 'react-day-picker';

// Need to update the type if we are using the MultiDayPicker or RangePicker.
// There is issue in react-day-picker types, so I manually added the single day picker types.
export type ICalendarProps = PropsBase &
    PropsSingleRequired & {
        /**
         * In the year view, the number of years to display at once.
         * @default 12
         */
        yearRange?: number;

        /**
         * Wether to show the year switcher in the caption.
         * @default true
         */
        showYearSwitcher?: boolean;

        monthsClassName?: string;
        monthCaptionClassName?: string;
        weekdaysClassName?: string;
        weekdayClassName?: string;
        monthClassName?: string;
        captionClassName?: string;
        captionLabelClassName?: string;
        buttonNextClassName?: string;
        buttonPreviousClassName?: string;
        navClassName?: string;
        monthGridClassName?: string;
        weekClassName?: string;
        dayClassName?: string;
        dayButtonClassName?: string;
        rangeStartClassName?: string;
        rangeEndClassName?: string;
        selectedClassName?: string;
        todayClassName?: string;
        outsideClassName?: string;
        disabledClassName?: string;
        rangeMiddleClassName?: string;
        hiddenClassName?: string;
    };
