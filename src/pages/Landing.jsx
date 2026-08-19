import Background from "../components/Background/Background";
import Hero from "../components/Hero/Hero";
import Events from "../components/Events/Events";

export default function Landing() {
    return (
        <section className="landing">

            <Background />

            <main className="landing-content">

                <Hero />

                {/* About Us will go here */}

               <Events/>

            </main>

        </section>
    );
}