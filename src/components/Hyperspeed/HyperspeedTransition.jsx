import "./HyperspeedTransition.css";
import { useEffect, useMemo, useState } from "react";
import Hyperspeed from "./Hyperspeed";

export default function HyperspeedTransition({
    active,
    onComplete
}) {

    const [visible, setVisible] = useState(false);

    const effectOptions = useMemo(() => ({

        distortion: "turbulentDistortion",

        length: 700,

        roadWidth: 10,

        islandWidth: 2,

        lanesPerRoad: 4,

        fov: 90,

        fovSpeedUp: 90,

        speedUp: 1.2,

        carLightsFade: 0.4,

        totalSideLightSticks: 20,

        lightPairsPerRoadWay: 40,

        shoulderLinesWidthPercentage: 0.05,

        brokenLinesWidthPercentage: 0.1,

        brokenLinesLengthPercentage: 0.5,

        lightStickWidth: [
            0.12,
            0.5
        ],

        lightStickHeight: [
            1.3,
            1.7
        ],

        movingAwaySpeed: [
            60,
            80
        ],

        movingCloserSpeed: [
            -120,
            -160
        ],

        carLightsLength: [
            20,
            100
        ],

        carLightsRadius: [
            0.05,
            0.14
        ],

        carWidthPercentage: [
            0.3,
            0.5
        ],

        carShiftX: [
            -0.8,
            0.8
        ],

        carFloorSeparation: [
            0,
            5
        ],

        colors: {

            roadColor: 0x000000,

            islandColor: 0x000000,

            background: 0x000000,

            shoulderLines: 0xffffff,

            brokenLines: 0xffffff,

            leftCars: [
                0x00d4ff,
                0x66e2ff,
                0xb8f6ff
            ],

            rightCars: [
                0x0077ff,
                0x4da6ff,
                0xffffff
            ],

            sticks: 0x66e2ff

        }

    }), []);

    useEffect(() => {

        if (!active) return;

        setVisible(true);

        const timer = setTimeout(() => {

            onComplete?.();

        }, 4200);

        return () => clearTimeout(timer);

    }, [active, onComplete]);

    if (!visible) {
        return null;
    }

    return (

        <div
            className={`hyperspeedTransition ${
                active ? "isActive" : "isLeaving"
            }`}
        >

            <Hyperspeed
                effectOptions={effectOptions}
            />

        </div>

    );

}