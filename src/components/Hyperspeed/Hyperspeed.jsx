import "./Hyperspeed.css";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hyperspeed({
    effectOptions = {},
    onSpeedUp,
    onSlowDown
}) {

    const containerRef = useRef(null);

    useEffect(() => {

        const container = containerRef.current;

        if (!container) return;

        /* ==========================================
           OPTIONS
        ========================================== */

        const options = {

            length: 700,

            roadWidth: 10,

            lanesPerRoad: 4,

            speedUp: 1.2,

            colors: {

                background: 0x000000,

                roadColor: 0x000000,

                islandColor: 0x000000,

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

            },

            ...effectOptions

        };


        /* ==========================================
           SCENE
        ========================================== */

        const scene = new THREE.Scene();

        scene.background = new THREE.Color(
            options.colors.background
        );


        /* ==========================================
           CAMERA
        ========================================== */

        const camera = new THREE.PerspectiveCamera(

            options.fov || 90,

            container.clientWidth /
            container.clientHeight,

            0.1,

            3000

        );

        camera.position.set(
            0,
            2.2,
            8
        );


        /* ==========================================
           RENDERER
        ========================================== */

        const renderer =
            new THREE.WebGLRenderer({

                antialias:true,

                alpha:false,

                powerPreference:"high-performance"

            });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(

            container.clientWidth,

            container.clientHeight

        );

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        container.appendChild(renderer.domElement);


        /* ==========================================
           LIGHT
        ========================================== */

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                0.15
            );

        scene.add(ambient);


        /* ==========================================
           ROAD
        ========================================== */

        const roadGroup =
            new THREE.Group();

        scene.add(roadGroup);


        const roadGeometry =
            new THREE.PlaneGeometry(

                options.roadWidth,

                options.length,

                1,

                1

            );


        const roadMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    options.colors.roadColor,

                side:
                    THREE.DoubleSide

            });


        const road =
            new THREE.Mesh(

                roadGeometry,

                roadMaterial

            );

        road.rotation.x =
            -Math.PI / 2;

        road.position.y = 0;

        road.position.z =
            -options.length / 2;

        roadGroup.add(road);


        /* ==========================================
           LIGHT STREAK STORAGE
        ========================================== */

        const streaks = [];


        /* ==========================================
           CREATE STREAK
        ========================================== */

        function createStreak() {

            const geometry =
                new THREE.BufferGeometry();

            const material =
                new THREE.LineBasicMaterial({

                    color:
                        Math.random() > .45

                            ? options.colors.leftCars[
                                Math.floor(
                                    Math.random() *
                                    options.colors.leftCars.length
                                )
                              ]

                            : options.colors.rightCars[
                                Math.floor(
                                    Math.random() *
                                    options.colors.rightCars.length
                                )
                              ],

                    transparent:true,

                    opacity:
                        Math.random() * .45 + .35,

                    blending:
                        THREE.AdditiveBlending

                });


            const laneWidth =
                options.roadWidth /
                options.lanesPerRoad;


            const lane =
                Math.floor(
                    Math.random() *
                    options.lanesPerRoad
                );


            const x =

                (lane -
                (options.lanesPerRoad - 1) / 2)

                * laneWidth;


            const z =
                -Math.random() *
                options.length;


            const length =
                Math.random() * 80 + 25;


            const y =
                Math.random() * 0.15 + 0.04;


            const points = [

                new THREE.Vector3(

                    x,

                    y,

                    z

                ),

                new THREE.Vector3(

                    x,

                    y,

                    z - length

                )

            ];


            geometry.setFromPoints(points);


            const line =
                new THREE.Line(

                    geometry,

                    material

                );


            line.userData.speed =
                Math.random() * 3 + 2;


            line.userData.baseSpeed =
                line.userData.speed;


            line.userData.lane =
                lane;


            roadGroup.add(line);

            streaks.push(line);

        }


        /* ==========================================
           CREATE MANY STREAKS
        ========================================== */

        const streakCount = 150;

        for (
            let i = 0;
            i < streakCount;
            i++
        ) {

            createStreak();

        }


        /* ==========================================
           SIDE LIGHT STICKS
        ========================================== */

        const sideSticks = [];


        function createSideStick(side) {

            const geometry =
                new THREE.BoxGeometry(

                    0.025,

                    Math.random() * 1.5 + 1,

                    0.025

                );


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        options.colors.sticks,

                    transparent:true,

                    opacity:
                        Math.random() * .45 + .35,

                    blending:
                        THREE.AdditiveBlending

                });


            const stick =
                new THREE.Mesh(

                    geometry,

                    material

                );


            stick.position.x =
                side *
                (options.roadWidth / 2 + 1);


            stick.position.y =
                Math.random() * 1.2;


            stick.position.z =
                -Math.random() *
                options.length;


            stick.userData.speed =
                Math.random() * 2 + 1.5;


            roadGroup.add(stick);

            sideSticks.push(stick);

        }


        for (
            let i = 0;
            i < 50;
            i++
        ) {

            createSideStick(
                i % 2 === 0
                    ? -1
                    : 1
            );

        }


        /* ==========================================
           CENTER LANE LIGHTS
        ========================================== */

        const laneLights = [];


        function createLaneLight(x) {

            const geometry =
                new THREE.BoxGeometry(

                    0.035,

                    0.035,

                    Math.random() * 1.2 + .5

                );


            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        options.colors.brokenLines,

                    transparent:true,

                    opacity:.7,

                    blending:
                        THREE.AdditiveBlending

                });


            const light =
                new THREE.Mesh(

                    geometry,

                    material

                );


            light.position.set(

                x,

                .025,

                -Math.random() *
                options.length

            );


            light.userData.speed =
                Math.random() * 2 + 2;


            roadGroup.add(light);

            laneLights.push(light);

        }


        for (
            let lane = 1;
            lane < options.lanesPerRoad;
            lane++
        ) {

            const x =

                (
                    lane -
                    options.lanesPerRoad / 2
                )

                *
                (
                    options.roadWidth /
                    options.lanesPerRoad
                );

            for (
                let i = 0;
                i < 30;
                i++
            ) {

                createLaneLight(x);

            }

        }


        /* ==========================================
           SPEED
        ========================================== */

        let speedMultiplier = 1;

        let targetSpeed = 1;

        let currentSpeed = 1;


        /* ==========================================
           MOUSE
        ========================================== */

        let mouseX = 0;

        let mouseY = 0;

        const handleMouseMove = (event) => {

            mouseX =
                (
                    event.clientX /
                    window.innerWidth -
                    .5
                );

            mouseY =
                (
                    event.clientY /
                    window.innerHeight -
                    .5
                );

        };

        window.addEventListener(
            "mousemove",
            handleMouseMove
        );


        /* ==========================================
           RESIZE
        ========================================== */

        const handleResize = () => {

            if (!container) return;

            camera.aspect =
                container.clientWidth /
                container.clientHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(

                container.clientWidth,

                container.clientHeight

            );

        };

        window.addEventListener(
            "resize",
            handleResize
        );


        /* ==========================================
           ANIMATION
        ========================================== */

        const clock =
            new THREE.Clock();


        let animationFrame;


        const animate = () => {

            animationFrame =
                requestAnimationFrame(
                    animate
                );


            const delta =
                Math.min(
                    clock.getDelta(),
                    .05
                );


            /* Smooth acceleration */

            currentSpeed +=
                (
                    targetSpeed -
                    currentSpeed
                )
                *
                delta
                *
                2;


            /* Camera movement */

            camera.position.x +=
                (
                    mouseX * .7 -
                    camera.position.x
                )
                *
                delta
                *
                2;


            camera.position.y +=
                (
                    2.2 +
                    mouseY * .25 -
                    camera.position.y
                )
                *
                delta
                *
                2;


            /* ==================================
               STREAK MOVEMENT
            ================================== */

            streaks.forEach(streak => {

                streak.position.z +=

                    streak.userData.baseSpeed *

                    currentSpeed *

                    speedMultiplier *

                    delta *

                    80;


                if (
                    streak.position.z > 20
                ) {

                    streak.position.z =
                        -options.length;

                    streak.position.x =
                        (
                            Math.floor(
                                Math.random() *
                                options.lanesPerRoad
                            )
                            -
                            (options.lanesPerRoad - 1) / 2
                        )
                        *
                        (
                            options.roadWidth /
                            options.lanesPerRoad
                        );

                }

            });


            /* ==================================
               SIDE STICKS
            ================================== */

            sideSticks.forEach(stick => {

                stick.position.z +=

                    stick.userData.speed *

                    currentSpeed *

                    delta *

                    65;


                if (
                    stick.position.z > 20
                ) {

                    stick.position.z =
                        -options.length;

                }

            });


            /* ==================================
               LANE LIGHTS
            ================================== */

            laneLights.forEach(light => {

                light.position.z +=

                    light.userData.speed *

                    currentSpeed *

                    delta *

                    70;


                if (
                    light.position.z > 20
                ) {

                    light.position.z =
                        -options.length;

                }

            });


            /* ==================================
               SUBTLE CAMERA ROLL
            ================================== */

            camera.rotation.z +=
                (
                    -mouseX * .025 -
                    camera.rotation.z
                )
                *
                delta
                *
                2;


            renderer.render(
                scene,
                camera
            );

        };


        animate();


        /* ==========================================
           SPEED UP API
        ========================================== */

        const handleSpeedUp = () => {

            targetSpeed =
                options.speedUp || 1.5;

            speedMultiplier = 1.8;

            onSpeedUp?.();

        };


        const handleSlowDown = () => {

            targetSpeed = 1;

            speedMultiplier = 1;

            onSlowDown?.();

        };


        /*
          Start slightly faster for the transition.
        */

        setTimeout(
            handleSpeedUp,
            500
        );


        /* ==========================================
           CLEANUP
        ========================================== */

        return () => {

            cancelAnimationFrame(
                animationFrame
            );

            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "resize",
                handleResize
            );

            scene.traverse(object => {

                if (
                    object.geometry
                ) {

                    object.geometry.dispose();

                }

                if (
                    object.material
                ) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material =>
                                material.dispose()
                        );

                    } else {

                        object.material.dispose();

                    }

                }

            });

            renderer.dispose();

            if (
                renderer.domElement.parentNode
            ) {

                renderer.domElement.parentNode
                    .removeChild(
                        renderer.domElement
                    );

            }

        };

    }, [
        effectOptions,
        onSpeedUp,
        onSlowDown
    ]);


    return (

        <div
            ref={containerRef}
            className="hyperspeed"
        />

    );

}