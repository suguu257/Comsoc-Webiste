import "./Particles.css";

export default function Particles(){

return(

<div className="particles">

{

[...Array(140)].map((_,i)=>(

<span

key={i}

className="particle"

style={{

"--x":`${Math.random()*120-60}px`,

"--delay":`${Math.random()*2}s`,

"--duration":`${1+Math.random()*1.4}s`

}}

></span>

))

}

</div>

);

}