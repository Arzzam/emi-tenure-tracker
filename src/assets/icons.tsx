import { cn } from '@/lib/utils';

export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
    google: (props: IconProps) => (
        <svg role="img" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
        </svg>
    ),
    spinner: (props: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    ),
    home: (props: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-home "
            {...props}
        >
            <path d="M9.43414 20.803V13.0557C9.43414 12.5034 9.88186 12.0557 10.4341 12.0557H14.7679C15.3202 12.0557 15.7679 12.5034 15.7679 13.0557V20.803M12.0181 3.48798L5.53031 7.9984C5.26145 8.18532 5.10114 8.49202 5.10114 8.81948L5.10117 18.803C5.10117 19.9075 5.9966 20.803 7.10117 20.803H18.1012C19.2057 20.803 20.1012 19.9075 20.1012 18.803L20.1011 8.88554C20.1011 8.55988 19.9426 8.25462 19.6761 8.06737L13.1639 3.49088C12.8204 3.24951 12.3627 3.24836 12.0181 3.48798Z"></path>
        </svg>
    ),
    logout: (props: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            fill="currentColor"
            className="text-white"
            {...props}
        >
            <path d="M12.625 13.667q-.25-.25-.25-.615 0-.364.25-.614l1.563-1.563H8.396q-.354 0-.615-.26-.26-.261-.26-.615t.26-.615q.261-.26.615-.26h5.729l-1.521-1.542q-.229-.25-.229-.604t.25-.604q.25-.25.615-.25.364 0 .614.25l3.021 3.021q.146.146.208.302.063.156.063.323t-.063.323q-.062.156-.208.302l-3.042 3.042q-.25.25-.593.25-.344 0-.615-.271ZM4.25 17.5q-.729 0-1.24-.51-.51-.511-.51-1.24V4.25q0-.729.51-1.24.511-.51 1.24-.51h4.854q.354 0 .615.26.26.261.26.615t-.26.615q-.261.26-.615.26H4.25v11.5h4.854q.354 0 .615.26.26.261.26.615t-.26.615q-.261.26-.615.26Z"></path>
        </svg>
    ),
    loading: (props: IconProps) => (
        <div className={cn('font-medium flex space-x-1', props.className)}>
            <span>Loading</span>
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-200">.</span>
            <span className="animate-bounce delay-400">.</span>
        </div>
    ),
};
