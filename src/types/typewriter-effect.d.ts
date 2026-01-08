declare module 'typewriter-effect' {
    export interface Options {
        strings?: string[];
        autoStart?: boolean;
        loop?: boolean;
        delay?: number | string;
        deleteSpeed?: number | string;
        pauseFor?: number;
        cursor?: string;
        wrapperClassName?: string;
        cursorClassName?: string;
    }

    export interface TypewriterComponentProps {
        onInit?: (typewriter: any) => void;
        options?: Options;
    }

    const Typewriter: React.FC<TypewriterComponentProps>;
    export default Typewriter;
}
