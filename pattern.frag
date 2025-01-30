// you can set these 4 uniform variables dynamically or hardwire them:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting
uniform float   uShininess;	 // specular exponent

//// in Project #1, these have to be set dynamically from glman sliders or keytime animations or by keyboard hits:
uniform float    uAd, uBd, uTol;

uniform float  uNoiseAmp;
uniform float  uNoiseFreq;
uniform sampler3D Noise3;

// interpolated from the vertex shader:
varying  vec2  vST;                  // texture coords
varying  vec3  vN;                   // normal vector
varying  vec3  vL;                   // vector from point to light
varying  vec3  vE;                   // vector from point to eye
varying  vec3  vMC;            // model coordinates

const vec3 OBJECTCOLOR          = vec3( 1. );           // color to make the object
const vec3 ELLIPSECOLOR         = vec3( .9, .5, .2);           // color to make the ellipse
const vec3 SPECULARCOLOR        = vec3( 1., 1., 1. );

float sqNorm(float coord, float spacing) {
    return pow(fract(coord / spacing) * 2. - 1., 2.);
}

void
main( )
{
    vec3 myColor = OBJECTCOLOR;
    vec2 st = vST;
    
    vec3 noiseCoord = vec3(st, 0.) * uNoiseFreq;
    vec4 nv = texture3D(Noise3, noiseCoord);
    float n = (nv.r + nv.g + nv.b + nv.a) * 0.25;
    n = 2.*n - 1.;
    n *= uNoiseAmp;
    st.s += n;
    st.t += n;

    // blend OBJECTCOLOR and ELLIPSECOLOR by using the ellipse equation to decide how close
    //     this fragment is to the ellipse border:

//    float t = smoothstep( 1.-uTol, 1.+uTol, sqNorm(st.s, uAd) + sqNorm(st.t, uBd));
    float t = smoothstep( .75-uTol, .75+uTol, sqNorm(st.s, uAd) + sqNorm(st.t, uBd));
    myColor = mix( ELLIPSECOLOR, OBJECTCOLOR, t );

    // now use myColor in the per-fragment lighting equations:

    vec3 Normal    = normalize(vN);
    vec3 Light     = normalize(vL);
    vec3 Eye       = normalize(vE);

    vec3 ambient = uKa * myColor;

    float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
    vec3 diffuse = uKd * dd * myColor;

    float s = 0.;
    if( dd > 0. )              // only do specular if the light can see the point
    {
        vec3 ref = normalize(  reflect( -Light, Normal )  );
        float cosphi = dot( Eye, ref );
        if( cosphi > 0. )
            s = pow( max( cosphi, 0. ), uShininess );
    }
    vec3 specular = uKs * s * SPECULARCOLOR.rgb;
    gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}
