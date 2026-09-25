import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import './Topography.css';

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
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uLowColor;
  uniform vec3 uMidColor;
  uniform vec3 uHighColor;
  uniform float uSpeed;
  uniform float uMorphAmount;
  uniform float uMorphSpeed;
  uniform float uBands;
  uniform float uThickness;
  uniform float uScale;
  uniform float uGlow;
  uniform float uContrast;
  uniform float uBrightness;
  uniform float uOpacity;
  uniform float uGrainIntensity;
  uniform float uMouseStrength;
  uniform float uMouseRadius;
  uniform int uFillBands;

  // Simplex-like procedural noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractional Brownian Motion
  float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 1.0;
    float maxVal = 0.0;
    for (int i = 0; i < 4; i++) {
      total += snoise(p) * amplitude;
      maxVal += amplitude;
      p *= 2.0;
      amplitude *= 0.5;
    }
    return total / maxVal;
  }

  // Pseudo-random grain
  float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uv = vUv * aspect * uScale;

    // Mouse influence
    vec2 mouseNorm = uMouse * aspect;
    float mouseDist = distance(vUv * aspect, mouseNorm);
    float mouseFactor = smoothstep(uMouseRadius, 0.0, mouseDist) * uMouseStrength;

    // Temporal morphing
    float time = uTime * uSpeed;
    float morphTime = uTime * uMorphSpeed;

    vec2 p = uv + vec2(time * 0.1, time * 0.05);
    p += snoise(uv + morphTime) * uMorphAmount * 0.15;
    p += (vUv * aspect - mouseNorm) * mouseFactor;

    // Elevation heightmap
    float elevation = (fbm(p) + 1.0) * 0.5;
    elevation = pow(elevation, uContrast) * uBrightness;

    // Calculate isoline contours
    float contour = fract(elevation * uBands);
    float lineDist = abs(contour - 0.5) * 2.0;
    float line = smoothstep(1.0 - uThickness * 10.0, 1.0, lineDist);

    // Glow halo around contour lines
    float glow = smoothstep(1.0 - uThickness * 30.0, 1.0, lineDist) * uGlow;

    // Color gradient interpolation based on elevation
    vec3 color;
    if (elevation < 0.5) {
      color = mix(uLowColor, uMidColor, elevation * 2.0);
    } else {
      color = mix(uMidColor, uHighColor, (elevation - 0.5) * 2.0);
    }

    vec3 finalColor = color * (line + glow);

    // Background fill tint if enabled
    if (uFillBands == 1) {
      finalColor += uLowColor * 0.3 * (1.0 - line);
    }

    // Add subtle cinematic grain
    float grain = (random(vUv + fract(uTime)) - 0.5) * uGrainIntensity;
    finalColor += grain;

    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

const Topography = ({
  lowColor = '#500817',
  midColor = '#F20D3A',
  highColor = '#FF8BA2',
  speed = 0.25,
  morphAmount = 2.5,
  morphSpeed = 0.05,
  bands = 2.5,
  thickness = 0.012,
  scale = 1.1,
  glow = 0.35,
  colorMode = 'elevation',
  contrast = 2.5,
  brightness = 0.85,
  fillBands = false,
  opacity = 0.85,
  grain = true,
  grainIntensity = 0.025,
  mouseInteraction = true,
  mouseRadius = 0.3,
  mouseStrength = 0.25,
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
      });
      gl = renderer.gl;
      container.appendChild(gl.canvas);
      gl.canvas.className = 'topography-canvas';
    } catch (e) {
      console.warn('WebGL not supported for Topography, using fallback background');
      return;
    }

    const geometry = new Triangle(gl);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: [container.clientWidth, container.clientHeight] },
      uMouse: { value: [0.5, 0.5] },
      uLowColor: { value: hexToRgb(lowColor) },
      uMidColor: { value: hexToRgb(midColor) },
      uHighColor: { value: hexToRgb(highColor) },
      uSpeed: { value: speed },
      uMorphAmount: { value: morphAmount },
      uMorphSpeed: { value: morphSpeed },
      uBands: { value: bands },
      uThickness: { value: thickness },
      uScale: { value: scale },
      uGlow: { value: glow },
      uContrast: { value: contrast },
      uBrightness: { value: brightness },
      uOpacity: { value: opacity },
      uGrainIntensity: { value: grain ? grainIntensity : 0.0 },
      uMouseStrength: { value: mouseInteraction ? mouseStrength : 0.0 },
      uMouseRadius: { value: mouseRadius },
      uFillBands: { value: fillBands ? 1 : 0 },
    };

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value = [width, height];
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse Tracking with smooth interpolation
    let targetMouse = [0.5, 0.5];
    const handleMouseMove = (e) => {
      if (!mouseInteraction || !container) return;
      const rect = container.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Intersection Observer to pause when invisible
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    // Render loop
    let lastTime = performance.now();
    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const delta = (currentTime - lastTime) * 0.001;
      lastTime = currentTime;

      uniforms.uTime.value += delta;

      // Mouse lerp
      if (mouseInteraction) {
        uniforms.uMouse.value[0] += (targetMouse[0] - uniforms.uMouse.value[0]) * 0.05;
        uniforms.uMouse.value[1] += (targetMouse[1] - uniforms.uMouse.value[1]) * 0.05;
      }

      renderer.render({ scene: mesh });
    };

    animationFrameId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();

      if (gl && gl.canvas && gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
    };
  }, [
    lowColor,
    midColor,
    highColor,
    speed,
    morphAmount,
    morphSpeed,
    bands,
    thickness,
    scale,
    glow,
    contrast,
    brightness,
    fillBands,
    opacity,
    grain,
    grainIntensity,
    mouseInteraction,
    mouseRadius,
    mouseStrength,
  ]);

  return (
    <div
      ref={containerRef}
      className={`topography-container ${className}`}
      aria-hidden="true"
    />
  );
};

export default Topography;
