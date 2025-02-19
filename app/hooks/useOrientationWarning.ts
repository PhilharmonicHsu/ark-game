import { useState, useEffect } from "react";

export default function useOrientationWarning() {
    const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
    const [showWarning, setShowWarning] = useState(isPortrait);

    useEffect(() => {
        const handleResize = () => {
            const portrait = window.matchMedia("(orientation: portrait)").matches;
            setIsPortrait(portrait);

            if (portrait) {
                setShowWarning(true);
            }
        };

        window.addEventListener("resize", handleResize);
        
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { showWarning, setShowWarning };
}
