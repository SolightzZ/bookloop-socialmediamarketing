# BOOKLOOP — PREMIUM COZY BACKGROUND MOTION

ROLE:
Senior Frontend Motion Engineer + UX/UI Designer.

TASK:
Upgrade the existing BookLoop Hero background
into a beautiful premium 2D animated environment.

IMPORTANT:
Do NOT change the current Hero layout.

Do NOT animate the entire page aggressively.

The background must remain behind the Hero content
and must never compete with the headline,
CTA, search bar, or Girl + Cat illustration.

==================================================

# DESIGN CONCEPT

==================================================

Create:

"Cozy Book Breeze"

Mood:

- cozy
- premium
- cute
- elegant
- calm
- airy
- modern
- bookstore atmosphere

The background should feel alive,
but users should not immediately notice
that the background is animated.

==================================================

# 1. AMBIENT GRADIENT

==================================================

Create 2–3 extremely soft gradient blobs.

Primary:
soft BookLoop blue

Secondary:
warm cream / soft yellow

Optional:
very subtle cyan

Movement:

slow floating

Duration:
18–35 seconds

Opacity:
0.06–0.14

Scale:
0.98 → 1.03 → 0.98

Do not use saturated neon gradients.

==================================================

# 2. FLOATING DUST

==================================================

Create small floating particles.

Particle size:
1–3px

Opacity:
0.10–0.40

Motion:

Y:
0 → -20px

X:
-4px → 4px

Opacity:
0 → visible → 0

Duration:
6–12 sec

Random delays.

Keep particle count low.

Desktop:
12–20 particles

Mobile:
6–10 particles

==================================================

# 3. FLOATING BOOK OUTLINES

==================================================

Add 2–4 very subtle outline illustrations
of books.

Color:
BookLoop blue / warm orange

Opacity:
0.04–0.10

Animation:

translateY:
0 → -8px → 0

rotate:
-2deg → 2deg → -2deg

Duration:
8–14 sec

Use different durations and delays.

These should feel like distant background decoration.

Do NOT make them visually prominent.

==================================================

# 4. SOFT CLOUD MOTION

==================================================

Add very subtle clouds behind the Hero illustration.

Movement:

X:
-10px → 10px

Duration:
30–55 sec

Different cloud speeds.

Do not move clouds quickly.

==================================================

# 5. LIGHT SWEEP

==================================================

Create a soft white / warm light sweep.

Very low opacity.

Move horizontally across the background.

Duration:
12–18 sec

Repeat slowly.

It should look like natural sunlight,
not a glowing laser.

==================================================

# 6. PARALLAX

==================================================

Add pointer-based parallax.

Background:
1–2px

Gradient blobs:
2–3px

Clouds:
2–4px

Decorative books:
3–5px

Hero illustration:
4–7px

Foreground particles:
6–10px

Use spring smoothing.

Disable parallax on touch devices.

==================================================

# 7. RANDOMIZATION

==================================================

Do not make every animation synchronized.

Randomize:

duration
delay
position
opacity
movement direction

Example:

particle A:
8.4s

particle B:
11.2s

particle C:
6.8s

book A:
10s

book B:
13s

cloud:
42s

==================================================

# 8. MOTION HIERARCHY

==================================================

The animation hierarchy must be:

1. Girl + Cat
2. Hero Illustration
3. Environment
4. Background
5. Decorative FX

Background animation must always remain
less noticeable than the Girl + Cat.

==================================================

# 9. PERFORMANCE

==================================================

Use only:

transform
opacity

Avoid layout-affecting properties.

Use CSS keyframes for simple loops.

Use requestAnimationFrame only when necessary.

Avoid large particle systems.

Respect viewport visibility.

Pause unnecessary animation when Hero is off-screen.

==================================================

# 10. ACCESSIBILITY

==================================================

Respect:

prefers-reduced-motion: reduce

When enabled:

disable:

- parallax
- particles
- continuous floating
- light sweep

Keep the background visually beautiful as static layers.

==================================================

# 11. RESPONSIVE

==================================================

Desktop:
Full background motion.

Tablet:
Reduce particle count.

Mobile:
Keep:

- soft gradient
- 1–2 floating decorations
- subtle cloud motion

Disable heavy parallax.

==================================================

# 12. QA ACCEPTANCE

==================================================

[ ] Background is no longer visually static

[ ] Animation is subtle

[ ] Gradient movement is smooth

[ ] Particles float naturally

[ ] Book outlines move independently

[ ] Clouds move slowly

[ ] Light sweep is barely noticeable

[ ] Parallax works on desktop

[ ] Parallax disabled on touch

[ ] Animation does not interfere with CTA

[ ] Animation does not interfere with text readability

[ ] No horizontal overflow

[ ] No layout shift

[ ] No excessive CPU usage

[ ] No animation synchronization

[ ] Reduced motion works

[ ] Mobile remains smooth

[ ] Hero illustration remains the visual focal point

==================================================

# FINAL VISUAL TARGET

==================================================

The user should look at the BookLoop Hero and think:

"This feels warm and alive."

NOT:

"This website has lots of animations."

The background should behave like
soft air, sunlight, paper and tiny book elements
moving gently around the Hero.

The Girl + Cat illustration remains the main visual focus.
