# project2
## Requirements:
1. Using a GLIB file (for glman) or using the GLSL API, use the following uniform variables:
Parameter | What It Does | Does it have to be varied?
-|-|-
uKa | Ambient coefficient | No
uKd | Diffuse coefficient | No
uKs | Specular coefficient | No
uShininess | Specular exponent | No
uAd | Ellipse diameter in s | No
uBd | Ellipse diameter in t | No
uTol | Width of the blend between ellipse and non-ellipse areas | No
uNoiseAmp | Noise Amplitude | Yes
uNoiseFreq | Noise Frequency | Yes

If you are using glman, the .glib file might look something like this:
```
##OpenGL GLIB
LookAt  0 0 3  0 0 0  0 1 0
Perspective 70

Vertex   ovalnoise.vert
Fragment ovalnoise.frag
Program  OvalNoise                      \
        uKa <0.1 0.1 0.5>               \
        uKd <0.1 0.6 1.>                \
        uKs <0.1 0.3 1.>                \
        uShininess <1. 10. 25.>         \
        uAd <.01 .05 .5>		\
	uBd <.01 .05 .5> 		\
        uTol <0. 0. 1.>			\
        uNoiseAmp <0. 0. 1.>		\
	uNoiseFreq <0. 1. 10.>

Sphere 1.0 50 50
```

2. Remember that the border of an ellipse, defined in s and t coordinates, is:
`d = (s-sc)2 / Ar2 + (t-tc)2 / Br2 = 1`
3. The **uNoiseFreq** parameter is the frequency of the noise function, i.e., it multiplies what goes into the noise function.
4. The **uNoiseAmp** parameter is the amplitude of the noise function, i.e., it multiplies the noise value.
5. The effects of the **uNoiseAmp** and **uNoiseFreq** parameters should look something like this:

![image](https://github.com/user-attachments/assets/fedfa6e7-04f9-4228-b130-c3d600b6c7f2)

### uNoiseAmp
![image](https://github.com/user-attachments/assets/3a797d96-b5b2-485f-883f-91127006b9bd)

### uNoiseFreq
![image](https://github.com/user-attachments/assets/0dd70a5f-e4ad-430b-acc4-3466118f612a)

### uTol
![image](https://github.com/user-attachments/assets/391e718b-f864-4893-87b7-322c8b933d91)

7. Do per-fragment lighting just as you did in Project #1.
8. As we discussed in class, get a noise value by indexing into a noise texture. Use all 4 octaves available. Then use that value to alter the ds and dt values. Then use those new ds and dt values to determine the correct color to use.
```
// get the noise from the 3D noise texture
// look it up using (s,t,0.) if using 2D texture coords:
// look it up using (x,y,z)  if using 3D model   coords:

uniform sampler3D Noise3;

. . .
         vec4 nv  = texture( Noise3, uNoiseFreq*vMC );
```
OR:
```
         vec4 nv  = texture( Noise3, uNoiseFreq*vec3(vST,0.) );

// give the noise a range of [-1.,+1.]:

float n = ???;                          //  1. -> 3.
n = ???;                                // -1. -> 1.
n *= ???;				// -uNoiseAmp -> uNoiseAmp

<< use the noise to alter the fragment (s,t) coordinates >>
<< use those altered (s,t) coordinates in the ellipse equation >>
<< use the results of the ellipse equation in the smoothstep( ) function  >>
<< use what you get back from smoothstep( ) to mix( ) the 2 colors >>
```

8. The choice of geometry is up to you. You are allowed to contrive the size to make it work.

## Using Objects Other Than A Sphere
You can try this with any solid objects you want. However, be aware that not all solid objects have built-in (s,t) texture coordinates. In glman, the sphere, cone, torus, and teapot have them. The others don't. (Blame this on GLUT.) Many of the hundreds (thousands) of free .obj files available on the net have them. (You can check this by editing the .obj file and ensuring that there are lines beginning with "vt".) Also, be aware that not all .obj objects have built-in surface normals (nx,ny,nz). (You can check this by editing the .obj file and ensuring that there are lines beginning with "vn".)

In glman, download the OBJ file and reference it from your GLIB file like this:
**Obj spaceship.obj**

Or, using the API, load an OBJ file from your C/C++ program by placing the object into a display list:
```
// a global variable:
GLuint DL;

. . .

// do this in InitLists( ):
DL = glGenLists( 1 );
glNewList( DL, GL_COMPILE );
	LoadObjFile( "spaceship.obj" );
glEndList( );

. . .

// and do this in Display( ):
Pattern.Use( );
. . .
glCallList( DL );
. . .
Pattern.UnUse( );
```

## Hints:
Use the philosophy that you get the (s,t) or (x,y,z) coordinates of the current fragment, perturb them according to the noise parameters, then use the perturbed coordinates in the ellipse equation.

## The Turn-In Process:
Use Canvas to turn in your:
1. Your source files: .cpp, .glib, .vert, .frag, .geom
2. A short PDF report containing:
    - Your name
    - Your email address
    - Project number and title
    - A description of what you did to get the display you got
    - A cool-looking screen shot from your program
    - The link to the [Kaltura video](http://cs.oregonstate.edu/~mjb/cs557/Handouts/kaltura.1pp.pdf) demonstrating that your project does what the requirements ask for. If you can, we'd appreciate it if you'd narrate your video so that you can tell us what it is doing.
3. To see how to turn these files in to Canvas, go to our [Project Notes noteset](https://web.engr.oregonstate.edu/~mjb/cs550/PDFs/Project.Notes.450.550.1pp.pdf), and go the the slide labeled How to Turn In a Project on Canvas.
4. Be sure that your video's permissions are set to unlisted.. The best place to set this is on the [OSU Media Server](https://media.oregonstate.edu/).
5. A good way to test your video's permissions is to ask a friend to try to open the same video link that you are giving us.
6. The video doesn't have to be made with Kaltura. Any similar tool will do.

Submissions are due at 23:59:59 on the listed due date.

## Grading:
Feature | Points
-|-
uAd and uBd continue to work correctly | 20
uTol continues to work correctly | 20
Show correct changes in uNoiseAmp | 30
Show correct changes in uNoiseFreq | 30
**Potential Total | 100**
