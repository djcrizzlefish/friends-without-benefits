"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isClicking = useRef(false);

  useEffect(() => {
    // Only activate on fine-pointer devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.classList.add("cursor-ready");
    const cursor = cursorRef.current;
    if (!cursor) return;

    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => {
      isClicking.current = true;
      if (cursor) cursor.style.transform = `translate(-50%, -50%) scale(0.8)`;
      setTimeout(() => {
        isClicking.current = false;
        updateCursorStyle();
      }, 150);
    };

    const onMouseUp = () => {
      isClicking.current = false;
      updateCursorStyle();
    };

    const updateCursorStyle = () => {
      if (!cursor) return;
      if (isClicking.current) {
        cursor.style.transform = `translate(-50%, -50%) scale(0.8)`;
      } else if (isHovering.current) {
        cursor.style.width = "40px";
        cursor.style.height = "40px";
        cursor.style.borderWidth = "2.5px";
      } else {
        cursor.style.width = "20px";
        cursor.style.height = "20px";
        cursor.style.borderWidth = "1.5px";
        cursor.style.transform = `translate(-50%, -50%) scale(1)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("a, button, [role='button'], input, select, textarea, .interactive")
      ) {
        isHovering.current = true;
        updateCursorStyle();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (
        el.closest("a, button, [role='button'], input, select, textarea, .interactive")
      ) {
        isHovering.current = false;
        updateCursorStyle();
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (cursor) {
        cursor.style.left = `${pos.current.x}px`;
        cursor.style.top = `${pos.current.y}px`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    raf = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("cursor-ready");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[99999] rounded-full border-gold-400 mix-blend-screen hidden sm:block"
      style={{
        width: 20,
        height: 20,
        borderWidth: "1.5px",
        borderStyle: "solid",
        borderColor: "#d4a843",
        transform: "translate(-50%, -50%)",
        transition: "width 200ms ease, height 200ms ease, border-width 200ms ease, transform 150ms ease",
        left: -100,
        top: -100,
      }}
    />
  );
}
