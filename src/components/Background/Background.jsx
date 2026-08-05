import "./Background.css";
import { useMemo, useEffect, useRef } from "react";

export default function Background() {

  const backgroundRef = useRef(null);

  /* ==========================================
      STARS
  ========================================== */

  const stars = useMemo(() => {

    const data = [];

    for (let i = 0; i < 260; i++) {

      let x = Math.random() * 100;
      let y = Math.random() * 100;

      // Keep the center slightly emptier
      if (
        x > 35 &&
        x < 65 &&
        y > 30 &&
        y < 70 &&
        Math.random() < .55
      ) {
        x += Math.random() > .5 ? 18 : -18;
      }

      data.push({

        id: i,

        x,

        y,

        type:

          i < 180
            ? "tiny"
            : i < 240
            ? "medium"
            : "bright",

        blue: Math.random() < .08,

        opacity: Math.random() * .25 + .10,

        duration: Math.random() * 10 + 8,

        delay: Math.random() * 8

      });

    }

    return data;

  }, []);

  /* ==========================================
      FLOATING ORBS
  ========================================== */

  const orbs = useMemo(() => [

    {
x:8,
y:36,
size:46,
type:"white",
motion:1,
blurClass:"blur4",
radius:"8px"
},
{
x:22,
y:12,
size:28,
type:"blue",
motion:2,
blurClass:"blur2",
radius:"4px"
},
{
x:58,
y:22,
size:42,
type:"white",
motion:3,
blurClass:"blur3",
radius:"10px"
},
{
x:63,
y:33,
size:30,
type:"blue",
motion:4,
blurClass:"blur1",
radius:"6px"
},
{
x:80,
y:48,
size:36,
type:"white",
motion:5,
blurClass:"blur3",
radius:"12px"
},
{
x:68,
y:78,
size:34,
type:"blue",
motion:6,
blurClass:"blur2",
radius:"5px"
},
{
x:91,
y:14,
size:48,
type:"white",
motion:7,
blurClass:"blur4",
radius:"9px"
},

  ], []);

  /* ==========================================
      MOUSE PARALLAX
  ========================================== */

  useEffect(() => {

    const handleMove = (e) => {

      const x =
        (e.clientX / window.innerWidth - .5) * 20;

      const y =
        (e.clientY / window.innerHeight - .5) * 20;

      document
        .querySelectorAll(".nebula")
        .forEach((layer,index)=>{

          const depth=(index+1)*0.4;

          layer.style.transform=
          `translate(${x*depth}px,${y*depth}px)`;

      });

    };

    window.addEventListener("mousemove",handleMove);

    return()=>window.removeEventListener("mousemove",handleMove);

  },[]);

  return(

<div className="background" ref={backgroundRef}>

    {/* ===========================
            NEBULA
    ============================ */}

    <div className="nebula nebula1"></div>
    <div className="nebula nebula2"></div>
    <div className="nebula nebula3"></div>

    {/* ===========================
            CENTER GLOW
    ============================ */}

    <div className="centerGlow"></div>

    {/* ===========================
            STARS
    ============================ */}

    <div className="stars">

      {

        stars.map(star=>(

          <span

            key={star.id}

            className={

              `star
               ${star.type}
               ${star.blue?"blue":"white"}`

            }

            style={{

              left:`${star.x}%`,
              top:`${star.y}%`,
              opacity:star.opacity,
              animationDuration:`${star.duration}s`,
              animationDelay:`${star.delay}s`

            }}

          />

        ))

      }

    </div>

    {/* ===========================
            ORBS
    ============================ */}

    {

      orbs.map((orb,index)=>(

        <div

          key={index}

          className={

`orb
${orb.type}
motion-${orb.motion}
${orb.blurClass}`

}

          style={{

            left:`${orb.x}%`,
            top:`${orb.y}%`,
            width:orb.size,
            height:orb.size,
            "--radius":orb.radius

          }}

        />

      ))

    }

    {/* ===========================
          DOT GRID
    ============================ */}

    <div className="dotGrid">

      {

        [...Array(64)].map((_,i)=>

          <span key={i}></span>

        )

      }

    </div>

    {/* ===========================
          BLUE BARS
    ============================ */}

    <div className="bars">

      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>

    </div>

    {/* ===========================
          CHECKER
    ============================ */}

    <div className="checker">

      {

        [...Array(25)].map((_,i)=>

          <span key={i}></span>

        )

      }

    </div>
      <div className="edgeFade"></div>
</div>

);

}