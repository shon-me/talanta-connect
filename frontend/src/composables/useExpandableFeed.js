import { nextTick, ref } from "vue";
import { prefersReducedMotion } from "@/utils/motion";

const DURATION = 520;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export function useExpandableFeed(gridRef) {
  const expandedKey = ref(null);

  const cards = () =>
    Array.from(gridRef.value?.querySelectorAll("[data-flip-id]") ?? []);

  function measure() {
    const rects = new Map();
    cards().forEach((el) =>
      rects.set(el.dataset.flipId, el.getBoundingClientRect()),
    );
    return rects;
  }

  // If the viewer clicks again mid-animation, jump to the end first so measurements are true
  function settle() {
    gridRef.value?.getAnimations?.({ subtree: true }).forEach((a) => {
      if (a.effect?.target?.dataset?.flipId) a.finish();
    });
  }

  function play(first) {
    if (prefersReducedMotion()) return [];
    const running = [];
    cards().forEach((el) => {
      const from = first.get(el.dataset.flipId);
      if (!from) return;
      const to = el.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      const resized =
        Math.abs(from.width - to.width) > 1 ||
        Math.abs(from.height - to.height) > 1;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !resized) return;

      const start = { transform: `translate(${dx}px, ${dy}px)` };
      const end = { transform: "translate(0, 0)" };
      if (resized) {
        start.width = `${from.width}px`;
        start.height = `${from.height}px`;
        end.width = `${to.width}px`;
        end.height = `${to.height}px`;
      }
      running.push(
        el.animate([start, end], { duration: DURATION, easing: EASING }),
      );
    });
    return running;
  }

  async function toggle(key) {
    if (!gridRef.value) {
      expandedKey.value = expandedKey.value === key ? null : key;
      return;
    }
    settle();
    const first = measure();
    expandedKey.value = expandedKey.value === key ? null : key;
    await nextTick();
    const animations = play(first);

    if (expandedKey.value) {
      // Once it has opened, make sure the whole card is on screen
      const el = gridRef.value.querySelector(`[data-flip-id="${key}"]`);
      Promise.all(animations.map((a) => a.finished))
        .catch(() => {})
        .finally(() =>
          el?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        );
    }
  }

  const collapse = () => {
    expandedKey.value = null;
  };

  return { expandedKey, toggle, collapse };
}
