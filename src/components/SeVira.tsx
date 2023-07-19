import { useEffect } from "react";

interface Elements {
  text1: HTMLElement | null;  
  text2: HTMLElement | null;
}

export default function SeVira(){
  const texts: string[] = [
    "SE",
    "VIRA",
    ":)"
  ];
  
  const elts: Elements = {
    text1: null,
    text2: null
  };

  const morphTime: number = 1;
  const cooldownTime: number = 0.25;
  
  let textIndex: number = texts.length - 1;
  let time: Date = new Date();
  let morph: number = 0;
  let cooldown: number = cooldownTime;
  
  if (elts.text1 && elts.text2) {
    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];
  }
  
  function doMorph(): void {
    morph -= cooldown;
    cooldown = 0;
  
    let fraction: number = morph / morphTime;
  
    if (fraction > 1) {
      cooldown = cooldownTime;
      fraction = 1;
    }
  
    setMorph(fraction);
  }
  
  function setMorph(fraction: number): void {
    if (elts.text1 && elts.text2) {
      elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  
      fraction = 1 - fraction;
      elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  
      elts.text1.textContent = texts[textIndex % texts.length];
      elts.text2.textContent = texts[(textIndex + 1) % texts.length];
    }
  }
  
  function doCooldown(): void {
    morph = 0;
  
    if (elts.text1 && elts.text2) {
      elts.text2.style.filter = "";
      elts.text2.style.opacity = "100%";
  
      elts.text1.style.filter = "";
      elts.text1.style.opacity = "0%";
    }
  }
  
  function animate(): void {
    requestAnimationFrame(animate);
  
    let newTime: Date = new Date();
    let shouldIncrementIndex: boolean = cooldown > 0;
    let dt: number = (newTime.getTime() - time.getTime()) / 1000;
    time = newTime;
  
    cooldown -= dt;
  
    if (cooldown <= 0) {
      if (shouldIncrementIndex) {
        textIndex++;
      }
  
      doMorph();
    } else {
      doCooldown();
    }
  }
  
  useEffect(()=>{
    elts.text1 = document.getElementById("text1")
    elts.text2 = document.getElementById("text2")
    animate();
  },[])
  
  

  return (
    <div>
      <div id="container">
          <span id="text1"></span>
          <span id="text2"></span>
      </div>

      <svg id="filters">
          <defs>
              <filter id="threshold">
                  <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 255 -140" />
              </filter>
          </defs>
      </svg>
    </div>
  )
}