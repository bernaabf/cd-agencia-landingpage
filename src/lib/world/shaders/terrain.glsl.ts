export const terrainVertex = /* glsl */ `
  attribute float cavity;
  attribute vec3 terrainShadow;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vCavity;
  varying vec3 vTerrainShadow;
  void main() {
    vWorld = position;
    vNormal = normal;
    vCavity = cavity;
    vTerrainShadow = terrainShadow;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const terrainFragment = /* glsl */ `
  uniform vec3 uDeep, uRock, uSand, uSnow, uFog, uSunColor, uSunDirection;
  uniform sampler2D uNoise;
  uniform float uTime, uAtmosphere, uContours, uSnowLine, uFogDensity, uContourInterval, uProgress;
  varying vec3 vWorld, vNormal;
  varying float vCavity;
  varying vec3 vTerrainShadow;
  void main() {
    vec3 normal = normalize(vNormal);
    float grain = texture2D(uNoise, vWorld.xz * 0.028).r;
    float altitude = smoothstep(1.0, 24.0, vWorld.y);
    vec3 base = mix(uDeep, uRock, smoothstep(0.0, 0.55, altitude));
    base = mix(base, uSand, pow(altitude, 1.5) * 0.8);
    float snow = smoothstep(uSnowLine - 1.7, uSnowLine + 3.2, vWorld.y + grain * 3.0);
    snow *= smoothstep(0.28, 0.65, normal.y);
    base = mix(base, uSnow, snow * 0.94);
    float light = max(0.0, dot(normal, normalize(uSunDirection)));
    float ao = 1.0 - min(0.42, vCavity * 0.8);
    float shadow = uProgress < .5 ? mix(vTerrainShadow.x, vTerrainShadow.y, uProgress * 2.)
      : mix(vTerrainShadow.y, vTerrainShadow.z, (uProgress - .5) * 2.);
    vec3 color = base * (0.24 + light * uSunColor * (0.22 + shadow * 1.15)) * ao;
    color += uSand * pow(light, 4.) * altitude * .12;
    color *= 0.96 + grain * 0.08;
    float level = vWorld.y / uContourInterval;
    float width = max(fwidth(level), 0.015);
    float contour = 1.0 - smoothstep(width * 0.32, width * 1.25, abs(fract(level + 0.5) - 0.5));
    contour *= 1.0 - smoothstep(0.35, 0.8, width);
    color = mix(color, uSand, contour * uContours * (1.0 - snow * 0.75));
    float distanceToEye = length(cameraPosition - vWorld);
    float heightFog = exp(-max(vWorld.y - 1.0, 0.0) * 0.10);
    float fog = 1.0 - exp(-distanceToEye * uFogDensity * heightFog);
    #if FOG_STEPS > 0
      float optical = 0.0;
      for (int i = 0; i < FOG_STEPS; i++) {
        float t = (float(i) + 0.5) / float(FOG_STEPS);
        vec3 p = mix(cameraPosition, vWorld, t);
        float cloud = texture2D(uNoise, p.xz * 0.009 + vec2(uTime * 0.9, 0.0)).r;
        optical += exp(-max(p.y - 4.0, 0.0) * 0.18) * smoothstep(0.27, 0.65, cloud);
      }
      fog = max(fog, 1.0 - exp(-optical * distanceToEye * 0.011 / float(FOG_STEPS)));
    #endif
    fog *= uAtmosphere;
    color = mix(color, uFog, min(0.8, fog));
    // Arestas da malha dissolvem no horizonte, nunca formando uma mesa recortada.
    float edge = smoothstep(45.0, 55.5, abs(vWorld.x));
    edge = max(edge, smoothstep(72.0, 87.5, abs(vWorld.z)));
    color = mix(color, uFog, edge);
    color *= mix(.32, 1., smoothstep(0., .12, uProgress));
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
