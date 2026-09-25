import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './PrismaticBurst.css';

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
};

const vertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor1; // Muted forest green (#547A60)
  uniform vec3 uColor2; // Pale sage (#E3EBE2)
  uniform vec3 uColor3; // Soft mint (#D5E5D5)
  uniform vec3 uColor4; // Warm off-white (#F4F6F2)
  uniform float uSpeed;
  uniform float uIntensity;
  uniform float uRays;
  uniform float uGrain;
  uniform float uMouseInfluence;
  uniform float uOpacity;

  // Hash / noise helper
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 uv = (vUv - 0.5) * aspect;

    // Mouse offset
    vec2 mouseOffset = (uMouse - 0.5) * uMouseInfluence * 0.3;
    uv -= mouseOffset;

    // Polar coordinates
    float angle = atan(uv.y, uv.x);
    float dist = length(uv);

    float time = uTime * uSpeed;

    // Prismatic dynamic rays & dispersion waves
    float rays = sin(angle * uRays + time * 0.8) * cos(angle * (uRays * 0.5) - time * 0.5);
    rays += sin(angle * 10.0 + dist * 8.0 - time) * 0.25;

    // Dispersion wave
    float wave = sin(dist * 14.0 - time * 1.5 + rays * 1.5);
    float glow = smoothstep(1.4, 0.0, dist) * uIntensity;

    // Color gradient mixing across prismatic angles
    float colorPhase = fract((angle / 6.2831853) + dist * 0.3 + time * 0.04);
    vec3 col;
    if (colorPhase < 0.33) {
      col = mix(uColor1, uColor2, colorPhase * 3.0);
    } else if (colorPhase < 0.66) {
      col = mix(uColor2, uColor3, (colorPhase - 0.33) * 3.0);
    } else {
      col = mix(uColor3, uColor4, (colorPhase - 0.66) * 3.0);
    }

    // Prismatic highlight bursts
    float burst = max(0.0, rays * wave) * glow;
    col += uColor3 * burst * 0.5;
    col += uColor2 * pow(max(0.0, 1.0 - dist * 1.2), 2.0) * 0.4;

    // Subtle grain
    float grain = (hash(vUv * 1000.0 + fract(uTime)) - 0.5) * uGrain;
    col += grain;

    gl_FragColor = vec4(col, uOpacity);
  }
`;

const PrismaticBurst = ({
  color1 = '#547A60', // Muted forest green
  color2 = '#E3EBE2', // Pale sage
  color3 = '#D5E5D5', // Soft mint
  color4 = '#F4F6F2', // Warm off-white
  speed = 0.2,
  intensity = 0.45,
  rays = 10.0,
  grain = 0.015,
  mouseInfluence = 0.15,
  opacity = 0.45,
  className = '',
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    let gl;
    let animationFrameId;
    let isVisible = true;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        premultipliedAlpha: false,
      });
      gl = renderer.gl;
      container.appendChild(gl.canvas);
      gl.canvas.className = 'prismatic-burst-canvas';
    } catch (e) {
      console.warn('WebGL not supported for PrismaticBurst, using fallback', e);
      return;
    }

    const geometry = new Triangle(gl);

    const initialW = container.clientWidth || window.innerWidth || 800;
    const initialH = container.clientHeight || window.innerHeight || 600;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: [initialW, initialH] },
      uMouse: { value: [0.5, 0.5] },
      uColor1: { value: hexToRgb(color1) },
      uColor2: { value: hexToRgb(color2) },
      uColor3: { value: hexToRgb(color3) },
      uColor4: { value: hexToRgb(color4) },
      uSpeed: { value: speed },
      uIntensity: { value: intensity },
      uRays: { value: rays },
      uGrain: { value: grain },
      uMouseInfluence: { value: mouseInfluence },
      uOpacity: { value: opacity },
    };

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = (width, height) => {
      if (!renderer || !container) return;
      const w = width || container.clientWidth || window.innerWidth;
      const h = height || container.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) {
        renderer.setSize(w, h);
        uniforms.uResolution.value = [w, h];
      }
    };

    resize(initialW, initialH);

    // Use ResizeObserver for accurate and responsive viewport sizing
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            resize(width, height);
          }
        }
      });
      resizeObserver.observe(container);
    }

    const handleWindowResize = () => {
      resize();
    };
    window.addEventListener('resize', handleWindowResize);

    let targetMouse = [0.5, 0.5];
    const handleMouseMove = (e) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouse[0] = (e.clientX - rect.left) / rect.width;
        targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Respect user reduced-motion preferences
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // IntersectionObserver to pause rendering when component is offscreen
    let intersectionObserver;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      });
      intersectionObserver.observe(container);
    }

    // Page Visibility API to pause rendering when tab is hidden
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();
    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const delta = prefersReducedMotion ? 0 : (currentTime - lastTime) * 0.001;
      lastTime = currentTime;

      uniforms.uTime.value += delta;
      uniforms.uMouse.value[0] += (targetMouse[0] - uniforms.uMouse.value[0]) * 0.05;
      uniforms.uMouse.value[1] += (targetMouse[1] - uniforms.uMouse.value[1]) * 0.05;

      renderer.render({ scene: mesh });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();

      if (gl && gl.canvas && gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
    };
  }, [
    color1,
    color2,
    color3,
    color4,
    speed,
    intensity,
    rays,
    grain,
    mouseInfluence,
    opacity,
  ]);

  return (
    <div
      ref={containerRef}
      className={`prismatic-burst-container ${className}`}
      aria-hidden="true"
    />
  );
};

export default PrismaticBurst;
