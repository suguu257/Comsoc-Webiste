import Background from "../components/Background/Background";
import Hero from "../components/Hero/Hero";

export default function Landing({ onEnter }) {
    return (
        <section className="landing">
            <Background />

            <main className="landing-content">
                <Hero onEnter={onEnter} />

                {/* About Us will go here */}
            </main>
        </section>
    );
}