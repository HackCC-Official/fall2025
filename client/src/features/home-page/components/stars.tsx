"use client"
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
    type Container,
    type ISourceOptions,
} from "@tsparticles/engine";

import { loadSlim } from "@tsparticles/slim";

export function Stars() {
    const [init, setInit] = useState(false);

    useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadSlim(engine);
    }).then(() => {
        setInit(true);
    });
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {
        //console.log(container);
    };

    const options: ISourceOptions = useMemo(
        () => ({
        background: {
            color: {
            value: "transparent",
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
            },
        },
        particles: {
            color: {
            value: "#E8DDB5",
            },
            links: {
                color: "#E8DDB5",
                enable: true,
                opacity: 0.05,
                width: 1,
            },
            move: {
            direction: "none",
            enable: true,
            outModes: {
                default: "bounce",
            },
            random: true,
            speed: .3,
            straight: false,
            },
            number: {
                density: {
                    enable: true,
                    width: 1920,
                    height: 1080
                },
                value: 260,
            },
            opacity: {
                value: {
                    min: 0.1,
                    max: 1,
                },
                animation: {
                    enable: true,
                    speed: 1,
                    startValue: "random"
                },
            },
            shape: {
            type: "circle",
            },
            size: {
            value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
        }),
        [],
    );

    if (init) {
        return (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
        />
        );
    }

    return <></>;
    };