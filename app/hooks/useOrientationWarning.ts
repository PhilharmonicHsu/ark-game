import { useState, useEffect } from "react";

export default function useOrientationWarning() {
    const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
    const [showWarning, setShowWarning] = useState(isPortrait);

    useEffect(() => {
        const handleResize = () => {
            const portrait = window.matchMedia("(orientation: portrait)").matches;
            setIsPortrait(portrait);

            // 若使用者是直向，且警告已關閉過，則再次顯示
            if (portrait) {
                setShowWarning(true);
            }
        };

        // 監聽螢幕變化
        window.addEventListener("resize", handleResize);
        
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { showWarning, setShowWarning };
}
