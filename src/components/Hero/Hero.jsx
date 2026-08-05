import "./Hero.css";
import CircularText from "./CircularText";

export default function Hero() {

    return (

        <section className="hero">

            {/* OUTER RING */}

           <div className="outerRing">

<CircularText

text="WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC • "

radius={280}

/>

</div>

            {/* INNER RING */}

            <div className="innerRing">

<CircularText

text="WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC •"

radius={180}

reverse

/>

</div>

            {/* IEEE */}

            <div className="heroCenter">

<h1>IEEE</h1>

<h2>COMSOC</h2>

</div>

        </section>

    );

}