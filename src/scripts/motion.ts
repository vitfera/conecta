const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');
const sections = [...document.querySelectorAll<HTMLElement>('main > section')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const visibleSections = new Set<HTMLElement>();

let frame = 0;
let pointer: {
  x: number;
  y: number;
  section: HTMLElement | null;
  card: HTMLElement | null;
} | null = null;
let activeSection: HTMLElement | null = null;
let activeCard: HTMLElement | null = null;

const motionAllowed = () => !reducedMotion.matches && finePointer.matches;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function resetCard() {
  if (!activeCard) return;
  for (const property of ['--card-rx', '--card-ry', '--light-x', '--light-y']) {
    activeCard.style.removeProperty(property);
  }
  activeCard = null;
}

function resetSection() {
  activeSection?.style.removeProperty('--ambient-x');
  activeSection?.style.removeProperty('--ambient-pointer-y');
  activeSection = null;
}

function render() {
  frame = 0;
  const viewport = window.innerHeight;
  const scrollable = document.documentElement.scrollHeight - viewport;
  const ratio = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
  progress?.style.setProperty('--reading-progress', String(ratio));

  if (!motionAllowed()) return;

  // Only visible sections participate; there is no continuous animation loop.
  for (const section of visibleSections) {
    const rect = section.getBoundingClientRect();
    const position = (viewport / 2 - rect.top - rect.height / 2) / (viewport + rect.height);
    section.style.setProperty('--ambient-scroll-y', `${clamp(position * 56, -28, 28)}px`);
  }

  if (!pointer) return;
  if (activeSection !== pointer.section) resetSection();
  activeSection = pointer.section;
  if (activeSection) {
    const rect = activeSection.getBoundingClientRect();
    const x = clamp((pointer.x - rect.left) / rect.width, 0, 1) - 0.5;
    const y = clamp((pointer.y - rect.top) / rect.height, 0, 1) - 0.5;
    activeSection.style.setProperty('--ambient-x', `${x * 24}px`);
    activeSection.style.setProperty('--ambient-pointer-y', `${y * 24}px`);
  }

  if (activeCard !== pointer.card) resetCard();
  activeCard = pointer.card;
  if (activeCard) {
    const rect = activeCard.getBoundingClientRect();
    const x = clamp((pointer.x - rect.left) / rect.width, 0, 1);
    const y = clamp((pointer.y - rect.top) / rect.height, 0, 1);
    const tilt = activeCard.classList.contains('featured-product') ? 0.8 : 1.8;
    activeCard.style.setProperty('--card-rx', `${(0.5 - y) * tilt * 2}deg`);
    activeCard.style.setProperty('--card-ry', `${(x - 0.5) * tilt * 2}deg`);
    activeCard.style.setProperty('--light-x', `${x * 100}%`);
    activeCard.style.setProperty('--light-y', `${y * 100}%`);
  }
}

function schedule() {
  if (!frame) frame = window.requestAnimationFrame(render);
}

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const section = entry.target as HTMLElement;
    if (entry.isIntersecting) visibleSections.add(section);
    else visibleSections.delete(section);
  }
  schedule();
});
sections.forEach((section) => observer.observe(section));

document.addEventListener(
  'pointermove',
  (event) => {
    if (!motionAllowed() || event.pointerType !== 'mouse' || !(event.target instanceof Element)) {
      return;
    }
    pointer = {
      x: event.clientX,
      y: event.clientY,
      section: event.target.closest<HTMLElement>('main > section'),
      card: event.target.closest<HTMLElement>('[data-interactive-card]'),
    };
    schedule();
  },
  { passive: true },
);

function clearPointer() {
  pointer = null;
  resetCard();
  resetSection();
}

// Reset immediately when leaving a card, even before another pointermove arrives.
document.addEventListener('pointerout', (event) => {
  const next = event.relatedTarget instanceof Node ? event.relatedTarget : null;
  if (activeCard && !activeCard.contains(next)) {
    resetCard();
    if (pointer) pointer.card = null;
  }
  if (activeSection && !activeSection.contains(next)) {
    resetSection();
    if (pointer) pointer.section = null;
  }
});
document.documentElement.addEventListener('pointerleave', clearPointer);
window.addEventListener('blur', clearPointer);
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });
window.addEventListener('pageshow', schedule);
new ResizeObserver(schedule).observe(document.body);

function resetMotionPreference() {
  clearPointer();
  for (const section of sections) section.style.removeProperty('--ambient-scroll-y');
  schedule();
}
reducedMotion.addEventListener('change', resetMotionPreference);
finePointer.addEventListener('change', resetMotionPreference);

if (progress) progress.hidden = false;
schedule();
