import Hero from "../components/Hero/Hero";
import Background from "../components/Background/Background";

export default function Landing({ onEnter }) {
  return (
    <section className="landing">

      <Background />

      <Hero onEnter={onEnter} />

    </section>
  );
}