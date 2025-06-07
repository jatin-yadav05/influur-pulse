"use client";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Adds a fade effect on the curve side using masking in the shader.
 * The fade is applied only if `curve` is true and `position` is "right-bottom".
 * The fade mask is rotated 180 degrees to match the visual orientation.
 */
export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  containerClassName,
  dotSize,
  showGradient = true,
  position = "right-bottom",
  curve = true,
}: {
  /**
   * 0.1 - slower
   * 1.0 - faster
   */
  animationSpeed?: number;
  opacities?: number[];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  position?: "right-bottom" | "full";
  curve?: boolean;
}) => {
  // To cover more width at the bottom, increase width and reduce border radius
  // w-[90vw] h-2/3 covers more width, rounded-br-[60%] is less curved
  const positionClass =
    position === "right-bottom"
      ? "absolute bottom-0 right-0 w-full h-2/3"
      : "h-full w-full";
  const curveClass = curve ? "rounded-br-[100%]" : "";

  // Pass fadeMask to DotMatrix if curve and right-bottom
  const fadeMask = curve && position === "right-bottom" ? true : false;

  return (
    <div
      className={cn(
        "relative overflow-hidden rotate-180",
        positionClass,
        curveClass,
        containerClassName
      )}
    >
      <div className="h-full w-full">
        <DotMatrix
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          // The shader below is modified to load from the corner (0,0) to the center
          shader={`
              float animation_speed_factor = ${animationSpeed.toFixed(1)};
              // Calculate the distance from the corner (0,0) to the current dot
              float maxDist = length(u_resolution / u_total_size * 0.5);
              float distToCorner = distance(vec2(0.0, 0.0), st2);
              float intro_offset = distToCorner * 0.04 + (random(st2) * 0.15);
              opacity *= step(intro_offset, u_time * animation_speed_factor);
              opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            `}
          center={["x", "y"]}
          fadeMask={fadeMask}
        />
      </div>
      {/* No gradient or background color */}
    </div>
  );
};

interface DotMatrixProps {
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
  fadeMask?: boolean;
}

/**
 * Adds a fade mask on the curved (bottom-right) side using a radial gradient in the fragment shader.
 * The fade is only applied if fadeMask is true.
 * The mask is rotated 180 degrees to match the visual orientation.
 */
const DotMatrix: React.FC<DotMatrixProps> = ({
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
  fadeMask = false,
}) => {
  const uniforms = React.useMemo(() => {
    return {
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
    };
  }, [opacities, totalSize, dotSize]);

  // Shader code for fade mask on curve side (bottom-right)
  // The fade is a radial gradient from the bottom-right corner, but rotated 180deg (so, top-left in shader space)
  // To cover more width at the bottom, increase the maskRadius and adjust the fade range
  const fadeMaskShader = fadeMask
    ? `
      // Fade mask for curved bottom-right, rotated 180deg (so, top-left in shader space)
      float maskRadius = min(u_resolution.x, u_resolution.y) * 1.2; // increased for more width
      vec2 maskCenter = vec2(0.0, 0.0); // top-left after 180deg rotation
      float dist = distance(fragCoord.xy, maskCenter);
      // Make vertical fade much less pronounced from the top
      float verticalFade = smoothstep(0.0, maskRadius * 0.9, fragCoord.y);
      float fade = smoothstep(maskRadius * 0.7, maskRadius, dist);
      opacity *= (1.0 - fade) * (1.0 - verticalFade);
    `
    : "";

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
      float opacity = step(0.0, st.x);
      opacity *= step(0.0, st.y);

      vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

      float frequency = 15.0;
      float show_offset = random(st2);
      float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
      opacity *= u_opacities[int(rand * 10.0)];
      opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
      opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

      // Use only orange color for all dots
      vec3 color = vec3(1.0, 0.5, 0.0);

      ${shader}

      ${fadeMaskShader}

      fragColor = vec4(color, opacity);
      fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};
const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) {
      return;
    }
    lastFrameTime = timestamp;

    const material: any = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    }; // Initialize u_resolution
    return preparedUniforms;
  };

  // Shader material
  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0  h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};
interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}
